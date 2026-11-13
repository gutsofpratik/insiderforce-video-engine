import json
import os

audits = {
  '001_23cUNfHdJcc': {
    'slug': '001_23cUNfHdJcc',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 12,
      'framed_real_screenshots_pct': 22,
      'real_brand_icons_and_pucks_pct': 16,
      'pure_kinetic_typography_pct': 50
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f65: 3D interactive WebGL browser card displaying live Earth and Mars interactive web builds',
      'f120-f285: Official Anthropic Claude 3D cube puck, 8-bit mascot avatar, and framed 3D website card with live URL pill',
      'f300-f420: AweShell official web UI dashboard and framed copy-prompt code block',
      'f630-f765: Dark terminal window displaying live CLI deployment commands and automatic cloud hosting encryption',
      'f1245-f1345: Gallery of real production website cards including Hyper percussion massage gun 3D interactive showcase and marketplace cards',
      'f1365-f1440: Framed custom URL pill (https://3d-basketball-shop...) with globe icon and mascot',
      'f1500-f1605: AweShell drag-and-drop web UI screenshot/recording showing instant file upload workflow',
      'f1725-f1815: Dark loading spinner screen transitioning into live 3D basketball store screenshot',
      'f1830-f1905: Framed custom URL bar showing yourbrand.aweshell.com',
      'f1920-f2070: AweShell web console screenshot showing Define shell domain modal dialog and DNS setup',
      'f2130-f2265: Live 3D basketball website mockup transitioning into framed MacBook laptop hardware frame',
      'f2265-f2415: Brand icon puck tree with Anthropic hexagon puck connected to Claude mascot, Python terminal puck, and Gemini star puck',
      'f2490-f2596: InsiderForce black crown logo emblem on subtle technical engineering grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'Blur-deconvolve with dry-darkening token snap observed on mid strip (f1318-f1333) as 3D website card shifts; late strip (f2128-f2143) exhibits optical recentering and tight letter-tracking expansion as words build from muted gray (#999999) to full black (#111111)',
      'typography_hierarchy': 'Large tight-tracked bold lead lines (e.g. Claude Code can now launch any website, you get a working public link) anchor the beat, while small regular explanatory sub-lines and italic emphasis tokens balance technical specs',
      'list_and_emphasis_markers': ['✦', '×', '→', 'underline', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.4,
      'music_floor_db': -23.0,
      'gap_db': 10.6,
      'sfx_pattern_start_to_end': 'Crisp mechanical whoosh swells on card transitions (0.20s, 0.52s, 1.20s), sharp clicks on negated list item reveals (f795, f825, f870), deep sub-bass hits on key conceptual nouns (0.08s, 0.46s, 3.80s), and deliberate quiet-gap contrast before the final CTA'
    },
    'closing_and_loop_design': 'At f2430-f2475 delivers CTA Comment SHELL. At f2490 through final frame f2596 (~10%), canvas transitions via clean deconvolve to a centered InsiderForce crown mark on an engineering grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, with audio ducking to complete silence at the cut point for seamless looping'
  },
  '002_j5-XLj2E9g4': {
    'slug': '002_j5-XLj2E9g4',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 18,
      'framed_real_screenshots_pct': 26,
      'real_brand_icons_and_pucks_pct': 18,
      'pure_kinetic_typography_pct': 38
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f135: Framed high-production 3D website showcases (Inner Circle red rabbit 3D site, Hyper percussion site, Contact UI card)',
      'f135-f225: Brand puck tree featuring Bing (b), Google (G), and Perplexity official icons with connecting node lines',
      'f240-f315: Big Tech brand puck column with Apple, Meta, OpenAI, Nvidia, Microsoft, and Airbnb topped with golden crown vectors',
      'f450-f495: Framed browser URL bar typing Blink.new',
      'f510-f540: Prompt modal input dialog card (describe your website idea and hit enter)',
      'f555-f630: Three dark pill/card stack: Layer 01, Layer 02, Layer 03',
      'f645-f975: Architecture diagram connecting Inner Circle pink card to search engine pucks and server rack with green checkmarks',
      'f1065-f1230: Responsive multi-device layout cards (OYLI luxury ring 3D website) across desktop, tablet, and mobile breakpoints',
      'f1260-f1335: Real Blink visual editor interface with live 3D rotating ring model being manipulated inside browser canvas',
      'f1350-f1410: Split view showing live dark VS Code terminal editor auto-compiling code changes directly from visual editor',
      'f1410-f1470: Framed real-time visual commenting interface with agent rewrite annotation pill',
      'f1485-f1680: Blink black square logo puck and SEO/AEO automated technical audit report cards scoring from 0 to 100 across 5 areas',
      'f1710-f1860: Blink logo connected to globe and AI platform pucks (Perplexity, Google, OpenAI)',
      'f1875-f1980: Framed tablet/browser displaying automated fix suggestions dashboard with one-click resolution',
      'f1995-f2115: Blink logo connected to global CDN cloud node with animated padlock icon (auto-renewed SSL)',
      'f2130-f2280: Rapid showcase gallery of dark 3D client website builds (Hyper percussion 3D site, Contact card)',
      'f2295-f2385: 3-tier dark card stack: Layer 01, Layer 02, Layer 03',
      'f2490-f2591: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1288-f1303), kinetic text click any element in the visual editor maintains locked optical centering while 3D ring viewport manipulates; late strip (f2158-f2173) displays word-by-word dry-darkening token snap where new words enter in faint gray and instantly harden to dense black as spoken syllables land',
      'typography_hierarchy': 'Heavy tight-tracked lead statements (your preview stays hidden, three layers of infrastructure) paired with medium muted secondary text and bulleted feature breakdowns',
      'list_and_emphasis_markers': ['✦', 'underline', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.2,
      'music_floor_db': -23.2,
      'gap_db': 11.0,
      'sfx_pattern_start_to_end': 'Mechanical card thuds on Layer 01-03 drops (f555), crisp high-frequency clicks on interactive element taps (f1290), whoosh sweeps across breakpoint shifts, and controlled music ducking creating a 11.0 dB separation gap'
    },
    'closing_and_loop_design': 'At f2415-f2475 delivers CTA Comment BLINK. From f2490 to final frame f2591 (~10%), transitions to the signature black InsiderForce crown logo mark centered on white technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, cutting audio cleanly for loop readiness'
  },
  '003_qGuDcRRJAD4': {
    'slug': '003_qGuDcRRJAD4',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 22,
      'framed_real_screenshots_pct': 28,
      'real_brand_icons_and_pucks_pct': 20,
      'pure_kinetic_typography_pct': 30
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f50: Claude red 8-bit mascot typing at mechanical keyboard in front of terminal screen',
      'f60-f155: Central MCP hub diagram connecting Claude puck to 5 plugin pucks (Playwright, Supabase, VibeSec, SkillUI, Context7)',
      'f195-f230: Plugin #1 Playwright MCP green/red masks official icon puck',
      'f240-f285: Dark code terminal screen where AI writes code and Claude mascot inspects',
      'f300-f350: Browser window mockup with confused Claude mascot encountering frontend bugs',
      'f360-f465: Real Playwright automated browser test execution recording with live cursor clicking through login flow',
      'f525-f585: Framed ecommerce checkout failure test screen catching broken flow before release',
      'f600-f655: Plugin #2 Supabase green lightning bolt puck',
      'f660-f765: Framed Supabase database schema and live management card',
      'f780-f925: Live terminal running SQL database queries directly from CLI prompt',
      'f945-f990: Plugin #3 VibeSec green shield puck',
      'f1005-f1055: Green security shield cracking over cyber grid background representing security vulnerabilities',
      'f1080-f1120: Hacker hoodie silhouette avatar node',
      'f1125-f1275: Live terminal security scan with animated magnifying glass detecting vulnerability alert card',
      'f1290-f1345: Plugin #4 SkillUI puck',
      'f1350-f1390: Gallery of live production website cards (Mouthfeels IPA beer site, Hyper massage gun site, 3D render site)',
      'f1395-f1565: Dark terminal CLI output extracting full design system tokens (colors, fonts, spacing rules, component patterns)',
      'f1590-f1665: Design token bundle packaging into yellow folder icon and handed to Claude mascot',
      'f1725-f1775: Plugin #5 Context7 math bracket sum puck',
      'f1785-f1885: Dark terminal running outdated library code with confused mascot',
      'f1890-f1995: Framed real documentation reference table listing up-to-date API parameters',
      'f2025-f2115: Dark terminal executing current API syntax',
      'f2130-f2250: All 5 plugin pucks orbiting Claude mascot with green verification checkmarks',
      'f2385-f2610: Realistic 3D printed eBook mockup (They Will Never Know AI Wrote It) flipping open to show interior chapters',
      'f2625-f2755: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1378-f1393), rapid frame-accurate cut from 3-card stack into SkillUI terminal with optical centering; late strip (f2248-f2263) reveals an 8-frame heavy Gaussian blur-vignette dissolve completely dissolving the 5-puck architecture out before now make dry-darkens in',
      'typography_hierarchy': 'Prominent numbered plugin labels (#1 Playwright MCP, #2 Supabase, etc.) lead each section, followed by bold kinetic capability statements over regular subordinate clauses',
      'list_and_emphasis_markers': ['✦', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.1,
      'music_floor_db': -23.1,
      'gap_db': 11.0,
      'sfx_pattern_start_to_end': 'Crisp mechanical snap on each MCP node socketing in, high-impact glass shatter on security shield breach (f1035), paper whoosh on eBook page turns (f2385), and solid sub-thuds on numbered list reveals'
    },
    'closing_and_loop_design': 'At f2385-f2480 delivers CTA Comment HUMAN / I will send you my ebook. From f2625 to final frame f2755 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, with music ducked to digital zero at cut'
  },
  '004_RKZOKc51wz4': {
    'slug': '004_RKZOKc51wz4',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 12,
      'framed_real_screenshots_pct': 25,
      'real_brand_icons_and_pucks_pct': 18,
      'pure_kinetic_typography_pct': 45
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f75: Technical engineering grid canvas with hand-drawn question mark doodles and GitHub repo typography',
      'f90-f145: Real Google Gemini 2.5 Pro API billing calculator cards stepping down from $174/1M to $12/1M to $0/1M',
      'f150-f285: Official GitHub repository table screenshot (146 free LLM APIs from 24 providers)',
      'f300-f350: Dark terminal window listing permanent free provider endpoints',
      'f360-f450: Framed banner card (No credit card, ever) with negated list items',
      'f465-f580: Comprehensive model directory table screenshot showcasing Llama 3, DeepSeek, Mistral, and Qwen free endpoints',
      'f585-f705: Dark terminal screen recording showing interactive typing of awesome freellm apis repository',
      'f720-f820: Dark code editor window showing environment configuration and API key setup',
      'f825-f1080: Large cluster of official brand pucks appearing: Perplexity, Gemini, Groq, Nvidia, Together AI, Mistral, OpenAI, Hugging Face',
      'f1170-f1320: Stacked API card deck showing OpenAI, Gemini, and Anthropic drop-in compatibility connected to Python and curl pucks',
      'f1320-f1335: Inverted black pill button with mouse cursor click animation (with one click)',
      'f1415-f1575: Framed GitHub README Quick Start code snippet card (Quick Start - Use Any Free API in 10 Seconds)',
      'f1575-f1680: Realistic error alert dialog card stack (AI Credits Exhausted / Rate Limit Reached)',
      'f1695-f1780: Constellation of free model provider pucks activating with interconnecting wires',
      'f1830-f1970: Dark terminal automated sync schedule connected to globe icon node (updates daily)',
      'f2190-f2440: 3D printed eBook mockup (They Will Never Know AI Wrote It) flipping open with bulleted chapter overview',
      'f2460-f2568: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1408-f1423), Quick Start card smoothly glides in from lower-right while negated list markers exit; late strip (f2173-f2188) reveals a Gaussian blur-vignette transition clearing canvas into minimal light gray where Comment sits centered and HUMAN deconvolves into dense black bold text',
      'typography_hierarchy': 'Massive bold declarations (could end your API bill forever, 146 free LLM APIs, your API bill just became a choice) dominate the canvas above clean medium-weight secondary copy',
      'list_and_emphasis_markers': ['✦', '×', 'underline', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -15.7,
      'music_floor_db': -26.8,
      'gap_db': 11.1,
      'sfx_pattern_start_to_end': 'Subtle digital clicks on API counter decreases, crisp UI mouse click on with one click pill (f1325), rapid multi-tone pops as provider pucks populate (f840-f1080), and clear sub thuds on section breaks'
    },
    'closing_and_loop_design': 'At f2190-f2440 delivers CTA Comment HUMAN / I will send you my ebook. From f2460 to final frame f2568 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, fading music to digital zero for seamless replay'
  },
  '005_TWSOfNXgL-c': {
    'slug': '005_TWSOfNXgL-c',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 14,
      'framed_real_screenshots_pct': 26,
      'real_brand_icons_and_pucks_pct': 18,
      'pure_kinetic_typography_pct': 42
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f105: Realistic iOS push notification banner cards stacking (Systeme: Your Store has a new Order for 3 Items totaling $1170)',
      'f120-f285: Claude 8-bit mascot carrying mechanical gear puck with negated list markers (Never sleeps, Never stops, Never lets anyone get ahead)',
      'f345-f405: Framed browser address bar typing systeme.io',
      'f405-f525: Framed account creation interface and sales analytics dashboard table',
      'f540-f645: Dark AI prompt input modal with prompt describing digital business concept',
      'f660-f945: Dark terminal markdown document scrolling full funnel copy (Claude writes your sales funnel copy, Your email sequence, Your course outline)',
      'f945-f1110: Systeme.io blue S brand puck, real running business notification banner, and 3-layer card stack (01, 02, 03)',
      'f1170-f1350: Layer 01: Framed lead capture landing pages and automated contact tag dashboard (What they clicked, What interests them)',
      'f1365-f1530: Layer 02: Audience user avatar nodes connected to automated email sequence flow',
      'f1545-f1740: Layer 03: Transaction completed success card, Video Editing Course graphic card, affiliate megaphone, and PayPal $1000 zero-fee payment dialogs',
      'f1755-f1845: All three layer cards (01, 02, 03) synchronized with rotating mechanical gear icon',
      'f1920-f2085: Showcase carousel of digital product mockup covers (THEY LL NEVER KNOW AI WROTE IT, DIGITAL MARKETING COURSE, Coach Training Programs)',
      'f2100-f2265: Claude mascot paired with blue Systeme puck illustrating autonomous business execution',
      'f2385-f2492: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1018-f1033), iOS notification card enters while real running business text holds inside an inverted dark pill; late strip (f1948-f1963) exhibits an 8-frame Gaussian blur-deconvolve as the square digital course mockup resolves into crisp sharpness',
      'typography_hierarchy': 'Dominant bold headlines (you can now use Claude to sell anything you want, Systeme handles your entire business in three layers simultaneously) contrasted with light regular tracking for technical workflow details',
      'list_and_emphasis_markers': ['×', '→', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.3,
      'music_floor_db': -23.5,
      'gap_db': 11.2,
      'sfx_pattern_start_to_end': 'Chime/cash register SFX on incoming order banners (f0-f105), mechanical clicks on Layer 01-03 transitions, whooshes on product card rotations, and deep sub hits on value propositions'
    },
    'closing_and_loop_design': 'At f2295-f2355 delivers CTA Comment SYS / and I will send you the Direct Link. From f2385 to final frame f2492 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, audio ducks cleanly to zero'
  },
  '006_CvelXUzEopU': {
    'slug': '006_CvelXUzEopU',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 32,
      'framed_real_screenshots_pct': 38,
      'real_brand_icons_and_pucks_pct': 12,
      'pure_kinetic_typography_pct': 18
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f135: Cinematic high-fidelity fantasy world generation cards (ancient stone portal, luminous crystal cavern, dragon cliff)',
      'f150-f195: Dark AI worldbuilding input prompt box with extensive paragraph prompt describing mythical kingdom',
      'f210-f405: Tidecrown in Sight interactive world card with bullet list (Its own geography, Its own history, Its own characters)',
      'f420-f450: Framed browser address bar typing neta.ai',
      'f465-f555: Dark search and generation prompt bar',
      'f570-f600: Neta anime mascot puck with purple twin-tails',
      'f615-f675: Full-bleed cinematic atmospheric vertical generations of gothic archways and fantasy temples',
      'f690-f1665: Continuous panoramic horizontal world generation cards with narrative arrowed beats (A dragon skims the black tide, A seaside city, A frozen academy, A desert city, Dragon Lair)',
      'f1680-f1800: Six-card multi-region fantasy atlas grid (all from one sentence)',
      'f1815-f1860: Animated iOS toggle switch flipping green (then you activate the Map Skill)',
      'f1875-f2115: Upper City wide aerial fantasy landscape card with bullet list (Every location mapped, Every region connected, A geography that feels like it has existed for centuries)',
      'f2130-f2265: Live POV 3D panoramic walkthrough inside Tidecrown Cathedral with smooth camera panning through gothic interior',
      'f2280-f2430: Interactive dialogue RPG screen recording with live fantasy character avatar and dynamic chat window',
      'f2460-f2625: Advanced AI model suite status cards: Anthropic Opus 5.5, GPT Astra, Seedance 2.5',
      'f2715-f2824: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1273-f1288), continuous narrative block anchors beneath desert city card with word-by-word dry-darkening token snap; late strip (f2188-f2203) features tight optical horizontal tracking as text from that map you can take a full POV walk through builds seamlessly alongside 3D camera pan',
      'typography_hierarchy': 'Narrative world lore styled in clean sans with arrow prefix (→) and high-contrast bold highlights on key fantasy locations over dark cinematic cards',
      'list_and_emphasis_markers': ['✦', '→']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.3,
      'music_floor_db': -23.6,
      'gap_db': 11.2,
      'sfx_pattern_start_to_end': 'Low-frequency cinematic atmospheric sub drones, tactile toggle click on Map Skill activation (f1845), smooth panoramic whooshes, and quiet contrast pause before final call-to-action'
    },
    'closing_and_loop_design': 'At f2640-f2700 delivers CTA Comment NETA / and I will send you the Direct Link. From f2715 to final frame f2824 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, cutting cleanly for infinite loop'
  },
  '007_gwdJ9EzNJDI': {
    'slug': '007_gwdJ9EzNJDI',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 10,
      'framed_real_screenshots_pct': 35,
      'real_brand_icons_and_pucks_pct': 15,
      'pure_kinetic_typography_pct': 40
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f105: Official brand icon pucks for Anthropic, Perplexity, OpenAI, and Gemini orbiting top canvas',
      'f120-f165: Broken/cracked 3D Earth globe illustration (hallucinates real world data confidently)',
      'f180-f270: Realistic tabular data sheet screenshot with inverted pill tag it was never real',
      'f390-f465: AI brand pucks connected to cracked globe node',
      'f480-f540: Warning hazard icon over user silhouette (it hallucinates confidently and keeps going)',
      'f660-f720: Framed browser address bar typing glasser.ai and loading landing page (One prompt gives your agent the real data it needs)',
      'f720-f795: Glasser installation card (one prompt installs it as a skill into any agent)',
      'f810-f870: Claude 8-bit mascot with lightbulb alert antennas',
      'f885-f990: Glasser official icon puck (a) with info badge linked to Claude mascot',
      'f1080-f1170: Floating dark search prompt bar (ask your agent to find decision makers at companies in your target market)',
      'f1185-f1350: Real framed B2B lead database table screenshot with verified leads (Verified names, Job titles, LinkedIn profiles, Work emails) and inverted pill that actually exist',
      'f1380-f1440: Dark prompt bar querying competitor SEO metrics',
      'f1470-f1620: Real competitor SEO analytics graphs and ranking metric tables',
      'f1635-f1740: Claude mascot connected to Meta infinity puck and TikTok music note puck',
      'f1755-f1905: Mascot linked to globe pulling live creative video ad cards (How To Grow Your Business?)',
      'f1920-f2010: Glasser query input bar generating massive linked network graph of real verified data nodes',
      'f2040-f2190: Side-by-side prompt output sheets (Same agent, Same prompt) showing dramatic factuality difference',
      'f2280-f2490: Comprehensive pricing card comparison stack showing traditional B2B SaaS vs Glasser API prices (Ahrefs $129 vs $0.051, Semrush $139.95 vs $0.050, Apollo $65 vs $0.026, ZoomInfo $300 vs $0.040, Hunter $49 vs $0.016, Bright Data $499 vs $0.120)',
      'f2685-f2790: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1363-f1378), kinetic text ask it to enters with optical recentering directly beneath floating dark query bar; late strip (f2368-f2383) demonstrates a deconvolve dissolve where multi-tier enterprise price cards fade and condense into a single Hunter orange pricing badge',
      'typography_hierarchy': 'Bold urgency hook (this is the scariest problem with every AI right now, it hallucinates confidently) transitioning into structured ✦ feature lists and high-impact price comparison rows',
      'list_and_emphasis_markers': ['✦', 'underline', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.3,
      'music_floor_db': -23.6,
      'gap_db': 11.3,
      'sfx_pattern_start_to_end': 'Sub-bass earth impact thud, crisp mechanical clicks on lead row checkmarks, fluttering paper card transitions on pricing comparison deck, and ducked silence before final CTA'
    },
    'closing_and_loop_design': 'At f2595-f2655 delivers CTA Comment DATA / and I will send you the direct link. From f2685 to final frame f2790 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, cleanly cutting audio'
  },
  '008_OGrLbo3dskw': {
    'slug': '008_OGrLbo3dskw',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 12,
      'framed_real_screenshots_pct': 32,
      'real_brand_icons_and_pucks_pct': 18,
      'pure_kinetic_typography_pct': 38
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f135: Claude 8-bit mascot typing at terminal keyboard while technical output translates into formatted plain English card',
      'f195-f345: Document card titled WALL OF TEXT filled with dense developer jargon and stressed stick-figure sketch',
      'f360-f450: Yellow folder icon filled with code snippets (someone just built a free pack of commands that fixes it permanently)',
      'f465-f555: Open Steps tool interface documentation card (Free & Open source)',
      'f555-f645: Claude mascot holding terminal bar with one-line install command',
      'f780-f1005: Command #1 /os-done-or-not: Claude mascot outputting structured verification report with binary yes/no answers',
      'f1020-f1215: Command #2 /os-step-by-step: Claude mascot breaking work into 5 numbered interactive pill steps (1 Open settings, 2 Copy API key, 3 Paste, 4 Click Save, 5 Confirm complete)',
      'f1245-f1425: Command #3 /os-ask-simple: Claude mascot converting complex terminal question into clean card with single green marked recommendation',
      'f1500-f1680: Command #4 /os-whats-next: Claude mascot surfacing single next prioritized task card',
      'f1695-f2010: Command #5 /os-check-work: Claude detective mascot with trenchcoat and magnifying glass auditing session claims and catching false completions',
      'f2025-f2205: Command #6 /os-say-simple: Claude mascot translating dense git diffs into plain human words',
      'f2220-f2445: Command #7 /os-what-could-go-wrong: Claude mascot running pre-mortem analysis on high-risk operations (✦ Deploys, ✦ Migrations, ✦ Payments)',
      'f2460-f2685: Command #8 /os-big-picture: Claude mascot compiling entire project architecture and state into a single markdown source file',
      'f2700-f2835: Central one-install gear node connected to Claude, Cursor, and Terminal agent pucks with for free badge',
      'f2925-f3035: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1333-f1348), dark terminal card scales up and settles with spring easing while this one turns any agent question into enters with word-by-word dry-darkening; late strip (f2428-f2443) shows pre-mortem card holding steady as Payments bullet slides up and deconvolves into place',
      'typography_hierarchy': 'Heavy bold numbered headers (Number #1, Number #2 through Number #8) establish structural hierarchy over kinetic explanatory body lines and bulleted checklists',
      'list_and_emphasis_markers': ['✦', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.3,
      'music_floor_db': -22.6,
      'gap_db': 10.3,
      'sfx_pattern_start_to_end': 'Fast card whooshes on command tag swaps (#1 through #8), sharp mechanical clicks on numbered checklist completion (f1170), detective magnifying glass chime, and punchy sub hits on command numbers'
    },
    'closing_and_loop_design': 'At f2850-f2910 delivers CTA Comment OPEN / and I will send you the direct link. From f2925 to final frame f3035 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, fading audio cleanly to zero'
  },
  '009_jeR2zez-Jk4': {
    'slug': '009_jeR2zez-Jk4',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 20,
      'framed_real_screenshots_pct': 35,
      'real_brand_icons_and_pucks_pct': 15,
      'pure_kinetic_typography_pct': 30
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f135: Real high-production fashion and lifestyle video clips (cinematic blue forest, party, fashion runway, portrait, street model)',
      'f90-f135: ChatGPT logo puck paired with CapCut bowtie brand logo puck',
      'f150-f225: Realistic 3D purple book mockup flipping open (most people have no idea what that is actually capable of)',
      'f240-f375: Framed CapCut ChatGPT Plugin dark UI in Codex',
      'f420-f495: Codex blue terminal puck with brain icon badge connected to CapCut puck with film strip badge (Codex is the brain, CapCut is the studio)',
      'f510-f585: Codex natural language prompt interface card',
      'f600-f690: Real AI product photography and video gallery (luxury perfume bottle, wooden architecture model, lowrider car, city robot)',
      'f705-f840: Structured production script and shotlist breakdown documents generated by AI',
      'f870-f945: CapCut bowtie logo puck generating 3x3 video asset gallery',
      'f960-f1005: Stack of video title cards (Secret of Success)',
      'f1020-f1155: Real CapCut video editor UI screen recording with timeline tracks, creator speaking preview, and layer clips',
      'f1215-f1440: CapCut media library interface selecting effects, transitions, and audio tracks',
      'f1455-f1575: Finished CapCut timeline view with colored multi-track clips (post production workflow completed inside CapCut without you touching the timeline once)',
      'f1620-f1710: Natural language prompt input card for timeline refinements',
      'f1725-f1845: Split screen showing conversational prompt card and CapCut manual inspector panel (for precise manual editing)',
      'f1980-f2055: Reusable workflow skill document card with gear icon (Skill)',
      'f2070-f2205: Moodboard gallery of video formats (fashion, sports, food, beauty) with bullet list (Your style, Your preferences, Your process)',
      'f2265-f2445: Connected pipeline view connecting prompt bar to Codex to CapCut project with inverted pill inside one conversation',
      'f2580-f2700: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1213-f1228), kinetic text a draft opens with everything already inside it holds with subtle curved underline while CapCut UI panel scales in; late strip (f2143-f2158) shows asset moodboard cycling while one click and it runs again automatically deconvolves with dry-darkening token snaps',
      'typography_hierarchy': 'Heavy tight-tracked lead statements (ChatGPT can now create and edit professional videos using CapCut, without you touching the timeline once) set against clean light sub-lines and bullet points',
      'list_and_emphasis_markers': ['✦', 'underline', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -11.9,
      'music_floor_db': -23.3,
      'gap_db': 11.4,
      'sfx_pattern_start_to_end': 'High-shutter camera clicks on asset card reveals (f600), digital UI whooshes on draft generation, mechanical track snaps on timeline assembly, and quiet-gap pause before final CTA'
    },
    'closing_and_loop_design': 'At f2505-f2565 delivers CTA Comment CUT / and I will send you the direct link. From f2580 to final frame f2700 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, audio fading cleanly into zero'
  },
  '010_2BWt4v3jXSU': {
    'slug': '010_2BWt4v3jXSU',
    'composition_ratio': {
      'real_video_or_screen_recording_pct': 12,
      'framed_real_screenshots_pct': 36,
      'real_brand_icons_and_pucks_pct': 18,
      'pure_kinetic_typography_pct': 34
    },
    'real_footage_and_assets_start_to_end': [
      'f0-f135: Subscription pricing modal cards for Cursor Pro ($20/mo), Claude Pro ($20/mo), and Claude Max ($100/mo) stacking under brand pucks',
      'f210-f240: Smashed/cracked glass overlay over $100 subscription cards (that beats all of them)',
      'f300-f375: Browser screenshot typing bot.abacus.ai showing landing page (Meet Abacus AI Bot: Code for Free. Forever. - $0)',
      'f420-f465: Hero card presenting desktop AI coworker ($0)',
      'f480-f585: Hub node diagram: Abacus AI logo puck (equalizer bars) connected via network lines to Slack, Notion, GitHub, and Google Drive pucks with rotating gear',
      'f600-f705: Multi-monitor dark terminal and desktop workspace cards (every task you give it gets handled end to end)',
      'f720-f780: Code task prompt card (you describe a coding task)',
      'f765-f780: Official GitHub octopus brand puck',
      'f795-f1005: Multi-page automated codebase analyzer documents and test logs (reads your entire codebase, understands structure, writes code, catches bugs, opens PR)',
      'f1125-f1140: Notion official black N brand puck',
      'f1230-f1380: Framed Notion workspace cards (Find the Missing Info, Acme Home wiki) updating autonomously',
      'f1410-f1485: Abacus puck connected to Gmail (M) and Slack pucks',
      'f1500-f1605: Framed tablet mockup displaying structured daily morning briefing (inbox summary, calendar schedule, daily priorities)',
      'f1620-f1740: Connected app integration ecosystem (Gmail, Meet, Slack, Notion) cycling around Abacus core with gear icon (done automatically while you slept)',
      'f1740-f1815: Framed mobile smartphone view chatting with bot on WhatsApp / Telegram',
      'f1830-f1965: Dark terminal chat window executing real-time desktop agent interaction',
      'f2085-f2105: Hand-drawn SVG underline accent under everything (it remembers everything)',
      'f2130-f2250: Structured persistent memory cards (Your codebase structure, Your preferences, Your patterns) with inverted pill every single session',
      'f2340-f2430: Abacus puck with open-source credentials (Open source, MIT licensed, Free forever)',
      'f2520-f2610: InsiderForce black crown logo emblem on technical grid canvas'
    ],
    'mid_and_late_text_kinetics': {
      'entrance_mechanics': 'In mid strip (f1228-f1243), Notion card scales up smoothly under Abacus puck while it reads your docs deconvolves with subtle rise and dry-darkening token snap; late strip (f2098-f2113) shows curved SVG underline drawing under everything before cross-dissolving into structured memory cards with bulleted points',
      'typography_hierarchy': 'Heavy tight-tracked lead statements (that beats all of them, actually does the work instead of just talking about it, you never explain the same thing twice) over medium body text and bullet lists',
      'list_and_emphasis_markers': ['✦', '→', 'underline', 'inverted pill']
    },
    'audio_sfx_and_music_balance': {
      'voice_peak_db': -12.0,
      'music_floor_db': -22.8,
      'gap_db': 10.9,
      'sfx_pattern_start_to_end': 'Violent glass shatter SFX on $100 price card crack (f225), crisp mechanical clicks on Notion card sync, notification chime on morning briefing card drop (f1545), and quiet gap before final CTA'
    },
    'closing_and_loop_design': 'At f2460-f2505 delivers CTA Comment BOT / and I will send you the direct link. From f2520 to final frame f2610 (~10%), transitions to the centered InsiderForce crown mark on technical grid with make sure you Follow InsiderForce / the system only sends it to FOLLOWERS, fading audio cleanly to zero'
  }
}

for slug, data in audits.items():
    path = f'analysis/videos/{slug}/deep_audit.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    with open(path, 'r', encoding='utf-8') as f:
        check = json.load(f)
    assert check['slug'] == slug
    print(f'Wrote and verified: {path}')

print('All 10 deep_audit.json files successfully written and validated!')
