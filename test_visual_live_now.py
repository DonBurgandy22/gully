"""
Run a real multi-node task to test visual improvements.
"""
import json
import time
import datetime

print("=== RUNNING REAL VISUAL TEST ===\n")

state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# Phase 1: Start with all edges inactive to see weight differences
print("PHASE 1: Weight differences (all edges inactive)")
phase1 = {
    "task": "VISUAL TEST: Weight differences MUST be obvious",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": [],
    "active_edges": [],
    "all_edges": [
        # Strong adaptive edge
        {"source": "mathematics", "target": "working_memory", "weight": 0.95, "relation_type": "adaptive"},
        # Medium adaptive edge  
        {"source": "abstraction", "target": "mathematics", "weight": 0.60, "relation_type": "adaptive"},
        # Weak adaptive edge
        {"source": "logic", "target": "working_memory", "weight": 0.45, "relation_type": "adaptive"},
        # Strong base edge
        {"source": "language_comprehension", "target": "logic", "weight": 0.92, "relation_type": "base"},
        # Weak base edge
        {"source": "spatial_reasoning", "target": "visual_perception", "weight": 0.30, "relation_type": "base"},
    ]
}

with open(state_file, 'w') as f:
    json.dump(phase1, f, indent=2)

print("✓ Phase 1 loaded: All edges inactive")
print("  Look for:")
print("  1. mathematics→working_memory (0.95, adaptive): Should glow BRIGHTEST")
print("  2. abstraction→mathematics (0.60, adaptive): Should glow MEDIUM")
print("  3. logic→working_memory (0.45, adaptive): Should glow FAINT")
print("  4. language_comprehension→logic (0.92, base): Should glow bright BLUE")
print("  5. spatial_reasoning→visual_perception (0.30, base): Should be barely visible")
print("\n  REFRESH: http://localhost:8765/burgandy_network_3d.html")
print("  Wait 5 seconds, then check Phase 2...")
time.sleep(5)

# Phase 2: Activate strong path to see directional flow
print("\nPHASE 2: Active directional flow")
phase2 = {
    "task": "ACTIVE FLOW: Strong path should show obvious movement",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": ["mathematics", "working_memory", "logic"],
    "active_edges": [
        ["mathematics", "working_memory"],  # Strong adaptive edge - should pulse strongly
        ["language_comprehension", "logic"], # Strong base edge - should pulse
    ],
    "all_edges": phase1["all_edges"]
}

with open(state_file, 'w') as f:
    json.dump(phase2, f, indent=2)

print("✓ Phase 2 loaded: Strong path active")
print("  Look for:")
print("  1. mathematics→working_memory: Should pulse GOLD with obvious flow")
print("  2. language_comprehension→logic: Should pulse BLUE")
print("  3. Other edges: Should remain visible but faint")
print("\n  Status should show: 'Active (3 nodes)'")
print("  Wait 5 seconds, then check Phase 3...")
time.sleep(5)

# Phase 3: Return to idle but edges should still be visible
print("\nPHASE 3: Inactive but visible presence")
phase3 = {
    "task": "IDLE BUT VISIBLE: Edges should still show weight",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": [],
    "active_edges": [],
    "all_edges": phase1["all_edges"]
}

with open(state_file, 'w') as f:
    json.dump(phase3, f, indent=2)

print("✓ Phase 3 loaded: All edges inactive again")
print("  Look for:")
print("  1. All edges should still be VISIBLE (not disappear)")
print("  2. Weight differences should still be obvious")
print("  3. Status might show 'Idle' but edges should glow")
print("\n  Final check complete.")
print("\n=== VISUAL VERIFICATION QUESTIONS ===")
print("1. Is the localhost view now visibly alive by eye?")
print("2. Are strong links unmistakably brighter than weak links?")
print("3. Are adaptive edges clearly distinguishable from base edges?")
print("4. Does the top-right Idle/live state still feel misleading?")
print("5. Is one more single-block patch needed?")