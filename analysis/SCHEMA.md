# @InsiderForce Shorts — Frame-by-Frame Analysis Schema

Every one of the channel's Shorts MUST produce both:
1. `analysis/videos/<slug>/breakdown.json` (valid JSON adhering to this schema)
2. `analysis/videos/<slug>/breakdown.md` (human-readable detailed report with exact frame/ms notes)

## Required JSON Structure (`breakdown.json`)

```json
{
  "slug": "001_VIDEOID",
  "id": "VIDEOID",
  "title": "Exact YouTube title",
  "duration_sec": 38.5,
  "fps": 30,
  "resolution": "1080x1920",
  "overall_style_tag": "minimal_dark_ui_explainer | light_notion_style | terminal_claude_demo | hybrid_broll_ui | ...",
  "hook": {
    "hook_archetype": "curiosity_gap | contrarian_claim | speed_demo | secret_workflow | visual_shock | comparison_vs",
    "duration_sec": 2.8,
    "visual_hook": "Exact description of frame 0..90 visuals & movement",
    "on_screen_text_hook": "Exact text shown in 0-3s",
    "verbal_hook": "Exact spoken opening line",
    "audio_sfx_hook": "Exact SFX/music behavior in first 1.5s",
    "scroll_stop_mechanism": "Why a viewer stops scrolling in the first 500ms"
  },
  "color_system": {
    "theme": "dark | light | mixed",
    "bg_hex": "#0B0D12",
    "bg_treatment": "radial_glow | dot_grid | line_grid | solid | subtle_gradient | vignette",
    "surface_card_hex": "#141821",
    "border_hex": "#252B3B",
    "text_primary_hex": "#F8FAFC",
    "text_muted_hex": "#94A3B8",
    "accent_colors": ["#3B82F6", "#10B981"],
    "semantic_colors_used": ["green_success", "red_error", "amber_warning"]
  },
  "typography": {
    "headline_style": "geometric_sans_bold | grotesk_tight | mono_code",
    "body_style": "clean_sans_regular | mono",
    "caption_style": "none | word_by_word_pop | phrase_fade | highlighted_active_word | top_anchored_card_title",
    "casing_pattern": "Title Case | Sentence case | UPPERCASE_BADGE",
    "text_animations_observed": ["word_stagger_up", "opacity_blur_reveal", "typewriter_cursor", "scale_pop_overshoot", "highlight_sweep"]
  },
  "layout_and_minimalism": {
    "alignment": "center_stack | left_aligned_card | split_top_bottom",
    "safe_zone_compliance": "keeps UI in center 60% vertical band avoiding YT bottom/right overlays",
    "whitespace_ratio_est": 0.45,
    "max_simultaneous_elements": 3,
    "cleanliness_techniques": ["1px subtle border", "soft elevation shadow", "progressive disclosure", "icon+label pills"]
  },
  "ui_components_and_assets": [
    {
      "component_type": "claude_chat_window | macos_terminal | pill_button | cursor_pointer | metric_counter | toggle_switch | toast_card | browser_mockup | node_diagram | comparison_table | code_snippet | progress_bar | badge_tag | image_screenshot",
      "visual_spec": "Exact styling: corner radius, border, fill, shadow, icon style, badge colors",
      "asset_source_type": "generated_ui_vector | real_app_screenshot | ai_generated_image | icon_lucide_style"
    }
  ],
  "frame_by_frame_animations": [
    {
      "strip_file": "00_hook_sequence.png",
      "frame_range": "f000-f018",
      "duration_ms": 600,
      "what_animates": "Exact element and property changing per frame",
      "frame_progression": "f000: ... -> f002: ... -> f005: ... -> f010: ... -> f018: settle",
      "easing_curve_estimate": "snappy_ease_out | spring_overshoot | linear_type | instant_cut",
      "smoothness_notes": "Motion blur, opacity fade overlap, stagger delay in frames"
    }
  ],
  "shots": [
    {
      "shot": 1,
      "start_f": 0,
      "end_f": 75,
      "duration_sec": 2.5,
      "purpose": "Hook / Problem / Demo Step / Proof / Payoff / Loop",
      "visual_summary": "What is on screen",
      "transition_in": "hard_cut | scale_pop | slide_up | wipe | zoom_in",
      "on_screen_text": "Exact text in this shot"
    }
  ],
  "audio_and_sfx": {
    "music_presence": true,
    "music_vibe": "ambient_tech_pulse | lofi_minimal | dark_synth_tension | upbeat_clean_corporate | none",
    "estimated_bpm": 110,
    "music_ducking_behavior": "Ducks sharply under voiceover, swells in 300ms pause transitions",
    "music_dramatic_cuts": "Stops abruptly before punchline or hook drop? yes/no + timestamp",
    "sfx_cues": [
      {
        "sfx_type": "whoosh | pop | mouse_click | keyboard_clack | chime_ding | bass_thud | riser | card_slide | toggle_snap | error_buzz",
        "trigger_visual": "Exact UI/text action it accompanies",
        "frame_sync_note": "Observed frame offset e.g. -2f before cut or 0f on click"
      }
    ],
    "voice_delivery": {
      "wpm": 165,
      "tone": "calm_authoritative | fast_curious | conversational_insider",
      "pacing_pattern": "Short punchy clauses, micro-pauses before reveals"
    }
  },
  "explanation_craft": {
    "narrative_formula": "Hook -> Why Old Way Fails -> Claude/Tool Mechanism -> Live Result -> Takeaway/Loop",
    "visual_metaphor_or_simplification": "How complex concept is made visually intuitive",
    "loop_technique": "seamless_audio_sentence_loop | visual_reset | cliffhanger_payoff | hard_stop"
  }
}
```
