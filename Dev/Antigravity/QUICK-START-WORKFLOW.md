# QUICK-START WORKFLOW: Antigravity + Claude Code Bridge

## **IMMEDIATE WORKFLOW (Start Here)**

### **Step 1: Choose Your Path**
```
┌─────────────────────────────────────────────────────────────┐
│                     WEBSITE REQUEST                         │
│                     from Daryl                              │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│           DECISION: Claude Credits Available?               │
│                                                             │
│  ✅ YES → Path A: Claude Code (Fast, High Quality)         │
│  ⚠️ NO  → Path B: Direct Coding (Reliable, Always Works)   │
└─────────────────────────────────────────────────────────────┘
```

### **Step 2A: Claude Code Path (Optimal)**
```
1. Daryl: "Build a [website type] with [features]"
2. Burgundy: Switches to Reasoner mode
3. Burgundy: Writes prompt in C:\Dev\claude-code-queue.md
4. Daryl: Copies prompt → Opens Claude Code terminal
5. Claude Code: Executes in C:\dev\antigravity\[project]
6. Burgundy: Tests → Deploys → Sends URL
```

**Prompt Template (Copy-Paste Ready):**
```markdown
## WEBSITE: [Project Name]

### Requirements
- [ ] Responsive design (mobile-first)
- [ ] Antigravity magnetic cursor
- [ ] GSAP + Lenis smooth scroll
- [ ] Performance optimized (<2s load)

### Features
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

### Tech Stack
- HTML5, CSS3, JavaScript (ES6+)
- GSAP + ScrollTrigger
- Three.js (if 3D needed)
- localtunnel deployment

### Files to Create
C:\dev\antigravity\[project-name]\
├── index.html
├── style.css
├── script.js
└── assets/

### Deployment
- Port: [8001-8010]
- Password: 197.86.222.24
- Test: https://[name].loca.lt
```

### **Step 2B: Direct Coding Path (Fallback)**
```
1. Daryl: "Build a simple [website]"
2. Burgundy: "Switching to Reasoner for direct coding"
3. Burgundy: Codes directly in C:\dev\antigravity\[project]
4. Burgundy: Tests → Deploys → Sends URL
```

**Direct Code Template:**
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antigravity Website</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.0.45/dist/lenis.min.js"></script>
</head>
<body>
    <div class="magnetic-cursor"></div>
    <!-- Your content -->
    <script src="script.js"></script>
</body>
</html>
```

## **ANTIGRAVITY TECHNIQUES (Pick 2-3 per project)**

### **1. Magnetic Cursor (Always Include)**
```javascript
// script.js - Magnetic hover effects
document.querySelectorAll('[data-strength]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 1.5, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
    });
});
```

### **2. Smooth Scroll (Always Include)**
```javascript
// script.js - Lenis smooth scroll
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```

### **3. Parallax Effects (For Hero Sections)**
```javascript
// script.js - Scroll-triggered parallax
gsap.utils.toArray('[data-parallax]').forEach(el => {
    gsap.to(el, {
        y: el.dataset.parallax || -100,
        ease: 'none',
        scrollTrigger: { trigger: el, scrub: true }
    });
});
```

### **4. Particle Background (For Tech/Luxury)**
```javascript
// script.js - Three.js particle system
const particles = new THREE.Points(geometry, material);
scene.add(particles);
```

## **DEPLOYMENT CHECKLIST**

### **Before Coding:**
- [ ] Choose available port (8001-8010)
- [ ] Create folder: `C:\dev\antigravity\[project]`
- [ ] Note password: `197.86.222.24`

### **After Coding:**
- [ ] Test locally: `npx serve .` or open index.html
- [ ] Deploy: `npx localtunnel --port [port] --subdomain [name]`
- [ ] Test mobile: Open URL on phone
- [ ] Check performance: Chrome DevTools Lighthouse

### **Completion Message:**
```
✅ [Project Name] Complete!
🌐 Live at: https://[name].loca.lt
📱 Mobile tested: ✓
⚡ Performance: [Lighthouse score]
📁 Files: C:\dev\antigravity\[project]
```

## **COMMON PROJECT TYPES**

### **Portfolio Website**
```
Techniques: Magnetic cursor + Smooth scroll + Parallax
Sections: Hero, About, Projects, Contact
Time: 30-60 minutes
```

### **Landing Page**
```
Techniques: Magnetic CTA buttons + Scroll reveals
Sections: Hero, Features, Testimonials, CTA
Time: 20-40 minutes
```

### **Client Presentation**
```
Techniques: Subtle parallax + Professional animations
Sections: Problem, Solution, Results, Next Steps
Time: 15-30 minutes
```

## **ERROR HANDLING**

### **Claude Code Issues:**
```
Issue: API rate limited
Fix: Switch to direct coding immediately
Message: "Claude API limited. Switching to direct antigravity coding."
```

### **Tunnel Issues:**
```
Issue: localtunnel connection failed
Fix: Try different port or restart
Command: npx localtunnel --port 8002 --subdomain myproject
```

### **Performance Issues:**
```
Issue: Animations lag on mobile
Fix: Reduce particle count, simplify effects
Check: Chrome DevTools Performance tab
```

## **MODEL SWITCHING PROTOCOL**

### **When to Switch:**
- **DeepSeek Chat → Reasoner:** Complex planning, Claude Code prompts
- **Reasoner → Chat:** Back to routine tasks
- **Any → Gemini Flash:** DeepSeek unavailable

### **Announcement Format:**
```
🤔 Complex task detected
🔄 Switching to DeepSeek Reasoner for planning
📝 Writing Claude Code prompt...
```

## **FILE STRUCTURE PREFERENCE**

Daryl prefers **2-space indentation** and hierarchical structure:
```markdown
# Main Header
  ## Sub-header
    - **Item Title** - Description
      - URL: https://example.com/
      - Use: What it's used for
      - Notes: Additional context
```

## **IMMEDIATE ACTION**

**Next time Daryl asks for a website:**

1. **Check Claude credits** - If available, use Path A
2. **Write prompt** - Use template above
3. **Deploy** - Always to `C:\dev\antigravity\`
4. **Send completion** - With URL and details

**This workflow makes website building:**
- ✅ **Fast** - 15-60 minutes per site
- ✅ **Easy** - Clear decision tree
- ✅ **Reliable** - Fallback path always works
- ✅ **Consistent** - Same antigravity quality every time

---

*Last Updated: 2026-03-29 | Version: Quick-Start 1.0*
*Use this for immediate reference during website builds*