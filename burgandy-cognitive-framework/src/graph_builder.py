from __future__ import annotations
import json
from pathlib import Path
from typing import Dict, List, Tuple
import networkx as nx

from src.models import Node, Edge, Cluster


def load_nodes(data_dir: Path) -> Dict[str, Node]:
    with open(data_dir / "starter_nodes.json") as f:
        raw = json.load(f)
    return {n["id"]: Node(**n) for n in raw}


def load_edges(data_dir: Path) -> List[Edge]:
    with open(data_dir / "starter_edges.json") as f:
        raw = json.load(f)
    return [Edge(**e) for e in raw]


def load_clusters(data_dir: Path) -> Dict[str, Cluster]:
    with open(data_dir / "starter_clusters.json") as f:
        raw = json.load(f)
    return {c["id"]: Cluster(**c) for c in raw}


def build_graph(nodes: Dict[str, Node], edges: List[Edge]) -> nx.DiGraph:
    G = nx.DiGraph()

    for node_id, node in nodes.items():
        G.add_node(
            node_id,
            name=node.name,
            layer=node.layer,
            cluster=node.cluster,
            node_weight=node.node_weight,
            foundationality=node.foundationality,
            activation_level=node.activation_level,
            transfer_power=node.transfer_power,
            failure_impact=node.failure_impact,
            adaptability=node.adaptability,
            tags=node.tags,
        )

    for edge in edges:
        if edge.source not in nodes or edge.target not in nodes:
            raise ValueError(f"Edge references unknown node: {edge.source} -> {edge.target}")
        G.add_edge(
            edge.source,
            edge.target,
            weight=edge.weight,
            relation_type=edge.relation_type,
            path_cost=edge.path_cost,
            reliability=edge.reliability,
            feedback_enabled=edge.feedback_enabled,
            notes=edge.notes,
        )

    return G


def detect_cycles(G: nx.DiGraph) -> List[List[str]]:
    """Return all simple cycles in the graph."""
    return list(nx.simple_cycles(G))


def get_layer_subgraph(G: nx.DiGraph, layer: int) -> nx.DiGraph:
    nodes = [n for n, d in G.nodes(data=True) if d.get("layer") == layer]
    return G.subgraph(nodes).copy()


def load_full_graph(base_dir: Path) -> Tuple[nx.DiGraph, Dict[str, Node], List[Edge], Dict[str, Cluster]]:
    """One-shot loader: returns graph + raw model objects."""
    data_dir = base_dir / "data"
    nodes = load_nodes(data_dir)
    edges = load_edges(data_dir)
    clusters = load_clusters(data_dir)
    G = build_graph(nodes, edges)
    return G, nodes, edges, clusters
