// Antigravity Workflow Test
class AntigravityTest {
    constructor() {
        this.initMagneticCursor();
        this.initSmoothScroll();
        this.initParallax();
        this.initHoverEffects();
    }
    
    initMagneticCursor() {
        const cursor = document.querySelector('.magnetic-cursor');
        
        // Track mouse position
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
                gsap.to(cursor, {
                    scale: 1 + strength,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    initSmoothScroll() {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: true
        });
        
        // RAF loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        // Update ScrollTrigger on scroll
        lenis.on('scroll', ScrollTrigger.update);
    }
    
    initParallax() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Parallax effects for elements with data-parallax
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || -50;
            
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
        
        // Hero text animation
        gsap.from('.hero h1', {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
        
        gsap.from('.hero p', {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.cta', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            ease: 'power3.out'
        });
    }
    
    initHoverEffects() {
        // Feature card hover effects
        document.querySelectorAll('.feature').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    duration: 0.3
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    boxShadow: 'none',
                    duration: 0.3
                });
            });
        });
        
        // CTA button hover
        const cta = document.querySelector('.cta');
        cta.addEventListener('mouseenter', () => {
            gsap.to(cta, {
                scale: 1.05,
                duration: 0.2
            });
        });
        
        cta.addEventListener('mouseleave', () => {
            gsap.to(cta, {
                scale: 1,
                duration: 0.2
            });
        });
        
        // CTA click animation
        cta.addEventListener('click', () => {
            gsap.to(cta, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
            
            // Scroll to deployment section
            const deployment = document.querySelector('.deployment');
            deployment.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new AntigravityTest();
    
    // Log initialization
    console.log('🚀 Antigravity Workflow Test Initialized');
    console.log('📁 Path: C:\\dev\\antigravity\\test-workflow');
    console.log('🌐 Ready for deployment');
});