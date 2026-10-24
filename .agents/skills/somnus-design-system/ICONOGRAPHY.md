# Iconography

## What's used

### 1. Font Awesome 6 — the workhorse
**Every reference HTML loads Font Awesome 6 free from cdnjs.** This is the system's built-in icon font and the *only* glyph library used in chrome. Add it to any new page exactly the way the originals do:

```html
<!-- Most files use the JS bundle -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js"></script>

<!-- A handful of files use the CSS bundle instead -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

Both work. Use `fas` (solid) for almost everything; `fab` for brand glyphs (e.g. `fab fa-git-alt`); `far` (regular) is unused in the source files we have.

#### Inventory of icons actually used in source files
*(These are the ones that already mean something in this system — prefer them over inventing new ones.)*

**Chat / messaging**
`fa-paper-plane` (send) · `fa-microphone` (voice) · `fa-camera` (vision input) · `fa-comment` `fa-comments` (chat) · `fa-microscope` (research mode) · `fa-magnifying-glass` (search)

**Workspace / nav (the floating bubble nav)**
`fa-cube` (artifacts) · `fa-folder` (projects) · `fa-brain` (AI training) · `fab fa-git-alt` (git repos) · `fa-flask` (research) · `fa-cog` (settings) · `fa-sliders` (instance settings)

**Status / system**
`fa-shield` `fa-shield-halved` (sovereignty / security) · `fa-satellite` `fa-satellite-dish` · `fa-globe` · `fa-bolt` (unlimited / power) · `fa-circle` (status dot fallback) · `fa-chart-line` `fa-chart-bar` · `fa-database` · `fa-server`

**Multi-agent / collaboration**
`fa-users` · `fa-user-robot` · `fa-network-wired` · `fa-diagram-project` · `fa-people-arrows`

**Actions**
`fa-plus` (new) · `fa-copy` (clone) · `fa-history` (recent) · `fa-list` (view all) · `fa-play` `fa-pause` `fa-stop` · `fa-download` `fa-upload` · `fa-sync` (refresh) · `fa-trash` · `fa-pen` (edit)

**REM-Core specific**
`fa-crosshairs` · `fa-radar` · `fa-triangle-exclamation` (threat) · `fa-bullseye` · `fa-eye` (surveillance/view) · `fa-binoculars` · `fa-sitemap` (correlation tree)

#### How to render
```html
<i class="fas fa-paper-plane"></i>            <!-- inline -->
<button class="action-btn">
  <i class="action-icon fas fa-microscope"></i>
  Research
</button>
```
Stroke weight: solid (default). Don't mix solid + outline in the same view — pick one and stick with it (the source overwhelmingly uses solid).

### 2. Inline SVG — for shield / brand-y glyphs
A handful of REM-Core templates draw a **shield** glyph inline (the security mark in the command header):

```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-10-5z"/>
  <path d="M8 11l2 2 4-4"/>
</svg>
```
Use this pattern when an icon needs to be tinted with a CSS variable (because Font Awesome glyphs inherit `color` fine, but multi-color builds are harder). Keep `stroke-width="2"`, no fills, `currentColor`.

### 3. Corner brackets — characteristic UI ornament
Not really icons — but the L-shaped corner brackets on REM-Core panels function like a brand glyph and are part of the iconography vocabulary. They are CSS pseudo-elements, never SVG:

```css
.corner-bracket {
  position: absolute;
  width: 14px; height: 14px;
  border-color: var(--neural-primary);
}
.corner-bracket.top-left    { top: 0; left: 0;
  border-top: 1px solid; border-left: 1px solid; }
.corner-bracket.top-right   { top: 0; right: 0;
  border-top: 1px solid; border-right: 1px solid; }
.corner-bracket.bottom-left { bottom: 0; left: 0;
  border-bottom: 1px solid; border-left: 1px solid; }
.corner-bracket.bottom-right{ bottom: 0; right: 0;
  border-bottom: 1px solid; border-right: 1px solid; }
```

### 4. Status dots
Small 8px circles (`.status-dot`) in green / amber / red / cyan / orange — defined in `colors_and_type.css`. These are the most-used "icon" in the system; treat them as a primitive.

---

## What NOT to use

- **No emoji in chrome.** Emoji appear *only* inside `console.log` (🚀 ✅ ❌ 📡 💪) — they are dev telemetry, never UI labels.
- **No Lucide / Heroicons / Phosphor / Material Icons.** Source files don't use them; mixing will break visual consistency.
- **No PNG icon sprites.** The source uses zero raster icons.
- **No unicode glyphs as icons** in the chrome — except the lone `●` for an extra-emphatic dot when CSS isn't available.

---

## Logos (in `assets/`)

| File | Use |
|---|---|
| `assets/ssds-logo.png` | **SSDS** — primary product mark for Somnus Sovereign Systems. Hex shield, brushed-metal SSDS wordmark, red glow at the base. Use on near-black surfaces. Do not place on light backgrounds. |
| `assets/oracle-logo.png` | **Oracle** — sub-system mark for the correlation/oracle engine. Eight-spoke node with a red center, ORACLE serif wordmark in cream. |
| `assets/operation-moonshine-logo.png` | **Operation Moonshine** — campaign/mission badge. Hexagonal frame, moon-droplet center, *"DISTILL THE FLOW"* tagline. Use as a project/mission badge inside either product. |

All three were created for dark backgrounds and have transparent or near-black fields. None should be recoloured or placed on a light surface.

---

## Substitutions / flags

- **No icons were substituted.** The source uses Font Awesome 6 only, which we link from CDN exactly as the originals do.
- If you ever need an icon Font Awesome doesn't have, prefer to draw it as inline SVG with `stroke="currentColor" stroke-width="2"` — that's the existing exception pattern, not a new direction.
