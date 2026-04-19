from __future__ import annotations
import json
from pathlib import Path
from typing import Dict, List, Optional
import networkx as nx

from src.models import Cluster, Node, Edge


def attach_cluster_to_graph(
    G: nx.DiGraph,
    cluster: Cluster,
    new_nodes: List[Node],
    new_edges: List[Edge],
) -> nx.DiGraph:
    """
    Attach a populated domain cluster to the existing cognitive graph.
    new_nodes are the domain-specific leaf nodes.
    new_edges connect domain nodes to core graph nodes and to each other.
    """
    for node in new_nodes:
        G.add_node(
            node.id,
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

    for edge in new_edges:
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


def get_cluster_summary(G: nx.DiGraph, clusters: Dict[str, Cluster]) -> List[Dict]:
    """Return a summary of each cluster: stub node presence and attachment health."""
    summaries = []
    for cluster_id, cluster in clusters.items():
        in_graph = cluster_id in G.nodes()
        attachment_health = []
        for attachment in cluster.attachment_nodes:
            reachable = attachment in G.nodes() and nx.has_path(G, attachment, cluster_id) if in_graph else False
            attachment_health.append({"node": attachment, "reachable": reachable})

        summaries.append({
            "cluster_id": cluster_id,
            "name": cluster.name,
            "domain": cluster.domain,
            "in_graph": in_graph,
            "attachment_nodes": cluster.attachment_nodes,
            "future_nodes": cluster.future_nodes,
            "attachment_health": attachment_health,
        })
    return summaries


def add_future_node_to_cluster(
    G: nx.DiGraph,
    cluster: Cluster,
    node_id: str,
    node_name: str,
    description: str,
    node_weight: float,
    attachment_edges: List[Dict],
) -> nx.DiGraph:
    """
    Scaffold for adding a new domain-specific node to a cluster.
    attachment_edges: list of dicts with keys: source, target, weight, relation_type, etc.
    """
    G.add_node(
        node_id,
        name=node_name,
        layer=cluster.layer,
        cluster=cluster.id,
        node_weight=node_weight,
        foundationality=node_weight * 0.5,
        activation_level=0.0,
        transfer_power=node_weight * 0.7,
        failure_impact=node_weight * 0.6,
        adaptability=0.6,
        tags=[cluster.domain, "domain_node"],
        description=description,
    )

    for edge_dict in attachment_edges:
        G.add_edge(
            edge_dict["source"],
            edge_dict["target"],
            weight=edge_dict.get("weight", 0.5),
            relation_type=edge_dict.get("relation_type", "dependency"),
            path_cost=edge_dict.get("path_cost", 1.5),
            reliability=edge_dict.get("reliability", 0.75),
            feedback_enabled=edge_dict.get("feedback_enabled", False),
            notes=edge_dict.get("notes", ""),
        )

    return G
