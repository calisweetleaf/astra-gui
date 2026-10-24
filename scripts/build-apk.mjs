import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile, access, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const cache = join(homedir(), '.cache/astra-native-build');
const javaHome = process.env.JAVA_HOME ?? join(cache, 'astra-toolchain/jdk-21.0.13+9');
const sdk = process.env.ANDROID_HOME ?? join(cache, 'astra-android-sdk');
const gradleHome = process.env.GRADLE_USER_HOME ?? join(cache, 'astra-gradle');
for (const path of [join(javaHome, 'bin/java'), join(sdk, 'build-tools/36.0.0/apksigner')]) await access(path).catch(() => { throw new Error('Missing native build tool: ' + path + '. Set JAVA_HOME and ANDROID_HOME to an installed toolchain.'); });
const state = resolve('.astra');
await mkdir(state, { recursive: true, mode: 0o700 });
const signingPath = join(state, 'signing.json');
let signing;
try { signing = JSON.parse(await readFile(signingPath, 'utf8')); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  signing = { alias: 'astra-private', password: randomBytes(32).toString('hex') };
  await writeFile(signingPath, JSON.stringify(signing), { mode: 0o600, flag: 'wx' });
}
const env = { ...process.env, CI: '1', NODE_ENV: 'production', NODE_OPTIONS: '--max-old-space-size=768', JAVA_HOME: javaHome,
  ANDROID_HOME: sdk, ANDROID_SDK_ROOT: sdk, GRADLE_USER_HOME: gradleHome,
  ASTRA_SIGNING_PASSWORD: signing.password };
function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(command + ' failed with exit ' + code)));
  });
}
const key = join(state, 'astra-release.keystore');
try { await access(key); } catch {
  await run(join(javaHome, 'bin/keytool'), ['-genkeypair', '-keystore', key, '-alias', signing.alias, '-storepass:env', 'ASTRA_SIGNING_PASSWORD',
    '-keypass:env', 'ASTRA_SIGNING_PASSWORD', '-keyalg', 'RSA', '-keysize', '3072', '-validity', '10000', '-dname', 'CN=Astra Private, OU=Personal Research', '-noprompt']);
}
if (process.argv.includes('--skip-prebuild')) await access(resolve('android/gradlew'));
else await run('npx', ['expo', 'prebuild', '--platform', 'android', '--no-install']);
await run('./android/gradlew', ['-p', 'android', 'app:assembleRelease', '-PreactNativeArchitectures=arm64-v8a', '--no-daemon', '--max-workers=1',
  '-Dorg.gradle.parallel=false', '-Dorg.gradle.jvmargs=-Xmx1024m -XX:MaxMetaspaceSize=512m', '-Pkotlin.compiler.execution.strategy=in-process']);
const signer = join(sdk, 'build-tools/36.0.0/apksigner');
await run(signer, ['sign', '--ks', key, '--ks-key-alias', signing.alias, '--ks-pass', 'env:ASTRA_SIGNING_PASSWORD', '--key-pass', 'env:ASTRA_SIGNING_PASSWORD',
  '--out', resolve('Astra.apk'), resolve('android/app/build/outputs/apk/release/app-release.apk')]);
await run(signer, ['verify', '--verbose', '--print-certs', resolve('Astra.apk')]);
console.log('Standalone ARM64 APK: ' + resolve('Astra.apk') + ' (' + (await stat('Astra.apk')).size + ' bytes)');
