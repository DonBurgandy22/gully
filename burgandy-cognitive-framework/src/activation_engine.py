from __future__ import annotations
from collections import defaultdict
from typing import Dict, List, Set
import networkx as nx

from src.models import Node, ActivationRecord, SimulationResult


# Engine constants (can be overridden via config)
DECAY_PER_STEP = 0.1
MAX_ACTIVATION_CAP = 0.95
MAX_ITERATIONS = 20
MAX_LOOP_VISITS = 3


def propagate(
    G: nx.DiGraph,
    nodes: Dict[str, Node],
    seed_activations: Dict[str, float],
    decay: float = DECAY_PER_STEP,
    cap: float = MAX_ACTIVATION_CAP,
    max_iter: int = MAX_ITERATIONS,
    max_visits: int = MAX_LOOP_VISITS,
) -> SimulationResult:
    """
    Spread activation outward from seed nodes through the graph.

    Formula per edge:
        incoming_signal = source_activation * source_weight * edge_weight * reliability
        adjusted_signal = incoming_signal / path_cost
        new_target_activation = min(cap, current + adjusted_signal * (1 - decay))

    Loop protection: if a node is visited > max_visits times in one run, that path stops.
    """
    # Working copy of activation levels (float per node)
    activation: Dict[str, float] = {n: 0.0 for n in G.nodes()}
    visit_count: Dict[str, int] = defaultdict(int)
    activation_history: Dict[str, List[float]] = defaultdict(list)
    loop_traversals: Dict[str, int] = defaultdict(int)

    # Seed initial activations
    for node_id, init_val in seed_activations.items():
        if node_id in activation:
            activation[node_id] = min(cap, init_val)
            visit_count[node_id] = 1
            activation_history[node_id].append(activation[node_id])

    saturated: Set[str] = set()
    iterations_run = 0

    for iteration in range(max_iter):
        delta: Dict[str, float] = defaultdict(float)
        any_change = False

        for source in list(G.nodes()):
            src_activation = activation[source]
            if src_activation <= 0.001:
                continue

            src_weight = G.nodes[source].get("node_weight", 0.5)

            for target in G.successors(source):
                if visit_count[target] >= max_visits:
                    # Track loop saturation
                    loop_key = f"{source}->{target}"
                    loop_traversals[loop_key] += 1
                    continue

                edge_data = G[source][target]
                edge_weight = edge_data.get("weight", 0.5)
                path_cost = edge_data.get("path_cost", 1.0)
                reliability = edge_data.get("reliability", 1.0)

                incoming_signal = src_activation * src_weight * edge_weight * reliability
                adjusted_signal = incoming_signal / path_cost
                contribution = adjusted_signal * (1.0 - decay)

                delta[target] += contribution
                any_change = True

        # Apply accumulated deltas
        for node_id, incoming in delta.items():
            old_val = activation[node_id]
            new_val = min(cap, old_val + incoming)

            if new_val != old_val:
                activation[node_id] = new_val
                visit_count[node_id] += 1
                activation_history[node_id].append(new_val)

                if new_val >= cap:
                    saturated.add(node_id)

        iterations_run = iteration + 1
        if not any_change:
            break

    # Build result
    records: List[ActivationRecord] = []
    for node_id in G.nodes():
        final_act = activation[node_id]
        if final_act > 0.0:
            records.append(ActivationRecord(
                node_id=node_id,
                final_activation=round(final_act, 4),
                visit_count=visit_count[node_id],
                activation_history=[round(v, 4) for v in activation_history[node_id]],
            ))

    records.sort(key=lambda r: r.final_activation, reverse=True)

    return SimulationResult(
        demo_name="",
        seed_nodes=list(seed_activations.keys()),
        iterations_run=iterations_run,
        activated_nodes=records,
        loop_traversals=dict(loop_traversals),
        saturated_nodes=list(saturated),
    )


def build_seed_activations(nodes: Dict[str, Node], seed_ids: List[str]) -> Dict[str, float]:
    """Create seed dict using each node's own node_weight as its starting activation."""
    return {
        sid: nodes[sid].node_weight
        for sid in seed_ids
        if sid in nodes
    }
