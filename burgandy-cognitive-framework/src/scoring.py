from __future__ import annotations
from typing import Dict, List, Tuple
import networkx as nx


def compute_centrality(G: nx.DiGraph) -> Dict[str, Dict[str, float]]:
    """Compute degree, betweenness, and pagerank centrality for all nodes."""
    in_degree = dict(G.in_degree(weight="weight"))
    out_degree = dict(G.out_degree(weight="weight"))
    betweenness = nx.betweenness_centrality(G, weight="weight", normalized=True)
    pagerank = nx.pagerank(G, weight="weight", alpha=0.85)

    result = {}
    for node in G.nodes():
        result[node] = {
            "in_degree": round(in_degree.get(node, 0.0), 4),
            "out_degree": round(out_degree.get(node, 0.0), 4),
            "betweenness": round(betweenness.get(node, 0.0), 4),
            "pagerank": round(pagerank.get(node, 0.0), 4),
        }
    return result


def compute_influence_score(G: nx.DiGraph) -> Dict[str, float]:
    """
    Influence score combines node weight, out-edge weights, and PageRank.
    Higher score = more cognitive leverage in the network.
    """
    pagerank = nx.pagerank(G, weight="weight", alpha=0.85)
    scores = {}

    for node in G.nodes():
        node_weight = G.nodes[node].get("node_weight", 0.5)
        out_edge_total = sum(
            G[node][succ].get("weight", 0.0) for succ in G.successors(node)
        )
        pr = pagerank.get(node, 0.0)
        scores[node] = round(node_weight * (1 + out_edge_total) * (1 + pr), 4)

    return scores


def compute_path_cost(G: nx.DiGraph, source: str, target: str) -> float:
    """
    Compute the minimum path cost from source to target.
    Uses path_cost edge attribute; falls back to 1.0 if missing.
    Returns float('inf') if no path exists.
    """
    try:
        path = nx.shortest_path(G, source, target, weight="path_cost")
        total_cost = 0.0
        for i in range(len(path) - 1):
            edge_data = G[path[i]][path[i + 1]]
            total_cost += edge_data.get("path_cost", 1.0)
        return round(total_cost, 4)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return float("inf")


def rank_nodes_by_influence(G: nx.DiGraph) -> List[Tuple[str, float]]:
    """Return nodes sorted by influence score, highest first."""
    scores = compute_influence_score(G)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)


def rank_nodes_by_activation(activated_nodes) -> List[Tuple[str, float]]:
    """Sort ActivationRecord list by final activation descending."""
    return sorted(
        [(r.node_id, r.final_activation) for r in activated_nodes],
        key=lambda x: x[1],
        reverse=True,
    )


def multi_path_analysis(G: nx.DiGraph, target: str) -> Dict[str, object]:
    """
    For a target node, find all nodes that can reach it and the path costs.
    Demonstrates multi-path convergence as specified in Section 12.
    """
    sources = []
    for node in G.nodes():
        if node == target:
            continue
        cost = compute_path_cost(G, node, target)
        if cost < float("inf"):
            sources.append({"source": node, "path_cost": cost})

    sources.sort(key=lambda x: x["path_cost"])
    return {
        "target": target,
        "reachable_from": sources,
        "total_sources": len(sources),
    }
