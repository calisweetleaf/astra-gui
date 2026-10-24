# Factory handoff — Astra UI

Build forward from this Expo scaffold. Astra is Daeron's private Android control surface for local coding agents. Preserve the composition and visual system. The immediate deliverable is a premium UI, not a hosted platform.

## Visual contract

| Role | Rule |
| --- | --- |
| Canvas | `#000000`, true black, including safe areas |
| Primary surfaces | `#121212` |
| Raised controls | `#191919` |
| Inset surfaces | `#090909` |
| Typography | Primary `#FFFFFF`, secondary `#A0A09A` |
| Accent | Only `#D7FF62`; active indicators, primary action, selected controls, command variables |
| Dividers | 1px `#292929`; stronger boundaries `#404040` |
| Body font | Bundled Inter regular / medium / semibold |
| Code font | Bundled JetBrains Mono regular |
| Corners | 20px cards, 24px drawer, 10–14px small controls |
| Touch targets | At least 48px for controls; visual dots are not touch targets |
| Motion | Drawer height transition 220ms, respecting reduced motion |

No rainbow statuses, default blue links, decorative gradients, glass stacks, neon glows, avatar bubbles, or marketing illustrations. Use text, border weight, and geometry to distinguish states. Keep accent area small: a primary action may use solid lime; inactive cards may not.

Use `theme.syntax` for terminal roles. Commands are white, variables lime, paths pale gray, comments muted gray, string values warm gray. Errors are white with explicit ERROR text and, if needed, a visible border/icon. Do not rely on hue alone.

## Layout and navigation

1. Compact top bar: Astra identity/navigation on the left, LOCAL DEMO status on the right until real connections exist.
2. Short title block, then a horizontally scrolling machine strip. The tile selects a machine; its separate ellipsis edits the address. Persist addresses locally.
3. Two equal provider cards on phones at least 360px wide. Stack them below 360px. Grid gaps must stay at least 12px. Each card has a compact provider mark, name, project/task context, and quiet footer status.
4. Provider opens its own workspace. Its model, mode, command menu, sessions, and controls live there. No global settings page.
5. At 900px and above, use a 240px provider-grouped sidebar. On phones the wordmark opens the equivalent navigation sheet. Session links nest under the provider; they are never the top-level information architecture.
6. Terminal floats 12px above the bottom safe area with 12px side insets. Collapsed height is 70px; expanded height is capped at 410px or 62% of screen height. Content reserves clearance for it. Keyboard resizing and Android back behavior are part of the interaction contract.
7. Only the machine strip scrolls horizontally. Main content and sheets scroll vertically. Respect font scaling; reflow controls rather than clipping essential labels. Check 320, 390, 430, 768, and 1280px widths.

## Component boundaries

Keep the current small components and shared theme. This is StyleSheet-based intentionally. Introducing NativeWind is unnecessary unless requested. Native UI primitives already provide Android input, touch, accessibility, and font scaling behavior. All labels and code strings remain selectable where appropriate.

`data.ts` is the provider registry for this visual demo. Adding another provider eventually means adding its identity, local controls, command metadata, and workspace behavior. Keep provider-specific features visible; do not force every agent into an identical chat interface.

## Local connection, later

One companion process on each machine is enough for the intended architecture. The phone stores its base URL. The actual agent-facing calls depend on each installed agent; a local server alone does not automatically expose all CLI functionality.

For the next explicitly authorized integration pass:

- Replace demo metric values with reads from the saved rig address.
- Replace `submit`'s demo responses with the local server's streaming output.
- Fill model choices and slash-command menus from the real agent's installed capabilities.
- Keep terminal input and provider configuration distinct, and retain real execution/approval semantics.
- Keep agent execution on the rig, independent of a phone socket staying connected.
- Do not add cloud accounts, global settings, discovery, synchronized databases, or a universal orchestration framework.

An Android release build may require deliberate cleartext-network configuration to call an `http://` LAN address. The UI currently makes no such calls. Set and verify that behavior when adding the actual local connection rather than assuming a saved HTTP URL proves connectivity. Keep any future credentials separate from the plain saved addresses.

## Demo boundaries

Address persistence is real. Provider navigation, control selection, terminal expansion, command suggestions, and local demo replies work. CPU/RAM numbers, agent execution, streaming, diffs, and session lists are illustrative. The source does not contain a hidden backend or fake live networking. Keep that distinction visible until real integration exists.
