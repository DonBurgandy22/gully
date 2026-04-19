# BURGANDY ARCHITECTURE PIPELINE — FINAL CLAUDE CODE PROMPT
# Paste this entire prompt into Claude Code after running:
# cd C:\Burgandy\architecture
# claude --dangerously-skip-permissions

---

You are a systems architect assistant executing a structured pipeline.
Rules that override everything else:
- Save every output to disk before proceeding to the next step
- Read checkpoint.json at start — skip any step where last_completed >= step number
- Never proceed if an input file is missing or an output file is empty
- Never print more than 3 lines per step — no explanations, just checkpoint lines
- Never load more than 2 files into context at once
- If any file exceeds 300KB, read only the first 300KB and log: TRUNCATED: [filename] at 300KB

WORKING DIRECTORY: C:\Burgandy\architecture\

---

## PRE-FLIGHT

Create these folders if missing:
- C:\Burgandy\architecture\input\
- C:\Burgandy\architecture\scripts\
- C:\Burgandy\architecture\output\

Create checkpoint.json if missing: {"last_completed": 0, "steps": {}}

Verify these input files exist:
- input\burgandy-master.md
- input\openclaw.json
- input\agents.md

If any are missing — print the exact missing path and STOP. Do not create any scripts.

---

## STEP 1 — Write and run 01_ingest.py

Write scripts\01_ingest.py with this exact logic:

