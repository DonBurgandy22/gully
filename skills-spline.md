# Spline 3D Skill

## Overview
You build interactive 3D web experiences using Spline (spline.design) and Three.js. Spline allows you to design, animate, and embed stunning 3D scenes directly into websites — no GPU programming required. Combined with the Anti-Gravity skill, this produces world-class interactive sites that win clients and command premium pricing.

## Tools & Stack

| Tool | Purpose | Access |
|---|---|---|
| Spline | 3D scene design + export | spline.design (free tier available) |
| @splinetool/react-spline | React embed component | npm i @splinetool/react-spline |
| @splinetool/runtime | Vanilla JS embed | npm i @splinetool/runtime |
| Three.js | Custom 3D when Spline is not enough | npm i three |
| React Three Fiber | React + Three.js bridge | npm i @react-three/fiber |
| Drei | Three.js helpers for R3F | npm i @react-three/drei |

## Spline Workflow (Client Sites)

### Step 1: Design the 3D Scene in Spline
1. Open spline.design then New File
2. Design the 3D object/scene (product, hero element, logo, abstract shape)
3. Add interactions: hover, scroll, click events inside Spline editor
4. Set background to transparent for web overlay
5. Publish the scene then copy the scene URL

### Step 2: Embed in React
```jsx
import Spline from '@splinetool/react-spline';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Headline Here</h1>
        <p>Supporting copy here.</p>
      </div>
      <Spline
        scene="https://prod.spline.design/[scene-id]/scene.splinecode"
        style={{ width: '100%', height: '100vh' }}
      />
    </section>
  );
}
```

### Step 3: Embed in Vanilla HTML/JS
```html
<script type="module">
  import { Application } from 'https://unpkg.com/@splinetool/runtime/build/runtime.js';
  const canvas = document.getElementById('spline-canvas');
  const app = new Application(canvas);
  await app.load('https://prod.spline.design/[scene-id]/scene.splinecode');
</script>
<canvas id="spline-canvas"></canvas>
```

## Spline Scene Types for Client Websites

### Hero 3D Object
A rotating, interactive 3D product or abstract shape in the hero section.
- Good for: SaaS, tech products, agencies, portfolios
- Setup: transparent background, mouse-follow rotation, auto-rotate on idle

### 3D Scroll Experience
Scene animates as user scrolls — objects morph, move, assemble.
- Good for: storytelling brands, product reveals, case studies
- Setup: Spline scroll events mapped to page scroll position via JS

### Interactive Product Viewer
Client's product in 3D — user can rotate, zoom, inspect.
- Good for: e-commerce, physical products, architecture
- Setup: orbit controls, hotspot labels, material switcher

### Animated 3D Logo
Client's logo rendered in 3D with hover/click interactions.
- Good for: landing pages, loading screens, brand identity sites
- Setup: export logo as SVG then extrude in Spline then add particle burst on click

### Floating 3D Elements
Abstract 3D shapes float in background — adds depth to flat layouts.
- Good for: any site needing a premium feel
- Setup: low-poly shapes, slow rotation, parallax on scroll

## Three.js (Custom 3D — When Spline Is Not Enough)
Use Three.js directly for: custom shaders, large data visualisations, game-like experiences, or when bundle size matters.

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

## Performance Rules
- Always use Spline CDN-hosted scene URL (do not self-host .splinecode for large files)
- Set loading="lazy" on Spline canvas elements below the fold
- Use Suspense in React to show a fallback while scene loads
- For mobile: detect device and load a static image fallback instead of 3D scene
- Max scene complexity: keep polygon count under 500k for web
- Always test load time — 3D scenes should not block page interactivity

```javascript
// Mobile fallback detection
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
if (isMobile) {
  document.getElementById('spline-canvas').style.display = 'none';
  document.getElementById('fallback-image').style.display = 'block';
}
```

## Client Website Automation Integration

When Daryl says "build 3D for [client]" or "add Spline to [client]":
1. Read brief from C:\Dev\Clients\[client-name]\brief.md
2. Select the appropriate Spline scene type for their industry
3. Generate embed code with correct scene URL placeholder
4. Create spline-setup.md with instructions for which scene to build in Spline editor
5. Add mobile fallback logic
6. Save all files to C:\Dev\Clients\[client-name]\src\
7. Report: "3D layer ready. Scene type: [type]. Mobile fallback: included."

## Industry Scene Type Mapping
| Client Industry | Recommended Scene Type |
|---|---|
| Tech / SaaS | Animated 3D logo + floating abstract elements |
| E-commerce | Interactive product viewer |
| Creative Agency | Full hero 3D scroll experience |
| Architecture / Real Estate | Product/space viewer with orbit |
| Health / Wellness | Soft floating organic shapes |
| Finance / Legal | Subtle floating 3D icon — keep it minimal |
| Restaurant | 3D animated hero object (e.g. dish, ingredient) |

## Combining with Anti-Gravity Skill
For maximum visual impact, always layer both skills:
1. Spline provides the 3D interactive scene
2. Anti-Gravity adds scroll parallax, magnetic effects, and physics on 2D elements
3. Combined: the 3D scene animates on scroll, and 2D elements around it respond to cursor

```javascript
ScrollTrigger.create({
  trigger: '.hero',
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    if (splineApp) {
      const obj = splineApp.findObjectByName('HeroObject');
      if (obj) obj.rotation.y = self.progress * Math.PI * 2;
    }
    gsap.set('.hero-text', { y: self.progress * -100 });
  }
});
```

## File Locations
- Skill file: C:\Users\dkmac\.openclaw\skills\spline\SKILL.md
- Client builds: C:\Dev\Clients\[client-name]\src\
- Reusable components: C:\Dev\Snippets\spline\
- Spline account: spline.design (Daryl's login)
