# WORKFLOW-BRIDGE.md - Burgundy ↔ Claude Code ↔ Antigravity Integration

## **Complete Integration Bridge for Website Development**

**Established:** March 29, 2026  
**Purpose:** Unified workflow for website development with fallback paths

**Quick Reference:** See `QUICK-START-WORKFLOW.md` for immediate action guide

---

## **DECISION TREE: Which Path to Use?**

### **Path 1: Claude Code Available (Optimal)**
```
┌─────────────┐    ┌───────────────┐    ┌──────────────┐    ┌──────────────┐
│   Daryl     │───▶│   Burgundy    │───▶│ Claude Code  │───▶│  Antigravity │
│ (Request)   │    │ (Reasoner)    │    │   Queue      │    │  Workspace   │
└─────────────┘    └───────────────┘    └──────────────┘    └──────────────┘
       │                   │                     │                   │
       │ "Build website"   │ Write detailed      │ Daryl runs        │ Code executes
       │                   │ prompt              │ from terminal     │ in C:\dev\antigravity
       └───────────────────┴─────────────────────┴───────────────────┴─────▶ Website Live
```

**When to use:**
- ✅ Claude API credits available
- ✅ Complex website with antigravity/spline effects
- ✅ Production-ready code needed quickly
- ✅ You have time to copy/paste prompts

**Process:**
1. Daryl: "Build a portfolio website with magnetic cursor"
2. Burgundy: Switches to Reasoner mode
3. Burgundy: Writes detailed prompt in `C:\Dev\claude-code-queue.md`
4. Daryl: Copies prompt to Claude Code terminal
5. Claude Code: Executes in `C:\dev\antigravity`
6. Burgundy: Tests, deploys, sends completion message

---

### **Path 2: No Claude Credits (Fallback)**
```
┌─────────────┐    ┌───────────────┐    ┌──────────────┐
│   Daryl     │───▶│   Burgundy    │───▶│  Antigravity │
│ (Request)   │    │ (Reasoner)    │    │  Workspace   │
└─────────────┘    └───────────────┘    └──────────────┘
       │                   │                     │
       │ "Build website"   │ "Switching to      │ Code writes
       │                   │ direct coding"     │ directly
       └───────────────────┴─────────────────────┴─────▶ Website Live
```

**When to use:**
- ⚠️ Claude API credits exhausted
- ⚠️ Rate limited or API errors
- ⚠️ Simple website needed quickly
- ⚠️ You want to save Claude credits for complex tasks

**Process:**
1. Daryl: "Build a simple landing page"
2. Burgundy: "Switching to Reasoner mode for direct antigravity coding"
3. Burgundy: Writes code directly in `C:\dev\antigravity`
4. Burgundy: Tests, iterates, deploys
5. Burgundy: Sends completion message

---

## **PROMPT TEMPLATE SYSTEM**

### **Standardized Prompt Format (For Claude Code Queue)**

```markdown
## WEBSITE REQUEST: [Project Name]

### Project Details
- **Client/Use:** [Personal portfolio, Client website, etc.]
- **Budget:** [If applicable]
- **Timeline:** [Urgent, This week, Whenever]

### Core Requirements
- [ ] Responsive design (mobile-first)
- [ ] Antigravity magnetic cursor effects
- [ ] Spline 3D integration (if needed)
- [ ] Performance optimized (<2s load)
- [ ] SEO basics (meta tags, alt text)

### Specific Features Requested
1. [Feature 1 with details]
2. [Feature 2 with details]
3. [Feature 3 with details]

### Design References
- Color palette: [Hex codes]
- Typography: [Font choices]
- Inspiration: [URLs to reference sites]

### Technical Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Animation:** GSAP + Lenis smooth scroll
- **3D:** Three.js (if needed)
- **Effects:** Magnetic hover, parallax, particle background
- **Deployment:** localtunnel with password protection

### Files to Create
```
C:\dev\antigravity\[project-name]\
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/
│   ├── fonts/
│   └── spline/ (if 3D)
└── README.md (deployment instructions)
```

### Deployment Instructions
1. Serve from: `C:\dev\antigravity\[project-name]`
2. Tunnel port: [8001-8010]
3. Password: [197.86.222.24 or custom]
4. Test URL: https://[tunnel-name].loca.lt

### Success Criteria
- [ ] Loads in <2 seconds on 3G
- [ ] Perfect Lighthouse scores (>90)
- [ ] All animations smooth (60fps)
- [ ] Mobile touch interactions work
- [ ] No console errors

---

**NOTE FOR CLAUDE CODE:** 
- Use existing antigravity components from `C:\dev\antigravity\portfolio\`
- Follow Daryl's MD file structure (2-space indentation, hierarchical)
- Keep token count <3000
- Output complete, working code (no placeholders)
```

