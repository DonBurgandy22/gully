# BURGUNDY-MASTER.md
**Version:** 4.2  
**Updated:** 2026-04-17  
**Owner:** Daryl Keenan Mack, Johannesburg, South Africa  
**Purpose:** Single source of truth for ChatGPT/Claude project memory. This version consolidates the latest supplied source files and resolves contradictions where possible.

---

## 1. OWNER PROFILE

- **Full name:** Daryl Keenan Mack
- **Location:** Johannesburg, South Africa
- **Currency:** ZAR
- **Primary contact flow:** Daryl WhatsApp → Burgandy WhatsApp
- **Primary personal email:** dkmack22@outlook.com
- **Secondary Google/email context:** darylmack124@gmail.com
- **Discipline:** Civil / structural engineering
- **Operating style:** direct, exact, systems-first, monetisation-first, low tolerance for inefficiency

### Working preferences
- No fluff, no filler, no repeated restatement
- Practical output over discussion
- Exact paths, commands, model names, and triggers matter
- Save before reporting done
- Prefer cheapest viable path that still works reliably

---

## 2. WHAT BURGANDY IS

Burgandy is Daryl's **self-funding AI operating system**.

It is not one model. It is an orchestrated system of:
- OpenClaw as agent runtime/orchestrator
- local Ollama models on brother's PC
- selective cloud fallbacks for harder tasks
- file-based memory and skills
- WhatsApp as primary operating channel

### Long-term vision
Burgandy becomes the mother AI that coordinates specialist subagents for:
- engineering
- legal
- finance
- content
- coding
- web design
- research

### Economic loop
Income systems → pay for APIs/tools → improve hardware → run more locally → reduce cost → scale output → compound.

---

## 3. CURRENT HQ / HARDWARE / PLATFORM

### Current HQ
- **Main machine:** Brother's PC
- **Username:** `User`
- **Workspace root:** `C:\Burgandy`
- **OpenClaw runtime:** `C:\Users\User\.openclaw\`
- **OpenClaw version:** 2026.4.14

### Hardware
- **Brother's PC:** Ryzen 5 5600, 16 GB RAM, RTX 3060 12 GB, Windows 11
- **Old laptop:** Huawei MateBook D14, i5, 8 GB RAM, Iris Xe — not suitable as main local inference box, may become worker/support node
- **Planned OC build:** 32 GB RAM + RTX 4080

### Channel setup
- **Primary:** WhatsApp Business on Burgandy number
- **Secondary:** Telegram bot exists historically but is currently disabled in config
- **Gateway:** `ws://127.0.0.1:18789`

---

## 4. MODEL STACK — CURRENT CANONICAL ROUTING

### Local models installed on RTX 3060 box
| Model | Role | Tool calling status |
|---|---|---|
| `ollama/qwen3.5:4b` | primary local general-use model | works, but borderline |
| `ollama/deepseek-coder:6.7b` | coding tasks | partial |
| `ollama/phi3.5` | chat fallback only | no reliable tool calling |
| `ollama/llama3.2:3b` | not suitable for agent work | unreliable |

### Cloud / external routing
| Model / service | Use |
|---|---|
| `google/gemini-2.0-flash` | free fallback when local fails |
| `deepseek/deepseek-reasoner` | explicit deep reasoning only |
| Claude Code | production coding tasks from terminal |
| NotebookLM | document-grounded research |

### Routing rule
- **Normal messages:** local qwen3.5:4b first
- **Code-related tasks:** deepseek-coder or Claude Code depending task weight
- **Free fallback:** Gemini Flash
- **Deep reasoning:** DeepSeek Reasoner only when complexity justifies it

### Durable truth
`llama3.2:3b` is not acceptable as the primary agent model for Burgandy.  
Gemma 4 26B A4B is the intended future OC-build model target.

---

## 5. OPENCLAW CONFIG — LATEST RESOLVED VIEW

There is an important contradiction in the source material:
- one section says the config fixes were already applied on 2026-04-16
- later sections still mark those same fixes as pending

### Canonical interpretation
Treat these values as the **target correct configuration** and verify them on the live machine before assuming they are active.

