"""
Demonstrate adaptive network with visual weight-based glow.
"""
import sys
import json
import time
from pathlib import Path

# Add framework to path
framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
sys.path.insert(0, str(framework_path))

import adaptive_network
import live_network

print("=== ADAPTIVE NETWORK DEMONSTRATION ===")
print("Demonstrating weight-based visual glow in 3D network")
print("Open: http://localhost:8765/burgandy_network_3d.html")
print()

# Clear any existing state
live_network.deactivate_all()
time.sleep(2)

print("1. Creating new adaptive edge between unlinked nodes")
print("   Activating: working_memory + variable_mapping")
live_network.activate(["working_memory", "variable_mapping"], "Creating adaptive edge")
print("   ✓ Should create green adaptive edge with weight 0.20")
time.sleep(3)

print("\n2. Strengthening the adaptive edge with repeated use")
for i in range(3):
    live_network.activate(["working_memory", "variable_mapping"], f"Strengthening edge {i+1}")
    print(f"   Activation {i+1}: Edge should be thicker and brighter")
    time.sleep(2)

print("\n3. Comparing with base edge")
print("   Activating: logic + mathematics (base edge)")
live_network.activate(["logic", "mathematics"], "Base edge for comparison")
print("   ✓ Base edge should be blue, adaptive edge should be green")
print("   ✓ Adaptive edge should be visibly stronger after 3 reinforcements")
time.sleep(3)

print("\n4. Testing multiple adaptive edges")
print("   Activating: systems_thinking + planning + decision_making")
live_network.activate(["systems_thinking", "planning", "decision_making"], "Multiple nodes")
print("   ✓ Should create/strengthen multiple adaptive edges")
print("   ✓ Each edge should have weight-based glow")
time.sleep(3)

print("\n5. Showing weight decay over time (simulated)")
print("   Deactivating all nodes...")
live_network.deactivate_all()
print("   ✓ Edges should remain visible but less intense")
print("   ✓ Adaptive edges should still be green, base edges blue")
time.sleep(2)

print("\n6. Final demonstration: Strong vs weak edges")
print("   Activating strongly reinforced edge...")
live_network.activate(["working_memory", "variable_mapping"], "Strong edge (weight ~0.35)")
time.sleep(2)
print("   Activating newly created edge...")
live_network.activate(["abstraction", "causal_reasoning"], "Weak edge (weight 0.20)")
print("   ✓ Strong edge should be thicker, brighter, more visible")
print("   ✓ Weak edge should be fainter but still visible")
time.sleep(3)

# Final deactivation
live_network.deactivate_all()

print("\n=== DEMONSTRATION COMPLETE ===")
print("\nVisual verification checklist:")
print("1. Adaptive edges are GREEN (0x44AA88)")
print("2. Base edges are BLUE (0x334466)")
print("3. Stronger weights = thicker lines")
print("4. Stronger weights = higher opacity")
print("5. Active edges = GOLD (0xFFD700) with pulsing")
print("6. Pulse intensity correlates with edge weight")
print("7. New adaptive edges clearly visible")
print("8. Weight differences visually apparent")

# Show current adaptive edges
adaptive_edges = adaptive_network.get_adaptive_edges()
print(f"\nCurrent adaptive edges ({len(adaptive_edges)}):")
for edge in adaptive_edges:
    print(f"  {edge['source']} -> {edge['target']}: weight={edge['weight']:.2f}")

print("\nOpen http://localhost:8765/burgandy_network_3d.html to see the visual result")