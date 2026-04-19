from __future__ import annotations
from typing import Dict, List, Tuple
import networkx as nx


def find_all_cycles(G: nx.DiGraph) -> List[List[str]]:
    """Return all simple cycles detected in the directed graph."""
    return list(nx.simple_cycles(G))


def classify_cycles(G: nx.DiGraph) -> Dict[str, List[List[str]]]:
    """
    Classify detected cycles by length:
        short  = 2 nodes (mutual feedback pairs)
        medium = 3-4 nodes
        long   = 5+ nodes
    """
    cycles = find_all_cycles(G)
    classified: Dict[str, List[List[str]]] = {"short": [], "medium": [], "long": []}

    for cycle in cycles:
        n = len(cycle)
        if n == 2:
            classified["short"].append(cycle)
        elif n <= 4:
            classified["medium"].append(cycle)
        else:
            classified["long"].append(cycle)

    return classified


def get_loop_reinforcement_bonus(visit_count: int, max_visits: int = 3) -> float:
    """
    Calculate a diminishing reinforcement bonus for loop traversals.
    First pass: full bonus. Each repeat: diminishing returns. After max_visits: 0.
    """
    if visit_count <= 0 or visit_count > max_visits:
        return 0.0
    return max(0.0, 1.0 - (visit_count - 1) * (1.0 / max_visits))


def is_saturated(activation: float, cap: float = 0.95) -> bool:
    return activation >= cap


def get_cycle_nodes(cycles: List[List[str]]) -> List[str]:
    """Return a deduplicated list of nodes that participate in any cycle."""
    seen = set()
    result = []
    for cycle in cycles:
        for node in cycle:
            if node not in seen:
                seen.add(node)
                result.append(node)
    return result


def cycle_summary(G: nx.DiGraph) -> str:
    """Human-readable summary of all cycles in the graph."""
    cycles = find_all_cycles(G)
    if not cycles:
        return "No cycles detected."

    lines = [f"Found {len(cycles)} cycle(s):"]
    for i, cycle in enumerate(cycles, 1):
        path = " -> ".join(cycle) + f" -> {cycle[0]}"
        lines.append(f"  Loop {i} ({len(cycle)} nodes): {path}")
    return "\n".join(lines)


def named_loops() -> List[Tuple[str, List[str]]]:
    """
    Return the three canonical named loops defined in the spec.
    These are the primary feedback mechanisms in Burgandy's cognitive graph.
    """
    return [
        (
            "Loop A — Language / Logic / Math",
            ["language_comprehension", "logic", "mathematics", "symbolic_reasoning", "language_comprehension"],
        ),
        (
            "Loop B — Monitoring / Correction / Optimization",
            ["self_monitoring", "error_detection", "error_correction", "self_optimization", "self_monitoring"],
        ),
        (
            "Loop C — Abstraction / First Principles / Systems / Synthesis",
            ["abstraction", "first_principles_reasoning", "systems_thinking", "synthesis", "abstraction"],
        ),
    ]
