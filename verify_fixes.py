"""
Verify all visual fixes are applied.
"""
html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

print("=== VERIFYING VISUAL FIXES ===\n")

fixes = {
    # Edge creation
    "Adaptive edges glow 3.5x": 'glowIntensity = isAdaptive ? weight * 3.5 : weight * 2.5' in content,
    "Bright green for adaptive": 'baseColor = isAdaptive ? 0x00FFAA : 0x3366CC' in content,
    "Extreme width scaling": 'width = Math.max(0.2, weight * 6.0)' in content,
    "Low minimum opacity": 'opacity = Math.max(0.1, weight * 1.2)' in content,
    
    # Inactive edge updates
    "Strong inactive glow": 'emissiveIntensity = weight * 2.5' in content and '// EXTREME glow' in content,
    "Visible inactive pulse": 'opacity = weight * 0.5' in content and '// MUCH stronger pulse visibility' in content,
    "Strong pulse glow": 'emissiveIntensity = weight * 1.2' in content and '// MUCH stronger pulse glow' in content,
    
    # Animation
    "Continuous glow pulse": 'glowPulse = 0.15 * Math.sin(time * 0.8 + e.idHash) * weight' in content,
    "All edges animated": '// Animate ALL edges with continuous subtle movement' in content,
    "Idle edge movement": '// Subtle idle movement for inactive edges' in content,
    
    # Status logic
    "Significant edges check": 'significantEdges = Object.values(edgeMap).filter' in content,
    "Active with edges": 'activeSet.size > 0 || significantEdges > 5' in content,
}

all_passed = True
for fix, passed in fixes.items():
    status = "[PASS]" if passed else "[FAIL]"
    if not passed:
        all_passed = False
    print(f"{status} {fix}")

print(f"\nTotal: {sum(fixes.values())}/{len(fixes)} fixes applied")
print(f"All fixes applied: {'YES' if all_passed else 'NO - VISUAL STILL WEAK'}")

if not all_passed:
    print("\nMISSING FIXES WILL CAUSE:")
    print("1. Weak glow (edges hard to see)")
    print("2. Static appearance (no life)")
    print("3. Weight differences not obvious")
    print("4. Adaptive edges don't stand out")
    print("\nREAPPLY MISSING FIXES IMMEDIATELY")