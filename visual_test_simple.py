"""
Simple visual test without Unicode.
"""
import sys
import time
from pathlib import Path

framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
sys.path.insert(0, str(framework_path))

import live_network

print("=== VISUAL TEST ===")
print("Testing weight-based glow")
print("Open http://localhost:8765/burgandy_network_3d.html")

# Clear state
live_network.deactivate_all()
time.sleep(2)

print("\n1. Strong adaptive edge (weight=0.90)")
print("   mathematics <-> working_memory")
live_network.activate(["mathematics", "working_memory"], "Strong adaptive")
time.sleep(3)

print("\n2. Weak adaptive edge (weight=0.25)")
print("   logic <-> working_memory")
live_network.activate(["logic", "working_memory"], "Weak adaptive")
time.sleep(3)

print("\n3. Strong base edge (weight=0.92)")
print("   language_comprehension <-> logic")
live_network.activate(["language_comprehension", "logic"], "Strong base")
time.sleep(3)

print("\n4. All active for comparison")
live_network.activate([
    "mathematics", "working_memory",
    "logic", "working_memory",
    "language_comprehension", "logic"
], "Comparison")
time.sleep(5)

live_network.deactivate_all()
print("\n=== TEST DONE ===")
print("\nCheck visualizer for:")
print("- Adaptive edges: GREEN")
print("- Base edges: BLUE")
print("- Strong edges: Thick, bright")
print("- Weak edges: Thin, faint")
print("- Active edges: GOLD with pulse")