```python
import json, os, re
from datetime import datetime

INPUTS = [
    "input/burgandy-master.md",
    "input/openclaw.json",
    "input/agents.md"
]
OUTPUT = "output/burgandy-graph.json"
CHECKPOINT = "checkpoint.json"
MAX_BYTES = 300_000

nodes = {}
edges = []

def read_file(path):
    with open(path, "rb") as f:
        raw = f.read(MAX_BYTES)
    try:
        text = raw.decode("utf-8")
    except:
        text = raw.decode("utf-8", errors="replace")
    if os.path.getsize(path) > MAX_BYTES:
        print(f"TRUNCATED: {path} at 300KB")
    return text

# PRIORITY 1: Parse NODE_ID structured blocks from master file
def parse_node_blocks(text):
    # Match blocks: NODE_ID: id\nTYPE: type\nDESCRIPTION: desc\nPROPERTIES: props
    pattern = re.compile(
        r"NODE_ID:\s*(.+?)\n.*?TYPE:\s*(.+?)\n.*?DESCRIPTION:\s*(.+?)\n.*?PROPERTIES:\s*(.+?)(?=\nNODE_ID:|\Z)",
        re.DOTALL | re.IGNORECASE
    )
    found = []
    for m in pattern.finditer(text):
        nid = m.group(1).strip().replace(" ", "_").lower()
        found.append({
            "id": nid,
            "type": m.group(2).strip().lower(),
            "label": m.group(3).strip()[:80],
            "notes": m.group(4).strip()[:120],
            "source": "node_block"
        })
    return found

# PRIORITY 2: Known entity extraction from master file
KNOWN_MODELS = [
    ("qwen3.5:4b", "model", "Primary local model"),
    ("phi3.5", "model", "Fallback local — no tools"),
    ("deepseek-coder:6.7b", "model", "Coding tasks"),
    ("llama3.2:3b", "model", "Chat only — not suitable for agent"),
    ("deepseek-chat", "model", "Cloud primary (legacy)"),
    ("deepseek-reasoner", "model", "Cloud reasoning — Deep think trigger"),
    ("gemini-2.0-flash", "model", "Free cloud fallback"),
    ("claude-code", "model", "Production coding — separate key"),
]
KNOWN_CHANNELS = [
    ("whatsapp", "channel", "Primary — +27602678740"),
    ("telegram", "channel", "Secondary — disabled"),
]
KNOWN_TOOLS = [
    ("youtube_skill", "tool", "YouTube pipeline"),
    ("finance_skill", "tool", "Finance tracking"),
    ("security_skill", "tool", "8-step security scan"),
    ("coding_agent_skill", "tool", "Code task queue"),
    ("websiteautomation_skill", "tool", "Client website pipeline"),
    ("antigravity_skill", "tool", "GSAP physics animations"),
    ("spline_skill", "tool", "3D Spline integration"),
    ("himalaya_skill", "tool", "Email via Outlook COM"),
    ("organisation_skill", "tool", "File organisation"),
    ("productivity_skill", "tool", "Morning/evening routines"),
    ("weather_skill", "tool", "Weather lookup"),
    ("skill_creator_skill", "tool", "Create/refine skills"),
]
KNOWN_FILES = [
    ("agents_md", "file", "Startup rules and behaviour"),
    ("soul_md", "file", "Identity and tone"),
    ("memory_md", "file", "Long-term durable memory"),
    ("user_md", "file", "User profile"),
    ("session_summary_md", "file", "Cross-session continuity"),
    ("daily_memory", "file", "memory/YYYY-MM-DD.md"),
    ("openclaw_json", "file", "Config — models, channels, gateway"),
    ("checkpoint_json", "file", "Pipeline step tracking"),
]
KNOWN_PROCESSES = [
    ("gateway", "process", "OpenClaw gateway ws://127.0.0.1:18789"),
    ("auto_restart_loop", "process", "70% context threshold trigger"),
    ("context_monitor", "process", "BurgandyContextMonitor2Min task"),
    ("memory_save", "process", "Save before restart"),
    ("model_router", "process", "Routes tasks to cheapest viable model"),
    ("compaction", "process", "safeguard mode — context management"),
]
KNOWN_HARDWARE = [
    ("rtx_3060", "hardware", "12GB VRAM — runs local models"),
    ("ryzen_5600", "hardware", "AMD Ryzen 5 5600 — 16GB RAM"),
]
KNOWN_SERVICES = [
    ("deepseek_api", "service", "Cloud API — $25/mo max"),
    ("google_cloud", "service", "TTS + NotebookLM"),
    ("elevenlabs_api", "service", "YouTube voiceover — pending"),
    ("reddit_praw", "service", "Story scraping — pending"),
    ("youtube_data_api", "service", "Upload automation — pending"),
    ("ollama", "service", "Local model runtime — port 11434"),
]

all_known = KNOWN_MODELS + KNOWN_CHANNELS + KNOWN_TOOLS + KNOWN_FILES + KNOWN_PROCESSES + KNOWN_HARDWARE + KNOWN_SERVICES

for nid, ntype, label in all_known:
    if nid not in nodes:
        nodes[nid] = {"id": nid, "type": ntype, "label": label, "notes": "", "source": "known"}

# PRIORITY 3: Parse openclaw.json for config-derived nodes
try:
    cfg_text = read_file("input/openclaw.json")
    cfg = json.loads(cfg_text)
    primary = cfg.get("agents", {}).get("defaults", {}).get("model", {}).get("primary", "")
    if primary:
        pid = primary.replace("/", "_").replace(":", "_").replace(".", "_")
        if pid not in nodes:
            nodes[pid] = {"id": pid, "type": "model", "label": primary, "notes": "from openclaw.json", "source": "config"}
    bootstrap = cfg.get("agents", {}).get("defaults", {}).get("bootstrapMaxChars", 0)
    nodes["openclaw_config"] = {"id": "openclaw_config", "type": "process", "label": f"OpenClaw Config (bootstrap:{bootstrap})", "notes": "version 2026.4.14", "source": "config"}
except Exception as e:
    print(f"WARN: openclaw.json parse error: {e}")

# KNOWN EDGES — derived from verified system relationships
known_edges = [
    # Channel → model routing
    ("whatsapp", "model_router", "routes_to", "WhatsApp input"),
    ("telegram", "model_router", "routes_to", "Telegram input (disabled)"),
    ("model_router", "qwen3_5_4b", "routes_to", "primary local"),
    ("model_router", "deepseek_reasoner", "routes_to", "deep think trigger"),
    ("model_router", "gemini_2_0_flash", "routes_to", "cloud fallback"),
    # Fallback chain
    ("qwen3_5_4b", "phi3_5", "falls_back_to", "no tools"),
    ("phi3_5", "gemini_2_0_flash", "falls_back_to", "cloud"),
    ("deepseek_chat", "gemini_2_0_flash", "falls_back_to", "budget limit"),
    # Models run on hardware
    ("qwen3_5_4b", "rtx_3060", "runs_on", "GPU inference"),
    ("phi3_5", "rtx_3060", "runs_on", "GPU inference"),
    ("deepseek_coder_6_7b", "rtx_3060", "runs_on", "GPU inference"),
    # Ollama serves models
    ("ollama", "qwen3_5_4b", "calls", "serves"),
    ("ollama", "phi3_5", "calls", "serves"),
    ("ollama", "deepseek_coder_6_7b", "calls", "serves"),
    # Gateway
    ("gateway", "model_router", "triggers", "message dispatch"),
    ("gateway", "whatsapp", "reads", "channel input"),
    # Startup file reads
    ("gateway", "agents_md", "reads", "bootstrap"),
    ("gateway", "soul_md", "reads", "bootstrap"),
    ("gateway", "user_md", "reads", "bootstrap"),
    ("gateway", "memory_md", "reads", "bootstrap"),
    ("gateway", "session_summary_md", "reads", "on reconnect"),
    # Process chains
    ("context_monitor", "auto_restart_loop", "triggers", "70% threshold"),
    ("auto_restart_loop", "memory_save", "triggers", "save before restart"),
    ("memory_save", "session_summary_md", "writes", "state preservation"),
    ("memory_save", "daily_memory", "writes", "daily log"),
    ("auto_restart_loop", "gateway", "triggers", "restart via gateway.cmd"),
    ("compaction", "context_monitor", "reads", "session size proxy"),
    # Skills called by models
    ("qwen3_5_4b", "youtube_skill", "calls", ""),
    ("qwen3_5_4b", "finance_skill", "calls", ""),
    ("qwen3_5_4b", "security_skill", "calls", ""),
    ("qwen3_5_4b", "coding_agent_skill", "calls", ""),
    ("qwen3_5_4b", "websiteautomation_skill", "calls", ""),
    ("qwen3_5_4b", "antigravity_skill", "calls", ""),
    ("deepseek_coder_6_7b", "coding_agent_skill", "calls", ""),
    # External services
    ("youtube_skill", "youtube_data_api", "calls", "upload"),
    ("youtube_skill", "elevenlabs_api", "calls", "voiceover"),
    ("youtube_skill", "reddit_praw", "calls", "scrape"),
    ("coding_agent_skill", "claude_code", "calls", "heavy coding"),
    ("deepseek_reasoner", "deepseek_api", "calls", "cloud inference"),
    ("gemini_2_0_flash", "google_cloud", "calls", "cloud inference"),
    # Config
    ("openclaw_config", "gateway", "reads", "runtime config"),
    ("openclaw_config", "openclaw_json", "reads", "disk config"),
]

for src, tgt, etype, label in known_edges:
    # Normalize IDs
    src_n = src.replace(":", "_").replace(".", "_").replace("/", "_").replace("-", "_")
    tgt_n = tgt.replace(":", "_").replace(".", "_").replace("/", "_").replace("-", "_")
    edges.append({"from": src_n, "to": tgt_n, "type": etype, "label": label})
    # Auto-add missing nodes as stubs
    for nid in [src_n, tgt_n]:
        if nid not in nodes:
            nodes[nid] = {"id": nid, "type": "unknown", "label": nid, "notes": "auto-stub", "source": "edge_inference"}

graph = {
    "nodes": list(nodes.values()),
    "edges": edges,
    "meta": {
        "source_files": INPUTS,
        "generated_at": datetime.utcnow().isoformat(),
        "node_count": len(nodes),
        "edge_count": len(edges)
    }
}

os.makedirs("output", exist_ok=True)
with open(OUTPUT, "w") as f:
    json.dump(graph, f, indent=2)

# Update checkpoint
with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 1
cp["steps"]["1"] = {"output": OUTPUT, "nodes": len(nodes), "edges": len(edges)}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 1 COMPLETE — {len(nodes)} nodes, {len(edges)} edges → {OUTPUT}")
```

