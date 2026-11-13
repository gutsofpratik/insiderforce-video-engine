import json

audits_tail = {
  '029__ENDJNDJFas': {
    'slug': '029__ENDJNDJFas',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 38,
      'framed_real_screenshots_pct': 32,
      'real_brand_icons_and_pucks_pct': 10,
      'pure_kinetic_typography_pct': 20
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f135: Cinematic high-fidelity fantasy world generation cards (ancient stone hall, luminous crystal cavern, waterfall gorge, dragon cliff)',
      'f120-f165: Claude red 8-bit mascot with orange flower aura and dark input prompt modal with paragraph worldbuilding prompt',
      'f210-f285: Full-bleed cinematic waterfall cavern generation card (and it builds an entire universe around your idea and lets you step inside)',
      'f285-f375: Negated requirement cards (No experience required, No artistic background needed)',
      'f390-f465: Tidecrown fantasy world cards displaying multi-region environments',
      'f480-f540: Neta anime mascot puck with purple twin-tails and framed mobile phone mockup running Neta.art app',
      'f600-f630: Framed browser address bar typing neta.art',
      'f645-f765: Dark prompt bar displaying paragraphs of worldbuilding lore',
      'f810-f1650: Continuous horizontal panoramic fantasy scenes with narrative arrowed captions (An ancient dwarven gate, A great spiral sinking into an abyss, A glowing forest of mushrooms, Dark elven spires, Ancient dragon coiled around its eggs)',
      'f1665-f1755: Six-card multi-node grid atlas layout (built from one sentence)',
      'f1770-f1860: Dark interactive Canvas interface with node graph and character cards',
      'f1875-f2055: Interactive Canvas node screen recording where character and location cards connect with SVG wires (Character cards appear, Locations take shape)',
      'f2070-f2265: World Map Skill view displaying full regional geography (Every region, Every landmark, Every corner of your world laid out and connected)',
      'f2280-f2445: Living interactive map UI with terrain elevation and biome cards (a living map that shows you the entire scale of what just came from one sentence)',
      'f2460-f2625: First-person POV full video camera recording of adventurer walking through jungle trail, waterfall, and ancient stone ruins',
      'f2640-f2865: Live interactive 3D camera POV walking through dark underground stairs with torch, giant luminescent mushroom forest, and hanging rope suspension bridge over glowing blue abyss (hands gripping rope rails in real time)',
      'f2880-f3000: Cinematic encounter with the ancient dragon and shaman characters in dragon sanctum with golden eggs',
      'f3015-f3075: Multi-card gallery comparing static results vs live interactive world',
      'f3090-f3255: POV walkthrough video clips continuing across rope bridge and temple corridors (this is a world you explore, and share as a video)',
      'f3405-f3525: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1663-f1678), the 6-card fantasy grid builds with progressive deconvolve fade-ins; late strip (f2818-f2833) shows first-person POV suspension bridge footage panning forward smoothly while text holds with subtle optical tracking',
      'typography_hierarchy': 'Narrative world lore styled in clean sans with arrow prefix (→) and high-contrast bold highlights on key fantasy locations over dark cards; major declarations use heavy bold headers',
      'list_and_emphasis_markers': ['✦', '×', '→', 'underline', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -15.9,
      'music_floor_db': -25.3,
      'gap_db': 9.5,
      'sfx_pattern_start_to_end': 'Atmospheric cinematic low sub drones, torch fire crackle, wooden rope bridge creak / footstep Foley, paper whooshes on card reveals, quiet pause before Comment NETA'
    },
    'closing_and_loop_design': 'At f3315-f3375 delivers CTA Comment NETA / and I will send you the Direct Link. From f3405 to final frame f3525 (~10%), transitions cleanly to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, audio ducking to complete silence at loop boundary'
  },
  '030_21LvkiDcMi0': {
    'slug': '030_21LvkiDcMi0',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 8,
      'framed_real_screenshots_pct': 28,
      'real_brand_icons_and_pucks_pct': 22,
      'pure_kinetic_typography_pct': 42
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f120: Claude Code Skills orange folder card with icon badges (You can now run CLAUDE CODE with unlimited usage completely free)',
      'f135-f240: Bookmark icon with limit warning card (Save this before you hit your limit mid session and lose everything you were working on)',
      'f270-f345: GitHub official logo puck on white canvas (Someone on GitHub just built a free tool called 9Router)',
      'f345-f375: Framed dark GitHub repository card for 9Router - FREE AI Router & Token Saver',
      'f420-f540: Hub diagram: Claude 8-bit mascot connected to Anthropic orange star puck, connected to free AI provider pucks: Kimi (K), GLM, Gemini',
      'f555-f630: Clean kinetic text (It sits in the background and you never have to think about it)',
      'f645-f750: Claude mascot screaming with sweat drops and alert exclamation mark (The second your claude limit runs out!)',
      'f765-f825: Clean kinetic transitions (it just switches to the next available providers on its own)',
      'f840-f1065: 9Router switching engine animation: Anthropic orange star puck seamlessly failing over to Kimi, GLM, and Gemini pucks with connecting dotted lines',
      'f1065-f1230: 9Router architecture card with checklist (you set it up once, connect your providers)',
      'f1245-f1350: Claude mascot smiling with sunglasses next to negated checklist (No manual switching, No interruptions, No extra cost)',
      'f1380-f1485: Universal coding agent compatibility cards: Claude Code, Cursor, Codex, Antigravity',
      'f1485-f1590: 8-puck grid of AI coding tools (Claude, Cursor, Codex, Antigravity, VS Code, OpenAI, Mistral, Together) working out of the box',
      'f1605-f1710: Framed 9Router GitHub README and setup dashboard with checklist (One free tool, Zero interruptions, Unlimited sessions)',
      'f1740-f1830: Claude star puck radiating softly (And if you want everything Claude puts out to sound like a real person wrote it)',
      'f1860-f1965: 3D printed eBook mockup (They Will Never Know AI Wrote It) with Comment Human / I will send you my e-book',
      'f1980-f2100: eBook interior pages flipping open: Chapter 1 Why AI Sounds Like AI, Step-by-step guide, To make AI copy sound 100% HUMAN',
      'f2115-f2231: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f928-f943), Anthropic star puck holds top position while Kimi/GLM failover pucks blur-dissolve into place and kinetic text Your session enters with dry-darkening token snap; late strip (f1888-f1903) shows 3D eBook mockup settled with spring physics while Comment Human holds centered with crisp optical balance',
      'typography_hierarchy': 'Bold punchy hook (You can now run CLAUDE CODE with unlimited usage completely free) followed by emergency alert styling (runs out!), balanced by clean ✦ checklists and medium body copy',
      'list_and_emphasis_markers': ['✦', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -13.7,
      'music_floor_db': -24.9,
      'gap_db': 11.2,
      'sfx_pattern_start_to_end': 'Warning alert buzzer / gasp on Claude limit exhausted (f660), crisp mechanical clicks on failover provider switches, paper whoosh on eBook page turns (f1980), and clean ducked silence before final CTA'
    },
    'closing_and_loop_design': 'At f1860-f1965 delivers CTA Comment Human / I will send you my e-book They will never know AI wrote it. From f2115 to final frame f2231 (~10%), transitions cleanly to the centered InsiderForce crown mark on technical grid with make sure you follow InsiderForce / the system only sends it to FOLLOWERS, audio fading cleanly to digital zero for seamless replay'
  }
}

for slug, data in audits_tail.items():
    path = f'analysis/videos/{slug}/deep_audit.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    with open(path, 'r', encoding='utf-8') as f:
        check = json.load(f)
    assert check['slug'] == slug
    assert sum(check['composition_ratio'].values()) == 100
    print(f'Wrote and validated: {path}')

print('Both 029 and 030 deep audits written and validated successfully!')
