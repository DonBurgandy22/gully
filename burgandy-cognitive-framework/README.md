# Burgandy Cognitive Framework

**Version:** 1.0  
**Owner:** Daryl Keenan Mack  
**Project:** Burgandy  

A human-inspired weighted cognitive graph — the first real cognitive scaffold for Burgandy.

---

## What This Is

This framework models Burgandy's internal cognition as a **directed, weighted, recursive graph**. It is not a chatbot skill list, a workflow diagram, or a simple routing table.

It maps:
- how reasoning capabilities depend on each other
- how activation spreads from foundational cognition to executive decisions
- how feedback loops reinforce cognitive capability over time
- how domain specialists (engineering, legal, finance, coding) attach to the cognitive core

The architecture is inspired by human cognitive development — language enables logic, logic enables mathematics, mathematics reinforces logic, and so on.

---

## Install

```bash
pip install -r requirements.txt
```

**Dependencies:** `networkx`, `pyvis`, `matplotlib`, `pydantic`

---

## Run the Demo

```bash
python run_demo.py
```

This will:
1. Load the cognitive graph (40 nodes, 62+ edges)
2. Detect and report all cycles (Loops A, B, C)
3. Compute influence scores and multi-path convergence analysis
4. Run 3 simulations (Demo 1, 2, 3)
5. Write outputs to `outputs/`

**Outputs:**
- `outputs/burgandy_network.html` — interactive graph (open in any browser)
- `outputs/burgandy_network.png` — static PNG overview
- `outputs/sample_activation_report.md` — activation report for all demos

---

## Project Structure

```
burgandy-cognitive-framework/
├─ README.md
├─ requirements.txt
├─ run_demo.py               ← entry point
├─ config/
│  └─ framework_config.json  ← engine settings, colors, paths
├─ data/
│  ├─ starter_nodes.json     ← all node definitions
│  ├─ starter_edges.json     ← all edge definitions
│  └─ starter_clusters.json  ← domain cluster stubs
├─ src/
│  ├─ models.py              ← Pydantic data models
│  ├─ graph_builder.py       ← JSON loading + networkx graph
│  ├─ activation_engine.py   ← propagation engine
│  ├─ loop_engine.py         ← cycle detection + loop utilities
│  ├─ scoring.py             ← centrality, influence, path cost
│  ├─ cluster_manager.py     ← domain cluster attachment
│  ├─ simulation.py          ← Demo 1, 2, 3 entry points
│  ├─ visualization.py       ← pyvis HTML + matplotlib PNG
│  └─ utils.py               ← file I/O, report writing
├─ docs/
│  ├─ architecture.md        ← design rationale and layer structure
│  ├─ node-taxonomy.md       ← every node explained
│  ├─ edge-rules.md          ← edge types and weighting rules
│  └─ loop-behaviour.md      ← how loops reinforce and saturate
└─ outputs/                  ← generated on first run
```

---

## How to Add a Node

1. Open `data/starter_nodes.json`
2. Add a new object following this schema:

```json
{
  "id": "your_node_id",
  "name": "Human Readable Name",
  "description": "What this cognitive capability does.",
  "layer": 2,
  "cluster": "reasoning",
  "node_weight": 0.60,
  "foundationality": 0.55,
  "activation_level": 0.0,
  "transfer_power": 0.65,
  "failure_impact": 0.60,
  "adaptability": 0.65,
  "tags": ["reasoning", "your_tag"]
}
```

3. Add edges connecting it in `data/starter_edges.json`
4. Re-run `python run_demo.py`

---

## How to Add an Edge

Open `data/starter_edges.json` and add:

```json
{
  "source": "source_node_id",
  "target": "target_node_id",
  "weight": 0.75,
  "relation_type": "dependency",
  "path_cost": 1.1,
  "reliability": 0.85,
  "feedback_enabled": false,
  "notes": "Why this edge exists."
}
```

Valid relation types: `dependency`, `amplification`, `translation`, `constraint`, `feedback`, `co_activation`

---

## How to Extend with Domain Clusters

Each Layer 6 cluster stub is ready for expansion. To populate a cluster:

1. Add specialist nodes to `data/starter_nodes.json` (Layer 6, cluster = domain name)
2. Add edges connecting them to core nodes listed in `data/starter_clusters.json` under `attachment_nodes`
3. Alternatively, use `cluster_manager.add_future_node_to_cluster()` programmatically

Example — adding `debugging_reasoning` to the coding cluster:

```python
from src.cluster_manager import add_future_node_to_cluster
G = add_future_node_to_cluster(
    G, clusters["coding_cluster"],
    node_id="debugging_reasoning",
    node_name="Debugging Reasoning",
    description="Systematic isolation and resolution of software defects.",
    node_weight=0.55,
    attachment_edges=[
        {"source": "error_detection", "target": "debugging_reasoning", "weight": 0.80, "relation_type": "dependency", "path_cost": 1.2, "reliability": 0.85, "feedback_enabled": False, "notes": ""},
        {"source": "debugging_reasoning", "target": "coding_cluster", "weight": 0.70, "relation_type": "co_activation", "path_cost": 1.0, "reliability": 0.80, "feedback_enabled": False, "notes": ""},
    ]
)
```

---

## The Three Demos

| Demo | Seeds | Shows |
|------|-------|-------|
| Demo 1 | `language_comprehension`, `abstraction` | Activation reaching logic, symbolic_reasoning, variable_mapping, mathematics |
| Demo 2 | `self_monitoring` | Correction loop: error_detection → error_correction → self_optimization |
| Demo 3 | `abstraction`, `first_principles_reasoning` | Synthesis loop: systems_thinking → synthesis → strategy_adaptation → planning |

---

## Read First

- `docs/architecture.md` — why this graph architecture was chosen
- `docs/node-taxonomy.md` — every node and what it enables
- `outputs/burgandy_network.html` — open in browser for the interactive view