Run it: python scripts\01_ingest.py
Verify: output\burgandy-graph.json exists and is non-empty. If not — STOP.

---

## STEP 2 — Write and run 02_mermaid.py

Write scripts\02_mermaid.py:

```python
import json, os

INPUT = "output/burgandy-graph.json"
OUTPUT = "output/burgandy-map.mmd"
CHECKPOINT = "checkpoint.json"

with open(INPUT) as f:
    graph = json.load(f)

SHAPES = {
    "model": ("[[", "]]"),
    "channel": ("([", "])"),
    "tool": ("{{", "}}"),
    "file": ("[(", ")]"),
    "process": ("[/", "/]"),
    "hardware": ("[\\", "\\]"),
    "service": (">", "]"),
    "unknown": ("[", "]"),
}

GROUPS = {
    "model": "MODELS", "channel": "CHANNELS", "tool": "SKILLS",
    "file": "FILES", "process": "PROCESSES",
    "hardware": "HARDWARE", "service": "SERVICES", "unknown": "OTHER"
}

by_group = {}
for n in graph["nodes"]:
    g = GROUPS.get(n["type"], "OTHER")
    by_group.setdefault(g, []).append(n)

lines = ["graph TD"]
for group, members in by_group.items():
    lines.append(f"  subgraph {group}")
    for n in members:
        s, e = SHAPES.get(n["type"], ("[", "]"))
        safe_id = n["id"].replace("-", "_")
        safe_label = n["label"].replace('"', "'")[:40]
        lines.append(f'    {safe_id}{s}"{safe_label}"{e}')
    lines.append("  end")

for edge in graph["edges"]:
    src = edge["from"].replace("-", "_")
    tgt = edge["to"].replace("-", "_")
    lbl = edge.get("label", edge["type"])[:20]
    arrow = "-->" if edge["type"] in ("calls", "routes_to", "triggers") else "-.->"
    lines.append(f"  {src} {arrow}|{lbl}| {tgt}")

with open(OUTPUT, "w") as f:
    f.write("\n".join(lines))

with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 2
cp["steps"]["2"] = {"output": OUTPUT, "lines": len(lines)}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 2 COMPLETE — {len(lines)} lines → {OUTPUT}")
```

