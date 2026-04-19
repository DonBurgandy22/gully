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

print(f"STEP 6 COMPLETE — {len(nodes_3d)} nodes, {len(links_3d)} links -> {OUTPUT}")