### Required target values in `openclaw.json`
```json
workspace: "C:\\Burgandy"
primary model: "ollama/qwen3.5:4b"
bootstrapMaxChars: 40000
qwen3.5:4b maxTokens: 4096
qwen3.5:4b contextWindow: 40000
phi3.5 maxTokens: 2048
api: "ollama"
baseUrl: "http://127.0.0.1:11434"
compaction: "safeguard"
Telegram: disabled
```

### Why these matter
- `maxTokens 512` caused repeated round trips and visible slowness
- `bootstrapMaxChars 12000` truncated startup context
- `/v1` style base URLs broke native Ollama tool calling

### Tool-calling rules
- Use native Ollama API mode
- Do **not** use `/v1` or OpenAI-completions mode for local tool-calling setup
- Sub-14B local models may narrate instead of acting; this is a model limitation, not always a script bug

### Recommended local upgrade
- `qwen2.5:7b` or another stronger local tool-calling-capable model when practical

---

## 6. FILE / PATH CANON

### Live runtime locations
| Item | Path |
|---|---|
| OpenClaw config | `C:\Users\User\.openclaw\openclaw.json` |
| Workspace root | `C:\Burgandy\` |
| AGENTS | `C:\Burgandy\AGENTS.md` |
| USER | `C:\Burgandy\USER.md` |
| MEMORY | `C:\Burgandy\MEMORY.md` |
| SOUL | `C:\Burgandy\SOUL.md` |
| IDENTITY | `C:\Burgandy\IDENTITY.md` |
| TOOLS | `C:\Burgandy\TOOLS.md` |
| HEARTBEAT | `C:\Burgandy\HEARTBEAT.md` |
| session summary | `C:\Burgandy\session-summary.md` |
| daily memory | `C:\Burgandy\memory\YYYY-MM-DD.md` |
| gateway launcher | `C:\Users\User\.openclaw\gateway.cmd` |
| scripts/dev area | `C:\Dev\` |
| Cognitive framework | `C:\Burgandy\burgandy-cognitive-framework\` |
| Cognitive graph data | `C:\Burgandy\burgandy-cognitive-framework\data\` |
| Cognitive outputs | `C:\Burgandy\burgandy-cognitive-framework\outputs\` |

### Path migration truth
Old `dkmac` paths from the laptop era are stale for the brother-PC setup and should be treated as legacy unless explicitly needed for historical recovery.

---

## 7. WORKSPACE MEMORY FILES

### Startup sequence
Lean startup order currently centers on:
1. `IDENTITY.md`
2. `SOUL.md`
3. `USER.md`
4. `MEMORY.md`
5. `session-summary.md`
6. master file
7. recent daily memory

### Durable file purposes
- **IDENTITY.md:** who Burgandy is
- **SOUL.md:** tone, principles, temperament
- **USER.md:** who Daryl is and how he works
- **MEMORY.md:** durable truths only
- **HEARTBEAT.md:** daily operating check-in routine
- **session-summary.md:** current continuity / active thread
- **daily memory files:** dated task and continuity logs

### Memory rule
Keep bootstrap lean, but not so lean that core identity or path truth gets cut off.

---

## 8. ACTIVE SKILLS

Current active skill stack includes:
- youtube
- finance
- organisation
- productivity
- himalaya / email-related legacy skill
- weather
- coding-agent
- skill-creator
- antigravity
- spline
- websiteautomation
- security

### Email truth
Operational direction now favors Outlook desktop COM access rather than Himalaya/IMAP for Outlook handling.

---

## 9. BEHAVIOUR RULES — CANONICAL

### Response rules
- work first, report after
- keep replies short unless detail is necessary
- no filler, no empty greetings
- confirm completion or failure explicitly
- never go silent during long tasks

### Anti-stall rules
- periodic progress heartbeat during long-running work
- save before restarts
- save before claiming done
- always state current model when relevant in WhatsApp runtime

### Core principles
1. cheapest viable reliable path first
2. local-first when practical
3. never expose credentials in workspace docs
4. always save to disk before final completion signal
5. confirm model switches

---

## 10. AUTO-RESTART / CONTINUITY

### Threshold logic
- 50% context: save quietly
- 70% context: restart loop
- 80% context: emergency restart

### Restart truth
Confirmed working method is:
- save continuity files
- kill gateway node process if needed
- relaunch via `gateway.cmd`

### Important durable rule
Do **not** rely on `openclaw gateway stop/start` from hidden processes if PATH is unreliable in that context.

---

## 11. STORAGE / VERSION CONTROL CANON

This has been a repeated pain point. Canonical storage model is:

### 1. Local runtime
- `C:\Burgandy` is the **single active local workspace** for Burgandy runtime files

### 2. OneDrive
- document/file storage only
- use for assets, legal docs, PDFs, project files, outputs
- do **not** treat it as the active duplicated code/workspace root

### 3. GitHub
- version control for Burgandy code/config/docs
- commit changes after real updates
- canonical repo purpose is **Burgandy version control**, not an unrelated project name

### Durable cleanup rule
Avoid duplicate working copies of Burgandy across:
- OneDrive workspace clones
- stray `C:\Dev` copies
- stale laptop-era workspace structures

Use one live workspace, one cloud file-storage area, one version-control repo.

---

## 12. COST / BUDGET TRUTH

### Cost posture
- local first whenever viable
- DeepSeek Reasoner only when actually needed
- Claude Code for heavy production coding, selectively
- Gemini Flash stays as free fallback

### Durable budget principle
Budget efficiency outranks elegance.

---

## 13. YOUTUBE PIPELINE

### Current state
- Channel direction: Reddit's Best / faceless animated content
- Pipeline concept: PRAW → script → voice → video → thumbnail → upload
- Two approved stories and one ready script were reported in the source set

### Still pending / needs verification
- Reddit API setup
- ElevenLabs API setup
- YouTube Data API OAuth

### Ground truth
The YouTube automation pipeline has been a strategic priority, but end-to-end auto-upload has historically remained incomplete until API/OAuth setup is finished.

---

## 14. WEBSITE / AGENCY TRACK

### Build stack
- Antigravity / GSAP
- Spline / 3D
- Lenis scrolling

### Commercial track
Web design is a real second-income lane, not a side note.

---

## 15. STRUCTAI

StructAI remains a planned Python structural engineering tool:
- input: drawings / PDFs / images
- output: SANS-aligned design outputs, reports, and BOQs in ZAR
- offline-first objective

---

## 16. HERMES AGENT / SUBAGENTS

Hermes Agent is now part of the forward architecture thinking:
- OpenClaw remains orchestrator
- Hermes becomes a self-improving specialist brain for repetitive domain workflows

Planned specialist subagents remain:
- engineering
- legal
- research/strategy
- coding
- website design

---

## 17. BURGANDY COGNITIVE FRAMEWORK

Built 2026-04-17 using Claude Code from the spec file `architecture/input/BURGUNDY-COGNITIVE-FRAMEWORK-SPEC.md`.

### What it is
A working Python prototype of Burgandy's internal cognitive architecture — modelled as a **directed, weighted, recursive graph**. Not a skill list. Not a routing table. A real first cognitive scaffold.

### Location
`C:\Burgandy\burgandy-cognitive-framework\`

### What was built
- **40 nodes** across 6 cognitive layers (foundational → reasoning → formal → executive → meta → domain)
- **63 edges** with typed relationships (dependency, amplification, translation, feedback, co_activation)
- **12 detected cycles** including the 3 canonical named loops
- **3 demo simulations** with activation propagation engine
- Activation report, interactive HTML graph, and static PNG

### The three canonical loops
| Loop | Path | Purpose |
|---|---|---|
| Loop A | language_comprehension → logic → mathematics → symbolic_reasoning → language_comprehension | Language / logic / math reinforcement |
| Loop B | self_monitoring → error_detection → error_correction → self_optimization → self_monitoring | Internal quality control cycle |
| Loop C | abstraction → first_principles_reasoning → systems_thinking → synthesis → abstraction | Strategic cognition improvement |

### Top influence nodes (by composite score)
1. `language_comprehension` — 5.01
2. `logic` — 3.39
3. `working_memory` — 3.17
4. `mathematics` — 2.90
5. `abstraction` — 2.48

### Multi-path convergence confirmed
`mathematics` is reachable from **19 distinct source nodes** — proving the multi-path convergence design is working.

### Outputs (generated on run)
| File | Purpose |
|---|---|
| `outputs/burgandy_network.html` | Interactive node graph — open in browser |
| `outputs/burgandy_network.png` | Static PNG overview |
| `outputs/sample_activation_report.md` | Activation levels for all 3 demos |

### How to run
```bash
cd C:\Burgandy\burgandy-cognitive-framework
python run_demo.py
```

### How to open the network map
Open File Explorer → navigate to `C:\Burgandy\burgandy-cognitive-framework\outputs\` → double-click `burgandy_network.html`. Opens in any browser. Hover nodes for weight and activation data.

### Domain cluster stubs (ready for expansion)
engineering, legal, finance, content, coding, web_design, research, operations — all stubbed at Layer 6, ready to attach specialist nodes.

### Extension rule
Add new nodes to `data/starter_nodes.json`. Add edges to `data/starter_edges.json`. Rerun `python run_demo.py`. No other files need to change for basic expansion.

### Dependencies
`networkx`, `pyvis`, `matplotlib`, `pydantic`, `scipy` — all installed on the brother-PC Python environment.

---

## 18. LEGAL / CASEWORK

### Durable legal truth
Legal workflows are high-priority and document-heavy. They must be processed one item at a time with save-and-confirm discipline.

### Immediate legal triggers already defined historically
- `Extract both` for CCMA + ECSA extraction workflows

---

## 19. KNOWN ISSUES / OPEN ITEMS

### Highest-priority technical items
1. verify and apply the OpenClaw config target values on the live brother-PC machine
2. update any remaining script paths from `dkmac` to `User`
3. strengthen local tool-calling model quality if qwen3.5:4b remains borderline

### Strategic items
4. finish YouTube API / voice / Reddit setup
5. standardize GitHub repo and remove naming drift like `gully` if that is not the intended canonical repo identity
6. keep runtime files credential-free and keep secrets outside workspace docs

---

## 20. CREDENTIALS POLICY

Do not store plaintext credentials, API keys, passwords, or sensitive tokens inside:
- workspace markdown files
- project master files
- Git-tracked docs

If credentials exist elsewhere in older chats/files, treat them as sensitive legacy material and redact them from future master-file versions.

---

## 21. UPDATE PROCEDURE

1. Accumulate session truth from Burgandy + current source files
2. Update this master file
3. Keep the Claude/ChatGPT project centered on the latest master file
4. Keep Burgandy's live local files separate and operational in `C:\Burgandy`
5. Push version-controlled, non-secret updates to GitHub

---

## 22. CHANGELOG

### v4.2 — 2026-04-17
- added Section 17: Burgandy Cognitive Framework (built 2026-04-17 via Claude Code)
- added cognitive framework paths to Section 6 file/path canon
- renumbered sections 17–21 to accommodate the new section
- updated version and date

### v4.1 — 2026-04-16
- resolved the config contradiction by treating the 2026-04-16 values as **target canonical config pending live verification**
- hardened the storage model into one live workspace + OneDrive documents + GitHub version control
- made repo purpose explicitly Burgandy-centric, not `gully`-centric
- consolidated memory, routing, and path truths into one cleaner file
- added explicit credentials-redaction policy
- removed plaintext sensitive values from the master file
- clarified that old `dkmac` paths are legacy in the current brother-PC setup

---

**Compiled from:** latest supplied BURGUNDY v4.0 master, prior handoff files, and archived WhatsApp project logs. The brother-PC migration, workspace root `C:\Burgandy`, OpenClaw 2026.4.14, local Ollama stack, config bug history, WhatsApp-first workflow, and GitHub/OneDrive consolidation rules are all preserved from the source material. fileciteturn8file0 fileciteturn9file13 fileciteturn9file12
