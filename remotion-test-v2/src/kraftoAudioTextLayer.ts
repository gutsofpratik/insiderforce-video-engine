import { z } from 'zod';
import { KineticWordProps } from './Primitives';

export const kraftoAudioShortSchema = z.object({
  showTextLayer: z.boolean().default(true),
  branding: z.object({
    channelName: z.string().default('Krafto'),
    followButtonText: z.string().default('Follow'),
    followSubtext: z.string().default('Sound Effects · Audio Pack'),
    watermark: z.string().default(''), // Strictly clean: no insiderforce.io watermark
  }),
});

export type KraftoAudioShortProps = z.infer<typeof kraftoAudioShortSchema> & {
  scene1Hook: { words: KineticWordProps[][] };
  scene2Reveal: {
    phase1Words: KineticWordProps[][];
    phase2Words: KineticWordProps[][];
  };
  scene3Zephyr: {
    badge: { num: string; name: string; tagline: string };
    phase1Words: KineticWordProps[][];
    phase2Words: KineticWordProps[][];
  };
  scene4Echo: {
    badge: { num: string; name: string; tagline: string };
    phase1Words: KineticWordProps[][];
    phase2Words: KineticWordProps[][];
  };
  scene5Tide: {
    badge: { num: string; name: string; tagline: string };
    phase1Words: KineticWordProps[][];
    phase2Words: KineticWordProps[][];
  };
  scene6Setup: {
    phase1Words: KineticWordProps[][];
    phase2Words: KineticWordProps[][];
    urlPill: string;
  };
  scene7Outro: {
    words: KineticWordProps[][];
  };
};