Run it: python scripts\02_mermaid.py
Verify: output\burgandy-map.mmd exists, more than 10 lines. If not — STOP.

---

## STEP 3 — Write and run 03_graphviz.py

Write scripts\03_graphviz.py:

```python
import json, os

INPUT = "output/burgandy-graph.json"
OUTPUT = "output/burgandy-map.dot"
CHECKPOINT = "checkpoint.json"

with open(INPUT) as f:
    graph = json.load(f)

COLORS = {
    "model": "lightblue", "channel": "lightyellow", "tool": "lightgreen",
    "file": "lightsalmon", "process": "plum", "hardware": "lightgray",
    "service": "peachpuff", "unknown": "white"
}
EDGE_STYLES = {
    "calls": "solid", "reads": "dashed", "writes": "bold",
    "triggers": "dotted", "routes_to": "solid", "falls_back_to": "dashed",
    "runs_on": "dotted"
}

lines = ['digraph burgandy {', '  rankdir=LR;', '  node [fontsize=10];']

by_type = {}
for n in graph["nodes"]:
    by_type.setdefault(n["type"], []).append(n)

for ntype, members in by_type.items():
    color = COLORS.get(ntype, "white")
    lines.append(f'  subgraph cluster_{ntype} {{')
    lines.append(f'    label="{ntype.upper()}";')
    lines.append(f'    style=filled; color="{color}";')
    for n in members:
        safe = n["id"].replace("-", "_")
        lbl = n["label"].replace('"', "'")[:35]
        lines.append(f'    {safe} [label="{lbl}" fillcolor="{color}" style=filled];')
    lines.append("  }")

for e in graph["edges"]:
    src = e["from"].replace("-", "_")
    tgt = e["to"].replace("-", "_")
    style = EDGE_STYLES.get(e["type"], "solid")
    lbl = e.get("label", e["type"])[:15].replace('"', "'")
    lines.append(f'  {src} -> {tgt} [label="{lbl}" style={style}];')

lines.append("}")

with open(OUTPUT, "w") as f:
    f.write("\n".join(lines))

with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 3
cp["steps"]["3"] = {"output": OUTPUT}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 3 COMPLETE — DOT graph → {OUTPUT}")
```

Run it: python scripts\03_graphviz.py
Verify: output\burgandy-map.dot starts with "digraph". If not — STOP.

---

## STEP 4 — Write and run 04_bottlenecks.py

Write scripts\04_bottlenecks.py:

