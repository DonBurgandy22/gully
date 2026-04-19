"""
Update the visualizer to show weight-based glow.
"""
import re
from pathlib import Path

html_path = Path(__file__).parent / "burgandy-cognitive-framework" / "outputs" / "burgandy_network_3d.html"

if not html_path.exists():
    print(f"HTML file not found: {html_path}")
    exit(1)

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

print("Updating visualizer for weight-based glow...")

# 1. Update edge creation to use weight-based properties
edge_creation_pattern = r'EDGES\.forEach\(e => \{[^}]+?edgeMap\[key\] = \{line, pulse, src:src\.mesh\.position, tgt:tgt\.mesh\.position, active:false, t:Math\.random\(\)\};'
edge_creation_replacement = '''EDGES.forEach(e => {
  const src = nodeMap[e.source], tgt = nodeMap[e.target];
  if(!src || !tgt) return;

  const points = [src.mesh.position.clone(), tgt.mesh.position.clone()];
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  // Weight-based visual properties
  const weight = e.weight || 0.5;
  const isAdaptive = e.relation_type === 'adaptive';
  const baseColor = isAdaptive ? 0x44AA88 : 0x334466; // Green for adaptive, blue for base
  const width = Math.max(0.3, weight * 2.0); // Thicker for stronger weights
  const opacity = Math.max(0.15, weight * 0.6); // More visible for stronger weights
  const glowIntensity = weight * 0.8; // Glow effect for stronger edges
  
  const mat = new THREE.LineBasicMaterial({
    color: baseColor,
    transparent: true,
    opacity: opacity,
    linewidth: width,
  });
  const line = new THREE.Line(geo, mat);
  scene.add(line);

  // Pulse sphere with weight-based properties
  const pGeo = new THREE.SphereGeometry(2.5 + weight * 1.5, 8, 8); // Larger for stronger weights
  const pMat = new THREE.MeshBasicMaterial({
    color: isAdaptive ? 0x88FFAA : 0xFFFFFF,
    transparent: true,
    opacity: 0,
  });
  const pulse = new THREE.Mesh(pGeo, pMat);
  scene.add(pulse);

  const key = e.source + '->' + e.target;
  edgeMap[key] = {
    line, 
    pulse, 
    src: src.mesh.position, 
    tgt: tgt.mesh.position, 
    active: false, 
    t: Math.random(),
    weight: weight,
    isAdaptive: isAdaptive,
    baseColor: baseColor,
    baseOpacity: opacity,
    baseWidth: width
  };
});'''

if re.search(edge_creation_pattern, html, re.DOTALL):
    html = re.sub(edge_creation_pattern, edge_creation_replacement, html, flags=re.DOTALL)
    print("✓ Updated edge creation for weight-based glow")
else:
    print("✗ Could not find edge creation pattern")

# 2. Update edge update logic in applyLiveState
edge_update_pattern = r'Object\.entries\(edgeMap\)\.forEach\(\(\[key, e\]\) => \{[^}]+?e\.pulse\.material\.opacity = 0;[^}]+?\}\);\s*\n'
edge_update_replacement = '''Object.entries(edgeMap).forEach(([key, e]) => {
    const isActive = activeEdgeSet.has(key);
    e.active = isActive;
    
    // Weight-based visual updates
    const weight = e.weight || 0.5;
    const targetOpacity = e.baseOpacity * (isActive ? 1.5 : 1.0); // Brighter when active
    const targetWidth = e.baseWidth * (isActive ? 1.3 : 1.0); // Thicker when active
    
    if(isActive) {
      // Active edges get gold color and enhanced glow
      e.line.material.color.set(0xFFD700);
      e.line.material.opacity = Math.min(0.9, targetOpacity * 1.2);
      e.line.material.linewidth = targetWidth * 1.2;
      e.pulse.material.opacity = 0.7 + weight * 0.3; // Stronger pulse for stronger weights
      e.pulse.material.color.set(e.isAdaptive ? 0xAAFFCC : 0xFFFFFF);
    } else {
      // Inactive edges show weight-based properties
      e.line.material.color.set(e.baseColor);
      e.line.material.opacity = targetOpacity;
      e.line.material.linewidth = targetWidth;
      e.pulse.material.opacity = 0;
    }
  });'''

if re.search(edge_update_pattern, html, re.DOTALL):
    html = re.sub(edge_update_pattern, edge_update_replacement, html, flags=re.DOTALL)
    print("✓ Updated edge update logic for weight-based glow")
else:
    print("✗ Could not find edge update pattern")

# 3. Update animation loop to include weight-based pulsing
animation_pattern = r'// ── Animation loop ──────────────────────────────────────[^}]+?renderer\.render\(scene, camera\);[^}]+?labelRenderer\.render\(scene, camera\);'
animation_replacement = '''// ── Animation loop ──────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
  // Node animation
  Object.values(nodeMap).forEach(n => {
    const targetScale = n.active ? 1.15 : 1.0;
    n.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    const targetColor = n.active ? new THREE.Color(0xFFD700) : n.baseColor;
    n.mesh.material.color.lerp(targetColor, 0.1);
    n.mesh.material.emissive.lerp(targetColor, 0.1);
    n.mesh.material.emissiveIntensity = n.active ? 0.8 : 0.3;
  });
  
  // Edge animation with weight-based effects
  Object.values(edgeMap).forEach(e => {
    e.t += 0.02;
    const pulsePhase = Math.sin(e.t) * 0.5 + 0.5;
    
    if(e.active) {
      // Active edge pulsing
      const pulseScale = 1.0 + pulsePhase * 0.3;
      e.pulse.scale.set(pulseScale, pulseScale, pulseScale);
      
      // Weight-based glow intensity
      const weightGlow = e.weight || 0.5;
      const glowIntensity = 0.3 + weightGlow * 0.5;
      e.line.material.opacity = Math.min(0.9, e.baseOpacity * glowIntensity);
      
      // Move pulse along edge based on weight (stronger weights move faster)
      const pulseSpeed = 0.02 + weightGlow * 0.03;
      const pulsePos = (Date.now() * pulseSpeed * 0.001) % 1;
      const pulsePosition = new THREE.Vector3().lerpVectors(e.src, e.tgt, pulsePos);
      e.pulse.position.copy(pulsePosition);
    } else {
      // Inactive edges still show subtle weight-based glow
      const weightGlow = e.weight || 0.5;
      const subtleGlow = 0.1 + weightGlow * 0.2;
      e.line.material.opacity = e.baseOpacity * (1.0 + subtleGlow * pulsePhase * 0.3);
    }
  });
  
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}'''

if re.search(animation_pattern, html, re.DOTALL):
    html = re.sub(animation_pattern, animation_replacement, html, flags=re.DOTALL)
    print("✓ Updated animation loop for weight-based effects")
else:
    print("✗ Could not find animation pattern")

# Save updated HTML
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n✓ Visualizer updated: {html_path}")
print("\nChanges made:")
print("1. Edge creation now uses weight-based properties:")
print("   - Thickness = weight × 2.0")
print("   - Opacity = weight × 0.6")
print("   - Adaptive edges are green (0x44AA88), base edges are blue (0x334466)")
print("2. Edge update logic shows weight-based glow:")
print("   - Stronger weights = brighter, thicker edges")
print("   - Active edges get gold color and enhanced glow")
print("3. Animation loop includes weight-based pulsing:")
print("   - Stronger weights have more intense glow")
print("   - Pulse moves faster along stronger edges")
print("   - Subtle pulsing even for inactive edges based on weight")