// Three.js 3D Bridge Scene for Portfolio Hero Section - Enhanced with Spline/Antigravity Principles
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('bridgeCanvas');
    if (!container) return;
    
    // Mobile detection for performance optimization
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    const shouldReduceGraphics = isMobile || window.innerWidth < 768;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 2, 8);
    
    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, shouldReduceGraphics ? 1 : 2));
    renderer.shadowMap.enabled = !shouldReduceGraphics;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = !shouldReduceGraphics;
    if (!shouldReduceGraphics) {
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
    }
    scene.add(directionalLight);
    
    // Add hemisphere light for more natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0x2563eb, 0x0ea5e9, 0.3);
    scene.add(hemisphereLight);
    
    // Create bridge structure with enhanced details
    function createBridge() {
        const bridgeGroup = new THREE.Group();
        
        // Bridge deck with glass-like material
        const deckGeometry = new THREE.BoxGeometry(6, 0.15, 2);
        const deckMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x2563eb,
            transmission: 0.2, // Glass effect
            roughness: 0.1,
            metalness: 0.3,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const deck = new THREE.Mesh(deckGeometry, deckMaterial);
        deck.castShadow = !shouldReduceGraphics;
        deck.receiveShadow = !shouldReduceGraphics;
        bridgeGroup.add(deck);
        
        // Bridge pillars (supports) with metallic material
        const pillarGeometry = new THREE.CylinderGeometry(0.12, 0.18, 2, 12);
        const pillarMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x0ea5e9,
            roughness: 0.3,
            metalness: 0.8,
            clearcoat: 0.5,
            clearcoatRoughness: 0.1
        });
        
        // Create four pillars
        const pillarPositions = [
            [-2, -1, 0.8],
            [-2, -1, -0.8],
            [2, -1, 0.8],
            [2, -1, -0.8]
        ];
        
        pillarPositions.forEach(pos => {
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(pos[0], pos[1], pos[2]);
            pillar.castShadow = !shouldReduceGraphics;
            bridgeGroup.add(pillar);
        });
        
        // Bridge cables (wireframe) with tension animation
        const cableMaterial = new THREE.LineBasicMaterial({ 
            color: 0x8b5cf6,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });
        
        // Create cables from pillars to deck with physics simulation
        const cablePoints = [];
        cablePoints.push(new THREE.Vector3(-2, 0.5, 0.8));
        cablePoints.push(new THREE.Vector3(0, 1.5, 0));
        cablePoints.push(new THREE.Vector3(2, 0.5, 0.8));
        
        const cableGeometry = new THREE.BufferGeometry().setFromPoints(cablePoints);
        const cable = new THREE.Line(cableGeometry, cableMaterial);
        cable.castShadow = !shouldReduceGraphics;
        bridgeGroup.add(cable);
        
        // Second cable on other side
        const cablePoints2 = [];
        cablePoints2.push(new THREE.Vector3(-2, 0.5, -0.8));
        cablePoints2.push(new THREE.Vector3(0, 1.5, 0));
        cablePoints2.push(new THREE.Vector3(2, 0.5, -0.8));
        
        const cableGeometry2 = new THREE.BufferGeometry().setFromPoints(cablePoints2);
        const cable2 = new THREE.Line(cableGeometry2, cableMaterial);
        cable2.castShadow = !shouldReduceGraphics;
        bridgeGroup.add(cable2);
        
        // Add wireframe to deck for engineering look
        const wireframeGeometry = new THREE.WireframeGeometry(deckGeometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ 
            color: 0x1d4ed8,
            linewidth: 2,
            transparent: true,
            opacity: 0.6
        });
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        deck.add(wireframe);
        
        // Add small architectural details - cross beams
        const beamGeometry = new THREE.BoxGeometry(0.08, 0.08, 1.8);
        const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
        
        for (let i = -2.5; i <= 2.5; i += 1.25) {
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            beam.position.set(i, -0.9, 0);
            beam.rotation.z = Math.PI / 4;
            bridgeGroup.add(beam);
        }
        
        // Interactive elements array for hover effects
        bridgeGroup.userData = {
            interactiveElements: [deck, ...bridgeGroup.children.filter(child => child.type === 'Mesh')],
            originalPositions: [],
            hoverIntensity: 0
        };
        
        return bridgeGroup;
    }
    
    const bridge = createBridge();
    scene.add(bridge);
    
    // Raycaster for mouse interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObject = null;
    
    // Animation variables
    let time = 0;
    const rotationSpeed = 0.2;
    let cameraTarget = new THREE.Vector3(0, 0, 0);
    let cameraAngle = 0;
    
    // Mouse move interaction
    function onMouseMove(event) {
        if (shouldReduceGraphics) return;
        
        // Calculate mouse position in normalized device coordinates
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update camera angle based on mouse position
        cameraAngle = mouse.x * 0.5;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(bridge.userData.interactiveElements);
        
        if (intersects.length > 0) {
            if (hoveredObject !== intersects[0].object) {
                // Reset previous hovered object
                if (hoveredObject) {
                    gsap.to(hoveredObject.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
                
                // Set new hovered object
                hoveredObject = intersects[0].object;
                gsap.to(hoveredObject.scale, {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.5)'
                });
                
                // Change material color on hover
                if (hoveredObject.material) {
                    const originalColor = hoveredObject.material.color.getHex();
                    gsap.to(hoveredObject.material, {
                        color: new THREE.Color(0xfbbf24), // Yellow highlight
                        duration: 0.2,
                        onComplete: () => {
                            gsap.to(hoveredObject.material, {
                                color: new THREE.Color(originalColor),
                                duration: 0.5,
                                delay: 0.2
                            });
                        }
                    });
                }
            }
        } else if (hoveredObject) {
            // No intersection, reset hovered object
            gsap.to(hoveredObject.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            hoveredObject = null;
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.01;
        
        // Gentle rotation with mouse influence
        bridge.rotation.x = Math.sin(time * 0.3) * 0.05;
        bridge.rotation.y += (cameraAngle - bridge.rotation.y) * 0.05;
        
        // Subtle floating animation with physics-like motion
        bridge.position.y = Math.sin(time * 0.8) * 0.1 + Math.sin(time * 0.4) * 0.05;
        
        // Cable tension animation
        const cableTension = Math.sin(time * 1.5) * 0.03;
        if (bridge.children[5] && bridge.children[5].geometry) { // First cable
            const positions = bridge.children[5].geometry.attributes.position;
            if (positions) {
                positions.setY(1, positions.getY(1) + cableTension);
                positions.needsUpdate = true;
            }
        }
        
        if (bridge.children[6] && bridge.children[6].geometry) { // Second cable
            const positions = bridge.children[6].geometry.attributes.position;
            if (positions) {
                positions.setY(1, positions.getY(1) + cableTension);
                positions.needsUpdate = true;
            }
        }
        
        // Camera orbiting animation
        camera.position.x = Math.sin(time * 0.1) * 1.5;
        camera.position.z = 8 + Math.cos(time * 0.1) * 0.5;
        camera.lookAt(cameraTarget);
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function handleResize() {
        const width = Math.min(400, container.clientWidth);
        const height = width;
        
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', onMouseMove);
    handleResize();
    
    // Start animation
    animate();
    
    // Enhanced particles background with mobile optimization
    if (typeof particlesJS !== 'undefined') {
        const particleCount = shouldReduceGraphics ? 20 : 50;
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: particleCount, 
                    density: { 
                        enable: true, 
                        value_area: 1000 
                    } 
                },
                color: { 
                    value: ["#2563eb", "#0ea5e9", "#8b5cf6"] 
                },
                shape: { 
                    type: shouldReduceGraphics ? "circle" : ["circle", "triangle", "polygon"],
                    polygon: { nb_sides: 5 }
                },
                opacity: { 
                    value: 0.4, 
                    random: true,
                    anim: { 
                        enable: !shouldReduceGraphics, 
                        speed: 1, 
                        opacity_min: 0.1 
                    }
                },
                size: { 
                    value: 4, 
                    random: true,
                    anim: { 
                        enable: !shouldReduceGraphics, 
                        speed: 2, 
                        size_min: 1 
                    }
                },
                line_linked: {
                    enable: !shouldReduceGraphics,
                    distance: 180,
                    color: "#0ea5e9",
                    opacity: 0.3,
                    width: 1.5,
                    shadow: {
                        enable: !shouldReduceGraphics,
                        blur: 5,
                        color: "#3b82f6"
                    }
                },
                move: {
                    enable: true,
                    speed: shouldReduceGraphics ? 0.8 : 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { 
                        enable: !shouldReduceGraphics, 
                        rotateX: 600, 
                        rotateY: 1200 
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { 
                        enable: !shouldReduceGraphics, 
                        mode: "grab",
                        parallax: { enable: !shouldReduceGraphics, force: 60, smooth: 10 }
                    },
                    onclick: { 
                        enable: true, 
                        mode: "push",
                        push: { particles_nb: 4 }
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
    
    // Scroll-controlled bridge rotation with enhanced physics (Spline-like interaction)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                // Enhanced scroll-controlled rotation with easing
                bridge.rotation.y = self.progress * Math.PI;
                bridge.position.x = Math.sin(self.progress * Math.PI * 2) * 1;
                bridge.position.z = Math.cos(self.progress * Math.PI) * 0.3;
                
                // Adjust camera based on scroll with smooth transitions
                camera.position.z = 8 - self.progress * 3;
                camera.position.y = 2 + Math.sin(self.progress * Math.PI) * 1;
                cameraTarget.y = self.progress * 0.5;
                
                // Bridge scale effect on scroll
                const scale = 1 + Math.sin(self.progress * Math.PI) * 0.1;
                bridge.scale.set(scale, scale, scale);
                
                // Material opacity changes with scroll
                bridge.traverse((child) => {
                    if (child.material && child.material.opacity !== undefined) {
                        const targetOpacity = 0.8 + Math.sin(self.progress * Math.PI) * 0.2;
                        gsap.to(child.material, {
                            opacity: targetOpacity,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
    }
    
    // Add click interaction for bridge
    container.addEventListener('click', function(event) {
        if (!hoveredObject || shouldReduceGraphics) return;
        
        // Animate clicked element with physics-like bounce
        gsap.to(hoveredObject.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        
        // Create particle effect at click position
        if (typeof gsap !== 'undefined') {
            const rect = container.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(45deg, #2563eb, #8b5cf6);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 100;
                    left: ${x}px;
                    top: ${y}px;
                `;
                container.appendChild(particle);
                
                gsap.to(particle, {
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                    opacity: 0,
                    scale: 0,
                    duration: 1,
                    ease: 'power2.out',
                    onComplete: () => particle.remove()
                });
            }
        }
    });
});