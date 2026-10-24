import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../bridge/server.mjs', import.meta.url));
const runtime = join(homedir(), '.local/share/astra-bridge');
const state = join(homedir(), '.local/state/astra');
const unitDir = join(homedir(), '.config/systemd/user');
const trusted = process.env.ASTRA_PHONE_IP;
if (!trusted || !/^192\.168\.\d{1,3}\.\d{1,3}$|^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$|^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(trusted)) throw new Error('Set ASTRA_PHONE_IP to the phone’s actual private LAN address.');
await mkdir(runtime, { recursive: true });
await mkdir(state, { recursive: true, mode: 0o700 });
await mkdir(unitDir, { recursive: true });
const ownPackage = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await writeFile(join(runtime, 'package.json'), JSON.stringify({ name: 'astra-workstation-bridge', version: '1.0.0', private: true, type: 'module',
  dependencies: { 'node-pty': ownPackage.dependencies['node-pty'], '@xterm/headless': ownPackage.dependencies['@xterm/headless'] } }, null, 2) + '\n');
function run(command, args, cwd = runtime) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args, { cwd, stdio: 'inherit', env: process.env });
    p.once('error', reject);
    p.once('exit', code => code === 0 ? resolve() : reject(new Error(command + ' failed: ' + code)));
  });
}
await run('npm', ['install', '--omit=dev']);
await copyFile(source, join(runtime, 'server.mjs'));
const path = [join(homedir(), '.local/bin'), join(homedir(), '.bun/bin'), join(homedir(), '.gemini/bin'), join(homedir(), '.local/share/pnpm'), dirname(process.execPath), '/usr/local/bin', '/usr/bin', '/bin'].join(':');
const unit = [
  '[Unit]', 'Description=Astra private workstation command bridge', 'After=network-online.target', 'Wants=network-online.target', '',
  '[Service]', 'Type=simple', 'WorkingDirectory=' + homedir(), 'ExecStart=' + process.execPath + ' ' + join(runtime, 'server.mjs'),
  'Environment="PATH=' + path + '"', 'Environment=ASTRA_HOST=0.0.0.0', 'Environment=ASTRA_PORT=8765',
  'Environment=ASTRA_STATE_DIR=' + state, 'Environment=ASTRA_ROOT=' + homedir(),
  'Environment=ASTRA_TRUSTED_CLIENTS=127.0.0.1,::1,' + trusted, 'Restart=on-failure', 'RestartSec=3', 'UMask=0077', '',
  '[Install]', 'WantedBy=default.target', '',
].join('\n');
await writeFile(join(unitDir, 'astra-bridge.service'), unit);
await run('systemctl', ['--user', 'daemon-reload']);
await run('systemctl', ['--user', 'enable', '--now', 'astra-bridge.service']);
await run('systemctl', ['--user', 'restart', 'astra-bridge.service']);
await run('systemctl', ['--user', 'is-active', 'astra-bridge.service']);
console.log('Installed runtime: ' + runtime);
console.log('State: ' + state);
console.log('Trusted phone: ' + trusted + '. No phone token entry required.');
