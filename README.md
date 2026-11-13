# InsiderForce Remotion & AI Video Production Engine

A reverse-engineered, frame-accurate production system for vertical AI/tech explainer YouTube Shorts (1080×1920 @ 30fps), based on the empirical forensic audit of 87 `@InsiderForce` videos.

---

## 📦 What's Inside ("The Sauce")

### 1. Four Agent Skills (`.agents/skills/`)
- **`insiderforce-shorts-director`**: Hook taxonomy (Contrast, Provocation, Secret Shift), simplified 3-beat storytelling structure, 60–75s pacing curves, and high-conversion comment-keyword funnels (`Comment "<KEYWORD>"` -> Playbook).
- **`insiderforce-ui-system`**: Minimalist 1080×1920 design system (`#F2F2F2` / `#FFFFFF`), elevated `BeveledMediaFrame` cards with subtle 3D perspective drift, official brand pucks, and high-fidelity browser/terminal captures.
- **`insiderforce-motion-engine`**: Physics-based Remotion springs (`damping: 16, stiffness: 210, mass: 0.72`), 12f Gaussian lens-blur & whip-slide transitions, kinetic mixed-weight typography with accent pill highlights, and anti-static micro-drift.
- **`insiderforce-audio-design`**: Complete audio mixing pipeline:
  - `-2f` pre-lapped tactile SFX palette (58 cues: air whooshes, woody pops, tactile clicks, paper ticks, sub impacts, major-9th warm chimes).
  - Pure background music bed (`Beyond the Black Veil` 93 BPM) with dynamic voice-aware ducking (`0.40` under speech, `0.52–0.54` on transitions).
  - Broadcast vocal mastering chain (`85Hz` HPF, `185Hz` body, `3.6kHz` intelligibility boost, `2.6:1` soft-knee compression, `loudnorm I=-13.8 LUFS`).

### 2. Complete Remotion Project (`remotion-test-v2/`)
- **`src/Primitives.tsx`**: GPU-composited primitives (`BlurVignetteScene`, `DirectionalMotionBlur`, `BeveledMediaFrame`, `KineticWordFlow`, `CursorClickOverlay`, `StudioCanvas`, `RealIconBulletRow`).
- **`src/Top3ClaudeSkillsShort.tsx`**: Full 8-scene production composition (70s @ 30fps) with isolated scenes and text layers.
- **`src/top3SkillsTextLayer.ts`**: Live editable text layer schema via Zod, exposed directly in Remotion Studio's Props panel.
- **`public/audio/`**: Pre-mixed 58-cue stereo stem (`skills_sfx_stem.wav`), pure channel BGM (`channel_music_bed.wav`), voiceover (`skills_voiceover.wav`), and word-level JSON alignments.
- **`public/skills_v4/`**: Official 3D brand pucks (Claude, Anthropic, GitHub, Playwright, React, Tailwind, MCP, Python, TypeScript), live scroll footage MP4s, terminal recordings, and 3D Playbook cover mockups.

### 3. Audio & Video Forensics (`analysis/` & `data/`)
- Deep audits of all 87 videos: duration, WPM, cut pacing, loudness, spectral distribution, hook patterns, and transition taxonomies.

### 4. Automation & Alignment Scripts (`scripts/`)
- Video analysis, timeline scanning, BGM extraction, DTW word-timestamp alignment, and SFX stem mixing tools.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd remotion-test-v2
npm install
```

### 2. Launch Remotion Studio (Interactive UI Preview & Live Props Editor)
```bash
npm run studio
```
Navigate to `http://localhost:3000/Top3ClaudeSkillsShort`. You can edit captions live in the **Default Props** sidebar without touching code.

### 3. Render Final Locked 30fps MP4
```bash
npx remotion render src/index.ts Top3ClaudeSkillsShort out/top_3_claude_skills.mp4 --codec=h264 --crf=17
```
