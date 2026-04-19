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
        changes.append(f"ADDED edge: {src} -> {tgt}")

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

print(f"STEP 5 COMPLETE — {len(changes)} changes -> {OUTPUT_JSON} + {OUTPUT_MMD}")