```python
import json, os

INPUT = "output/burgandy-graph.json"
OUTPUT = "output/burgandy-bottlenecks.md"
CHECKPOINT = "checkpoint.json"

with open(INPUT) as f:
    graph = json.load(f)

in_deg = {}
out_deg = {}
for n in graph["nodes"]:
    in_deg[n["id"]] = 0
    out_deg[n["id"]] = 0

for e in graph["edges"]:
    out_deg[e["from"]] = out_deg.get(e["from"], 0) + 1
    in_deg[e["to"]] = in_deg.get(e["to"], 0) + 1

centrality = {nid: in_deg.get(nid, 0) + out_deg.get(nid, 0) for nid in in_deg}

spof = []
bottlenecks = []
dead_ends = []
isolated = []

node_map = {n["id"]: n for n in graph["nodes"]}

for nid, cent in centrality.items():
    ind = in_deg.get(nid, 0)
    outd = out_deg.get(nid, 0)
    ntype = node_map.get(nid, {}).get("type", "unknown")
    label = node_map.get(nid, {}).get("label", nid)
    if cent >= 4 and ind >= 2:
        spof.append((nid, label, ntype, ind, outd, cent))
    if ind - outd >= 3:
        bottlenecks.append((nid, label, ntype, ind, outd, cent))
    if outd == 0 and ind > 0:
        dead_ends.append((nid, label, ntype, ind, outd))
    if cent == 0:
        isolated.append((nid, label, ntype))

lines = ["# Burgandy Bottleneck Analysis", ""]

lines += ["## Single Points of Failure (centrality >= 4, in_degree >= 2)",
          "| ID | Label | Type | In | Out | Centrality | Recommendation |",
          "|---|---|---|---|---|---|---|"]
for nid, lbl, ntype, ind, outd, cent in sorted(spof, key=lambda x: -x[5]):
    lines.append(f"| {nid} | {lbl[:30]} | {ntype} | {ind} | {outd} | {cent} | FLAG — add fallback |")

lines += ["", "## Bottlenecks (in_degree > out_degree by 3+)",
          "| ID | Label | Type | In | Out | Recommendation |",
          "|---|---|---|---|---|---|"]
for nid, lbl, ntype, ind, outd, cent in sorted(bottlenecks, key=lambda x: -(x[3]-x[4])):
    lines.append(f"| {nid} | {lbl[:30]} | {ntype} | {ind} | {outd} | SUGGEST buffer upstream |")

lines += ["", "## Dead Ends (out_degree = 0)",
          "| ID | Label | Type | In |",
          "|---|---|---|---|"]
for nid, lbl, ntype, ind, outd in dead_ends:
    lines.append(f"| {nid} | {lbl[:30]} | {ntype} | {ind} |")

lines += ["", "## Isolated Nodes (no connections)",
          "| ID | Label | Type |",
          "|---|---|---|"]
for nid, lbl, ntype in isolated:
    lines.append(f"| {nid} | {lbl[:30]} | {ntype} |")

lines += ["", f"## Summary",
          f"- Total nodes: {len(graph['nodes'])}",
          f"- Total edges: {len(graph['edges'])}",
          f"- SPOFs: {len(spof)}",
          f"- Bottlenecks: {len(bottlenecks)}",
          f"- Dead ends: {len(dead_ends)}",
          f"- Isolated: {len(isolated)}"]

with open(OUTPUT, "w") as f:
    f.write("\n".join(lines))

with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 4
cp["steps"]["4"] = {"output": OUTPUT, "spof": len(spof), "bottlenecks": len(bottlenecks)}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 4 COMPLETE — {len(spof)} SPOFs, {len(bottlenecks)} bottlenecks → {OUTPUT}")
```

Run it: python scripts\04_bottlenecks.py
Verify: output\burgandy-bottlenecks.md exists. If not — STOP.

PAUSE HERE. Read output\burgandy-bottlenecks.md and output\burgandy-graph.json before proceeding to Step 5.
Print: CHECKPOINT 4 REACHED — inspect outputs before continuing

---

## STEP 5 — Write and run 05_optimized_v2.py

Write scripts\05_optimized_v2.py:

