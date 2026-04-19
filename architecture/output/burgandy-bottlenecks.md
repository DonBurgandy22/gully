# Burgandy Bottleneck Analysis

## Single Points of Failure (centrality >= 4, in_degree >= 2)
| ID | Label | Type | In | Out | Centrality | Recommendation |
|---|---|---|---|---|---|---|
| qwen3_5_4b | qwen3_5_4b | unknown | 2 | 8 | 10 | FLAG — add fallback |
| gateway | OpenClaw gateway ws://127.0.0. | process | 2 | 7 | 9 | FLAG — add fallback |
| model_router | Routes tasks to cheapest viabl | process | 3 | 3 | 6 | FLAG — add fallback |
| gemini_2_0_flash | gemini_2_0_flash | unknown | 3 | 1 | 4 | FLAG — add fallback |
| phi3_5 | phi3_5 | unknown | 2 | 2 | 4 | FLAG — add fallback |

## Bottlenecks (in_degree > out_degree by 3+)
| ID | Label | Type | In | Out | Recommendation |
|---|---|---|---|---|---|
| rtx_3060 | 12GB VRAM — runs local models | hardware | 3 | 0 | SUGGEST buffer upstream |

## Dead Ends (out_degree = 0)
| ID | Label | Type | In |
|---|---|---|---|
| finance_skill | Finance tracking | tool | 1 |
| security_skill | 8-step security scan | tool | 1 |
| websiteautomation_skill | Client website pipeline | tool | 1 |
| antigravity_skill | GSAP physics animations | tool | 1 |
| agents_md | Startup rules and behaviour | file | 1 |
| soul_md | Identity and tone | file | 1 |
| memory_md | Long-term durable memory | file | 1 |
| user_md | User profile | file | 1 |
| session_summary_md | Cross-session continuity | file | 2 |
| daily_memory | memory/YYYY-MM-DD.md | file | 1 |
| openclaw_json | Config — models, channels, gat | file | 1 |
| rtx_3060 | 12GB VRAM — runs local models | hardware | 3 |
| deepseek_api | Cloud API — $25/mo max | service | 1 |
| google_cloud | TTS + NotebookLM | service | 1 |
| elevenlabs_api | YouTube voiceover — pending | service | 1 |
| reddit_praw | Story scraping — pending | service | 1 |
| youtube_data_api | Upload automation — pending | service | 1 |
| claude_code | claude_code | unknown | 1 |

## Isolated Nodes (no connections)
| ID | Label | Type |
|---|---|---|
| qwen3.5:4b | Primary local model | model |
| phi3.5 | Fallback local — no tools | model |
| deepseek-coder:6.7b | Coding tasks | model |
| llama3.2:3b | Chat only — not suitable for a | model |
| deepseek-chat | Cloud primary (legacy) | model |
| deepseek-reasoner | Cloud reasoning — Deep think t | model |
| gemini-2.0-flash | Free cloud fallback | model |
| claude-code | Production coding — separate k | model |
| spline_skill | 3D Spline integration | tool |
| himalaya_skill | Email via Outlook COM | tool |
| organisation_skill | File organisation | tool |
| productivity_skill | Morning/evening routines | tool |
| weather_skill | Weather lookup | tool |
| skill_creator_skill | Create/refine skills | tool |
| checkpoint_json | Pipeline step tracking | file |
| ryzen_5600 | AMD Ryzen 5 5600 — 16GB RAM | hardware |
| ollama_qwen3_5_4b | ollama/qwen3.5:4b | model |

## Summary
- Total nodes: 53
- Total edges: 42
- SPOFs: 5
- Bottlenecks: 1
- Dead ends: 18
- Isolated: 17