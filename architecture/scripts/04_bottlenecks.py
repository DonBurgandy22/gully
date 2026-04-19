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

print(f"STEP 4 COMPLETE — {len(spof)} SPOFs, {len(bottlenecks)} bottlenecks -> {OUTPUT}")
