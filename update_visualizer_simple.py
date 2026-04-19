"""
Update the visualizer to show weight-based glow - simple approach.
"""
from pathlib import Path

html_path = Path(__file__).parent / "burgandy-cognitive-framework" / "outputs" / "burgandy_network_3d.html"

if not html_path.exists():
    print(f"HTML file not found: {html_path}")
    exit(1)

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

print("Reading HTML file...")
lines = html.split('\n')

# Find the edge creation section
edge_start = -1
edge_end = -1
for i, line in enumerate(lines):
    if '// ── Build edges ────────────────────────────────────────' in line:
        edge_start = i
    elif edge_start != -1 and '// ── Arrow cones ────────────────────────────────────────' in line:
        edge_end = i
        break

if edge_start != -1 and edge_end != -1:
    print(f"Found edge section: lines {edge_start} to {edge_end}")
    
    # Replace the edge creation section
    new_edge_section = '''// ── Build edges ────────────────────────────────────────
EDGES.forEach(e => {
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
  
  const mat = new THREE.LineBasicMaterial({
    color: baseColor,
    transparent: true,
    opacity: opacity,
    linewidth: width,
  });
  const line = new THREE.Line(geo, mat);
  scene.add(line);

  // Pulse sphere with weight-based size
  const pGeo = new THREE.SphereGeometry(2.5 + weight * 1.5, 8, 8);
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
    
    # Replace the section
    lines[edge_start:edge_end] = [new_edge_section]
    print("Replaced edge creation section")
else:
    print("Could not find edge section")

# Find the edge update section in applyLiveState
update_start = -1
update_end = -1
in_update = False
for i, line in enumerate(lines):
    if 'Object.entries(edgeMap).forEach(([key, e]) => {' in line:
        update_start = i
        in_update = True
    elif in_update and line.strip() == '});':
        update_end = i + 1
        break

if update_start != -1 and update_end != -1:
    print(f"Found edge update section: lines {update_start} to {update_end}")
    
    new_update_section = '''  Object.entries(edgeMap).forEach(([key, e]) => {
    const isActive = activeEdgeSet.has(key);
    e.active = isActive;
    
    // Weight-based visual updates
    const weight = e.weight || 0.5;
    const targetOpacity = e.baseOpacity * (isActive ? 1.5 : 1.0);
    const targetWidth = e.baseWidth * (isActive ? 1.3 : 1.0);
    
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
    
    # Replace the section
    lines[update_start:update_end] = [new_update_section]
    print("Replaced edge update section")
else:
    print("Could not find edge update section")

# Find animation loop
anim_start = -1
anim_end = -1
in_anim = False
for i, line in enumerate(lines):
    if '// ── Animation loop ──────────────────────────────────────' in line:
        anim_start = i
    elif anim_start != -1 and 'animate();' in line:
        # Find the end of the animate function
        for j in range(i, len(lines)):
            if '}' in lines[j] and j > i + 20:  # Reasonable assumption
                anim_end = j + 1
                break
        break

if anim_start != -1 and anim_end != -1:
    print(f"Found animation section: lines {anim_start} to {anim_end}")
    
    new_anim_section = '''// ── Animation loop ──────────────────────────────────────
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
      
      // Move pulse along edge based on weight
      const pulseSpeed = 0.02 + weightGlow * 0.03;
      const pulsePos = (Date.now() * pulseSpeed * 0.001) % 1;
      const pulsePosition = new THREE.Vector3().lerpVectors(e.src, e.tgt, pulsePos);
      e.pulse.position.copy(pulsePosition);
    } else {
      // Inactive edges show subtle weight-based glow
      const weightGlow = e.weight || 0.5;
      const subtleGlow = 0.1 + weightGlow * 0.2;
      e.line.material.opacity = e.baseOpacity * (1.0 + subtleGlow * pulsePhase * 0.3);
    }
  });
  
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}'''
    
    # Replace the section
    lines[anim_start:anim_end] = [new_anim_section]
    print("Replaced animation section")
else:
    print("Could not find animation section")

# Write updated HTML
updated_html = '\n'.join(lines)
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(updated_html)

print(f"\nVisualizer updated: {html_path}")
print("\nSummary of changes:")
print("1. Edge creation: Weight-based thickness, opacity, and color")
print("2. Edge update: Weight-based glow when active/inactive")
print("3. Animation: Weight-based pulsing and glow effects")
print("\nOpen http://localhost:8765/burgandy_network_3d.html to see the changes")