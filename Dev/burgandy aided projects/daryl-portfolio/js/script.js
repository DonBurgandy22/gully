// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Simulate form submission
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // In a real implementation, you would send to Formspree or similar
            setTimeout(() => {
                alert('Thank you for your message! This is a demo form. In production, this would send to Formspree.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Smooth scrolling for anchor links (with Lenis support)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                if (typeof Lenis !== 'undefined' && window.lenisInstance) {
                    // Use Lenis for smooth scroll
                    window.lenisInstance.scrollTo(targetElement, {
                        offset: -80,
                        duration: 1.2
                    });
                } else {
                    // Fallback to native smooth scroll
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function highlightNavLink() {
        let scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Animation on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.project-card, .highlight-card, .skill-item').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .project-card,
        .highlight-card,
        .skill-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-menu a.active {
            color: var(--primary-blue);
        }
        
        .nav-menu a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Add 3D classes for enhanced effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('project-card-3d');
    });
    
    document.querySelectorAll('.skill-item').forEach(skill => {
        skill.classList.add('skill-item-3d');
    });
    
    document.querySelectorAll('.highlight-card').forEach(card => {
        card.classList.add('highlight-card');
    });
    
    // Add glass effect to hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('glass-effect');
    }
    
    // Anti-Gravity Effects
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Magnetic hover effect for buttons and cards
        const magneticElements = document.querySelectorAll('.btn-primary, .btn-nav, .project-card-3d');
        magneticElements.forEach(el => {
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
        
        // Parallax effect for hero background
        gsap.registerPlugin(ScrollTrigger);
        gsap.to('.hero-background-particles', {
            y: 100,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
        
        // Text reveal animation for section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Card stagger animation
        gsap.utils.toArray('.project-card-3d').forEach((card, i) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    end: 'bottom 10%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
    
    // Smooth scroll with Lenis
    if (typeof Lenis !== 'undefined') {
        window.lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });
        
        function raf(time) {
            window.lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
    
    console.log('Portfolio website JavaScript loaded successfully!');
});
/* ===== Enhanced Spline & Antigravity Interactions ===== */

// Advanced magnetic hover with physics simulation
function initMagneticPhysics() {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-nav, .project-card-3d, .skill-item-3d, .highlight-card');
    
    magneticElements.forEach(el => {
        let isActive = false;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        
        // Physics parameters
        const stiffness = 0.2;
        const damping = 0.5;
        const mass = 1;
        let velocityX = 0;
        let velocityY = 0;
        
        el.addEventListener('mousemove', (e) => {
            if (!isActive) isActive = true;
            
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate magnetic pull force based on mouse distance
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Stronger pull when closer
            const maxPull = 20;
            const pullStrength = Math.min(maxPull, 1000 / distance);
            
            targetX = (dx / distance) * pullStrength;
            targetY = (dy / distance) * pullStrength;
        });
        
        el.addEventListener('mouseleave', () => {
            isActive = false;
            targetX = 0;
            targetY = 0;
        });
        
        // Physics-based animation loop for each element
        function animateMagnetic() {
            if (!isActive && Math.abs(targetX) < 0.1 && Math.abs(targetY) < 0.1) {
                targetX = 0;
                targetY = 0;
            }
            
            // Spring physics calculation
            const forceX = (targetX - currentX) * stiffness;
            const forceY = (targetY - currentY) * stiffness;
            
            velocityX = (velocityX + forceX / mass) * damping;
            velocityY = (velocityY + forceY / mass) * damping;
            
            currentX += velocityX;
            currentY += velocityY;
            
            // Apply transform
            el.style.transform = 	ranslate(px, px);
            
            requestAnimationFrame(animateMagnetic);
        }
        
        animateMagnetic();
    });
}

// Scroll-triggered 3D parallax effect for sections
function initSectionParallax() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const depth = section.dataset.depth || 50;
        const speed = section.dataset.speed || 0.5;
        
        gsap.to(section, {
            y: () => -(window.scrollY * speed),
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

// Interactive particle system for hero section
function initInteractiveParticles() {
    if (typeof particlesJS !== 'undefined') {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        // Add particle interaction zone
        const interactionZone = document.createElement('div');
        interactionZone.className = 'particle-interaction-zone';
        interactionZone.style.cssText = 
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
            pointer-events: all;
        ;
        hero.appendChild(interactionZone);
        
        let mouseX = 0;
        let mouseY = 0;
        
        interactionZone.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update particle repulsion area
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                const pJS = window.pJSDom[0].pJS;
                if (pJS.interactivity.mouse) {
                    pJS.interactivity.mouse.x = mouseX;
                    pJS.interactivity.mouse.y = mouseY;
                }
            }
        });
        
        interactionZone.addEventListener('click', (e) => {
            // Create particle burst effect on click
            for (let i = 0; i < 10; i++) {
                const burst = document.createElement('div');
                burst.style.cssText = 
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(45deg, #2563eb, #8b5cf6);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 100;
                    left: px;
                    top: px;
                ;
                document.body.appendChild(burst);
                
                gsap.to(burst, {
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    opacity: 0,
                    scale: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                    onComplete: () => burst.remove()
                });
            }
        });
    }
}

// 3D card flip effect for project cards
function init3DCardFlip() {
    const projectCards = document.querySelectorAll('.project-card-3d');
    
    projectCards.forEach(card => {
        let isFlipped = false;
        
        card.addEventListener('click', () => {
            isFlipped = !isFlipped;
            
            gsap.to(card, {
                rotationY: isFlipped ? 180 : 0,
                duration: 0.8,
                ease: 'power3.inOut',
                transformStyle: 'preserve-3d'
            });
            
            // Show back content on flip
            const backContent = card.querySelector('.card-back');
            if (backContent) {
                gsap.to(backContent, {
                    rotationY: isFlipped ? 0 : -180,
                    opacity: isFlipped ? 1 : 0,
                    duration: 0.4,
                    delay: isFlipped ? 0.4 : 0
                });
            }
        });
    });
}

// Magnetic cursor with hover effects
function initMagneticCursor() {
    const cursor = document.querySelector('.cursor');
    const magneticElements = document.querySelectorAll('.magnetic');
    
    let mouse = { x: 0, y: 0 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // Update cursor position
    gsap.ticker.add(() => {
        gsap.set(cursor, {
            x: mouse.x,
            y: mouse.y
        });
    });
    
    magneticElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = el.dataset.strength ? parseInt(el.dataset.strength) : 20;

            gsap.to(el, {
                x: (x / rect.width) * strength,
                y: (y / rect.height) * strength,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

// Horizontal scroll with GSAP ScrollTrigger - Inspired by Antigravity
function initHorizontalScroll() {
    const horizontalSection = document.querySelector('.horizontal-scroll-section');
    if (!horizontalSection) return;
    
    const container = horizontalSection.querySelector('.horizontal-scroll-container');
    if (!container) return;
    
    // Calculate total width needed for scrolling
    const containerWidth = container.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = containerWidth - viewportWidth;
    
    // Create horizontal scroll animation
    gsap.to(container, {
        x: () => -scrollDistance,
        ease: 'none',
        scrollTrigger: {
            trigger: horizontalSection,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });
    
    // Add parallax effect to images
    gsap.utils.toArray('.horizontal-scroll-item img').forEach(img => {
        gsap.to(img, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5
            }
        });
    });
    
    // Add magnetic effect to scroll items
    gsap.utils.toArray('.horizontal-scroll-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
    
    console.log('Horizontal scroll gallery initialized');
}

// Initialize all enhanced effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for GSAP and Lenis to load
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            initMagneticCursor();
            initMagneticPhysics();
            initSectionParallax();
            initInteractiveParticles();
            init3DCardFlip();
            initHorizontalScroll();
            
            // Add floating animation to hero elements
            gsap.utils.toArray('.float-element').forEach(el => {
                gsap.to(el, {
                    y: 10,
                    rotation: 5,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
            
            console.log('Spline & Antigravity enhanced effects loaded!');
        }
    }, 1000);
});
