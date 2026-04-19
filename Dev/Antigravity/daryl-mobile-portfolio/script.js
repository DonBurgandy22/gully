// Mobile Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initThemeToggle();
    initProjects();
    initOfflineDetection();
    updateCurrentYear();
    initSmoothScrolling();
    initTouchGestures();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
        
        // Close menu on link click (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or prefer OS setting
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleText(currentTheme);
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleText(newTheme);
            
            // Add animation
            document.body.classList.add('theme-changing');
            setTimeout(() => document.body.classList.remove('theme-changing'), 300);
        });
    }
    
    // Listen for OS theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeToggleText(newTheme);
        }
    });
}

function updateThemeToggleText(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '🌞 Light Mode' : '🌓 Dark Mode';
    }
}

// Load Projects Dynamically
function initProjects() {
    const projects = [
        {
            title: "Reddit's Best YouTube",
            description: "AI-voiced Reddit stories channel with automated content pipeline",
            status: "active",
            tags: ["YouTube", "AI", "Automation"],
            icon: "🎬"
        },
        {
            title: "Tech/AI Channel",
            description: "Screen recording tutorials and AI tool demonstrations",
            status: "planning",
            tags: ["Tech", "Tutorials", "AI"],
            icon: "🤖"
        },
        {
            title: "Personal Development",
            description: "AI avatar talking head for personal growth content",
            status: "planning",
            tags: ["Personal Growth", "AI Avatar"],
            icon: "🚀"
        },
        {
            title: "Clipping Channel",
            description: "Podcast clips with commentary and analysis",
            status: "planning",
            tags: ["Podcasts", "Commentary"],
            icon: "🎙️"
        },
        {
            title: "Burgundy AI System",
            description: "24/7 personal AI life operating system",
            status: "active",
            tags: ["AI", "Automation", "System"],
            icon: "🦞"
        },
        {
            title: "Web Development",
            description: "Client websites and interactive portfolios",
            status: "active",
            tags: ["Web Dev", "Portfolio", "Design"],
            icon: "💻"
        }
    ];
    
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${project.icon}</div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-status ${project.status === 'active' ? 'status-active' : 'status-planning'}">
                ${project.status === 'active' ? 'Active' : 'Planning'}
            </div>
            <div class="project-tags" style="margin-top: 0.5rem; display: flex; gap: 0.25rem; flex-wrap: wrap;">
                ${project.tags.map(tag => `<span style="background: var(--border); padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem;">${tag}</span>`).join('')}
            </div>
        `;
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        projectsGrid.appendChild(card);
    });
}

// Offline Detection
function initOfflineDetection() {
    const offlineStatus = document.getElementById('offline-status');
    
    function updateOnlineStatus() {
        if (offlineStatus) {
            const isOnline = navigator.onLine;
            offlineStatus.textContent = isOnline ? '📶 Online' : '📶 Offline';
            offlineStatus.classList.toggle('offline', !isOnline);
            
            // Show notification
            if (!isOnline) {
                showNotification('You are offline. Some features may be limited.');
            } else {
                showNotification('Back online! All features restored.');
            }
        }
    }
    
    // Initial check
    updateOnlineStatus();
    
    // Listen for changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Show Notification
function showNotification(message) {
    // Check if notification already exists
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--surface);
            color: var(--text);
            padding: 1rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            border-left: 4px solid var(--primary-color);
            z-index: 1001;
            max-width: 300px;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Update Current Year
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.mobile-nav').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Touch Gestures for Mobile
function initTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Horizontal swipe (min 50px)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - could be used for navigation
                console.log('Swiped left');
            } else {
                // Swipe right - could be used for navigation
                console.log('Swiped right');
            }
        }
    });
    
    // Double tap to toggle theme
    let lastTap = 0;
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
        lastTap = currentTime;
    });
}

// Performance Monitoring
function monitorPerformance() {
    if ('performance' in window) {
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
            console.log('Page loaded in:', navTiming.loadEventEnd - navTiming.startTime, 'ms');
            
            // Show loading time in console for optimization
            if (navTiming.loadEventEnd - navTiming.startTime > 3000) {
                console.warn('Page load time exceeds 3 seconds. Consider optimizing.');
            }
        }
    }
}

// Initialize performance monitoring
window.addEventListener('load', monitorPerformance);

// Service Worker Registration (already in HTML, but backup)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope:', registration.scope);
        }).catch(function(error) {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// Add some interactive animations
document.querySelectorAll('.project-card, .contact-btn, .btn').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.2s ease';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Add loading state for buttons
document.querySelectorAll('a[href^="http"], a[href^="mailto"], a[href^="tel"]').forEach(link => {
    link.addEventListener('click', function() {
        this.classList.add('loading');
        setTimeout(() => this.classList.remove('loading'), 1000);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.click();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.textContent = '☰';
        }
    }
});

// Add vibration feedback for mobile (if supported)
if ('vibrate' in navigator) {
    document.querySelectorAll('.contact-btn, .btn').forEach(button => {
        button.addEventListener('touchstart', function() {
            navigator.vibrate(50); // 50ms vibration
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Daryl Mobile Portfolio initialized successfully!');
    
    // Check if PWA is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running as PWA');
        document.body.classList.add('pwa-mode');
    }
});