# Astra UI

A private, native-feeling agent workspace. Expo + React Native + TypeScript. Shared StyleSheet tokens; no Tailwind compiler, synchronization backend, or discovery service. This is Daerons personal highly customized, mobile application + mcp-server/plugin so that he may install the plugin to opencode, factory-droid-cli, maybe even codex, and all other coding agents, he will install as .apk on his phone, while the device will spin up a server locally. This is not a publishable app, but that is exactly why daeron wants it to be the single greatest command center of all time for his coding agents. The current color scheming is atrocius and must follow the Somnus-Design-System but modernized. The app must look like a 5 billion dollar app that nobody ever will see.

## Run on your Android phone

Install Node.js LTS on your computer and Expo Go on your phone. Extract this folder. Open a terminal in this folder, then run these commands one at a time:

```sh
npm ci
```

```sh
npx expo start
```

Keep your computer and phone on the same Wi-Fi. Open Expo Go and scan the QR code printed by Expo. This scaffold uses Expo SDK 57 from the current blank TypeScript template; use a matching Expo Go version. If your installed Expo Go does not support this SDK, obtain its compatible Android build from https://expo.dev/go, or use the preview APK route below.

For a desktop browser preview:

```sh
npm run web
```

This demo needs no agent server. Fonts are packaged as assets, not fetched by the running UI. Development mode still needs the Metro server; a built preview APK bundles the app for standalone use.

## Try the demo

- Tap an OpenCode or Droid card to open that provider's workspace.
- Tap the Astra wordmark on a phone to open provider-grouped navigation. At 900px and above, the same navigation becomes a persistent sidebar.
- Tap a machine tile to switch its context; tap its ellipsis to edit the saved server address.
- Open provider controls with the sliders icon. Model profile and Build/Plan mode belong to the selected provider on the selected machine.
- Expand the terminal, type `/`, select a suggestion, and send it. `/help`, `/status`, and `/clear` work locally. OpenCode also has `/review`; Droid has `/logs`.
- Open the working tree for an illustrative change preview.
- Return to a provider/machine during the same app session to find its current demo output and controls intact.

**Only machine addresses persist across app restarts.** Sessions and controls are in-memory UI state. The screen is explicitly labeled LOCAL DEMO. Metrics, model profiles, commands, sessions, and changes are fixtures. No command is executed and no server connection is made. Demo command names do not assert that the real agents support the same names.

## Android APK

The included `eas.json` has an internal preview profile that produces an installable APK. It is not an app-store release. With an Expo account, run each command separately:

```sh
npx eas-cli@latest login
```

```sh
npx eas-cli@latest build:configure
```

```sh
npx eas-cli@latest build --platform android --profile preview
```

Download and install the resulting APK on your Android device. EAS may ask to create a project and signing credentials. No APK was built as part of this handoff. A local Android build remains possible with an Android SDK/JDK installation; it is not required to preview the UI.

Official build reference: https://docs.expo.dev/build-reference/apk/

## Files

| File | Responsibility |
| --- | --- |
| `App.tsx` | Screen composition, local interaction state, saved addresses, demo commands |
| `src/theme.ts` | Palette, syntax roles, font families, spacing, radii, motion |
| `src/styles.ts` | Workspace layout and shared screen styling |
| `src/data.ts` | Typed demo fixtures and per-provider command menus |
| `src/components/DeviceStrip.tsx` | Horizontal machine selection and address actions |
| `src/components/AgentPanel.tsx` | Provider entry cards |
| `src/components/TerminalDrawer.tsx` | Animated terminal, input, completion menu |
| `src/components/Sheet.tsx` | Address, provider-controls, navigation, and change panels |
| `src/components/Primitives.tsx` | Icons, buttons, indicators, section headings |
| `docs/FACTORY.md` | Visual rules and exact extension boundaries |

## Validation

```sh
npm run typecheck
```

```sh
npx expo install --check
```

```sh
npm run export
```

See `docs/VALIDATION.md` for checks actually performed on this handoff.
