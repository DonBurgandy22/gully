"""
adaptive_network.py — Live relationship formation and adaptation between cognitive nodes.

Implements:
1. Co-activation link creation
2. Adaptive edge weights with reinforcement and decay
3. Live overlay on top of base cognitive architecture

Architecture: Adaptive graph overlay (live-only) on top of designed base graph.
This avoids polluting the core architecture while allowing visible learning.
"""
from __future__ import annotations
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Set
import time

# Paths
_STATE_PATH = Path(__file__).resolve().parent.parent / "outputs" / "live_state.json"
_ADAPTIVE_PATH = Path(__file__).resolve().parent.parent / "outputs" / "adaptive_edges.json"
_BASE_EDGES_PATH = Path(__file__).resolve().parent.parent / "data" / "starter_edges.json"

# Configuration
BASELINE_WEIGHT = 0.20          # Minimum weight for new adaptive edges
REINFORCEMENT_STEP = 0.05       # Weight increase per use
DECAY_STEP = 0.01               # Weight decrease per decay cycle
MAX_WEIGHT = 0.95               # Cap to prevent runaway growth
DECAY_INTERVAL_HOURS = 24       # Decay applied once per day
MIN_ACTIVATION_GAP_SECONDS = 2  # Minimum time between activations to count as co-activation


class AdaptiveNetwork:
    """Manages adaptive edges that form, strengthen, and decay based on real usage."""
    
    def __init__(self):
        self.adaptive_edges: Dict[Tuple[str, str], AdaptiveEdge] = {}
        self.last_decay_time: datetime = datetime.now()
        self._load_adaptive_edges()
    
    def _load_adaptive_edges(self) -> None:
        """Load adaptive edges from persistent storage."""
        if _ADAPTIVE_PATH.exists():
            try:
                data = json.loads(_ADAPTIVE_PATH.read_text(encoding="utf-8"))
                for edge_data in data.get("adaptive_edges", []):
                    key = (edge_data["source"], edge_data["target"])
                    self.adaptive_edges[key] = AdaptiveEdge.from_dict(edge_data)
                
                # Load last decay time
                last_decay = data.get("last_decay_time")
                if last_decay:
                    self.last_decay_time = datetime.fromisoformat(last_decay)
            except Exception as e:
                print(f"[ADAPTIVE] Failed to load adaptive edges: {e}")
                self.adaptive_edges = {}
    
    def _save_adaptive_edges(self) -> None:
        """Save adaptive edges to persistent storage."""
        data = {
            "adaptive_edges": [edge.to_dict() for edge in self.adaptive_edges.values()],
            "last_decay_time": self.last_decay_time.isoformat(),
            "updated": datetime.now().isoformat()
        }
        _ADAPTIVE_PATH.parent.mkdir(parents=True, exist_ok=True)
        _ADAPTIVE_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
    
    def _edge_exists_in_base(self, source: str, target: str) -> bool:
        """Check if edge exists in the base cognitive architecture."""
        if not _BASE_EDGES_PATH.exists():
            return False
        
        try:
            edges = json.loads(_BASE_EDGES_PATH.read_text(encoding="utf-8"))
            return any(e["source"] == source and e["target"] == target for e in edges)
        except:
            return False
    
    def process_activation(self, node_ids: List[str], task: str = "") -> List[Tuple[str, str, float]]:
        """
        Process node activation for adaptive learning.
        
        Returns: List of (source, target, current_weight) for edges to highlight.
        """
        # Apply decay if needed
        self._apply_decay_if_due()
        
        # Get all unique node pairs from activation
        pairs: Set[Tuple[str, str]] = set()
        for i in range(len(node_ids)):
            for j in range(i + 1, len(node_ids)):
                # Sort to ensure consistent ordering
                a, b = sorted([node_ids[i], node_ids[j]])
                pairs.add((a, b))
        
        # Process each pair
        edges_to_highlight = []
        for source, target in pairs:
            # Skip if edge already exists in base architecture
            if self._edge_exists_in_base(source, target):
                continue
            
            key = (source, target)
            
            # Create new adaptive edge if needed
            if key not in self.adaptive_edges:
                self.adaptive_edges[key] = AdaptiveEdge(
                    source=source,
                    target=target,
                    baseline_weight=BASELINE_WEIGHT,
                    current_weight=BASELINE_WEIGHT
                )
                print(f"[ADAPTIVE] Created new edge: {source} <-> {target} (weight: {BASELINE_WEIGHT:.2f})")
            
            # Reinforce existing edge
            edge = self.adaptive_edges[key]
            edge.reinforce()
            edges_to_highlight.append((source, target, edge.current_weight))
        
        # Save changes
        if pairs:
            self._save_adaptive_edges()
        
        return edges_to_highlight
    
    def _apply_decay_if_due(self) -> None:
        """Apply decay to all adaptive edges if decay interval has passed."""
        now = datetime.now()
        hours_since_decay = (now - self.last_decay_time).total_seconds() / 3600
        
        if hours_since_decay >= DECAY_INTERVAL_HOURS:
            print(f"[ADAPTIVE] Applying decay to {len(self.adaptive_edges)} edges")
            for edge in self.adaptive_edges.values():
                edge.decay()
            
            self.last_decay_time = now
            self._save_adaptive_edges()
    
    def get_adaptive_edges_for_display(self) -> List[Dict]:
        """Get adaptive edges formatted for visual display."""
        return [edge.to_display_dict() for edge in self.adaptive_edges.values()]
    
    def get_edge_weight(self, source: str, target: str) -> float:
        """Get current weight of adaptive edge, or 0 if doesn't exist."""
        key = (source, target) if source < target else (target, source)
        edge = self.adaptive_edges.get(key)
        return edge.current_weight if edge else 0.0


