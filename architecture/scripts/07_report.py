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

print(f"STEP 7 COMPLETE — Report -> {OUTPUT}")
