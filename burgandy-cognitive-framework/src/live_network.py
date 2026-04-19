"""
live_network.py — Burgandy's API for updating the live cognitive network state.

Usage from OpenClaw / any Burgandy skill:
    from src.live_network import activate, deactivate_all, add_node

These functions write to outputs/live_state.json.
The 3D network polls this file every 2 seconds and updates visually.
"""
from __future__ import annotations
import json
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Tuple

# Import adaptive network for live relationship formation
ADAPTIVE_AVAILABLE = False
try:
    # Try relative import first (when module is part of package)
    from .adaptive_network import update_for_activation, merge_with_base_edges
    ADAPTIVE_AVAILABLE = True
except ImportError:
    try:
        # Try direct import (when module is imported directly)
        from adaptive_network import update_for_activation, merge_with_base_edges
        ADAPTIVE_AVAILABLE = True
    except ImportError:
        ADAPTIVE_AVAILABLE = False
        print("[LIVE_NETWORK] Adaptive network not available")

_STATE_PATH = Path(__file__).resolve().parent.parent / "outputs" / "live_state.json"
_NODES_PATH = Path(__file__).resolve().parent.parent / "data" / "starter_nodes.json"
_EDGES_PATH = Path(__file__).resolve().parent.parent / "data" / "starter_edges.json"

LAYER_COLORS = {1:"#4A90D9",2:"#E67E22",3:"#9B59B6",4:"#27AE60",5:"#E74C3C",6:"#95A5A6"}


def _read_state() -> dict:
    if _STATE_PATH.exists():
        return json.loads(_STATE_PATH.read_text(encoding="utf-8"))
    return {"active_nodes":[],"active_edges":[],"pending_nodes":[],"pending_edges":[],"task":"","timestamp":""}


def _write_state(state: dict) -> None:
    state["timestamp"] = datetime.now().isoformat()
    _STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    _STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


def activate(node_ids: List[str], task: str = "", edges: Optional[List[Tuple[str,str]]] = None) -> None:
    """
    Mark nodes as active in the live network.
    The 3D map will highlight them gold and pulse them.
    Also updates adaptive network for relationship formation.

    Args:
        node_ids: list of node IDs to activate (e.g. ["logic", "mathematics"])
        task: description of what Burgandy is currently doing
        edges: list of (source, target) edge pairs to highlight as active
    """
    # Update adaptive network for co-activation learning
    adaptive_edges = []
    if ADAPTIVE_AVAILABLE:
        try:
            adaptive_edges = update_for_activation(node_ids, task)
        except Exception as e:
            print(f"[LIVE_NETWORK] Adaptive update failed: {e}")
    
    # Merge adaptive edges with provided edges
    all_edges = []
    if edges:
        all_edges.extend([(s, t) for s, t in edges])
    all_edges.extend([(s, t) for s, t, _ in adaptive_edges])
    
    # Get merged edges for display (adaptive + base)
    merged_edges = []
    if ADAPTIVE_AVAILABLE:
        try:
            merged_edges = merge_with_base_edges()
        except Exception as e:
            print(f"[LIVE_NETWORK] Edge merge failed: {e}")
    
    state = _read_state()
    state["active_nodes"] = list(node_ids)
    state["task"] = task
    state["active_edges"] = [[s, t] for s, t in all_edges]
    
    # Store merged edges for visual display with weights
    if merged_edges:
        state["all_edges"] = merged_edges
    
    _write_state(state)


def deactivate_all() -> None:
    """Clear all active nodes and edges. Call when task is complete."""
    state = _read_state()
    state["active_nodes"] = []
    state["active_edges"] = []
    state["task"] = ""
    _write_state(state)


def add_node(
    node_id: str,
    name: str,
    layer: int,
    weight: float,
    description: str,
    attachment_edges: List[Tuple[str, str, float]],
    cluster: str = "domain",
) -> None:
    """
    Add a new cognitive node to Burgandy's network — both the data file and the live map.

    Args:
        node_id: unique snake_case identifier
        name: human-readable name
        layer: 1-6 (use 5 for new meta nodes, 6 for domain nodes)
        weight: 0.0-1.0 importance score
        description: what this capability does
        attachment_edges: list of (source, target, weight) tuples connecting to existing nodes
        cluster: which cluster this belongs to

    Example:
        add_node(
            "debugging_reasoning", "Debugging Reasoning", 6, 0.55,
            "Systematic isolation of software defects.",
            [("error_detection", "debugging_reasoning", 0.80),
             ("debugging_reasoning", "coding_cluster", 0.70)],
            cluster="coding"
        )
    """
    import math
    # Add to starter_nodes.json
    nodes = json.loads(_NODES_PATH.read_text(encoding="utf-8"))
    if not any(n["id"] == node_id for n in nodes):
        nodes.append({
            "id": node_id, "name": name, "description": description,
            "layer": layer, "cluster": cluster,
            "node_weight": weight, "foundationality": weight * 0.7,
            "activation_level": 0.0, "transfer_power": weight * 0.8,
            "failure_impact": weight * 0.7, "adaptability": 0.6,
            "tags": [cluster, "dynamic"]
        })
        _NODES_PATH.write_text(json.dumps(nodes, indent=2), encoding="utf-8")

    # Add to starter_edges.json
    edges = json.loads(_EDGES_PATH.read_text(encoding="utf-8"))
    for src, tgt, w in attachment_edges:
        if not any(e["source"] == src and e["target"] == tgt for e in edges):
            edges.append({
                "source": src, "target": tgt, "weight": w,
                "relation_type": "dependency", "path_cost": 1.5,
                "reliability": 0.75, "feedback_enabled": False,
                "notes": f"Dynamic attachment: {node_id}"
            })
    _EDGES_PATH.write_text(json.dumps(edges, indent=2), encoding="utf-8")

    # Queue in live_state for visual addition
    color = LAYER_COLORS.get(layer, "#95A5A6")
    angle = hash(node_id) % 360
    r = 200 + layer * 40
    x = round(r * math.cos(math.radians(angle)), 2)
    y = round((layer - 3.5) * 80, 2)
    z = round(r * math.sin(math.radians(angle)), 2)

    state = _read_state()
    pn = state.get("pending_nodes", [])
    if not any(p["id"] == node_id for p in pn):
        pn.append({"id": node_id, "name": name, "layer": layer, "weight": weight,
                   "color": color, "x": x, "y": y, "z": z, "layerName": f"Layer {layer}"})
    state["pending_nodes"] = pn

    pe = state.get("pending_edges", [])
    for src, tgt, w in attachment_edges:
        if not any(p["source"] == src and p["target"] == tgt for p in pe):
            pe.append({"source": src, "target": tgt, "weight": w})
    state["pending_edges"] = pe
    _write_state(state)


def clear_pending() -> None:
    """
    Clear pending_nodes and pending_edges from live_state.json.
    Call this after add_node() has had time to animate (30+ seconds),
    or after regenerating the HTML with run_demo.py.
    """
    state = _read_state()
    state["pending_nodes"] = []
    state["pending_edges"] = []
    _write_state(state)


def get_status() -> dict:
    """Return the current live state."""
    return _read_state()
