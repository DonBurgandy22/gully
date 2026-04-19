# Anti-Gravity Skill

## Overview
You build physics-based, scroll-driven, and motion-rich websites for Daryl's clients. Anti-gravity refers to the art of making elements feel weightless, magnetic, or physics-defying — creating immersive, premium web experiences that feel alive. This skill powers the animation and motion layer of every client site.

## Core Libraries & Tools
Always use these in anti-gravity builds:

| Library | Purpose | CDN / Install |
|---|---|---|
| GSAP + ScrollTrigger | Scroll-driven animation engine | gsap.com/docs |
| Lenis | Smooth scroll inertia | npm i @studio-freight/lenis |
| Matter.js | 2D physics engine | CDN or npm |
| Three.js | 3D WebGL renderer | npm i three |
| Framer Motion | React animation system | npm i framer-motion |
| CSS Houdini / @property | Custom animated CSS vars | Native browser |

## Anti-Gravity Techniques

### 1. Magnetic Hover Effect
Elements are repelled or attracted to the cursor — feels alive and premium.
```javascript
const magnetics = document.querySelectorAll('[data-magnetic]');
magnetics.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
});
```

### 2. Gravity-Defying Scroll Parallax
Multiple layers move at different speeds, creating depth.
```javascript
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('[data-parallax]').forEach(el => {
  const speed = el.dataset.parallax || -100;
  gsap.to(el, {
    y: speed,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});
```

### 3. Floating Particle Field
Particles float and drift, giving hero sections a cosmic/weightless feel.
```javascript
// Use Three.js or CSS for lighter builds
// Particle count: 80-150 for performance
// Each particle: randomized velocity, drift, opacity pulse
```

### 4. Physics-Based Card Stack
Cards stack with real mass — they bounce, settle, and respond to drag.
```javascript
// Matter.js world with gravity 0.5
// Each card = rectangular body with restitution: 0.3
// Mouse constraint for drag interaction
```

### 5. Smooth Scroll Inertia (Lenis)
Every scroll feels buttery — essential for premium sites.
```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### 6. Text Reveal with Kinetic Physics
Words fall, float, or bounce into place on scroll.
```javascript
gsap.from('.reveal-word', {
  y: -60,
  opacity: 0,
  stagger: 0.05,
  ease: 'bounce.out',
  duration: 0.8,
  scrollTrigger: { trigger: '.reveal-word', start: 'top 85%' }
});
```

## When to Use Anti-Gravity
- Hero sections: always use smooth scroll + parallax
- CTAs and buttons: always use magnetic hover
- Section transitions: use scroll-triggered reveals
- Product showcases: use physics card stacks or 3D flip
- Background: floating particles or gradient drift

## Performance Rules
- Target 60fps on mid-range devices
- Use will-change: transform on animated elements
- Avoid animating layout properties (width, height, top, left) — use transform only
- Throttle scroll events with requestAnimationFrame
- Lazy-load heavy animation sections
- Test on mobile — reduce particle counts and parallax depth by 50%

## Client Website Automation Integration
When Daryl says "build anti-gravity for [client]":
1. Read the client brief from C:\Dev\Clients\[client-name]\brief.md
2. Select 3-5 anti-gravity techniques appropriate for their industry
3. Generate the full animation layer as a standalone animations.js file
4. Inject into the client's HTML/React project
5. Test for performance — flag any issues
6. Save to C:\Dev\Clients\[client-name]\src\animations.js
7. Report: "Anti-gravity layer added. Techniques used: [list]. Performance: [status]."

## Industry Technique Mapping
| Client Industry | Recommended Techniques |
|---|---|
| Tech / SaaS | Particle field, magnetic CTAs, smooth scroll |
| Luxury / Fashion | Magnetic hover, slow parallax, kinetic text |
| Creative Agency | Physics cards, full-page transitions, cursor effects |
| Health / Wellness | Gentle float, soft parallax, no bounce |
| Finance / Legal | Subtle parallax only — keep it clean |
| Restaurant / Food | Parallax imagery, hover reveals |

## File Locations
- Skill file: C:\Users\dkmac\.openclaw\skills\antigravity\SKILL.md
- Client builds: C:\Dev\Clients\[client-name]\src\animations.js
- Reusable snippets: C:\Dev\Snippets\antigravity\