export const KRAFTO_AUDIO_DEFAULT_PROPS: KraftoAudioShortProps = {
  showTextLayer: true,
  branding: {
    channelName: 'Krafto',
    followButtonText: 'Follow',
    followSubtext: 'Sound Effects · Audio Pack',
    watermark: '',
  },
  scene1Hook: {
    words: [
    [
        {
            "text": "Stop",
            "startFrame": 0,
            "weight": "semibold"
        },
        {
            "text": "wasting",
            "startFrame": 8.6,
            "weight": "semibold"
        },
        {
            "text": "hours",
            "startFrame": 23.8,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "digging",
            "startFrame": 34.6,
            "weight": "semibold"
        },
        {
            "text": "through",
            "startFrame": 49.7,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "bloated",
            "startFrame": 64.8,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "stock",
            "startFrame": 79.9,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "sites",
            "startFrame": 90.7,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "for",
            "startFrame": 101.5,
            "weight": "semibold"
        },
        {
            "text": "sound",
            "startFrame": 108.0,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "effects.",
            "startFrame": 118.8,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ]
],
  },
  scene2Reveal: {
    phase1Words: [
    [
        {
            "text": "Krafto",
            "startFrame": 0,
            "weight": "semibold"
        },
        {
            "text": "just",
            "startFrame": 12.5,
            "weight": "semibold"
        },
        {
            "text": "launched",
            "startFrame": 21.0,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "an",
            "startFrame": 37.9,
            "weight": "semibold"
        },
        {
            "text": "official",
            "startFrame": 42.1,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "audio",
            "startFrame": 59.0,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "library",
            "startFrame": 69.6,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "built",
            "startFrame": 84.3,
            "weight": "semibold"
        },
        {
            "text": "specifically",
            "startFrame": 94.9,
            "weight": "heavy"
        }
    ],
    [
        {
            "text": "for",
            "startFrame": 120.2,
            "weight": "semibold"
        },
        {
            "text": "modern",
            "startFrame": 126.6,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "creators.",
            "startFrame": 139.3,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ]
],
    phase2Words: [
    [
        {
            "text": "Every",
            "startFrame": 0.1,
            "weight": "semibold"
        },
        {
            "text": "track",
            "startFrame": 11.1,
            "weight": "semibold"
        },
        {
            "text": "is",
            "startFrame": 22.1,
            "weight": "semibold"
        },
        {
            "text": "a",
            "startFrame": 26.6,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "pristine",
            "startFrame": 28.8,
            "weight": "semibold"
        },
        {
            "text": "thirty-two-bit",
            "startFrame": 46.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "float",
            "startFrame": 77.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "stereo",
            "startFrame": 88.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "WAV",
            "startFrame": 101.7,
            "weight": "semibold"
        },
        {
            "text": "with",
            "startFrame": 108.3,
            "weight": "semibold"
        },
        {
            "text": "personal",
            "startFrame": 117.1,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "and",
            "startFrame": 134.8,
            "weight": "semibold"
        },
        {
            "text": "commercial",
            "startFrame": 141.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "rights",
            "startFrame": 163.5,
            "weight": "semibold"
        },
        {
            "text": "included.",
            "startFrame": 176.8,
            "weight": "semibold"
        }
    ]
],
  },
  scene3Zephyr: {
    badge: {
      num: '01',
      name: 'Zephyr Ambience',
      tagline: 'Airy High-Frequency Atmosphere',
    },
    phase1Words: [
    [
        {
            "text": "First",
            "startFrame": 0.4,
            "weight": "semibold"
        },
        {
            "text": "is",
            "startFrame": 15.4,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "Zephyr",
            "startFrame": 21.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "Ambience.",
            "startFrame": 39.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ]
],
    phase2Words: [
    [
        {
            "text": "An",
            "startFrame": 0.4,
            "weight": "semibold"
        },
        {
            "text": "airy,",
            "startFrame": 4.7,
            "weight": "semibold"
        },
        {
            "text": "high-frequency",
            "startFrame": 13.4,
            "weight": "heavy"
        }
    ],
    [
        {
            "text": "atmospheric",
            "startFrame": 43.8,
            "weight": "heavy"
        },
        {
            "text": "texture",
            "startFrame": 67.6,
            "weight": "semibold"
        },
        {
            "text": "that",
            "startFrame": 82.8,
            "weight": "semibold"
        },
        {
            "text": "gives",
            "startFrame": 91.4,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "tech",
            "startFrame": 102.3,
            "weight": "semibold"
        },
        {
            "text": "explainers",
            "startFrame": 111.0,
            "weight": "heavy"
        },
        {
            "text": "and",
            "startFrame": 132.6,
            "weight": "semibold"
        },
        {
            "text": "motion",
            "startFrame": 139.1,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "graphics",
            "startFrame": 152.1,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "instant",
            "startFrame": 169.5,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "depth",
            "startFrame": 184.7,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "without",
            "startFrame": 195.5,
            "weight": "semibold"
        },
        {
            "text": "cluttering",
            "startFrame": 210.7,
            "weight": "heavy"
        },
        {
            "text": "dialogue.",
            "startFrame": 232.4,
            "weight": "semibold"
        }
    ]
],
  },
  scene4Echo: {
    badge: {
      num: '02',
      name: 'Echo Ambience',
      tagline: 'Spatial Cinematic Pulse & Decay',
    },
    phase1Words: [
    [
        {
            "text": "Second",
            "startFrame": 0.6,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "is",
            "startFrame": 23.2,
            "weight": "semibold"
        },
        {
            "text": "Echo",
            "startFrame": 29.2,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "Ambience.",
            "startFrame": 41.1,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ]
],
    phase2Words: [
    [
        {
            "text": "A",
            "startFrame": 0,
            "weight": "semibold"
        },
        {
            "text": "spatial",
            "startFrame": 2.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "cinematic",
            "startFrame": 20.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "pulse",
            "startFrame": 43.5,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "with",
            "startFrame": 56.3,
            "weight": "semibold"
        },
        {
            "text": "natural",
            "startFrame": 66.6,
            "weight": "semibold"
        },
        {
            "text": "stereo",
            "startFrame": 84.6,
            "weight": "semibold"
        },
        {
            "text": "decay,",
            "startFrame": 100.0,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "perfect",
            "startFrame": 116.7,
            "weight": "semibold"
        },
        {
            "text": "for",
            "startFrame": 130.4,
            "weight": "semibold"
        },
        {
            "text": "scene",
            "startFrame": 136.3,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "transitions,",
            "startFrame": 146.1,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "UI",
            "startFrame": 171.6,
            "weight": "semibold"
        },
        {
            "text": "reveals,",
            "startFrame": 177.6,
            "weight": "semibold"
        },
        {
            "text": "and",
            "startFrame": 198.5,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "card",
            "startFrame": 207.4,
            "weight": "semibold"
        },
        {
            "text": "snaps.",
            "startFrame": 219.4,
            "weight": "semibold"
        }
    ]
],
  },
  scene5Tide: {
    badge: {
      num: '03',
      name: 'Tide Ambience',
      tagline: 'Dynamic Low-End Weight & Swell',
    },
    phase1Words: [
    [
        {
            "text": "Third",
            "startFrame": 0.2,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "is",
            "startFrame": 20.6,
            "weight": "semibold"
        },
        {
            "text": "Tide",
            "startFrame": 26.7,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "Ambience.",
            "startFrame": 38.8,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ]
],
    phase2Words: [
    [
        {
            "text": "A",
            "startFrame": 0,
            "weight": "semibold"
        },
        {
            "text": "dynamic",
            "startFrame": 2.4,
            "weight": "semibold"
        },
        {
            "text": "low-end",
            "startFrame": 19.3,
            "weight": "semibold"
        },
        {
            "text": "swell",
            "startFrame": 36.2,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "that",
            "startFrame": 48.2,
            "weight": "semibold"
        },
        {
            "text": "brings",
            "startFrame": 57.9,
            "weight": "semibold"
        },
        {
            "text": "organic",
            "startFrame": 72.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "weight",
            "startFrame": 89.3,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "to",
            "startFrame": 103.8,
            "weight": "semibold"
        },
        {
            "text": "visual",
            "startFrame": 108.6,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "impacts",
            "startFrame": 123.1,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "and",
            "startFrame": 140.0,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "timeline",
            "startFrame": 147.2,
            "weight": "semibold"
        },
        {
            "text": "cuts.",
            "startFrame": 166.5,
            "weight": "semibold"
        }
    ]
],
  },
  scene6Setup: {
    phase1Words: [
    [
        {
            "text": "And",
            "startFrame": 0.1,
            "weight": "semibold"
        },
        {
            "text": "here",
            "startFrame": 7.9,
            "weight": "semibold"
        },
        {
            "text": "is",
            "startFrame": 18.3,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "the",
            "startFrame": 23.5,
            "weight": "semibold"
        },
        {
            "text": "cheat",
            "startFrame": 31.3,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "code.",
            "startFrame": 44.3,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "With",
            "startFrame": 58.6,
            "weight": "semibold"
        },
        {
            "text": "Krafto's",
            "startFrame": 67.9,
            "weight": "semibold"
        },
        {
            "text": "official",
            "startFrame": 86.4,
            "weight": "semibold"
        },
        {
            "text": "MCP",
            "startFrame": 104.9,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "server,",
            "startFrame": 111.8,
            "weight": "semibold"
        },
        {
            "text": "you",
            "startFrame": 125.7,
            "weight": "semibold"
        },
        {
            "text": "can",
            "startFrame": 132.6,
            "weight": "semibold"
        },
        {
            "text": "connect",
            "startFrame": 139.6,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "this",
            "startFrame": 155.7,
            "weight": "semibold"
        },
        {
            "text": "directly",
            "startFrame": 165.0,
            "weight": "semibold"
        },
        {
            "text": "to",
            "startFrame": 183.5,
            "weight": "semibold"
        }
    ]
],
    phase2Words: [
    [
        {
            "text": "Claude",
            "startFrame": 0,
            "weight": "semibold"
        },
        {
            "text": "can",
            "startFrame": 12.3,
            "weight": "semibold"
        },
        {
            "text": "search,",
            "startFrame": 18.5,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "audition,",
            "startFrame": 30.8,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "and",
            "startFrame": 47.3,
            "weight": "semibold"
        },
        {
            "text": "pull",
            "startFrame": 53.5,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "these",
            "startFrame": 61.7,
            "weight": "semibold"
        },
        {
            "text": "sound",
            "startFrame": 72.0,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "effects",
            "startFrame": 82.3,
            "weight": "semibold"
        },
        {
            "text": "straight",
            "startFrame": 96.8,
            "weight": "semibold"
        },
        {
            "text": "into",
            "startFrame": 113.3,
            "weight": "semibold"
        },
        {
            "text": "your",
            "startFrame": 121.5,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "website",
            "startFrame": 129.8,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "code",
            "startFrame": 144.2,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "or",
            "startFrame": 152.4,
            "weight": "semibold"
        },
        {
            "text": "video",
            "startFrame": 156.6,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "timeline",
            "startFrame": 166.9,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "without",
            "startFrame": 183.3,
            "weight": "semibold"
        },
        {
            "text": "leaving",
            "startFrame": 197.8,
            "weight": "semibold"
        },
        {
            "text": "your",
            "startFrame": 212.2,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "workspace.",
            "startFrame": 220.4,
            "weight": "heavy"
        }
    ]
],
    urlPill: 'mcp.trykrafto.xyz/mcp',
  },
  scene7Outro: {
    words: [
    [
        {
            "text": "Comment",
            "startFrame": 0,
            "weight": "semibold"
        },
        {
            "text": "Krafto",
            "startFrame": 15.7,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "below",
            "startFrame": 29.2,
            "weight": "semibold"
        },
        {
            "text": "to",
            "startFrame": 40.5,
            "weight": "semibold"
        },
        {
            "text": "get",
            "startFrame": 45.0,
            "weight": "semibold"
        },
        {
            "text": "the",
            "startFrame": 51.8,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "setup",
            "startFrame": 58.5,
            "weight": "semibold"
        },
        {
            "text": "guide",
            "startFrame": 69.8,
            "weight": "semibold"
        },
        {
            "text": "and",
            "startFrame": 81.1,
            "weight": "semibold"
        },
        {
            "text": "the",
            "startFrame": 87.9,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "full",
            "startFrame": 94.6,
            "weight": "semibold"
        },
        {
            "text": "audio",
            "startFrame": 103.7,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "pack.",
            "startFrame": 114.9,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        }
    ],
    [
        {
            "text": "And",
            "startFrame": 127.8,
            "weight": "semibold"
        },
        {
            "text": "make",
            "startFrame": 134.4,
            "weight": "semibold"
        },
        {
            "text": "sure",
            "startFrame": 143.1,
            "weight": "semibold"
        },
        {
            "text": "you",
            "startFrame": 151.8,
            "weight": "semibold"
        }
    ],
    [
        {
            "text": "follow",
            "startFrame": 158.4,
            "weight": "semibold"
        },
        {
            "text": "Krafto",
            "startFrame": 171.4,
            "weight": "heavy",
            "highlightSweep": true,
            "highlightSweepColor": "#000000",
            "highlightSweepTextColor": "#FFFFFF"
        },
        {
            "text": "for",
            "startFrame": 184.5,
            "weight": "semibold"
        }
    ]
],
  },
};