---

## **DIRECT CODING TEMPLATE (Fallback Path)**

When coding directly in antigravity, use this structure:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Project Name] - Antigravity Design</title>
    <link rel="stylesheet" href="style.css">
    <!-- Antigravity Base -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.0.45/dist/lenis.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
    <!-- Magnetic cursor container -->
    <div class="magnetic-cursor"></div>
    
    <!-- Your content here -->
    
    <script src="script.js"></script>
</body>
</html>
```

```css
/* style.css - Antigravity Base */
:root {
    --primary: #2563eb;
    --secondary: #7c3aed;
    --accent: #f59e0b;
    --bg: #0f172a;
    --surface: rgba(30, 41, 59, 0.7);
    --text: #f8fafc;
}

/* Magnetic cursor styles */
.magnetic-cursor {
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

```javascript
// script.js - Antigravity Effects
class AntigravityWebsite {
    constructor() {
        this.initMagneticCursor();
        this.initSmoothScroll();
        this.init3DEffects();
    }
    
    initMagneticCursor() {
        const cursor = document.querySelector('.magnetic-cursor');
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX - 20,
                y: e.clientY - 20,
                duration: 0.3
            });
        });
        
        // Magnetic hover effects
        document.querySelectorAll('[data-strength]').forEach(el => {
            const strength = parseFloat(el.dataset.strength) || 0.5;
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });
    }
    
    initSmoothScroll() {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
    
    init3DEffects() {
        // Three.js scene for 3D elements
        if (document.querySelector('#three-container')) {
            // Initialize Three.js scene
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            // Add your 3D objects here
        }
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new AntigravityWebsite();
});
```

---

## **WORKFLOW CHECKLISTS**

### **Before Starting Any Website Build**

**✅ Pre-flight Checklist:**
1. [ ] Check Claude API credits status
2. [ ] Decide path: Claude Code vs Direct Coding
3. [ ] Clear `C:\dev\antigravity\[project-name]` if exists
4. [ ] Choose available port (8001-8010)
5. [ ] Note password (default: 197.86.222.24)

### **During Development**

**Claude Code Path:**
1. [ ] Burgundy writes prompt in queue
2. [ ] Daryl copies to Claude Code
3. [ ] Claude Code executes in antigravity
4. [ ] Burgundy tests locally
5. [ ] Burgundy deploys with localtunnel
6. [ ] Burgundy sends completion + URL

**Direct Coding Path:**
1. [ ] Burgundy announces "Switching to Reasoner"
2. [ ] Burgundy codes directly in antigravity
3. [ ] Burgundy tests iteratively
4. [ ] Burgundy deploys with localtunnel
5. [ ] Burgundy sends completion + URL

### **After Deployment**

**✅ Post-deployment Checklist:**
1. [ ] Test on mobile device
2. [ ] Check Lighthouse scores
3. [ ] Verify all animations work
4. [ ] Test form submissions (if any)
5. [ ] Update project documentation
6. [ ] Add to portfolio showcase

---

## **ERROR HANDLING & FALLBACKS**

### **Common Issues & Solutions**

**Issue 1: Claude Code API Rate Limited**
```
Solution: Switch to Direct Coding Path immediately
Message: "Claude API rate limited. Switching to direct antigravity coding."
```

**Issue 2: localtunnel Connection Failed**
```
Solution: Try different port or restart localtunnel
Command: npx localtunnel --port 8002 --subdomain myproject
```

**Issue 3: Three.js/Spline Compatibility**
```
Solution: Fall back to CSS/GSAP animations only
Message: "Spline asset too large, using particle background instead."
```

**Issue 4: Mobile Performance Issues**
```
Solution: Reduce particle count, simplify animations
Check: Use Chrome DevTools Performance tab
```

### **Graceful Degradation Rules**
1. **3D fails** → Use 2D CSS animations
2. **Magnetic cursor lags** → Reduce strength or disable on mobile
3. **Spline file too large** → Use Three.js basic geometry
4. **GSAP conflicts** → Use vanilla JavaScript animations
5. **localtunnel unstable** → Use ngrok or serveo as backup

---

## **PROJECT TRACKING SYSTEM**

### **Active Projects Log**
Create `C:\dev\antigravity\PROJECTS.md`:

```markdown
# ACTIVE PROJECTS

## [2026-03-29] Personal Portfolio v3
- **Path:** `C:\dev\antigravity\portfolio-v3\`
- **Port:** 8001
- **URL:** https://antigravity-portfolio.loca.lt
- **Status:** ✅ Live
- **Notes:** Magnetic cursor, horizontal scroll, 3D bridge

## [2026-03-28] Client Website - Tech Startup
- **Path:** `C:\dev\antigravity\client-tech\`
- **Port:** 8002  
- **URL:** https://tech-startup.loca.lt
- **Status:** ⏳ In progress
- **Notes:** Awaiting client feedback

## [2026-03-27] Landing Page Template
- **Path:** `C:\dev\antigravity\landing-template\`
- **Port:** 8003
- **URL:** https://landing-template.loca.lt
- **Status:** ✅ Complete
- **Notes:** Reusable template for future clients
```

---

## **PERFORMANCE OPTIMIZATION**

### **File Size Targets**
- HTML: < 50KB
- CSS: < 100KB (minified)
- JavaScript: < 200KB (minified)
- Images: < 500KB total (WebP format)
- 3D assets: < 5MB (or lazy load)

### **Loading Strategy**
1. **Critical CSS** in `<head>`
2. **Defer non-critical JavaScript**
3. **Lazy load images** below fold
4. **Preload key requests**
5. **Compress all assets** (Brotli/Gzip)

### **Animation Performance**
- Use `transform` and `opacity` only (GPU accelerated)
- Limit simultaneous animations to 3
- Reduce particle count on mobile (< 100)
- Use `will-change: transform` strategically

---

## **COMMUNICATION PROTOCOLS**

### **Status Messages (Standardized)**

**Starting a project:**
```
🏗️ Starting [Project Name] via [Claude Code/Direct Coding]
📁 Working in: C:\dev\antigravity\[folder]
🔧 Port: 800X | Password: [password]
```

**During development:**
```
⏳ Coding [feature]... (X% complete)
🔄 Testing on mobile...
🎨 Adding animations...
```

**Completion:**
```
✅ [Project Name] Complete!
🌐 Live at: https://[url].loca.lt
📱 Mobile tested: ✓
⚡ Performance: [Lighthouse score]
📁 Files: C:\dev\antigravity\[folder]
```

**Errors:**
```
⚠️ [Issue encountered]
🔄 Switching to fallback: [solution]
✅ Back on track...
```

### **Model Switching Announcements**
```
🤔 Complex task detected
🔄 Switching to DeepSeek Reasoner for planning
📝 Writing Claude Code prompt...
```

```
💰 Claude credits low/rate limited
🔄 Switching to direct antigravity coding
⚡ Building directly in C:\dev\antigravity
```

---

## **TRAINING & IMPROVEMENT**

### **Learn from Each Project**
After each website build:

1. **Document what worked:**
   - Which animations performed best?
   - What caused performance issues?
   - Which Claude Code prompts were most effective?

2. **Update component library:**
   - Add successful patterns to `C:\dev\antigravity\components\`
   - Create reusable snippets
   - Document best practices

3. **Optimize workflow:**
   - Reduce steps in process
   - Automate repetitive tasks
   - Improve prompt templates

### **Skill Development**
- **Burgundy:** Improve direct coding speed
- **Claude Code:** Better prompt engineering
- **Daryl:** Faster copy/paste workflow
- **System:** More reliable localtunnel alternatives

---

## **FINAL VISION**

This bridge creates a **resilient, multi-path website development system**:

1. **Primary Path:** Claude Code → Fast, high-quality production code
2. **Fallback Path:** Burgundy Direct → Reliable, always available
3. **Unified Output:** Always in `C:\dev\antigravity\`
4. **Consistent Quality:** Antigravity design principles applied
5. **Continuous Improvement:** Learn from each project

**The result:** Daryl gets websites built through the best available path at any given time, with consistent quality and antigravity aesthetics, regardless of API status or credits.

---

*Last Updated: 2026-03-29 | Version: 1.0*
*Maintainer: Burgundy | Integration: Claude Code + Antigravity*