```python
import json, os, copy
from datetime import datetime

INPUT_GRAPH = "output/burgandy-graph.json"
INPUT_BN = "output/burgandy-bottlenecks.md"
OUTPUT_JSON = "output/burgandy-v2-graph.json"
OUTPUT_MMD = "output/burgandy-v2-map.mmd"
CHECKPOINT = "checkpoint.json"

with open(INPUT_GRAPH) as f:
    graph = json.load(f)

with open(INPUT_BN) as f:
    bn_text = f.read()

v2 = copy.deepcopy(graph)
changes = []

# RULE 1 — Flag SPOFs only (no auto-fix)
spof_ids = []
for line in bn_text.split("\n"):
    if "FLAG — add fallback" in line:
        parts = line.split("|")
        if len(parts) > 1:
            spof_ids.append(parts[1].strip())

for n in v2["nodes"]:
    if n["id"] in spof_ids:
        n["notes"] = (n.get("notes","") + " [SPOF — review fallback]").strip()
        changes.append(f"FLAGGED SPOF: {n['id']}")

# RULE 2 — Suggest buffer nodes for confirmed bottlenecks (add as planned nodes only)
bn_ids = []
for line in bn_text.split("\n"):
    if "SUGGEST buffer upstream" in line:
        parts = line.split("|")
        if len(parts) > 1:
            bn_ids.append(parts[1].strip())

for bn_id in bn_ids[:2]:  # max 2 buffer suggestions
    buf_id = f"buffer_{bn_id}"
    exists = any(n["id"] == buf_id for n in v2["nodes"])
    if not exists:
        v2["nodes"].append({
            "id": buf_id,
            "type": "process",
            "label": f"[PLANNED] Buffer upstream of {bn_id}",
            "notes": "Suggested — not enforced",
            "source": "v2_suggestion"
        })
        v2["edges"].append({"from": buf_id, "to": bn_id, "type": "triggers", "label": "buffer"})
        changes.append(f"SUGGESTED buffer: {buf_id}")

# RULE 3 — Add confirmed planned nodes
planned_nodes = [
    {
        "id": "hermes_agent",
        "type": "process",
        "label": "Hermes Agent [PLANNED]",
        "notes": "Self-improving specialist subagent — Nous Research",
        "source": "v2_planned"
    },
    {
        "id": "context_monitor_v2",
        "type": "process",
        "label": "Context Monitor 2min [ACTIVE]",
        "notes": "BurgandyContextMonitor2Min — Task Scheduler",
        "source": "v2_confirmed"
    },
    {
        "id": "qwen25_7b",
        "type": "model",
        "label": "qwen2.5:7b [PLANNED UPGRADE]",
        "notes": "Better tool calling than 4b — RTX 3060 compatible",
        "source": "v2_planned"
    },
]

for pn in planned_nodes:
    if not any(n["id"] == pn["id"] for n in v2["nodes"]):
        v2["nodes"].append(pn)
        changes.append(f"ADDED planned node: {pn['id']}")

# RULE 4 — Add edges only if both endpoints exist in v2
def node_exists(nid):
    return any(n["id"] == nid for n in v2["nodes"])

planned_edges = [
    ("hermes_agent", "qwen3_5_4b", "routes_to", "specialist tasks"),
    ("hermes_agent", "model_router", "calls", "task dispatch"),
    ("context_monitor_v2", "auto_restart_loop", "triggers", "70% threshold"),
    ("qwen25_7b", "qwen3_5_4b", "falls_back_to", "upgrade path"),
    ("qwen25_7b", "rtx_3060", "runs_on", "GPU inference"),
]

for src, tgt, etype, lbl in planned_edges:
    if node_exists(src) and node_exists(tgt):
        v2["edges"].append({"from": src, "to": tgt, "type": etype, "label": lbl})
        changes.append(f"ADDED edge: {src} → {tgt}")

v2["meta"]["version"] = "v2"
v2["meta"]["generated_at"] = datetime.utcnow().isoformat()
v2["meta"]["node_count"] = len(v2["nodes"])
v2["meta"]["edge_count"] = len(v2["edges"])
v2["meta"]["changes"] = changes

with open(OUTPUT_JSON, "w") as f:
    json.dump(v2, f, indent=2)

# Generate Mermaid for v2
SHAPES = {
    "model": ("[[", "]]"), "channel": ("([", "])"), "tool": ("{{", "}}"),
    "file": ("[(", ")]"), "process": ("[/", "/]"), "hardware": ("[\\", "\\]"),
    "service": (">", "]"), "unknown": ("[", "]"),
}
GROUPS = {
    "model": "MODELS", "channel": "CHANNELS", "tool": "SKILLS",
    "file": "FILES", "process": "PROCESSES",
    "hardware": "HARDWARE", "service": "SERVICES", "unknown": "OTHER"
}
by_group = {}
for n in v2["nodes"]:
    g = GROUPS.get(n["type"], "OTHER")
    by_group.setdefault(g, []).append(n)

mmd = ["graph TD"]
for group, members in by_group.items():
    mmd.append(f"  subgraph {group}")
    for n in members:
        s, e = SHAPES.get(n["type"], ("[", "]"))
        safe_id = n["id"].replace("-", "_")
        safe_label = n["label"].replace('"', "'")[:40]
        mmd.append(f'    {safe_id}{s}"{safe_label}"{e}')
    mmd.append("  end")

for edge in v2["edges"]:
    src = edge["from"].replace("-", "_")
    tgt = edge["to"].replace("-", "_")
    lbl = edge.get("label", edge["type"])[:20]
    arrow = "-->" if edge["type"] in ("calls", "routes_to", "triggers") else "-.->"
    mmd.append(f"  {src} {arrow}|{lbl}| {tgt}")

with open(OUTPUT_MMD, "w") as f:
    f.write("\n".join(mmd))

with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 5
cp["steps"]["5"] = {"output_json": OUTPUT_JSON, "output_mmd": OUTPUT_MMD, "changes": len(changes)}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 5 COMPLETE — {len(changes)} changes → {OUTPUT_JSON} + {OUTPUT_MMD}")
```

