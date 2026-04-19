---
name: anti-gravity-spline
description: Generate interactive anti-gravity spline visualizations — fluid, physics-driven curves that repel from the cursor and float with spring dynamics. Use this skill whenever the user asks for an anti-gravity spline, floating curves, repulsive spline, cursor-repellent animation, physics spline, or any interactive spline that reacts to mouse movement. Also trigger for requests like "spline that avoids the mouse", "gravity-defying curves", "interactive spline animation", "elastic curve simulation", or "spring-based path". Always use this skill for any anti-gravity or repulsive curve visualization.
---

# Anti-Gravity Spline Skill

Produces a self-contained HTML artifact: a canvas-based anti-gravity spline where control points float with spring physics and repel from the cursor. No dependencies — pure vanilla JS + Canvas 2D.

---

## Core Concept

- **Control points** sit at rest positions distributed across the canvas
- Each point has velocity and is pulled back to its rest position by a spring force
- When the cursor approaches within a **repulsion radius**, points are pushed away
- A smooth **Catmull-Rom spline** (or cubic Bézier chain) is drawn through the live positions
- Result: a fluid, living curve that "avoids" the mouse and oscillates back

---

## Physics Parameters (tune per request)

| Parameter | Default | Effect |
|---|---|---|
| `SPRING_K` | 0.06 | Stiffness — higher = snappier return |
| `DAMPING` | 0.85 | Velocity decay — lower = more oscillation |
| `REPULSION_RADIUS` | 120 | Pixel distance at which repulsion kicks in |
| `REPULSION_STRENGTH` | 8 | Force magnitude of the push |
| `NUM_POINTS` | 8 | Number of spline control points |

Adjust these when the user requests "more elastic", "snappier", "gentler", "more points", etc.

---

## Standard Implementation Template

Use the template below as the base. Customise colours, point count, physics values, and curve style per the user's request.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anti-Gravity Spline</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; overflow: hidden; }
  canvas { display: block; }
  #info {
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
    color: rgba(255,255,255,0.3); font: 12px/1 monospace; pointer-events: none;
    letter-spacing: 0.08em;
  }
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="info">move cursor · spline repels</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

// ── Config ──────────────────────────────────────────────
const CFG = {
  NUM_POINTS:        8,
  SPRING_K:          0.06,
  DAMPING:           0.85,
  REPULSION_RADIUS:  120,
  REPULSION_STRENGTH:8,
  LINE_WIDTH:        2.5,
  GLOW_BLUR:         18,
  COLOR_LINE:        '#7c3aed',   // primary spline colour
  COLOR_GLOW:        '#a78bfa',   // glow layer colour
  COLOR_POINT:       '#c4b5fd',   // control point dot colour
  SHOW_POINTS:       true,
  POINT_RADIUS:      4,
};

// ── State ────────────────────────────────────────────────
let W, H, mouse = { x: -9999, y: -9999 };
let points = [];   // { rx, ry, x, y, vx, vy }

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initPoints();
}

function initPoints() {
  points = [];
  const margin = W * 0.15;
  for (let i = 0; i < CFG.NUM_POINTS; i++) {
    const t  = i / (CFG.NUM_POINTS - 1);
    const rx = margin + t * (W - 2 * margin);
    const ry = H / 2 + Math.sin(t * Math.PI * 2) * H * 0.12;
    points.push({ rx, ry, x: rx, y: ry, vx: 0, vy: 0 });
  }
}

// ── Physics ──────────────────────────────────────────────
function updatePhysics() {
  for (const p of points) {
    // Spring toward rest
    let fx = (p.rx - p.x) * CFG.SPRING_K;
    let fy = (p.ry - p.y) * CFG.SPRING_K;

    // Repulsion from cursor
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
    if (dist < CFG.REPULSION_RADIUS) {
      const force = (1 - dist / CFG.REPULSION_RADIUS) * CFG.REPULSION_STRENGTH;
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    }

    p.vx = (p.vx + fx) * CFG.DAMPING;
    p.vy = (p.vy + fy) * CFG.DAMPING;
    p.x += p.vx;
    p.y += p.vy;
  }
}

// ── Catmull-Rom spline ───────────────────────────────────
function catmullRomSegment(ctx, p0, p1, p2, p3, alpha = 0.5) {
  // Using centripetal Catmull-Rom
  const tension = 0.5;
  const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
  const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
  const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
  const cp2y = p2.y - (p3.y - p1.y) * tension / 3;
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
}

function drawSpline(pts) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);

  if (pts.length === 2) {
    ctx.lineTo(pts[1].x, pts[1].y);
  } else {
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      catmullRomSegment(ctx, p0, p1, p2, p3);
    }
  }
}

// ── Render ───────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, W, H);

  // Glow pass
  ctx.save();
  ctx.shadowBlur  = CFG.GLOW_BLUR;
  ctx.shadowColor = CFG.COLOR_GLOW;
  ctx.strokeStyle = CFG.COLOR_GLOW;
  ctx.lineWidth   = CFG.LINE_WIDTH * 1.5;
  ctx.globalAlpha = 0.45;
  drawSpline(points);
  ctx.stroke();
  ctx.restore();

  // Main spline
  ctx.save();
  ctx.strokeStyle = CFG.COLOR_LINE;
  ctx.lineWidth   = CFG.LINE_WIDTH;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  drawSpline(points);
  ctx.stroke();
  ctx.restore();

  // Control point dots
  if (CFG.SHOW_POINTS) {
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, CFG.POINT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = CFG.COLOR_POINT;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

// ── Loop ─────────────────────────────────────────────────
function loop() {
  updatePhysics();
  draw();
  requestAnimationFrame(loop);
}

// ── Events ───────────────────────────────────────────────
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('touchmove', e => {
  e.preventDefault();
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: false });
window.addEventListener('touchend', () => {
  mouse.x = -9999; mouse.y = -9999;
});

resize();
loop();
</script>
</body>
</html>
```

---

## Variation Patterns

### Closed loop spline
Set `NUM_POINTS` to 6–10 and connect last point back to first by appending `points[0]` and `points[1]` to the draw array. Rest positions form an ellipse.

### Multi-spline / layered
Instantiate 2–3 independent point arrays with offset rest positions and different colours. Draw each separately for a layered ribbon effect.

### Vertical layout
Distribute rest positions along a vertical line (`x = W/2`, `y` spaced evenly) for a column spline.

### Attract + repel toggle
Add a click listener that toggles repulsion sign — cursor attracts on click, repels on release.

### Colour shifting
Use `hsl(${hue}, 80%, 60%)` where `hue` increments each frame for animated rainbow spline.

---

## Output Rules

1. Always deliver a **single self-contained HTML file** — no CDN links, no external assets.
2. Include touch support (`touchmove`) by default.
3. Keep the `#info` hint visible unless the user says to remove UI chrome.
4. Do not use WebGL unless explicitly requested — Canvas 2D is sufficient and more portable.
5. Default background is near-black (`#0a0a0f`). Match to user's colour request if given.
6. If the user requests "download" or "file", save to `/mnt/user-data/outputs/anti-gravity-spline.html` and call `present_files`.

---

## Customisation Checklist

When interpreting a user request, extract and apply:

- [ ] Colour scheme / palette
- [ ] Number of control points
- [ ] Spring stiffness (snappy vs elastic)
- [ ] Repulsion radius and strength
- [ ] Closed vs open curve
- [ ] Show/hide control point dots
- [ ] Background colour
- [ ] Glow on/off
- [ ] Multiple splines
- [ ] Any additional interactivity (click, drag points, etc.)
