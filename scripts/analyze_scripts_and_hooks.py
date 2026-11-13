"""Analyze all 87 Shorts transcripts, titles, hooks, bridge phrases, CTAs, and view performance."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = ROOT / "data" / "channel" / "index.json"
ANALYSIS_DIR = ROOT / "analysis" / "videos"
OUT_PATH = ROOT / "analysis" / "SCRIPT_AND_HOOK_PATTERNS.json"


def split_sentences(text: str) -> list[str]:
    cleaned = re.sub(r"\[music\]|\[applause\]", "", text, flags=re.I)
    parts = [s.strip() for s in re.split(r"(?<=[.!?])\s+", cleaned) if s.strip()]
    return parts


def main() -> None:
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    records: list[dict[str, Any]] = []
    phrase_counts = Counter()

    patterns_to_track = [
        ("all_you_need", r"\ball you need\b"),
        ("now_instead_of", r"\bnow,?\s*instead of\b"),
        ("heres_the_part_different", r"part that makes it (genuinely )?different|what makes it different"),
        ("called_x", r"\b(?:it is|it's) called\b"),
        ("comment_x", r"\bcomment\b"),
        ("follow_insiderforce", r"follow insider\s*force|only sends it to followers"),
        ("save_this", r"\bsave this\b"),
        ("for_free", r"\bfor free\b|\bcompletely free\b|\bfree tool\b|\bfree skill\b"),
        ("no_x_no_y", r"\bno [a-z]+,?\s*no [a-z]+"),
        ("claude_code", r"\bclaude\s*code\b|\bcloud\s*code\b"),
        ("stop_doing_x", r"\bstop\s+[a-z]+ing\b"),
        ("nobody_talking", r"nobody(?:'s| is) talking about"),
        ("in_seconds_minutes", r"\bin\s+(?:\d+|one|two|three|five|ten|30)\s+(?:seconds?|minutes?|command|prompt)\b"),
    ]

    for item in index:
        slug = item["slug"]
        bpath = ANALYSIS_DIR / slug / "brief.json"
        if not bpath.exists():
            continue
        b = json.loads(bpath.read_text(encoding="utf-8"))
        full_text = b["subtitles"]["full_text"] or ""
        sents = split_sentences(full_text)
        hook_sent = sents[0] if sents else ""
        second_sent = sents[1] if len(sents) > 1 else ""
        outro_sent = " ".join(sents[-2:]) if len(sents) >= 2 else full_text[-140:]
        sent_lens = [len(s.split()) for s in sents]

        for name, rx in patterns_to_track:
            if re.search(rx, full_text, flags=re.I):
                phrase_counts[name] += 1

        records.append(
            {
                "slug": slug,
                "title": b["youtube"].get("title") or item.get("title"),
                "view_count": b["youtube"].get("view_count") or item.get("view_count") or 0,
                "like_count": b["youtube"].get("like_count") or 0,
                "comment_count": b["youtube"].get("comment_count") or 0,
                "duration_sec": b["video_meta"]["duration_sec"],
                "wpm": b["subtitles"]["wpm"],
                "word_count": b["subtitles"]["word_count"],
                "sentence_count": len(sents),
                "avg_words_per_sentence": round(sum(sent_lens) / max(1, len(sent_lens)), 1),
                "hook_0_3s": b["subtitles"]["hook_0_3s_text"],
                "opening_sentence": hook_sent,
                "second_sentence": second_sent,
                "outro_sentences": outro_sent,
            }
        )

    top_by_views = sorted(records, key=lambda r: r["view_count"], reverse=True)[:20]
    out = {
        "total_scripts": len(records),
        "rhetorical_pattern_frequencies": dict(phrase_counts.most_common()),
        "top_20_by_views": top_by_views,
        "all_87_hooks": [
            {
                "slug": r["slug"],
                "views": r["view_count"],
                "title": r["title"],
                "hook": r["opening_sentence"],
                "bridge": r["second_sentence"],
                "outro": r["outro_sentences"],
            }
            for r in records
        ],
    }
    OUT_PATH.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(records)} scripts)")
    print("Pattern counts:", dict(phrase_counts.most_common()))


if __name__ == "__main__":
    main()