Run it: python scripts\05_optimized_v2.py
Verify: both output files exist and are non-empty. If not — STOP.

---

## STEP 6 — Write and run 06_3d_export.py

Write scripts\06_3d_export.py:

```python
import json, os, math

INPUT = "output/burgandy-graph.json"
OUTPUT = "output/burgandy-3d.json"
CHECKPOINT = "checkpoint.json"

with open(INPUT) as f:
    graph = json.load(f)

GROUP_MAP = {
    "process": 0,     # core
    "channel": 1,     # routing
    "model": 2,       # models
    "tool": 3,        # execution
    "file": 4,        # memory
    "hardware": 5,    # constraints
    "service": 6,     # external
    "unknown": 7
}

# Arrange nodes in 3D space by group (spiral layout per group)
group_counts = {}
for n in graph["nodes"]:
    g = GROUP_MAP.get(n["type"], 7)
    group_counts[g] = group_counts.get(g, 0) + 1

group_idx = {}
nodes_3d = []

for n in graph["nodes"]:
    g = GROUP_MAP.get(n["type"], 7)
    idx = group_idx.get(g, 0)
    group_idx[g] = idx + 1

    # Spiral placement per group
    radius = 30 + g * 25
    angle = (idx / max(group_counts.get(g, 1), 1)) * 2 * math.pi
    x = round(radius * math.cos(angle), 2)
    y = round(g * 40 - 120, 2)
    z = round(radius * math.sin(angle), 2)

    nodes_3d.append({
        "id": n["id"],
        "label": n["label"][:40],
        "group": g,
        "type": n["type"],
        "x": x,
        "y": y,
        "z": z
    })

links_3d = []
for e in graph["edges"]:
    links_3d.append({
        "source": e["from"],
        "target": e["to"],
        "type": e["type"],
        "label": e.get("label", "")[:20]
    })

output_3d = {
    "nodes": nodes_3d,
    "links": links_3d,
    "groups": {
        "0": "core_processes",
        "1": "routing_channels",
        "2": "models",
        "3": "execution_tools",
        "4": "memory_files",
        "5": "hardware_constraints",
        "6": "external_services",
        "7": "other"
    },
    "meta": {
        "node_count": len(nodes_3d),
        "link_count": len(links_3d),
        "format": "three-js-force-graph compatible"
    }
}

with open(OUTPUT, "w") as f:
    json.dump(output_3d, f, indent=2)

with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 6
cp["steps"]["6"] = {"output": OUTPUT, "nodes": len(nodes_3d), "links": len(links_3d)}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 6 COMPLETE — {len(nodes_3d)} nodes, {len(links_3d)} links → {OUTPUT}")
```

