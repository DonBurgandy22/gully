"""
Test to activate nodes and see visual response.
"""
import json
import time
import sys
import os

# Path to live state
state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# Read current state
with open(state_file, 'r') as f:
    state = json.load(f)

# Create activation
new_state = state.copy()
new_state['active_nodes'] = ['mathematics', 'working_memory', 'logic']
new_state['active_edges'] = [['mathematics', 'working_memory'], ['logic', 'working_memory']]
new_state['task'] = "Testing visual activation - weight 0.95 vs 0.45"
import datetime
new_state['timestamp'] = datetime.datetime.now().isoformat()

# Write back
with open(state_file, 'w') as f:
    json.dump(new_state, f, indent=2)

print("Activated:")
print("  Nodes: mathematics, working_memory, logic")
print("  Edges: mathematics->working_memory (weight 0.95)")
print("         logic->working_memory (weight 0.45)")
print("\nCheck visualizer at http://localhost:8765/burgandy_network_3d.html")
print("You should see:")
print("  1. mathematics->working_medge should glow BRIGHT (weight 0.95)")
print("  2. logic->working_memory should glow MEDIUM (weight 0.45)")
print("  3. Adaptive edges should be bright green")
print("  4. Base edges should be blue")
print("\nIf not, the visual expression is too weak.")