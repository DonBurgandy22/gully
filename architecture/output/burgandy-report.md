# Burgandy Architecture Report

## Stats
| | V1 | V2 |
|---|---|---|
| Nodes | 53 | 57 |
| Edges | 42 | 48 |
| Generated | 2026-04-16 | 2026-04-16 |

## Node Inventory (top 20 by centrality)
| ID | Type | Label | In | Out | Centrality |
|---|---|---|---|---|---|
| qwen3_5_4b | unknown | qwen3_5_4b | 2 | 8 | 10 |
| gateway | process | OpenClaw gateway ws://127.0.0. | 2 | 7 | 9 |
| model_router | process | Routes tasks to cheapest viabl | 3 | 3 | 6 |
| youtube_skill | tool | YouTube pipeline | 1 | 3 | 4 |
| gemini_2_0_flash | unknown | gemini_2_0_flash | 3 | 1 | 4 |
| phi3_5 | unknown | phi3_5 | 2 | 2 | 4 |
| coding_agent_skill | tool | Code task queue | 2 | 1 | 3 |
| auto_restart_loop | process | 70% context threshold trigger | 1 | 2 | 3 |
| memory_save | process | Save before restart | 1 | 2 | 3 |
| rtx_3060 | hardware | 12GB VRAM — runs local models | 3 | 0 | 3 |
| ollama | service | Local model runtime — port 114 | 0 | 3 | 3 |
| deepseek_coder_6_7b | unknown | deepseek_coder_6_7b | 1 | 2 | 3 |
| whatsapp | channel | Primary — +27602678740 | 1 | 1 | 2 |
| session_summary_md | file | Cross-session continuity | 2 | 0 | 2 |
| context_monitor | process | BurgandyContextMonitor2Min tas | 1 | 1 | 2 |
| openclaw_config | process | OpenClaw Config (bootstrap:400 | 0 | 2 | 2 |
| deepseek_reasoner | unknown | deepseek_reasoner | 1 | 1 | 2 |
| telegram | channel | Secondary — disabled | 0 | 1 | 1 |
| finance_skill | tool | Finance tracking | 1 | 0 | 1 |
| security_skill | tool | 8-step security scan | 1 | 0 | 1 |

## V2 Changes
| Change |
|---|
| FLAGGED SPOF: gateway |
| FLAGGED SPOF: model_router |
| FLAGGED SPOF: qwen3_5_4b |
| FLAGGED SPOF: gemini_2_0_flash |
| FLAGGED SPOF: phi3_5 |
| SUGGESTED buffer: buffer_rtx_3060 |
| ADDED planned node: hermes_agent |
| ADDED planned node: context_monitor_v2 |
| ADDED planned node: qwen25_7b |
| ADDED edge: hermes_agent -> qwen3_5_4b |
| ADDED edge: hermes_agent -> model_router |
| ADDED edge: context_monitor_v2 -> auto_restart_loop |
| ADDED edge: qwen25_7b -> qwen3_5_4b |
| ADDED edge: qwen25_7b -> rtx_3060 |

## Output Files
| File | Purpose |
|---|---|
| burgandy-graph.json | V1 node-edge graph |
| burgandy-map.mmd | Mermaid diagram |
| burgandy-map.dot | Graphviz DOT diagram |
| burgandy-bottlenecks.md | SPOF and bottleneck analysis |
| burgandy-v2-graph.json | Optimized V2 graph |
| burgandy-v2-map.mmd | V2 Mermaid diagram |
| burgandy-3d.json | Three.js force-graph input |
| burgandy-report.md | This report |

## Recommended Next Steps
- Upgrade primary model: ollama pull qwen2.5:7b (better tool calling on RTX 3060)
- Implement Hermes Agent as specialist subagent alongside OpenClaw
- Build Three.js visualisation reading burgandy-3d.json
- Review SPOF nodes and add fallback routing in openclaw.json
- Process CCMA legal docs — April 7 2026 hearing is urgent