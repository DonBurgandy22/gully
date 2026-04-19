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

print(f"STEP 2 COMPLETE — {len(lines)} lines -> {OUTPUT}")
