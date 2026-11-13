---
name: insiderforce-ui-system
description: Design minimalist 1080x1920 vertical UI screens, color palettes, typography hierarchies, safe-zone alignments, clean assets, and real web/app screenshot captures matching InsiderForce's signature studio look across 87 Shorts. Use whenever building visual frames, React/HTML UI components, diagram cards, browser/terminal mockups, or capturing and framing app/website screenshots.
---

# InsiderForce UI System

Reproduce the crisp, high-whitespace studio aesthetic observed across all **87 InsiderForce Shorts** (`1080x1920`, `233,600` frames audited start-to-end in `DEEP_AUDIT_87_SUMMARY.json`). Every frame looks like an authentic editorial slide deck or real software artifact floating cleanly on a matte off-white studio desk.

## Non-Negotiable Visual Rules (Start-to-End 87-Video Audit)

1. **Matte Studio Light Canvas (`81.2%` mean light canvas share)**:
   - Primary canvas: `#F2F2F2` (most common) or `#F4F4F4` / `#FFFFFF`.
   - **Signature Architectural Texture**: Subtle `64px` dashed square lines (`#E3E3E7`) with tiny `1.8px` intersection dots (`#CCCCD2`) masked radially at the outer edges so the grid breathes softly toward the corners, or subtle `+` crosshairs (`56px` spacing).
   - Reserve dark surfaces (`#0D1017`, `#13161D`, `#19191B`) **strictly for real dark UI screenshots, real terminal video captures, and inverted dark highlight pills**.

2. **Real Assets vs. UI Budget (`DEEP_AUDIT_87_SUMMARY.json`)**:
   - **Never hand-code fake GUIs, Emoji placeholders, or mocked terminals.** Across all 87 videos start-to-end:
     - **Pure Kinetic Typography Breathers (`36.86%` mean / `38.0%` median; `47.4%` raw frame share)**: Open studio canvas with high-contrast multi-weight typography giving viewers visual breathing room between proof cards.
     - **Framed Real Screenshots (`28.99%` mean / `32.0%` median; `76/87` videos)**: Tightly cropped real web apps, GitHub repos, documentation, and pricing/code cards (`capture_web_screenshot.py`).
     - **Real Official Brand Icons & 3D Pucks (`24.55%` mean; `87/87` videos)**: Authentic SVG/PNG brand logos (`Claude`, `GitHub`, `Supabase`, `Vercel`, `Notion`, `Cursor`, `OpenAI`) set inside clean 3D beveled circular medallions or mini icon tiles (`fetch_brand_icon.py`).
     - **Real Screen Recordings & Terminal Video Footage (`9.60%` mean; `43/87` videos — up to `35%–66%` in demo-heavy hits like `031`, `037`, `040`, `058`)**: Real 30fps `<OffthreadVideo>` browser scroll recordings and live CLI executions (`record_footage_clip.py`) inside a thick white beveled frame (`BeveledMediaFrame`).

3. **9:16 Safe-Zone Alignment Discipline**:
   - **Top `0–25%` (`y: 0–480px`)**: Open margin; only floating context pills (`y: 260–395px`) stay clear of YouTube/Reels top chrome.
   - **Upper-Mid Visual Stage (`y: 380–1060px`)**: Medallion hubs, real `<OffthreadVideo>` footage, tightly cropped real screenshots, 3D playbook mockups. Keep content inside `x: 90–990px`.
   - **Lower-Mid Editorial Caption Stage (`y: 1090–1450px`)**: Centered mixed-weight `Inter` kinetic captions (`KineticWordFlow`). Always maintain **40–60px clear gap** below any beveled media frame shadow!
   - **Bottom Footer Margin (`y: 1460–1920px`)**: Empty except muted centered `insiderforce.io` watermark (`y: 1585px`), staying clear of Shorts UI chrome (`y > 1650px`).

---

## Color, Surface & Typography Tokens

See exact extracted distributions in [palette-typography-grid.md](references/palette-typography-grid.md). Quick defaults:

