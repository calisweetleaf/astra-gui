Somnus Design Tokens and Components

What’s included
- design-tokens/somnus.tokens.json — Tokens Studio/Figma-ready tokens (core palette, semantic colors, glass effects) with Light/Dark themes.
- styles/somnus-tokens.css — Web CSS variables mirroring the tokens, including utilities (glass, text colors, focus ring, links).
- styles/somnus-components.css — Small CSS components consuming the tokens (buttons, badges, cards, inputs, tabs, tables).
- scripts/somnus-theme.js — Optional theme helper to toggle data-theme.

Figma (Tokens Studio) import
- Install “Tokens Studio for Figma”.
- Open the plugin → three dots menu → Import/Export → Import from file.
- Select design-tokens/somnus.tokens.json.
- Activate the “Dark” or “Light” theme in Tokens Studio to switch modes.

Web usage
- Include styles/somnus-tokens.css first, then styles/somnus-components.css if you want the prebuilt components.
- Toggle theme by setting data-theme="light" or data-theme="dark" on <html>, or use scripts/somnus-theme.js.

Notes
- CSS variables and the tokens JSON stay in sync by design; update both when adding new tokens.
- Extend with spacing/typography/elevation tokens next if needed for your prototype.

