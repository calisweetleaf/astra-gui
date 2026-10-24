# Somnus / REM-Core Design System

A glassmorphic, dark-canvas design system for two interrelated product surfaces:

| Surface | Tagline | Vibe |
|---|---|---|
| **Somnus Sovereign Systems (SSDS)** | *"Persistent AI Operating System / Unlimited Assistant"* | Sovereign, unrestricted, prosumer power-user — chat + projects + artifacts + multi-agent + research + git, all under one cool-blue/purple roof. |
| **REM-Core** *(Recursive Execution Monitor)* | *"Strategic Intelligence Command"* | Defense / GEOINT / corporate-influence analysis. Hex grids, orbital viewports, threat classifications, neural violet + intel cyan. Reads like a SOCOM mission dashboard. |
| **Operation Moonshine** | *"Distill the Flow"* | Sub-program / campaign mark — used as a project / mission badge inside both surfaces. |
| **Oracle** | (network/correlation engine) | Used as a sub-component logo for correlation/oracle features. |

Both surfaces share fonts, glass material, status dots, and the dark stack — REM-Core just dials the chrome, the typography (Orbitron/Space Grotesk display), and the threat-classification palette up to 11.

---

## Sources

All design context was extracted from these read-only mounts (the user attached them via Import — they are **not** in this project's filesystem):

- `templates/` — REM-Core dashboards (`remfinal.html`, `rem_unified_command_center.html`, `satellite_threat_detection.html`, `earth_mapper.html`, `domain_analyzer.html`, `unified_intelligence_dashboard.html`, `rem_2dmap_dashboard.html`, `globe.html`).
- `html_reference_images/` — Somnus subsystems (`somnus_main_ui.html`, `multi_agent_collab_ui.html`, `research_v3.html`, `projects_subsytem.html`, `artifact_subsytem.html`, `global_settings.html`, `instance_settings.html`).
- `App HTMLs/` — `somnus_dashboard.html` (full Tailwind-config Somnus dashboard), `brain_map_dashboard2.html`.
- `HTML-REFERENCE-GUIS/` — additional GUI references incl. `EARTH_README.md` (the Maprenderer Omega / orbital-globe brief), `somnus_chat.html`, `claudes_globe.html`, `gcr_dashboard.html`.
- Three uploaded brand marks: `uploads/oracle_logo.png`, `uploads/ssds-logo.png`, `uploads/logo.png` (Operation Moonshine).

Anything below was lifted directly out of these files; nothing has been invented.

---

## CONTENT FUNDAMENTALS — voice, tone, casing

The voice is **operator-grade**: terse, capitalized, slightly paranoid, leaning on military / intelligence / engineering vocabulary. There is no friendly marketing softness — the product treats the user as a cleared operator, not a customer.

### Tone
- **Sovereign / unlimited** for Somnus: phrases like *"Sovereign Kernel Configuration"*, *"AI Sovereignty Active"*, *"Unlimited Power mode active"*, *"Unlimited Assistant"*, *"No Restrictions, Infinite Possibilities"*, *"Multi-AI Collaborative Environment"*, *"Persistent AI Operating System"*. Treats AI autonomy and absence of guardrails as a feature.
- **Command / classified** for REM-Core: *"Strategic Intelligence Command"*, *"Global Correlation Board"*, *"Recursive Execution Monitor"*, *"Satellite Threat Detection - Advanced Orbital Intelligence Platform"*, *"Corporate Influence Analysis"*. Reads like a Palantir/Anduril-adjacent product brief.
- **Cinematic engineering** in long-form (`EARTH_README.md`): mixes Pentagon-procurement language with games-industry rendering jargon — *"Defense-Grade Security"*, *"Orbital-Grade Globe Rendering Engine"*, *"DLSS 3-Style AI Upscaling"*, *"When the President asks 'What just happened?' – you zoom in."*

### Casing patterns
- **ALL CAPS w/ wide tracking** for status, threat, and section labels: `INSTITUTIONAL CAPTURE`, `HIGH INFLUENCE`, `OPERATIONAL`, `ELEVATED`, `CORPORATE MONITOR`, `GLOBAL STATUS`, `SYSTEMS`. Always rendered in a mono or display face.
- **Title Case** for section headers and named entities: *"Corporate Entities"*, *"Strategic Intelligence Command"*, *"Active Deployments"*.
- **camelCase / hyphen-case** in code: `somnus-artifact:unlimited`, `Gemma-3-4b-it`, `intelligence-primary`, `glass-bg`.

### Pronouns + address
- Almost no second-person / *you* copy — interface is mostly nouns + status. Rare exceptions are command prompts: *"Ask Somnus anything…"*.
- No first-person *we* or *I* — the system doesn't apologize, explain, or anthropomorphize.

### Emoji + symbols
- Emoji appear **only inside `console.log`** (e.g. `🚀 Initializing…`, `✅ Connected to REM-Core Intelligence Hub`, `❌ Connection Failed`, `📡 Processing initial intelligence state`) — they are **dev-only telemetry**, never UI chrome.
- The chrome itself uses **Font Awesome** glyphs (chat, microphone, brain, satellite-dish, folder, sliders, paper-plane). Treat FA classes as an icon system.
- Bullets and corner brackets are drawn with CSS pseudo-elements, not unicode.
- Common unicode: `●` for online dots (sometimes), `//` as a path/title separator (*"REM-Core // Satellite Threat Detection"*), and `~` for terminal prompts (`somnus@unlimited:~/workspace$`).

### Product copy examples
- Welcome greeting (Somnus): *"Ask Somnus anything…"*
- Sovereignty badge (Somnus Settings): *"AI Sovereignty Active"*
- Threat badge (REM-Core): *"INSTITUTIONAL CAPTURE"*, *"HIGH INFLUENCE"*, *"ELEVATED"*, *"OPERATIONAL"*.
- Header titles: *"REM-Core // Recursive Execution Monitor — Strategic Intelligence Command"*, *"Somnus Global Settings — Sovereign Kernel Configuration"*.
- Terminal prompts: `somnus@unlimited:~/workspace$ python3 main.py`.

### Microcopy heuristics
- Short. Three to five words for any chip, badge, or status.
- Numbers always tabular-nums and mono — `$20.0B`, `0.92`, `300%`, `GPU: 85%`, `5 Active`, `3 Projects`.
- Times in 24-hour or ISO; coordinates in lat/lon.
- Never apologize (*"Sorry, …"*) — REM-Core says `❌ Connection Failed - Check REM-Core Server.`

---

## VISUAL FOUNDATIONS

### Palette
- **Surface stack**: `#070a11 → #0a0a0f → #1a1a2e → #16213e → #1f2937` (lightest panel). Always cool — never warm grey.
- **Foreground stack**: `#ffffff → #f8fafc → #e2e8f0 → #cbd5e1 → #94a3b8 → #64748b`. Primary text sits at `#f8fafc`; muted at `#94a3b8`.
- **Somnus accent**: blue `#3b82f6`, purple `#8b5cf6`, cyan `#06b6d4`, green `#10b981`, amber `#f59e0b`, red `#ef4444` (and `pink #ec4899`, `orange #f97316` in projects subsystem).
- **REM-Core accent** adds: neural violet `#8b5cf6`/`#7c3aed`/`#6d28d9`, intelligence cyan `#06b6d4`/`#0891b2`/`#0284c7`, corporate orange `#f97316`.
- **Threat classification spectrum** (REM-Core only): institutional `#dc2626` → high `#f97316` → concerning `#f59e0b` → monitored `#10b981` → neutral `#06b6d4`.
- **AI-agent role colors** (Somnus collab): one `#3b82f6`, two `#8b5cf6`, three `#10b981`, system/delegator `#f59e0b`. Use for avatars + threading.

### Type
- **Inter** is the body/UI face throughout — weights 300–900. Tabular numerals on (`font-variant-numeric: tabular-nums`), with `font-feature-settings: "cv11", "ss01"` enabled at the body level.
- **JetBrains Mono** for telemetry, code, terminal, metric values, micro-labels.
- **Orbitron** is the command-grade display face — used for REM-Core titles, keyboard-style numerals, anything that should read like a HUD.
- **Space Grotesk** is the secondary display/accent — softer than Orbitron, used for entity names, panel titles in a few REM-Core templates.
- **Roboto Mono** appears once (`remfinal.html`) — treat as a JetBrains-Mono fallback.

### Background treatment
- Always **dark**, always with a 135° linear-gradient between two of the dark-stack tokens. Somnus = `dark-950 → dark-900`. REM-Core = `#0f0f1e → #1a1a2e → #16213e`.
- REM-Core dashboards layer **multiple radial gradients** (atmospheric cyan + violet + orange) on top of the linear base — gives the sense of a planetary atmosphere or holo-table glow.
- **No photographic backgrounds.** No textures. No grain. No hand-drawn illustrations. The surface is pure CSS.
- Decorative starfields drawn in `<canvas>` (`#starfield-background`) — subtle, ~0.6 opacity, never above content.

### Glassmorphism (the hero motif)
Every panel is a glass tile:
```
background: rgba(15, 20, 28, 0.92);     /* glass-primary */
backdrop-filter: blur(32px) saturate(1.2);
border: 1px solid rgba(148, 163, 184, 0.10);
box-shadow: 0 16px 64px rgba(0, 0, 0, 0.6);
border-radius: 16–24px;
```
There is a hierarchy of glass — `command` (most opaque) → `primary` → `secondary` → `tertiary` → `surface` → `overlay`. Stack them; opacity goes up as panels nest. Always combine with a thin desaturated border so the edge stays visible on the dark canvas.

### Shadows + glow
- **Drop shadows** are big, soft, and pure black (no color tint) — `0 16px 64px rgba(0,0,0,0.6)`.
- **Glow halos** are colored and used for *active*/*alert* states only:
  - cyan glow `0 0 40px rgba(6, 182, 212, 0.35)` — active orbital element
  - violet glow `0 0 40px rgba(139, 92, 246, 0.35)` — neural / corporate-link active
  - orange glow `0 0 32px rgba(249, 115, 22, 0.30)` — corporate threat
  - red glow `0 0 32px rgba(239, 68, 68, 0.30)` — critical
- No inner shadows. No emboss. No skeumorphic depth.

### Borders
- Default border is a **single 1px hairline** at `rgba(148, 163, 184, 0.10)` — barely visible, just enough to separate glass from canvas.
- On hover, the border picks up the panel's accent color at higher opacity (e.g. `rgba(139, 92, 246, 0.45)`).
- REM-Core panels add **corner brackets** — `<span class="corner-bracket top-left">` etc. drawn as L-shaped pseudo-elements in the panel's accent color. Highly characteristic of the brand.

### Corner radii
- 4 / 8 / 12 / 16 / 20 / 24px. Buttons: 8–12. Cards: 12–16. Panels: 16–20. Command surfaces & hero cards: 20–24. Pills: 9999. Avoid 6–10px in-between values.

### Hover / press states
- **Hover** on cards → `transform: translateY(-2px)` + border color → accent + box-shadow → glass-shadow. Sometimes adds a colored backdrop (`background: rgba(6, 182, 212, 0.1)`).
- **Hover** on bubble nav → `transform: scale(1.1)` + colored shadow.
- **Press** is a quick `transform: scale(0.95)` for 150ms. No color change.
- **Active** state for tabs/nav → solid accent fill, white text, soft glow underneath.

### Animation
- Transitions are universally `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (the smooth curve), with a **spring** `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for create-buttons + transformer actions, and a **bounce** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` for emphasis.
- **Pulse loops** are everywhere — status dots, sovereignty badges, welcome icons. Cycle = 2–3s, opacity 0.4 → 1.0 or scale 1.0 → 1.05.
- **Gradient-text animation** — 6s ease-in-out infinite background-position shift across the blue→purple gradient, used on the homepage greeting.
- **Welcome icon glow** — keyframe shifts box-shadow color from blue to purple over 3s.
- No bouncy spring physics. No parallax. No scroll-driven animation. No Lottie.

### Transparency + blur
- Used everywhere as the primary panel material. **Always paired with `backdrop-filter`** — never naked alpha. Strength scales with panel importance: `blur(20px)` for sidebars, `blur(32px) saturate(1.2)` for elevated panels, `blur(56px) saturate(1.2)` for the topmost command surfaces.
- Hovers don't change blur strength.

### Imagery vibe (when present)
- Logos are **photographic-rendered hexagonal badges** with subtle metallic / circuit textures (SSDS), or flat geometric marks on near-black backgrounds (Oracle, Operation Moonshine).
- Color temperature **cool**: blue / teal / violet. The only warm colors are alerts (orange / red / amber) and the SSDS hex-badge has a **single warm red glow at the bottom** that breaks the otherwise cool composition.
- Everything is on a near-black field — these marks were made for dark UI.

### Layout rules
- Every full-page surface is **a CSS grid** with named areas (`"sidebar header header" / "sidebar workspace knowledge-panel" / …`). Fixed-width sidebars (280–380px). Fixed header (60–88px). Fixed bottom rails (40–80px).
- Always **`height: 100vh; overflow: hidden`** at the page root — these are app shells, not scrolling pages. Inner regions scroll independently.
- **Nav-bubble pattern** (Somnus): a vertical column of 56px circular gradient buttons, fixed top-right, each with a hover popover that slides in from the right.
- **Hex-grid pattern** (REM-Core): faint hexagonal background mesh on command-center surfaces, drawn either with CSS or a low-opacity SVG.
- Cards in grids: `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))` is the default; `gap: 12–24px`.

### Protection / capsules
- Panel headers use a 2px gradient rule along the top edge (e.g. `background: linear-gradient(90deg, intelligence-primary, intelligence-accent, intelligence-teal)`) — like a HUD's status bar.
- No bottom-fade protection gradients on imagery. No vignettes.

### What this system AVOIDS
- Light mode (no light variant exists in any source file).
- Warm neutrals — beige, brown, sepia.
- Hand-drawn or sketchy elements.
- Skeumorphic textures (paper, leather, brushed metal in UI).
- Soft shadows from above (the shadows here are *deep*, not *floaty*).
- Cute icons, mascots, faces.
- Marketing-style emoji as content (only allowed in console).

---

## ICONOGRAPHY
See `ICONOGRAPHY.md` for the full description. Short version: **Font Awesome 6 free** (loaded from cdnjs) is the workhorse, supplemented by a few inline SVG strokes for app-specific glyphs (REM shield, hex brackets). Avoid emoji in chrome.

---

## INDEX — what's in this folder

| Path | What |
|---|---|
| `README.md` | This file. |
| `SKILL.md` | Skill-format manifest so this folder is portable to Claude Code. |
| `ICONOGRAPHY.md` | Full icon-system docs. |
| `colors_and_type.css` | All design tokens — colors, type, spacing, glass, shadows, motion. **Import this first.** |
| `assets/` | Logos: `oracle-logo.png`, `ssds-logo.png`, `operation-moonshine-logo.png`. |
| `fonts/` | Empty — fonts are loaded via Google Fonts in `colors_and_type.css`. See *Font substitutions* below. |
| `preview/` | Small HTML cards that populate the Design System tab — color swatches, type specimens, components, etc. |
| `ui_kits/somnus/` | Somnus Sovereign Systems UI kit — chat shell, sidebar, multi-agent panel, settings. |
| `ui_kits/rem-core/` | REM-Core UI kit — command center, threat panels, orbital viewport, correlation matrix. |

### Font substitutions (please update if you have originals)
The source HTML files all load fonts from Google Fonts CDN — there are **no local font files** in any source. We're loading the same Google-Fonts faces the originals do (Inter, JetBrains Mono, Orbitron, Space Grotesk). If your team has licensed local copies (e.g. for offline / air-gapped deployments), drop the `.woff2` files into `fonts/` and switch the `@import` at the top of `colors_and_type.css` for an `@font-face` block.

---

## How to use

1. **In a new HTML page**: link `colors_and_type.css` and apply `body.theme-rem-core` for command surfaces, default body for Somnus surfaces.
2. **In a React/JSX prototype**: copy the variables from `colors_and_type.css` into a global stylesheet, then build with the components in `ui_kits/`.
3. **For slides / decks**: pull logos from `assets/` and use the `display` + `gradient-text` classes for hero type. There are no slide templates in this folder — none were provided in the source materials.
