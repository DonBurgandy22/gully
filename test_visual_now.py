"""
Test the visual improvements NOW.
"""
import json
import time
import datetime

print("=== TESTING VISUAL IMPROVEMENTS ===\n")

# Update live state with dramatic test
state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# Create EXTREME test to see weight differences
test_state = {
    "task": "VISUAL TEST: Weight differences MUST BE OBVIOUS AT A GLANCE",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": ["mathematics", "working_memory", "logic"],
    "active_edges": [
        ["mathematics", "working_memory"],  # weight 0.95 - ADAPTIVE, should GLOW BRIGHTEST
        ["logic", "working_memory"],        # weight 0.45 - ADAPTIVE, should be visible but faint
    ],
    "all_edges": [
        {"source": "mathematics", "target": "working_memory", "weight": 0.95, "relation_type": "adaptive"},
        {"source": "logic", "target": "working_memory", "weight": 0.45, "relation_type": "adaptive"},
        {"source": "abstraction", "target": "mathematics", "weight": 0.60, "relation_type": "adaptive"},
        {"source": "language_comprehension", "target": "logic", "weight": 0.92, "relation_type": "base"},
    ]
}

with open(state_file, 'w') as f:
    json.dump(test_state, f, indent=2)

print("TEST STATE CREATED:")
print("=" * 50)
print("Edge 1: mathematics -> working_memory")
print("  Type: ADAPTIVE (green)")
print("  Weight: 0.95")
print("  Expected: BRIGHT GREEN GLOW, thick line, strong pulse")
print()
print("Edge 2: logic -> working_memory")
print("  Type: ADAPTIVE (green)")
print("  Weight: 0.45")
print("  Expected: MEDIUM GREEN GLOW, medium line, visible pulse")
print()
print("Edge 3: abstraction -> mathematics")
print("  Type: ADAPTIVE (green)")
print("  Weight: 0.60")
print("  Expected: BRIGHT GREEN GLOW, thick line")
print()
print("Edge 4: language_comprehension -> logic")
print("  Type: BASE (blue)")
print("  Weight: 0.92")
print("  Expected: BRIGHT BLUE GLOW, thick line")
print("=" * 50)
print("\nVISUAL EXPECTATIONS:")
print("1. mathematics->working_memory should be UNMISTAKABLY brightest")
print("2. Adaptive edges (green) should GLOW BRIGHTER than base edges")
print("3. Weight 0.95 should look MUCH stronger than weight 0.45")
print("4. ALL edges should have subtle continuous animation")
print("5. Status should show 'Active' (not 'Idle')")
print("\nREFRESH: http://localhost:8765/burgandy_network_3d.html")
print("\nIf weight differences are not obvious, glow is still too weak.")