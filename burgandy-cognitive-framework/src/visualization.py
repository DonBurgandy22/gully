"""
visualization.py - Burgandy Cognitive Framework 3D Visualizer Generator
Generates the Three.js-based 3D network visualization HTML file.
"""

import json
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs"

# Visual config
LAYER_COLORS = {
    1: "#4A90D9",   # Foundational Cognition - blue
    2: "#E67E22",   # Reasoning - orange
    3: "#9B59B6",   # Formal Manipulation - purple
    4: "#27AE60",   # Executive Cognition - green
    5: "#E74C3C",   # Meta/Recursive - red
    6: "#95A5A6",   # Domain Clusters - grey
}

LAYER_NAMES = {
    1: "Foundational Cognition",
    2: "Reasoning",
    3: "Formal Manipulation",
    4: "Executive Cognition",
    5: "Meta / Recursive",
    6: "Domain Clusters",
}


def load_graph_data():
    """Load nodes, edges and clusters from data files."""
    with open(DATA_DIR / "starter_nodes.json") as f:
        nodes = json.load(f)
    with open(DATA_DIR / "starter_edges.json") as f:
        edges = json.load(f)
    try:
        with open(DATA_DIR / "starter_clusters.json") as f:
            clusters = json.load(f)
    except FileNotFoundError:
        clusters = []
    return nodes, edges, clusters


def generate_3d_threejs():
    """Generate the full Three.js 3D network visualization HTML file."""
    nodes, edges, clusters = load_graph_data()

    # Build node lookup
    node_map = {n["id"]: n for n in nodes}

    # Generate node positions using layer-based layout
    layer_nodes = {}
    for node in nodes:
        layer = node.get("layer", 1)
        if layer not in layer_nodes:
            layer_nodes[layer] = []
        layer_nodes[layer].append(node)

    # Assign 3D positions
    positions = {}
    for layer, layer_node_list in layer_nodes.items():
        count = len(layer_node_list)
        y = (layer - 3.5) * 80  # vertical spread
        for i, node in enumerate(layer_node_list):
            angle = (2 * 3.14159 * i) / max(count, 1)
            radius = 120 + (count * 8)
            x = radius * __import__('math').cos(angle)
            z = radius * __import__('math').sin(angle)
            positions[node["id"]] = {"x": round(x, 2), "y": round(y, 2), "z": round(z, 2)}

    # Build JS node data
    nodes_js = []
    for node in nodes:
        pos = positions.get(node["id"], {"x": 0, "y": 0, "z": 0})
        color = LAYER_COLORS.get(node.get("layer", 1), "#888888")
        weight = node.get("weight", 0.5)
        size = 4 + weight * 8
        nodes_js.append({
            "id": node["id"],
            "label": node.get("label", node["id"]),
            "layer": node.get("layer", 1),
            "color": color,
            "size": round(size, 2),
            "weight": weight,
            "x": pos["x"],
            "y": pos["y"],
            "z": pos["z"],
        })

    # Build JS edge data
    edges_js = []
    for edge in edges:
        src = edge.get("source") or edge.get("from")
        tgt = edge.get("target") or edge.get("to")
        if src in node_map and tgt in node_map:
            edges_js.append({
                "source": src,
                "target": tgt,
                "weight": edge.get("weight", 0.5),
                "type": edge.get("type", "base"),
            })

    nodes_json = json.dumps(nodes_js, indent=2)
    edges_json = json.dumps(edges_js, indent=2)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Burgandy Cognitive Network</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ background: #04040f; overflow: hidden; font-family: 'Courier New', monospace; }}
#c {{ display: block; width: 100vw; height: 100vh; }}
#ui {{
  position: fixed; top: 16px; left: 16px; z-index: 100;
  color: #aaa; font-size: 12px; pointer-events: none;
}}
#status {{
  position: fixed; top: 16px; right: 16px; z-index: 100;
  background: rgba(0,0,0,0.6); border: 1px solid #333;
  padding: 8px 14px; border-radius: 6px; color: #aaa; font-size: 12px;
}}
#status-dot {{
  display: inline-block; width: 8px; height: 8px;
  border-radius: 50%; background: #444; margin-right: 6px;
}}
#status-dot.active {{ background: #FFD700; box-shadow: 0 0 6px #FFD700; }}
#hints {{
  position: fixed; bottom: 16px; left: 16px; z-index: 100;
  color: #555; font-size: 11px; pointer-events: none;
}}
#info {{
  position: fixed; bottom: 16px; right: 16px; z-index: 100;
  color: #666; font-size: 11px; text-align: right;
}}
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="ui">
  <div>BURGANDY COGNITIVE NETWORK</div>
  <div id="node-count" style="color:#555; margin-top:4px;">{len(nodes_js)} nodes · {len(edges_js)} edges</div>
