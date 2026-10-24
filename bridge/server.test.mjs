import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createBridge } from './server.mjs';

const exec = promisify(execFile);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
test('real authenticated HTTP → native PTY → VT screen → input, reconnect and stop', async t => {
  const root = await mkdtemp(join(tmpdir(), 'astra-native-test-'));
  const bridge = await createBridge({ root, cwd: root, stateDir: join(root, 'state'), binaries: { droid: '/bin/bash' } });
  await new Promise(resolve => bridge.server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + bridge.server.address().port;
  const token = (await readFile(bridge.tokenPath, 'utf8')).trim();
  const request = async (path, data, options = {}) => {
    const res = await fetch(base + path, { method: options.method ?? (data === undefined ? 'GET' : 'POST'),
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', ...options.headers },
      ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
    return { status: res.status, body: await res.json() };
  };
  const eventually = async (path, predicate) => {
    for (let n = 0; n < 100; n++) {
      const result = await request(path);
      if (predicate(result.body)) return result.body;
      await sleep(50);
    }
    assert.fail('Timed out waiting for real terminal output.');
  };
  t.after(async () => { await bridge.close(); await rm(root, { recursive: true, force: true }); });
  await t.test('credential protection and browser-origin rejection', async () => {
    assert.equal((await stat(bridge.tokenPath)).mode & 0o777, 0o600);
    assert.equal((await fetch(base + '/v1/health')).status, 401);
    assert.equal((await request('/v1/health', undefined, { headers: { Authorization: '', 'X-Forwarded-For': '127.0.0.1' } })).status, 401);
    assert.equal((await request('/v1/health', undefined, { headers: { Origin: 'https://untrusted.invalid' } })).status, 403);
    const health = await request('/v1/health');
    assert.equal(health.status, 200); assert.equal(health.body.protocol, 1);
    assert.equal(health.body.providers.droid.available, true);
    assert.notEqual(health.body.providers.antigravity.binary, '/usr/local/bin/antigravity');
  });
  await t.test('trusted local phone mode connects without token entry', async () => {
    const local = await createBridge({ root, cwd: root, stateDir: join(root, 'local-state'), trustedClients: ['127.0.0.1'] });
    await new Promise(resolve => local.server.listen(0, '127.0.0.1', resolve));
    try {
      const url = 'http://127.0.0.1:' + local.server.address().port + '/v1/health';
      assert.equal((await fetch(url)).status, 200);
      assert.equal((await fetch(url, { headers: { Origin: 'https://untrusted.invalid' } })).status, 403);
    } finally { await local.close(); }
  });
  await t.test('workspace containment and malformed arguments', async () => {
    assert.equal((await request('/v1/sessions', { provider: 'droid', settings: { extra: { workspace: '/', arguments: '[]' } } })).status, 403);
    assert.equal((await request('/v1/sessions', { provider: 'droid', settings: { extra: { arguments: 'not-json' } } })).status, 400);
    assert.equal((await request('/v1/sessions', { provider: 'droid', settings: { extra: { arguments: '[17]' } } })).status, 400);
    assert.equal((await request('/v1/sessions', { provider: '../bash' })).status, 409);
  });
  await t.test('real PTY cursor parsing, stdin and phone reconnection', async () => {
    const args = ['-c', 'printf "\\033[2J\\033[HNATIVE-PTY-READY\\n"; read -r line; printf "INPUT=%s\\n" "$line"; read -r second; printf "SECOND=%s\\n" "$second"'];
    const created = await request('/v1/sessions?device=phone', { provider: 'droid', settings: { extra: { arguments: JSON.stringify(args) } } });
    assert.equal(created.status, 201);
    const id = created.body.id;
    assert.equal(created.body.deviceId, 'phone');
    const screenPath = '/v1/sessions/' + id + '/screen';
    const screen = await eventually(screenPath, s => s.text.includes('NATIVE-PTY-READY'));
    assert.ok(!screen.text.includes('\x1b'), 'VT parser must consume escape sequences.');
    assert.equal((await request('/v1/sessions/' + id + '/input', { text: 'from-native-phone' })).status, 200);
    await eventually(screenPath, s => s.text.includes('INPUT=from-native-phone'));
    // A new HTTP request represents a reattached client; the PTY must still exist.
    assert.ok((await request('/v1/sessions?device=phone')).body.some(s => s.id === id));
    assert.equal((await request('/v1/sessions/' + id + '/resize', { cols: 48, rows: 24 })).status, 200);
    assert.equal((await request('/v1/sessions/' + id + '/input', { text: 'reconnected' })).status, 200);
    const finished = await eventually(screenPath, s => s.exited && s.text.includes('SECOND=reconnected'));
    assert.equal(finished.exitCode, 0);
    assert.equal((await request('/v1/sessions/' + id + '/input', { text: 'after-exit' })).status, 409);
    const waiting = await request('/v1/sessions', { provider: 'droid', settings: { extra: { arguments: JSON.stringify(['-c', 'read -r pending']) } } });
    assert.equal((await request('/v1/sessions/' + waiting.body.id, undefined, { method: 'DELETE' })).status, 200);
    await eventually('/v1/sessions/' + waiting.body.id + '/screen', s => s.exited);
  });
  await t.test('read actual staged/unstaged Git changes and untracked paths', async () => {
    await exec('git', ['init', '-q'], { cwd: root });
    await writeFile(join(root, 'tracked.txt'), 'first\n');
    await exec('git', ['add', 'tracked.txt'], { cwd: root });
    await writeFile(join(root, 'tracked.txt'), 'second\n');
    await writeFile(join(root, 'new.txt'), 'untracked\n');
    const result = await request('/v1/diff', { workspace: root });
    assert.equal(result.status, 200);
    assert.ok(result.body.diff.includes('+first'));
    assert.ok(result.body.diff.includes('+second'));
    assert.ok(result.body.untracked.includes('new.txt'));
  });
  await t.test('actual installed Droid CLI launch without a model call', async () => {
    const own = await createBridge({ root, cwd: root, stateDir: join(root, 'droid-state') });
    await new Promise(resolve => own.server.listen(0, '127.0.0.1', resolve));
    try {
      const ownToken = (await readFile(own.tokenPath, 'utf8')).trim();
      const url = 'http://127.0.0.1:' + own.server.address().port;
      const headers = { Authorization: 'Bearer ' + ownToken, 'Content-Type': 'application/json' };
      const created = await fetch(url + '/v1/sessions', { method: 'POST', headers, body: JSON.stringify({ provider: 'droid', settings: { extra: { arguments: '["--help"]' } } }) });
      assert.equal(created.status, 201);
      const session = await created.json();
      let screen;
      for (let n = 0; n < 100; n++) {
        screen = await (await fetch(url + '/v1/sessions/' + session.id + '/screen', { headers })).json();
        if (screen.exited && screen.text.includes('Droid')) break;
        await sleep(50);
      }
      assert.ok(screen.text.includes('Droid')); assert.equal(screen.exitCode, 0);
    } finally { await own.close(); }
  });
  for (const provider of ['codex', 'opencode', 'antigravity']) await t.test('actual installed ' + provider + ' native CLI launch, without a model call', async () => {
    const health = (await request('/v1/health')).body;
    if (!health.providers[provider].available) { t.diagnostic(provider + ' executable absent; CLI smoke not run.'); return; }
    const created = await request('/v1/sessions', { provider, settings: { extra: { arguments: '["--help"]' } } });
    assert.equal(created.status, 201);
    const screen = await eventually('/v1/sessions/' + created.body.id + '/screen', s => s.exited && s.text.length > 20);
    assert.equal(screen.exitCode, 0);
  });
});
