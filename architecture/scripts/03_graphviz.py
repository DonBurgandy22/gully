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

print(f"STEP 3 COMPLETE — DOT graph -> {OUTPUT}")