</div>
<div id="status">
  <span id="status-dot"></span>
  <span id="status-text">Idle</span>
  <div id="status-task" style="color:#666; margin-top:4px; font-size:11px;"></div>
</div>
<div id="hints">drag to rotate · scroll to zoom · right-drag to pan</div>
<div id="info">localhost:8765</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// ── DATA ────────────────────────────────────────────────────────────────────
const NODE_DATA = {nodes_json};
const EDGE_DATA = {edges_json};

// ── SCENE SETUP ─────────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({{ canvas, antialias: true }});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x04040f);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x04040f, 400, 1200);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 80, 380);
camera.lookAt(0, 0, 0);

// Ambient + directional light
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(1, 2, 3);
scene.add(dirLight);

// ── NODE + EDGE MAPS ────────────────────────────────────────────────────────
const nodeMap = {{}};
const edgeMap = {{}};

// Build nodes
NODE_DATA.forEach(nd => {{
  const geo = new THREE.SphereGeometry(nd.size, 16, 16);
  const mat = new THREE.MeshPhongMaterial({{
    color: nd.color,
    emissive: nd.color,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: 0.85,
  }});
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(nd.x, nd.y, nd.z);
  scene.add(mesh);

  // Label sprite
  const canvas2 = document.createElement('canvas');
  canvas2.width = 256; canvas2.height = 64;
  const ctx = canvas2.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0,0,256,64);
  ctx.font = 'bold 20px Courier New';
  ctx.fillStyle = nd.color;
  ctx.textAlign = 'center';
  ctx.fillText(nd.label.replace(/_/g,' '), 128, 40);
  const tex = new THREE.CanvasTexture(canvas2);
  const spriteMat = new THREE.SpriteMaterial({{ map: tex, transparent: true, opacity: 0.7 }});
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(60, 15, 1);
  sprite.position.set(nd.x, nd.y + nd.size + 10, nd.z);
  scene.add(sprite);

  nodeMap[nd.id] = {{
    mesh, sprite, mat, spriteMat,
    baseColor: new THREE.Color(nd.color),
    active: false,
    isThoughtTrain: false,
    thoughtTrainFade: 0,
    t: 0,
  }};
}});

// Build edges
EDGE_DATA.forEach(ed => {{
  const src = nodeMap[ed.source];
  const tgt = nodeMap[ed.target];
  if (!src || !tgt) return;
  const key = ed.source + '->' + ed.target;

  const isAdaptive = ed.type === 'adaptive';
  const weight = ed.weight || 0.5;
  const baseOpacity = 0.08 + weight * 0.25;
  const baseColor = isAdaptive ? 0x00FF88 : 0x334466;

  const points = [src.mesh.position.clone(), tgt.mesh.position.clone()];
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({{
    color: baseColor,
    transparent: true,
    opacity: baseOpacity,
    linewidth: 1,
  }});
  const line = new THREE.Line(geo, mat);
  scene.add(line);

  // Pulse sphere
  const pulseGeo = new THREE.SphereGeometry(1.5, 8, 8);
  const pulseMat = new THREE.MeshBasicMaterial({{
    color: baseColor,
    transparent: true,
    opacity: 0,
  }});
  const pulse = new THREE.Mesh(pulseGeo, pulseMat);
  scene.add(pulse);

  edgeMap[key] = {{
    line, pulse, mat, pulseMat,
    src: src.mesh.position,
    tgt: tgt.mesh.position,
    weight,
    baseOpacity,
    baseColor: new THREE.Color(baseColor),
    active: false,
    isAdaptive,
    isThoughtTrain: false,
    thoughtTrainFade: 0,
    t: Math.random(),
  }};
}});

// ── ORBIT CONTROLS (manual) ─────────────────────────────────────────────────
let isDragging = false, isRightDrag = false;
let prevMouse = {{ x: 0, y: 0 }};
let spherical = {{ theta: 0, phi: Math.PI / 2.5, r: 380 }};
let panOffset = new THREE.Vector3();

