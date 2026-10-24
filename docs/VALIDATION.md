# Astra validation — native Android and workstation service

Updated 2026-10-24.

## Current checks

| Check | Result | Exercised scope |
| --- | --- | --- |
| Real bridge integration | PASS — 10 tests | Real HTTP listeners, credential checks, trusted-local mode without token entry, origin refusal, workspace containment, PTY stdin/output/resize/stop/reattachment, actual Git diffs |
| Installed CLI launch | PASS | Actual Droid, Codex, OpenCode and AntiGravity agy executables launched through native PTYs using --help; no model call |
| Expo lint | PASS with --no-cache | Current native TypeScript/TSX source |
| TypeScript | PASS | tsc --noEmit |
| Native Android release | PASS — final rebuild completed in 35 seconds | ARM64, native React Native renderer, embedded Hermes bundle |
| Private APK signing | PASS — final APK verified | Private Astra signing identity, APK v2 and v3 signatures |
| Installed bridge service | PASS | Enabled and running as the desktop user; executable and dependencies installed outside this checkout |
| Live service request | PASS | HTTP 200 from installed service on loopback without a token; four available native CLIs reported |
| Deployed runtime PTY | PASS | The installed service launched Codex --help, rendered the real terminal screen and observed exit 0. Its disposable record was cleared by a guarded service restart only after confirming no user sessions existed. |
| Device installation | NOT RUN | Operator explicitly owns installation; no APK was sent or installed by the agent |
| On-device UI / network validation | NOT RUN | No ADB device or connected UI surface is available; earlier screenshots are not proof of the final APK |
| DeepSeek Harness runtime | UNAVAILABLE | Source checkout exists, but no installed runnable CLI or node_modules was found; not presented as connected |
| Real model inference | NOT RUN | CLI startup tests do not establish model-response behavior |

## Service placement and routing

- Unit: `~/.config/systemd/user/astra-bridge.service`
- Executable runtime: `~/.local/share/astra-bridge/server.mjs`
- Dependencies: installed in `~/.local/share/astra-bridge/node_modules/`
- Working directory: `/home/daeron`
- State: `~/.local/state/astra/`
- Listener: `0.0.0.0:8765`
- Current laptop LAN endpoint: `192.168.1.164:8765`
- Paired/reachable Galaxy S24 Ultra: `192.168.1.242`, observed through KDE Connect and its established socket
- Direct trusted clients: that phone and loopback; no mandatory pairing-token entry
- The old illustrative `192.168.1.42` laptop address is corrected and migrated in the client.
- No firewall or router rules were changed. Host INPUT policy was observed as ACCEPT.

## Build constraints and recovery

The first Android build coincided with RAM and swap exhaustion. The SDK, JDK and Gradle cache were moved from RAM-backed /tmp to the internal-drive build cache. Subsequent builds use one Gradle worker, a bounded JVM heap and a bounded Metro Node heap. No SD-card storage is used.

One build failed while resolving Google Maven dependencies because DNS temporarily failed. A later full native build completed successfully. The final rebuild completed successfully in 35 seconds and incorporates local-phone mode, corrected endpoint defaults and the privacy manifest settings.

The final APK was inspected with Android build-tools aapt. Its packaged manifest has allowBackup=false, is not debuggable, and requests only INTERNET, VIBRATE and the app-specific non-exported receiver permission. External-storage, overlay and biometric permissions are absent. The ARM64 Hermes library and embedded Android bundle are present; the embedded bundle contains the corrected 192.168.1.164 endpoint and optional/hidden token flow. Final artifact: Astra.apk, 45,351,265 bytes; APK v2/v3 signatures verify with the private Astra certificate.

An AntiGravity desktop-launcher --help probe unexpectedly initiated its setup wizard and created two data copies. Their creation times and contents were checked against the intact original; only those newly created copies were removed. The bridge uses the actual agy terminal executable, not that desktop launcher.

## Dependency observations

The isolated installed bridge audited four packages with zero reported vulnerabilities during installation. The application dependency audit still reports existing Expo-toolchain/router transitive advisories; no forced SDK downgrade, blanket override or disabled check was used.

## Commands used

```sh
npm run test:bridge
npm run lint -- --no-cache
npm run typecheck
npm run build:apk
npm run build:apk -- --skip-prebuild
ASTRA_PHONE_IP=192.168.1.242 npm run install:bridge
systemctl --user show astra-bridge.service
```

`--skip-prebuild` is appropriate only when the native project has already been generated from the current app configuration. Native/config changes require normal Expo prebuild; generated Android source is not hand-edited.