Run it: python scripts\06_3d_export.py
Verify: output\burgandy-3d.json exists and contains nodes array. If not — STOP.

---

## STEP 7 — Write and run 07_report.py

Write scripts\07_report.py:

```python
import json, os

INPUT_V1 = "output/burgandy-graph.json"
INPUT_V2 = "output/burgandy-v2-graph.json"
INPUT_BN = "output/burgandy-bottlenecks.md"
OUTPUT = "output/burgandy-report.md"
CHECKPOINT = "checkpoint.json"

with open(INPUT_V1) as f:
    v1 = json.load(f)
with open(INPUT_V2) as f:
    v2 = json.load(f)

# Centrality from v1
in_deg = {}
out_deg = {}
for e in v1["edges"]:
    out_deg[e["from"]] = out_deg.get(e["from"], 0) + 1
    in_deg[e["to"]] = in_deg.get(e["to"], 0) + 1

node_stats = []
for n in v1["nodes"]:
    ind = in_deg.get(n["id"], 0)
    outd = out_deg.get(n["id"], 0)
    node_stats.append((n["id"], n["type"], n["label"][:30], ind, outd, ind+outd))

node_stats.sort(key=lambda x: -x[5])

lines = [
    "# Burgandy Architecture Report",
    "",
    "## Stats",
    f"| | V1 | V2 |",
    f"|---|---|---|",
    f"| Nodes | {v1['meta']['node_count']} | {v2['meta']['node_count']} |",
    f"| Edges | {v1['meta']['edge_count']} | {v2['meta']['edge_count']} |",
    f"| Generated | {v1['meta']['generated_at'][:10]} | {v2['meta']['generated_at'][:10]} |",
    "",
    "## Node Inventory (top 20 by centrality)",
    "| ID | Type | Label | In | Out | Centrality |",
    "|---|---|---|---|---|---|"
]

for nid, ntype, lbl, ind, outd, cent in node_stats[:20]:
    lines.append(f"| {nid} | {ntype} | {lbl} | {ind} | {outd} | {cent} |")

lines += [
    "",
    "## V2 Changes",
    "| Change |",
    "|---|"
]
for change in v2["meta"].get("changes", []):
    lines.append(f"| {change} |")

lines += [
    "",
    "## Output Files",
    "| File | Purpose |",
    "|---|---|",
    "| burgandy-graph.json | V1 node-edge graph |",
    "| burgandy-map.mmd | Mermaid diagram |",
    "| burgandy-map.dot | Graphviz DOT diagram |",
    "| burgandy-bottlenecks.md | SPOF and bottleneck analysis |",
    "| burgandy-v2-graph.json | Optimized V2 graph |",
    "| burgandy-v2-map.mmd | V2 Mermaid diagram |",
    "| burgandy-3d.json | Three.js force-graph input |",
    "| burgandy-report.md | This report |",
    "",
    "## Recommended Next Steps",
    "- Upgrade primary model: ollama pull qwen2.5:7b (better tool calling on RTX 3060)",
    "- Implement Hermes Agent as specialist subagent alongside OpenClaw",
    "- Build Three.js visualisation reading burgandy-3d.json",
    "- Review SPOF nodes and add fallback routing in openclaw.json",
    "- Process CCMA legal docs — April 7 2026 hearing is urgent",
]

with open(OUTPUT, "w") as f:
    f.write("\n".join(lines))

with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 7
cp["steps"]["7"] = {"output": OUTPUT}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 7 COMPLETE — Report → {OUTPUT}")
```

Run it: python scripts\07_report.py

---

## FINAL VERIFICATION

After all scripts complete, print a summary:

```
Read checkpoint.json and print:
ALL STEPS COMPLETE

Output files:
- output\burgandy-graph.json     [size]
- output\burgandy-map.mmd        [size]
- output\burgandy-map.dot        [size]
- output\burgandy-bottlenecks.md [size]
- output\burgandy-v2-graph.json  [size]
- output\burgandy-v2-map.mmd     [size]
- output\burgandy-3d.json        [size]
- output\burgandy-report.md      [size]

Burgandy architecture pipeline complete.
Next: load burgandy-3d.json into Three.js force-graph for 3D visualisation.
```