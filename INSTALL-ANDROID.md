# Astra — install and run

## Start the laptop backend from anywhere

Open a terminal in Home or any other directory:

```sh
systemctl --user start astra-bridge
```

It is already enabled to start with your desktop session. You do not need to open this repository or run npm.

To check it:

```sh
systemctl --user is-active astra-bridge
```

Expected: `active`.

## Install on the Galaxy S24 Ultra

Only **Astra.apk** is needed on the phone. Do not copy the source, node_modules or the ZIP into an Android development tool.

### USB method

1. Connect the phone by USB and select File transfer on the phone.
2. Copy `Astra.apk` into the phone's Downloads folder.
3. On the phone, open My Files → Downloads → Astra.apk.
4. If Android asks, allow My Files to install this app, then tap Install (or Update if Astra is already installed).
5. Open Astra with the phone and laptop on the same Wi-Fi.

### Existing KDE Connect pairing

The phone is already paired with the laptop through KDE Connect. To send the APK yourself from any terminal:

```sh
kdeconnect-cli --device a518cc3fec2749bfa6cab08344d9b414 --share "/home/daeron/LAB/Experiments/projects/astra-ui/Astra.apk"
```

Open the received-file notification on the phone and install the APK. This command is provided for you; the agent has not sent or installed the app.

## Connect

The current laptop address is:

```text
http://192.168.1.164:8765
```

The app uses that address by default. Your current paired phone is trusted directly. No token entry or Expo Go is required. If connection settings are shown, use the address above and tap Connect. Leave Advanced options alone.

If either device changes Wi-Fi/DHCP address, the saved address or trusted-phone address may need updating; physical distance does not determine IP routing.

## What is in the ZIP?

- Astra.apk: the directly installable Android app.
- Source, assets, package lock, native build scripts, bridge installer and documentation.
- Design references and saved previews, where present.

Not included: node_modules, Gradle/SDK/JDK caches, generated Android/iOS projects, Git internals, Surgeon journals, running-service state, credentials or signing secrets.

The ZIP is a source-and-installable-app archive, not a copy of your global Codex setup. The existing APK signing key remains locally in this repository's ignored .astra directory. It is not needed to install the included APK, but it is needed to sign future updates with the same identity. It is deliberately not copied into an unencrypted archive.