class AdaptiveEdge:
    """Represents an adaptive edge with reinforcement and decay behavior."""
    
    def __init__(self, source: str, target: str, baseline_weight: float, current_weight: float = None):
        self.source = source
        self.target = target
        self.baseline_weight = baseline_weight
        self.current_weight = current_weight if current_weight is not None else baseline_weight
        self.usage_count = 1
        self.last_used = datetime.now()
        self.created = datetime.now()
    
    @classmethod
    def from_dict(cls, data: Dict) -> AdaptiveEdge:
        """Create AdaptiveEdge from dictionary."""
        edge = cls(
            source=data["source"],
            target=data["target"],
            baseline_weight=data["baseline_weight"],
            current_weight=data["current_weight"]
        )
        edge.usage_count = data.get("usage_count", 1)
        edge.last_used = datetime.fromisoformat(data["last_used"])
        edge.created = datetime.fromisoformat(data["created"])
        return edge
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for storage."""
        return {
            "source": self.source,
            "target": self.target,
            "baseline_weight": self.baseline_weight,
            "current_weight": self.current_weight,
            "usage_count": self.usage_count,
            "last_used": self.last_used.isoformat(),
            "created": self.created.isoformat()
        }
    
    def to_display_dict(self) -> Dict:
        """Convert to dictionary for visual display."""
        return {
            "source": self.source,
            "target": self.target,
            "weight": self.current_weight,
            "relation_type": "adaptive",
            "path_cost": 1.0,
            "reliability": 0.8,
            "feedback_enabled": True,
            "notes": f"Adaptive edge: used {self.usage_count} times, formed {self.created.date()}"
        }
    
    def reinforce(self) -> None:
        """Increase weight based on usage."""
        self.usage_count += 1
        self.last_used = datetime.now()
        
        # Increase weight, but cap at MAX_WEIGHT
        new_weight = self.current_weight + REINFORCEMENT_STEP
        self.current_weight = min(new_weight, MAX_WEIGHT)
    
    def decay(self) -> None:
        """Decrease weight over time, but never below baseline."""
        # Only decay if not recently used (within decay interval)
        hours_since_use = (datetime.now() - self.last_used).total_seconds() / 3600
        if hours_since_use >= DECAY_INTERVAL_HOURS:
            new_weight = self.current_weight - DECAY_STEP
            self.current_weight = max(new_weight, self.baseline_weight)


# Global adaptive network instance
_adaptive_network = AdaptiveNetwork()


def get_adaptive_network() -> AdaptiveNetwork:
    """Get the global adaptive network instance."""
    return _adaptive_network


def update_for_activation(node_ids: List[str], task: str = "") -> List[Tuple[str, str, float]]:
    """
    Update adaptive network based on node activation.
    
    Returns: List of (source, target, weight) for edges to highlight.
    """
    return _adaptive_network.process_activation(node_ids, task)


def get_adaptive_edges() -> List[Dict]:
    """Get all adaptive edges for display."""
    return _adaptive_network.get_adaptive_edges_for_display()


def merge_with_base_edges() -> List[Dict]:
    """
    Merge base edges with adaptive edges for complete display.
    Adaptive edges override base edges with same source/target.
    """
    if not _BASE_EDGES_PATH.exists():
        return get_adaptive_edges()
    
    try:
        # Load base edges
        base_edges = json.loads(_BASE_EDGES_PATH.read_text(encoding="utf-8"))
        
        # Create lookup for adaptive edges
        adaptive_lookup = {}
        for edge in get_adaptive_edges():
            key = (edge["source"], edge["target"])
            adaptive_lookup[key] = edge
        
        # Merge: adaptive edges override base edges
        merged = []
        seen = set()
        
        # Add all adaptive edges first
        for edge in adaptive_lookup.values():
            merged.append(edge)
            seen.add((edge["source"], edge["target"]))
        
        # Add base edges that don't have adaptive overrides
        for edge in base_edges:
            key = (edge["source"], edge["target"])
            if key not in seen:
                merged.append(edge)
        
        return merged
    except Exception as e:
        print(f"[ADAPTIVE] Failed to merge edges: {e}")
        return get_adaptive_edges()
