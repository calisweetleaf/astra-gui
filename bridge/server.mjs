import http from 'node:http';
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, mkdir, realpath, access, chmod } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir, hostname } from 'node:os';
import { resolve, delimiter, join, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import pty from 'node-pty';
import headless from '@xterm/headless';

const exec = promisify(execFile);
const { Terminal } = headless;
const definitions = {
  codex: { binary: 'codex', args: ['--no-alt-screen'] },
  droid: { binary: 'droid', args: [] },
  opencode: { binary: 'opencode', args: [] },
  antigravity: { binary: join(homedir(), '.gemini/bin/agy'), args: [] },
  deepseek: { binary: 'deepseek', args: [] },
};
const keys = { enter: '\r', tab: '\t', escape: '\x1b', interrupt: '\x03', up: '\x1b[A', down: '\x1b[B', left: '\x1b[D', right: '\x1b[C', backspace: '\x7f' };
function fail(status, message) { return Object.assign(new Error(message), { status }); }
async function executable(name) {
  if (name.includes('/')) {
    try { await access(name, constants.X_OK); return name; } catch { return null; }
  }
  for (const dir of (process.env.PATH ?? '').split(delimiter)) {
    const candidate = join(dir, name);
    try { await access(candidate, constants.X_OK); return candidate; } catch { /* Continue PATH discovery. */ }
  }
  return null;
}
async function body(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 65536) throw fail(413, 'Request exceeds 64 KiB.');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString() || '{}'); }
  catch { throw fail(400, 'Invalid JSON.'); }
}
function snapshot(session) {
  const buffer = session.terminal.buffer.active;
  const lines = [];
  const start = Math.max(0, buffer.length - 400);
  for (let row = start; row < buffer.length; row++) lines.push(buffer.getLine(row)?.translateToString(true) ?? '');
  return lines.join('\n').trimEnd();
}
function summary(session, deviceId) {
  return { id: session.id, title: session.title, provider: session.provider, deviceId,
    updatedTs: session.updatedTs, status: session.exited ? (session.exitCode === 0 ? 'idle' : 'error') : 'running' };
}
/** Private authenticated PTY owner. No provider credentials leave this host. */
export async function createBridge(options = {}) {
  const root = await realpath(options.root ?? process.env.ASTRA_ROOT ?? homedir());
  const cwd = await realpath(options.cwd ?? process.cwd());
  const stateDir = options.stateDir ?? process.env.ASTRA_STATE_DIR ?? resolve('.astra');
  await mkdir(stateDir, { recursive: true, mode: 0o700 });
  const tokenPath = join(stateDir, 'bridge-token');
  let token = options.token;
  if (!token) {
    try { token = (await readFile(tokenPath, 'utf8')).trim(); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      token = randomBytes(32).toString('hex');
      await writeFile(tokenPath, token, { mode: 0o600, flag: 'wx' });
    }
    await chmod(tokenPath, 0o600);
  }
  if (typeof token !== 'string' || token.length < 32) throw new Error('Pairing token must contain at least 32 characters.');
  const expected = Buffer.from('Bearer ' + token);
  const trustedClients = new Set(options.trustedClients ?? (process.env.ASTRA_TRUSTED_CLIENTS ?? '').split(',').filter(Boolean));
  const sessions = new Map();
  let closing = false;
  const resolved = {};
  for (const [id, def] of Object.entries(definitions)) {
    const binary = options.binaries?.[id] ?? process.env['ASTRA_' + id.toUpperCase() + '_BIN'] ?? def.binary;
    resolved[id] = await executable(binary);
  }
  async function workspace(value) {
    const target = await realpath(value || cwd).catch(() => { throw fail(400, 'Workspace does not exist.'); });
    const rel = relative(root, target);
    if (rel.startsWith('..') || isAbsolute(rel)) throw fail(403, 'Workspace is outside ASTRA_ROOT.');
    return target;
  }
  const limits = new Map();
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const reply = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
    try {
      if (closing) throw fail(503, 'Bridge is shutting down.');
      // Native app only: do not expose an authenticated shell to arbitrary websites.
      if (req.headers.origin) throw fail(403, 'Browser origins are not accepted. Use the native APK.');
      const supplied = Buffer.from(req.headers.authorization ?? '');
      const ip = (req.socket.remoteAddress ?? '').replace(/^::ffff:/, '');
      const trusted = trustedClients.has(ip);
      if (!trusted && (supplied.length !== expected.length || !timingSafeEqual(supplied, expected))) throw fail(401, 'This phone is not trusted by the bridge.');
      const now = Date.now();
      if (limits.size > 256) limits.clear();
      const window = limits.get(ip);
      const count = window && now - window.at < 60000 ? window.count + 1 : 1;
      limits.set(ip, { at: window && now - window.at < 60000 ? window.at : now, count });
      if (count > 1200) throw fail(429, 'Too many requests.');
      const url = new URL(req.url, 'http://localhost');
      const deviceId = url.searchParams.get('device') ?? 'kubuntu';
      if (req.method === 'GET' && url.pathname === '/v1/health') {
        return reply(200, { name: hostname(), cwd, root, protocol: 1, providers: Object.fromEntries(Object.entries(resolved).map(([id, binary]) => [id, { available: !!binary, binary }])) });
      }
      if (req.method === 'GET' && url.pathname === '/v1/sessions') {
        const provider = url.searchParams.get('provider');
        return reply(200, [...sessions.values()].filter(s => !provider || s.provider === provider).map(s => summary(s, deviceId)));
      }
      if (req.method === 'POST' && url.pathname === '/v1/sessions') {
        if ([...sessions.values()].filter(s => !s.exited).length >= 8) throw fail(409, 'Eight live sessions already exist. Stop a session first.');
        // Bound retained exited sessions as well.
        if (sessions.size >= 64) {
          const oldest = [...sessions.values()].find(s => s.exited);
          if (oldest) { oldest.terminal.dispose(); sessions.delete(oldest.id); }
        }
        const input = await body(req);
        const provider = input.provider;
        if (!Object.hasOwn(definitions, provider) || !resolved[provider]) throw fail(409, 'This provider executable is not available on the host.');
        const settings = input.settings ?? {};
        let args;
        try { args = JSON.parse(settings.extra?.arguments || '[]'); }
        catch { throw fail(400, 'Arguments must be a JSON array of strings.'); }
        if (!Array.isArray(args) || args.length > 64 || args.some(a => typeof a !== 'string' || a.length > 4096 || a.includes('\0'))) throw fail(400, 'Arguments must be a JSON array of strings.');
        const directory = await workspace(settings.extra?.workspace);
        if (closing) throw fail(503, 'Bridge is shutting down.');
        if ([...sessions.values()].filter(s => !s.exited).length >= 8) throw fail(409, 'Eight live sessions already exist. Stop a session first.');
        const terminal = new Terminal({ cols: 60, rows: 28, scrollback: 2000, allowProposedApi: true });
        const child = pty.spawn(resolved[provider], [...definitions[provider].args, ...args], {
          name: 'xterm-256color', cols: 60, rows: 28, cwd: directory,
          env: { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' },
        });
        const id = randomUUID();
        const session = { id, provider, title: provider + ' · ' + directory.split('/').pop(), cwd: directory, child, terminal, revision: 0, updatedTs: Date.now(), exited: false, exitCode: null };
        sessions.set(id, session);
        // Terminal query replies go back to the PTY, not to another session.
        terminal.onData(data => { if (!session.exited) child.write(data); });
        child.onData(data => {
          child.pause();
          terminal.write(data, () => {
            session.revision++; session.updatedTs = Date.now();
            if (!session.exited && !closing) child.resume();
          });
        });
        child.onExit(({ exitCode }) => { session.exited = true; session.exitCode = exitCode; session.revision++; });
        return reply(201, summary(session, deviceId));
      }
      const match = url.pathname.match(/^\/v1\/sessions\/([a-f0-9-]+)(?:\/(input|screen|resize))?$/);
      if (match) {
        const session = sessions.get(match[1]);
        if (!session) throw fail(404, 'Session not found. The host may have restarted.');
        if (req.method === 'GET' && match[2] === 'screen') return reply(200, { revision: session.revision, text: snapshot(session), exited: session.exited, exitCode: session.exitCode });
        if (req.method === 'POST' && match[2] === 'input') {
          if (session.exited) throw fail(409, 'Session has exited. Start a new session.');
          const input = await body(req);
          if (typeof input.key === 'string') {
            if (!Object.hasOwn(keys, input.key)) throw fail(400, 'Unknown terminal key.');
            session.child.write(keys[input.key]);
          } else {
            if (typeof input.text !== 'string' || input.text.length > 32768) throw fail(400, 'Invalid terminal input.');
            session.child.write(input.text + (input.submit === false ? '' : '\r'));
          }
          return reply(200, { accepted: true });
        }
        if (req.method === 'POST' && match[2] === 'resize') {
          const input = await body(req);
          if (!Number.isInteger(input.cols) || input.cols < 20 || input.cols > 240 || !Number.isInteger(input.rows) || input.rows < 8 || input.rows > 100) throw fail(400, 'Invalid terminal dimensions.');
          session.child.resize(input.cols, input.rows); session.terminal.resize(input.cols, input.rows); session.revision++;
          return reply(200, { resized: true });
        }
        if (req.method === 'DELETE' && !match[2]) {
          if (!session.exited) session.child.kill();
          return reply(200, { stopped: true });
        }
      }
      if (req.method === 'POST' && url.pathname === '/v1/diff') {
        const input = await body(req);
        const directory = await workspace(input.workspace);
        const results = await Promise.all([
          exec('git', ['diff', '--no-ext-diff', '--no-color', '--', '.'], { cwd: directory, timeout: 15000, maxBuffer: 2 * 1024 * 1024 }),
          exec('git', ['diff', '--cached', '--no-ext-diff', '--no-color', '--', '.'], { cwd: directory, timeout: 15000, maxBuffer: 2 * 1024 * 1024 }),
          exec('git', ['ls-files', '--others', '--exclude-standard'], { cwd: directory, timeout: 15000, maxBuffer: 1024 * 1024 }),
        ]);
        return reply(200, { diff: results.map(r => r.stdout).slice(0, 2).join('\n'), untracked: results[2].stdout });
      }
      throw fail(404, 'Unknown endpoint.');
    } catch (error) {
      if (!res.headersSent) reply(error.status ?? (error instanceof SyntaxError ? 400 : 500), { error: error.status ? error.message : 'Host operation failed: ' + error.message });
      else res.destroy();
    }
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 10000;
  async function close() {
    closing = true;
    for (const s of sessions.values()) { if (!s.exited) s.child.kill(); s.terminal.dispose(); }
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
  return { server, tokenPath, close };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bridge = await createBridge();
  const host = process.env.ASTRA_HOST ?? '127.0.0.1';
  const port = Number(process.env.ASTRA_PORT ?? 8765);
  bridge.server.listen(port, host, () => {
    console.log('Astra native bridge: http://' + host + ':' + port);
    console.log('Phone trust: ' + (process.env.ASTRA_TRUSTED_CLIENTS ? 'configured local devices; no pairing token needed' : 'token mode'));
    console.log('Optional pairing token file: ' + bridge.tokenPath);
    console.log('Provider credentials remain on this machine. No cloud relay.');
    if (host !== '127.0.0.1' && host !== '::1') console.warn('LAN HTTP: use only a trusted private network or an encrypted tunnel. Never expose this port to the Internet.');
  });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { void bridge.close().finally(() => process.exit(0)); });
}