| Token | Value | Usage |
|---|---|---|
| `--bg-canvas` | `#F2F2F2` / `#ECECEC` | Studio matte backdrop |
| `--grid-line` / `--grid-dot` | `#E3E3E7` dashed + `#CCCCD2` dots | `64px` architectural engineering matrix |
| `--surface-card` | `#FFFFFF` (`border: #D9DBE2`) | Thick `8–11px` white media bezels & medallion pucks |
| `--surface-dark` | `#0D1017` / `#19191B` | Real terminal recordings & dark mode screenshots |
| `--ink-dry` | `#AEAEB4` -> `#141416` | Word-by-word ink-drying transition target |
| `--ink-muted` | `#5C5C64` / `#71717A` | Secondary lead-in words (`Now instead of...`) |
| `--font-sans` | `'Inter'` (`normal` + `italic` loaded via `@remotion/google-fonts/Inter`) | **Mandatory** webfont load so Chrome never falls back to system `Segoe UI` |

---

## Real Asset & Footage Production Pipeline (`scripts/`)

Always generate authentic media before writing Remotion JSX:

### 1. Official Vector Logos & 3D Beveled Medallions (`fetch_brand_icon.py`)
Fetches genuine Simple Icons vector SVGs in official brand colors and renders `icon_<slug>.png` (for crisp inline bullet rows) + `puck_<slug>.png` (`256px` 3D beveled circular studio medallions with directional shadow):
```powershell
.\.venv\Scripts\python.exe .\.agents\skills\insiderforce-ui-system\scripts\fetch_brand_icon.py `
  --slugs claude github supabase vercel notion anthropic `
  --out-dir "public/assets" --size 256
```

### 2. Tightly Cropped Real Web Screenshots (`capture_web_screenshot.py`)
Never capture blurry full-desktop pages with noisy sidebars. Use `--crop x,y,w,h` and `--frame-style thick-white`:
```powershell
.\.venv\Scripts\python.exe .\.agents\skills\insiderforce-ui-system\scripts\capture_web_screenshot.py `
  --url "https://github.com/modelcontextprotocol/servers" `
  --out "public/assets/real_github_mcp.png" `
  --viewport "1320x900" --crop "20,105,1040,660" `
  --frame-style "thick-white" --url-pill "github.com/modelcontextprotocol"
```
*Tip*: You can also craft bespoke minimal HTML pages (e.g., 3D perspective CSS Playbook covers) and capture them cleanly via Edge + transparent floodfill cutout so they sit natively on `StudioCanvas`.

### 3. Real 30fps Web Scroll & CLI Terminal MP4 Footage (`record_footage_clip.py`)
Record authentic scrolling documentation pages or actual subprocess terminal executions directly as crisp 30fps H.264 MP4s for `<OffthreadVideo>` inside `BeveledMediaFrame`:
```powershell
# Live browser documentation scroll clip (with smooth ease-in-out scroll + cursor glide):
.\.venv\Scripts\python.exe .\.agents\skills\insiderforce-ui-system\scripts\record_footage_clip.py web-scroll `
  --url "https://modelcontextprotocol.io/docs/getting-started/intro" `
  --out "public/footage/real_mcp_scroll.mp4" `
  --duration 4.2 --viewport "1340x740" --crop-x 285 --crop-y-start 110 --scroll-px 580

# Live terminal execution recording (real subprocess output + macOS chrome):
.\.venv\Scripts\python.exe .\.agents\skills\insiderforce-ui-system\scripts\record_footage_clip.py terminal-run `
  --cmd "echo Syncing MCP..." --prompt "claude mcp add github supabase vercel" `
  --out "public/footage/real_cli_session.mp4" --duration 4.8 --title "claude-code — ~/app (zsh)"
```

## Companion Reference Files
- Complete color tokens, typography scale, and grid specs: [palette-typography-grid.md](references/palette-typography-grid.md)
- All 14 observed InsiderForce UI archetypes & geometry specs: [ui-component-catalog.md](references/ui-component-catalog.md)
- Motion & easing curves: use `insiderforce-motion-engine`