canvas.addEventListener('mousedown', e => {{
  isDragging = true;
  isRightDrag = e.button === 2;
  prevMouse = {{ x: e.clientX, y: e.clientY }};
}});
canvas.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', e => {{
  if (!isDragging) return;
  const dx = e.clientX - prevMouse.x;
  const dy = e.clientY - prevMouse.y;
  prevMouse = {{ x: e.clientX, y: e.clientY }};
  if (isRightDrag) {{
    panOffset.x -= dx * 0.3;
    panOffset.y += dy * 0.3;
  }} else {{
    spherical.theta -= dx * 0.005;
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + dy * 0.005));
  }}
}});
canvas.addEventListener('wheel', e => {{
  spherical.r = Math.max(100, Math.min(1200, spherical.r + e.deltaY * 0.5));
}});

// ── LIVE STATE POLLING ───────────────────────────────────────────────────────
let liveState = {{ active_nodes: [], active_edges: [], thought_trains: [], task: '' }};

function pollLiveState() {{
  fetch('/live_state.json?t=' + Date.now())
    .then(r => r.json())
    .then(state => {{
      liveState = state;
      applyLiveState(state);
    }})
    .catch(() => {{}});
}}
setInterval(pollLiveState, 500);

function applyLiveState(state) {{
  const activeNodeSet = new Set(state.active_nodes || []);
  const activeEdgeSet = new Set((state.active_edges || []).map(e =>
    (typeof e === 'string') ? e : (e.source + '->' + e.target)
  ));

  // Sync any missing edges from all_edges
  (state.all_edges || []).forEach(ed => {{
    const key = ed.source + '->' + ed.target;
    if (!edgeMap[key]) {{
      const src = nodeMap[ed.source];
      const tgt = nodeMap[ed.target];
      if (!src || !tgt) return;
      const isAdaptive = ed.type === 'adaptive';
      const weight = ed.weight || 0.5;
      const baseOpacity = 0.08 + weight * 0.25;
      const baseColor = isAdaptive ? 0x00FF88 : 0x334466;
      const points = [src.mesh.position.clone(), tgt.mesh.position.clone()];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({{
        color: baseColor, transparent: true, opacity: baseOpacity,
      }});
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      const pulseGeo = new THREE.SphereGeometry(1.5, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({{
        color: baseColor, transparent: true, opacity: 0,
      }});
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(pulse);
      edgeMap[key] = {{
        line, pulse, mat, pulseMat,
        src: src.mesh.position, tgt: tgt.mesh.position,
        weight, baseOpacity, baseColor: new THREE.Color(baseColor),
        active: false, isAdaptive, isThoughtTrain: false, thoughtTrainFade: 0, t: Math.random(),
      }};
    }}
  }});

  // Update node states
  Object.entries(nodeMap).forEach(([id, n]) => {{
    n.active = activeNodeSet.has(id);
    n.isThoughtTrain = false;
    n.thoughtTrainFade = 0;
  }});

  // Update edge states
  Object.entries(edgeMap).forEach(([key, e]) => {{
    e.active = activeEdgeSet.has(key);
    e.isThoughtTrain = false;
    e.thoughtTrainFade = 0;
  }});

  // Apply thought-train highlights
  const trains = state.thought_trains || [];
  if (trains.length > 0) {{
    const train = trains[0];
    const now = Date.now();
    const age = now - new Date(train.timestamp).getTime();
    const fade = Math.max(0, 1 - age / 10000);
    if (fade > 0) {{
      (train.activated_nodes || []).forEach(id => {{
        if (nodeMap[id]) {{
          nodeMap[id].isThoughtTrain = true;
          nodeMap[id].thoughtTrainFade = fade;
        }}
      }});
      (train.traversed_edges || []).forEach(pair => {{
        const key = Array.isArray(pair) ? pair[0] + '->' + pair[1] : pair;
        if (edgeMap[key]) {{
          edgeMap[key].isThoughtTrain = true;
          edgeMap[key].thoughtTrainFade = fade;
        }}
      }});
    }}
  }}

  // Update status badge
  const dot = document.getElementById('status-dot');
  const txt = document.getElementById('status-text');
  const taskEl = document.getElementById('status-task');
  const hasActive = activeNodeSet.size > 0;
  dot.className = hasActive ? 'active' : '';
  txt.textContent = hasActive ? 'Active' : 'Idle';
  taskEl.textContent = state.task || '';
}}

// ── ANIMATION LOOP ───────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {{
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // Update camera from spherical
  camera.position.set(
    panOffset.x + spherical.r * Math.sin(spherical.phi) * Math.sin(spherical.theta),
    panOffset.y + spherical.r * Math.cos(spherical.phi),
    panOffset.z + spherical.r * Math.sin(spherical.phi) * Math.cos(spherical.theta)
  );
  camera.lookAt(panOffset.x, panOffset.y, panOffset.z);

  // Animate nodes
  Object.values(nodeMap).forEach(n => {{
    if (n.isThoughtTrain && n.thoughtTrainFade > 0) {{
      const f = n.thoughtTrainFade;
      n.mat.color.setHex(0xFFAA00);
      n.mat.emissive.setHex(0xFFAA00);
      n.mat.emissiveIntensity = 0.8 * f + 0.3 * Math.sin(time * 6);
      n.mat.opacity = 0.7 + 0.3 * f;
      n.spriteMat.opacity = 0.9 * f;
      return;
    }}
    if (n.active) {{
      n.mat.color.setHex(0xFFD700);
      n.mat.emissive.setHex(0xFFD700);
      n.mat.emissiveIntensity = 0.6 + 0.4 * Math.sin(time * 4);
      n.mat.opacity = 0.95;
      n.spriteMat.opacity = 1.0;
    }} else {{
      n.mat.color.copy(n.baseColor);
      n.mat.emissive.copy(n.baseColor);
      n.mat.emissiveIntensity = 0.08 + 0.04 * Math.sin(time * 1.5);
      n.mat.opacity = 0.55;
      n.spriteMat.opacity = 0.45;
    }}
  }});

  // Animate edges
  Object.values(edgeMap).forEach(e => {{
    // Thought-train edges: gold, thick, directional pulse
    if (e.isThoughtTrain && e.thoughtTrainFade > 0) {{
      const f = e.thoughtTrainFade;
      e.line.material.color.setHex(0xFFAA00);
      e.line.material.opacity = Math.max(0.3, 0.8 * f);
      e.t = (e.t + 0.03) % 1;
      e.pulse.position.lerpVectors(e.src, e.tgt, e.t);
      e.pulseMat.color.setHex(0xFFD700);
      e.pulseMat.opacity = 0.9 * f;
      return;
    }}

    // Active edges: bright, animated
    if (e.active) {{
      e.line.material.color.setHex(0xFFEE00);
      e.line.material.opacity = Math.min(0.95, e.baseOpacity * 3.5 + 0.3 * Math.sin(time * 3));
      e.t = (e.t + 0.015) % 1;
      e.pulse.position.lerpVectors(e.src, e.tgt, e.t);
      e.pulseMat.color.setHex(0xFFEE00);
      e.pulseMat.opacity = 0.7 + 0.3 * Math.sin(time * 4);
      return;
    }}

    // Adaptive edges: green tint, slightly brighter than base
    if (e.isAdaptive) {{
      const w = e.weight || 0.5;
      e.line.material.color.setHex(0x00CC66);
      e.line.material.opacity = Math.max(0.06, 0.05 + w * 0.3 + 0.02 * Math.sin(time * 0.8));
      e.t = (e.t + 0.003) % 1;
      e.pulse.position.lerpVectors(e.src, e.tgt, e.t);
      e.pulseMat.color.setHex(0x00CC66);
      e.pulseMat.opacity = Math.max(0.04, w * 0.12);
      return;
    }}

    // Base edges: subtle blue, always visible
    const w = e.weight || 0.5;
    e.line.material.color.setHex(0x334466);
    e.line.material.opacity = Math.max(0.06, e.baseOpacity + 0.02 * Math.sin(time * 0.5));
    e.t = (e.t + 0.002) % 1;
    e.pulse.position.lerpVectors(e.src, e.tgt, e.t);
    e.pulseMat.color.setHex(0x3355AA);
    e.pulseMat.opacity = Math.max(0.03, w * 0.08);
  }});

  renderer.render(scene, camera);
}}
animate();

window.addEventListener('resize', () => {{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}});
</script>
</body>
</html>"""

    output_path = OUTPUT_DIR / "burgandy_network_3d.html"
    OUTPUT_DIR.mkdir(exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Generated: {output_path} ({len(html)} bytes)")
    return str(output_path)


if __name__ == "__main__":
    generate_3d_threejs()
