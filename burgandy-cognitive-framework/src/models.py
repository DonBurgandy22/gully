from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field


class Node(BaseModel):
    id: str
    name: str
    description: str
    layer: int
    cluster: str
    node_weight: float
    foundationality: float
    activation_level: float = 0.0
    transfer_power: float
    failure_impact: float
    adaptability: float
    tags: List[str] = Field(default_factory=list)

    def reset_activation(self) -> None:
        self.activation_level = 0.0


class Edge(BaseModel):
    source: str
    target: str
    weight: float
    relation_type: str
    path_cost: float
    reliability: float
    feedback_enabled: bool
    notes: str = ""


class Cluster(BaseModel):
    id: str
    name: str
    description: str
    layer: int
    node_weight: float
    domain: str
    attachment_nodes: List[str] = Field(default_factory=list)
    future_nodes: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)


class ActivationRecord(BaseModel):
    """Tracks the activation history of a single node during propagation."""
    node_id: str
    final_activation: float
    visit_count: int
    activation_history: List[float] = Field(default_factory=list)


class SimulationResult(BaseModel):
    """Complete result of a simulation run."""
    demo_name: str
    seed_nodes: List[str]
    iterations_run: int
    activated_nodes: List[ActivationRecord]
    loop_traversals: dict = Field(default_factory=dict)
    saturated_nodes: List[str] = Field(default_factory=list)
