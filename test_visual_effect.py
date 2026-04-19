"""
Test visual effects with strong weight differences.
"""
import sys
import time
from pathlib import Path

framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
sys.path.insert(0, str(framework_path))

import live_network

print("=== VISUAL EFFECT TEST ===")
print("Testing weight-based glow visibility")
print("Open http://localhost:8765/burgandy_network_3d.html")
print()

# Clear state
live_network.deactivate_all()
time.sleep(2)

print("1. Activating strong adaptive edge (weight=0.90)")
print("   mathematics ↔ working_memory")
live_network.activate(["mathematics", "working_memory"], "Strong adaptive edge")
print("   Should be: GREEN, thick, high opacity")
time.sleep(3)

print("\n2. Activating weak adaptive edge (weight=0.25)")
print("   logic ↔ working_memory")
live_network.activate(["logic", "working_memory"], "Weak adaptive edge")
print("   Should be: GREEN, thin, low opacity")
time.sleep(3)

print("\n3. Activating strong base edge (weight=0.92)")
print("   language_comprehension ↔ logic")
live_network.activate(["language_comprehension", "logic"], "Strong base edge")
print("   Should be: BLUE, thick, high opacity")
time.sleep(3)

print("\n4. Activating weak base edge (weight=0.65)")
print("   analogical_reasoning ↔ abstraction")
live_network.activate(["analogical_reasoning", "abstraction"], "Weak base edge")
print("   Should be: BLUE, thin, low opacity")
time.sleep(3)

print("\n5. Activating multiple edges for comparison")
print("   All four edges active")
live_network.activate([
    "mathematics", "working_memory",
    "logic", "working_memory",
    "language_comprehension", "logic",
    "analogical_reasoning", "abstraction"
], "Comparison test")
print("   Should see clear visual hierarchy:")
print("   - Strong adaptive (green, thick, bright)")
print("   - Strong base (blue, thick, bright)")
print("   - Weak adaptive (green, thin, faint)")
print("   - Weak base (blue, thin, faint)")
time.sleep(5)

live_network.deactivate_all()
print("\n=== TEST COMPLETE ===")
print("\nVisual verification checklist:")
print("1. Adaptive edges: GREEN (0x44AA88)")
print("2. Base edges: BLUE (0x334466)")
print("3. Strong edges (weight > 0.8): Thick, high opacity")
print("4. Weak edges (weight < 0.3): Thin, low opacity")
print("5. Active edges: GOLD (0xFFD700) with pulsing")
print("6. Weight differences clearly visible")