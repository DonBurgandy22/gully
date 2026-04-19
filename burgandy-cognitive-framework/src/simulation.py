from __future__ import annotations
from typing import Dict, List
import copy
import networkx as nx

from src.models import Node, SimulationResult
from src.activation_engine import propagate, build_seed_activations


def _reset_nodes(nodes: Dict[str, Node]) -> Dict[str, Node]:
    """Return a fresh copy of nodes with all activations zeroed."""
    return {nid: node.model_copy(update={"activation_level": 0.0}) for nid, node in nodes.items()}


def demo1_language_math(
    G: nx.DiGraph,
    nodes: Dict[str, Node],
) -> SimulationResult:
    """
    Demo 1 — Language-led math comprehension.
    Seeds: language_comprehension + abstraction.
    Traces activation reaching: logic, symbolic_reasoning, variable_mapping, mathematics.
    """
    fresh_nodes = _reset_nodes(nodes)
    seed_ids = ["language_comprehension", "abstraction"]
    seeds = build_seed_activations(fresh_nodes, seed_ids)

    result = propagate(G, fresh_nodes, seeds)
    result.demo_name = "Demo 1 — Language-Led Math Comprehension"
    return result


def demo2_correction_loop(
    G: nx.DiGraph,
    nodes: Dict[str, Node],
) -> SimulationResult:
    """
    Demo 2 — Self-correction loop.
    Seed: self_monitoring.
    Traces: error_detection -> error_correction -> self_optimization.
    """
    fresh_nodes = _reset_nodes(nodes)
    seed_ids = ["self_monitoring"]
    seeds = build_seed_activations(fresh_nodes, seed_ids)

    result = propagate(G, fresh_nodes, seeds)
    result.demo_name = "Demo 2 — Correction Loop"
    return result


def demo3_synthesis_loop(
    G: nx.DiGraph,
    nodes: Dict[str, Node],
) -> SimulationResult:
    """
    Demo 3 — Synthesis and strategy loop.
    Seeds: abstraction + first_principles_reasoning.
    Traces: systems_thinking -> synthesis -> strategy_adaptation -> planning.
    """
    fresh_nodes = _reset_nodes(nodes)
    seed_ids = ["abstraction", "first_principles_reasoning"]
    seeds = build_seed_activations(fresh_nodes, seed_ids)

    result = propagate(G, fresh_nodes, seeds)
    result.demo_name = "Demo 3 — Synthesis & Strategy Loop"
    return result


def run_all_demos(
    G: nx.DiGraph,
    nodes: Dict[str, Node],
) -> List[SimulationResult]:
    """Run all three demos and return their results."""
    return [
        demo1_language_math(G, nodes),
        demo2_correction_loop(G, nodes),
        demo3_synthesis_loop(G, nodes),
    ]
