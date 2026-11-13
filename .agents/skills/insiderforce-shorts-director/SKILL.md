---
name: insiderforce-shorts-director
description: Plan, script, hook, and pace vertical AI/tech explainer Shorts (1080x1920, ~60-95s) using InsiderForce's 87-video empirically reverse-engineered storytelling, hook taxonomy, simplified explanation structure, shot pacing, and comment-keyword funnel. Use whenever writing a script, designing a hook, breaking an explainer into visual beats, or directing a short-form AI tool / workflow video.
---

# InsiderForce Shorts Director

Direct short-form vertical tech explainers built on empirical start-to-end telemetry across all **87 Shorts** from `@InsiderForce` (`233,600` total frames audited in `DEEP_AUDIT_87_SUMMARY.json` and `FULL_TIMELINE_STATS.json`, `3,301` shots, `3,195` bursts, `87` transcripts & audio mixes).

> [!IMPORTANT]
> **Remotion is the Editing Engine, Not the Video Topic:** Use Remotion (`@remotion/cli`, `@remotion/media`, `@remotion/google-fonts`) as the programmatic video editor to render genuine AI workflows, MCP integrations, CLI tools, or product teardowns — never hardcode Remotion itself as the video topic unless explicitly requested.

## Core Numbers at a Glance (`87/87` Audited)

| Metric | Channel Median / Mean | Distribution | Target Rule |
|---|---|---|---|
| Canvas & FPS | `1080x1920`, `30 fps` | `85/87` @ 30fps, `2` @ 60fps | Vertical 9:16, `30 fps` (or `60 fps` for dense UI scroll) |
| Total Duration | `87.98s` median | IQR `76.66s – 99.09s` | Aim for `25s – 90s` tight paced explainers (`172–194 WPM`) |
| Start-to-End Composition | `36.9%` Pure Kinetic Typo<br>`29.0%` Framed Real Screenshots<br>`24.6%` Official Logos & 3D Pucks<br>`9.6%` Real Recorded Footage | `87/87` use real logos/pucks<br>`76/87` use real screenshots<br>`43/87` use live video/screencasts | **Never fill every shot with fake UI boxes.** Alternate real recordings & cropped screenshots with breathing pure-typo scenes! |
| Shot Duration | `1.90s` median (`2.33s` avg) | IQR `1.40s – 2.73s` | Transform/cut every `1.5s – 3.0s`; drive beats directly from `word_timings.json` |
| Outro Funnel | `76/87` (`87%`) follower reminder<br>`75/87` InsiderForce crest lockup | `37/87` feature 3D Playbook/guide | `"Comment <KEYWORD>"` + `"Make sure you follow InsiderForce"` in final 4–6s |

---

## 5-Act Script & Beat-Sheet Blueprint

Every high-performing InsiderForce Short compresses real technical workflows into **5 tight acts**:

### Act 1: Pattern-Interrupt Hook (`0.0s – 3.5s`)
Open on `f000` with **zero greeting or filler** — pair a sharp hook claim with **official floating 3D brand medallions** (`fetch_brand_icon.py`) or a framed real clip. Choose from the 5 proven formulas in [hooks-and-scripts.md](references/hooks-and-scripts.md):
1. **Paid-Competitor Price Contrast**: `"Cursor has a price tag. Codex has a price tag..."` *(973k views)*
2. **Authority / Viral Social Proof Drop**: `"This Anthropic Hackathon winner just released his entire Claude Code setup for free."` *(2.2M views)*
3. **David-vs-Goliath Free/Local Paradox**: `"The open-source model that just beat Claude runs locally on a 4GB laptop for free."` *(885k views)*
4. **Numbered Overnight Outcome**: `"Three Claude Code skills that make you look like a designer overnight."` *(848k views)*
5. **Universal Pain + Concrete Workflow Replace**: `"Most developers still copy and paste code into Claude Code. Now instead of switching twenty tabs by hand..."` *(745k views style)*

### Act 2: Pure Kinetic Typography Breather (`1.5s – 2.5s`)
Across all 87 videos (`47.4%` raw pixel-level / `36.86%` scene-level share), InsiderForce deliberately strips away UI boxes for quick transitional phrases (`"Now instead of switching twenty tabs by hand"`), letting multi-scale `Inter` regular/heavy/italic typography breathe cleanly on `#F2F2F2`.

### Act 3: Official Workflow Hub + Real Cropped Screenshot (`3.0s – 5.0s`)
Drop real tool medallions (`puck_claude.png`, `puck_github.png`, `puck_supabase.png`, `puck_vercel.png`) wired by clean orthogonal lines alongside a **tightly cropped real GitHub/app screenshot** (`capture_web_screenshot.py --crop`) proving the tool is real.

### Act 4: Real Recorded Terminal / Web Video Proof + Icon Stack (`6.0s – 12.0s+`)
Never fake a terminal or doc viewer in React when you can record the real thing:
- **Real CLI Session (`record_footage_clip.py terminal-run`)**: Actual command output streaming inside macOS terminal chrome framed in `BeveledMediaFrame` (`<OffthreadVideo>`).
- **Real Live Website Scroll (`record_footage_clip.py web-scroll`)**: Eased live browser scroll + pointer click (`CursorClickOverlay`) on genuine docs/dashboards.
- **Official Icon Stack (`RealIconBulletRow`)**: Crisp official mini logo tiles (`icon_github.png`, `icon_supabase.png`, `icon_vercel.png`) summarizing `"Zero glue code / Zero manual setup"`.

### Act 5: 3D Playbook CTA & Follower Lockup (`Final 5.0s – 7.0s`)
1. Float a genuine **3D perspective Playbook Ebook** (`real_mcp_book.png`) with keyword trigger `"Comment \"MCP\" and I'll send you the exact setup guide."`
2. Resolve onto the clean **InsiderForce badge + `"Make sure you follow InsiderForce"`** lockup, holding cleanly through fade-out for seamless replay (`74/87` videos).

---

## Voiceover-First Production Workflow

1. **Finalize spoken script** (`~170–190 WPM`, zero filler).
2. **Run `generate_voiceover.py`** (`insiderforce-audio-design`) first so `word_timings.json` dictates every cut, wire draw, and `KineticWord` `startFrame`.
3. **Acquire REAL assets (`insiderforce-ui-system`)**: `fetch_brand_icon.py` for logos/pucks, `capture_web_screenshot.py` for tight screenshots + 3D Playbook cutout, `record_footage_clip.py` for live `<OffthreadVideo>` MP4 clips.
4. **Animate & Mix (`insiderforce-motion-engine` + `insiderforce-audio-design`)**: Render in Remotion (`StudioCanvas`, `BlurVignetteScene`, `BeveledMediaFrame`, `KineticWordFlow`) with V2 stereo SFX pre-lapped `-2f`.

## Companion Reference Files
- Hook formulas, verbatim top-20 scripts, and rhetorical frequencies: [hooks-and-scripts.md](references/hooks-and-scripts.md)
- Complete 87-video quantitative distributions: [channel-telemetry-87.md](references/channel-telemetry-87.md)
- Real UI captures, logos & footage recording: use `insiderforce-ui-system`
- Frame-by-frame blur-deconvolve curves & Remotion code: use `insiderforce-motion-engine`
- Voiceover timing, V2 stereo SFX & 4-band music mix: use `insiderforce-audio-design`
