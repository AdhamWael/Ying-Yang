// ===================================
// LENIS SMOOTH SCROLL INITIALIZATION
// ===================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP ScrollTrigger integration with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ===================================
// GSAP SCROLL ANIMATIONS
// ===================================
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero elements fade-up animations
document.querySelectorAll('[data-gsap="fade-up"]').forEach((element, index) => {
    const delay = parseFloat(element.getAttribute('data-delay')) || 0;
    
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        delay: delay,
        ease: 'power3.out'
    });
});

// Fade left animations
document.querySelectorAll('[data-gsap="fade-left"]').forEach((element) => {
    const delay = parseFloat(element.getAttribute('data-delay')) || 0;
    
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
        },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: delay,
        ease: 'power3.out'
    });
});

// Fade right animations
document.querySelectorAll('[data-gsap="fade-right"]').forEach((element) => {
    const delay = parseFloat(element.getAttribute('data-delay')) || 0;
    
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
        },
        x: -100,
        opacity: 0,
        duration: 1,
        delay: delay,
        ease: 'power3.out'
    });
});

// Concept part animations
document.querySelectorAll('.concept-part').forEach((part, index) => {
    gsap.from(part, {
        scrollTrigger: {
            trigger: part,
            start: 'top 70%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Achievement cards stagger animation
const achievementCards = document.querySelectorAll('.achievement-card');
if (achievementCards.length > 0) {
    gsap.from(achievementCards, {
        scrollTrigger: {
            trigger: '.achievements-grid',
            start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)'
    });
}

// Challenge cards animation
const challengeCards = document.querySelectorAll('.challenge-card');
if (challengeCards.length > 0) {
    gsap.from(challengeCards, {
        scrollTrigger: {
            trigger: '.challenges-grid',
            start: 'top 75%',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out'
    });
}

// ===================================
// THREE.JS 3D MODEL VIEWER
// ===================================
let scene, camera, renderer, yinYangModel, controls;
let currentViewMode = 'model';
const container = document.getElementById('threejs-container');

if (container && typeof THREE !== 'undefined') {
    initThreeJS();
    animate3D();
}

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // Light gray background to see black/white contrast
    // Remove fog for clarity
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 20, 35);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 15;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI / 2;
    }
    
    // Lights - Omnidirectional setup for no blind spots
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    
    // Top light (key light from above)
    const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
    topLight.position.set(0, 40, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 0.5;
    topLight.shadow.camera.far = 100;
    topLight.shadow.camera.left = -30;
    topLight.shadow.camera.right = 30;
    topLight.shadow.camera.top = 30;
    topLight.shadow.camera.bottom = -30;
    scene.add(topLight);
    
    // Front light
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 20, 40);
    scene.add(frontLight);
    
    // Back light
    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 20, -40);
    scene.add(backLight);
    
    // Left light
    const leftLight = new THREE.DirectionalLight(0xffffff, 0.8);
    leftLight.position.set(-40, 20, 0);
    scene.add(leftLight);
    
    // Right light
    const rightLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rightLight.position.set(40, 20, 0);
    scene.add(rightLight);
    
    // Bottom light (to eliminate shadows underneath)
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.6);
    bottomLight.position.set(0, -20, 0);
    scene.add(bottomLight);
    
    // Four corner lights for complete coverage
    const cornerLight1 = new THREE.PointLight(0xffffff, 0.5, 100);
    cornerLight1.position.set(30, 25, 30);
    scene.add(cornerLight1);
    
    const cornerLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
    cornerLight2.position.set(-30, 25, 30);
    scene.add(cornerLight2);
    
    const cornerLight3 = new THREE.PointLight(0xffffff, 0.5, 100);
    cornerLight3.position.set(30, 25, -30);
    scene.add(cornerLight3);
    
    const cornerLight4 = new THREE.PointLight(0xffffff, 0.5, 100);
    cornerLight4.position.set(-30, 25, -30);
    scene.add(cornerLight4);
    
    // Hemisphere light for natural sky/ground lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.6);
    scene.add(hemiLight);
    
    // Try to load .stl file
    loadSTLModel();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (container && camera && renderer) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}


function loadSTLModel() {
    // Load STL file only
    if (typeof THREE.STLLoader !== 'undefined') {
        const stlLoader = new THREE.STLLoader();
        stlLoader.load(
            '3d-design.stl',
            (geometry) => {
                // Calculate geometry center for proper coloring
                geometry.computeBoundingBox();
                const center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                
                // Create a group to hold both black and white parts
                yinYangModel = new THREE.Group();
                
                // Black material for yin side
                const blackMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    metalness: 0.3,
                    roughness: 0.4,
                    emissive: 0x111111,
                    emissiveIntensity: 0.1,
                });
                
                // White material for yang side
                const whiteMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    metalness: 0.3,
                    roughness: 0.4,
                    emissive: 0xeeeeee,
                    emissiveIntensity: 0.05,
                });
                
                // For yin-yang pattern, we'll use vertex colors or split geometry
                // Since STL doesn't have color data, we'll apply a gradient based on position
                const mesh = new THREE.Mesh(geometry, [
                    blackMaterial,
                    whiteMaterial
                ]);
                
                // Alternative: Single material with custom shader for yin-yang pattern
                const yinYangMaterial = new THREE.MeshStandardMaterial({
                    color: 0x888888,
                    metalness: 0.3,
                    roughness: 0.4,
                    vertexColors: false,
                });
                
                // Create mesh with standard black/white material
                const poolMesh = new THREE.Mesh(geometry, yinYangMaterial);
                poolMesh.material.color.setHex(0x000000); // Start with black, you can manually adjust
                
                poolMesh.scale.set(0.1, 0.1, 0.1);
                poolMesh.rotation.x = -Math.PI / 5;
                poolMesh.castShadow = true;
                poolMesh.receiveShadow = true;
                
                yinYangModel.add(poolMesh);
                yinYangModel.userData.mainMesh = poolMesh;
                
                scene.add(yinYangModel);
                console.log('✅ STL model loaded successfully!');
                console.log('ℹ️ Model colored in grayscale - adjust manually for yin-yang pattern');
            },
            (progress) => {
                const percentComplete = (progress.loaded / progress.total) * 100;
                console.log(`Loading STL: ${percentComplete.toFixed(0)}%`);
            },
            (error) => {
                console.error('❌ Error loading STL file:', error);
                console.log('Please make sure "3d-design.stl" is in the same folder as enhanced.html');
            }
        );
    } else {
        console.error('❌ STLLoader not available');
    }
}


function animate3D() {
    requestAnimationFrame(animate3D);
    
    if (controls) {
        controls.update();
    }
    
    // Gentle rotation when not interacting
    if (yinYangModel && !controls?.isUserInteracting) {
        yinYangModel.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// View control buttons
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const view = this.getAttribute('data-view');
        changeView(view);
    });
});

function changeView(view) {
    currentViewMode = view;
    
    if (!camera || !yinYangModel) return;
    
    gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        ...getViewPosition(view),
        onUpdate: () => {
            camera.lookAt(0, 0, 0);
        }
    });
    
    // Update materials based on view
    if (view === 'wireframe') {
        yinYangModel.traverse((child) => {
            if (child.isMesh) {
                child.material.wireframe = true;
            }
        });
    } else {
        yinYangModel.traverse((child) => {
            if (child.isMesh) {
                child.material.wireframe = false;
            }
        });
    }
}

function getViewPosition(view) {
    switch(view) {
        case 'model':
        case 'equations':
            return { x: 0, y: 20, z: 35 };
        case 'wireframe':
            return { x: 25, y: 25, z: 25 };
        case 'top':
            return { x: 0, y: 40, z: 0.1 };
        case 'side':
            return { x: 35, y: 10, z: 0 };
        default:
            return { x: 0, y: 20, z: 35 };
    }
}

// ===================================
// EQUATION CANVAS ANIMATIONS
// ===================================
document.querySelectorAll('.eq-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const type = canvas.getAttribute('data-type');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    drawEquation(ctx, type, canvas.width, canvas.height);
    
    // Animate on scroll
    gsap.from(canvas, {
        scrollTrigger: {
            trigger: canvas,
            start: 'top 80%',
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
});

function drawEquation(ctx, type, width, height) {
    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.strokeStyle = '#4d9fff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch(type) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(centerX, centerY, 96, 0, Math.PI * 2); // radius = 12 * 8 scale
            ctx.stroke();
            break;
            
        case 'sine':
            ctx.beginPath();
            for (let y = -100; y <= 100; y += 2) {
                const x = 30 * Math.sin(y / 40);
                const canvasX = centerX + x;
                const canvasY = centerY - y;
                if (y === -100) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            }
            ctx.stroke();
            break;
            
        case 'smallcircle':
            ctx.beginPath();
            ctx.arc(centerX - 30, centerY - 56, 20, 0, Math.PI * 2); // (-3, 7) position adjusted
            ctx.fillStyle = 'rgba(77, 159, 255, 0.3)';
            ctx.fill();
            ctx.stroke();
            break;
            
        case 'composite':
            const scale = 8; // Scale factor for visualization
            
            // First, fill the composite region with BLUE highlighting
            ctx.fillStyle = 'rgba(77, 159, 255, 0.3)'; // Blue highlight
            
            // Draw the region pixel by pixel to check constraints
            for (let px = 0; px < width; px++) {
                for (let py = 0; py < height; py++) {
                    // Convert canvas coordinates to mathematical coordinates
                    const x = (px - centerX) / scale;
                    const y = (centerY - py) / scale;
                    
                    // Check all constraints for composite region:
                    // 1. Inside outer circle: x² + y² ≤ 144
                    const inOuterCircle = (x * x + y * y) <= 144;
                    
                    // 2. Right side of S-curve: x ≥ 3sin(y/4)
                    const rightOfCurve = x >= 3 * Math.sin(y / 4);
                    
                    // 3. Outside small circle: (x-3)² + (y+7)² ≥ 4
                    const outsideSmallCircle = ((x - 3) * (x - 3) + (y + 7) * (y + 7)) >= 4;
                    
                    // If all constraints are satisfied, fill the pixel
                    if (inOuterCircle && rightOfCurve && outsideSmallCircle) {
                        ctx.fillRect(px, py, 1, 1);
                    }
                }
            }
            
            // Draw boundary lines on top
            // Outer circle
            ctx.strokeStyle = '#4d9fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 96, 0, Math.PI * 2); // radius = 12 * 8
            ctx.stroke();
            
            // S-curve (blue)
            ctx.strokeStyle = '#0066cc';
            ctx.lineWidth = 4;
            ctx.beginPath();
            for (let y = -96; y <= 96; y += 2) { // -12 to 12 scaled by 8
                const x = 24 * Math.sin(y / 32); // 3 * 8 * sin(y / (4*8))
                if (y === -96) {
                    ctx.moveTo(centerX + x, centerY - y);
                } else {
                    ctx.lineTo(centerX + x, centerY - y);
                }
            }
            ctx.stroke();
            
            // Small circle (excluded region) - BLUE at (3, -7)
            ctx.strokeStyle = '#4d9fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX + 24, centerY + 56, 16, 0, Math.PI * 2); // (3*8, -7*8)
            ctx.stroke();
            break;
    }
}

// ===================================
// CONCEPT CANVAS ANIMATIONS
// ===================================

// Inspiration Canvas - Yin Yang with Philosophy
const inspirationCanvas = document.getElementById('inspirationCanvas');
if (inspirationCanvas) {
    const ctx = inspirationCanvas.getContext('2d');
    inspirationCanvas.width = inspirationCanvas.offsetWidth;
    inspirationCanvas.height = 400;
    
    let rotation = 0;
    
    function drawInspiration() {
        const w = inspirationCanvas.width;
        const h = inspirationCanvas.height;
        const r = 120;
        
        ctx.clearRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.rotate(rotation);
        
        // Yin Yang
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI/2, Math.PI*1.5);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, -r/2, r/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, r/2, r/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, -r/2, r/6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, r/2, r/6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        rotation += 0.005;
        requestAnimationFrame(drawInspiration);
    }
    
    drawInspiration();
}

// Modeling Canvas - Equations Visualization
const modelingCanvas = document.getElementById('modelingCanvas');
if (modelingCanvas) {
    const ctx = modelingCanvas.getContext('2d');
    modelingCanvas.width = modelingCanvas.offsetWidth;
    modelingCanvas.height = 400;
    
    function drawModeling() {
        const w = modelingCanvas.width;
        const h = modelingCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = 120; // radius for x²+y²=144 (12 units * 10 scale)
        
        ctx.clearRect(0, 0, w, h);
        
        // Grid background
        ctx.strokeStyle = 'rgba(0, 102, 204, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // Outer circle (x²+y²=144)
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        
        // S-curve
        ctx.strokeStyle = '#4d9fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let y = -r; y <= r; y += 2) {
            const x = 30 * Math.sin(y / 40); // 3 * 10 * sin(y / (4 * 10))
            const px = cx + x;
            const py = cy - y;
            if (y === -r) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
        
        // Small circles (updated to (-3, 7) and (3, -7))
        ctx.fillStyle = 'rgba(0, 102, 204, 0.3)';
        // Yang dot at (-3, 7)
        ctx.beginPath();
        ctx.arc(cx - 30, cy - 70, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0066cc';
        ctx.stroke();
        
        // Yin dot at (3, -7)
        ctx.beginPath();
        ctx.arc(cx + 30, cy + 70, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    
    drawModeling();
}

// 3D Translation Canvas - Blender/Project themed
const translationCanvas = document.getElementById('translationCanvas');
if (translationCanvas) {
    const ctx = translationCanvas.getContext('2d');
    translationCanvas.width = translationCanvas.offsetWidth;
    translationCanvas.height = 400;
    
    let angle = 0;
    
    function draw3DTranslation() {
        const w = translationCanvas.width;
        const h = translationCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        
        // Dark theme background like Blender
        ctx.fillStyle = '#2b2b2b';
        ctx.fillRect(0, 0, w, h);
        
        // Grid (like Blender viewport)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // 3D Axes (RGB = XYZ)
        const axisLength = 60;
        
        // X-axis (Red)
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + axisLength, cy);
        ctx.stroke();
        
        // Y-axis (Green)
        ctx.strokeStyle = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - axisLength);
        ctx.stroke();
        
        // Z-axis (Blue)
        ctx.strokeStyle = '#0066cc';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - axisLength * 0.5, cy + axisLength * 0.5);
        ctx.stroke();
        
        // Rotating yin-yang wireframe model
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        
        // Outer circle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.stroke();
        
        // S-curve
        ctx.strokeStyle = '#4d9fff';
        ctx.beginPath();
        for (let y = -80; y <= 80; y += 2) {
            const x = 25 * Math.sin(y / 35);
            if (y === -80) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Small circles
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -40, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 40, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
        
        // Blender-style info text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText('Blender 3D Model', 10, 20);
        ctx.fillText('Vertices: 1024 | Faces: 2048', 10, 35);
        
        angle += 0.01;
        requestAnimationFrame(draw3DTranslation);
    }
    
    draw3DTranslation();
}

// Resize handler for concept canvases
window.addEventListener('resize', () => {
    if (inspirationCanvas) {
        inspirationCanvas.width = inspirationCanvas.offsetWidth;
    }
    if (modelingCanvas) {
        modelingCanvas.width = modelingCanvas.offsetWidth;
        const ctx = modelingCanvas.getContext('2d');
        modelingCanvas.height = 400;
        
        const w = modelingCanvas.width;
        const h = modelingCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = 120;
        
        ctx.clearRect(0, 0, w, h);
        
        // Grid background
        ctx.strokeStyle = 'rgba(0, 102, 204, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // Outer circle
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        
        // S-curve
        ctx.strokeStyle = '#4d9fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let y = -r; y <= r; y += 2) {
            const x = 30 * Math.sin(y / 40);
            const px = cx + x;
            const py = cy - y;
            if (y === -r) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
        
        // Small circles
        ctx.fillStyle = 'rgba(0, 102, 204, 0.3)';
        ctx.beginPath();
        ctx.arc(cx - 40, cy - 50, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0066cc';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(cx + 40, cy + 50, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    if (translationCanvas) {
        translationCanvas.width = translationCanvas.offsetWidth;
    }
});

// ===================================
// HERO CANVAS PARTICLES
// ===================================
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * heroCanvas.width;
            this.y = Math.random() * heroCanvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > heroCanvas.width || this.x < 0 || 
                this.y > heroCanvas.height || this.y < 0) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(77, 159, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateHero() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect nearby particles
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(77, 159, 255, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateHero);
    }
    
    animateHero();
    
    window.addEventListener('resize', () => {
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = window.innerHeight;
    });
}

// ===================================
// CALCULATOR - Fixed Model to Real Scale
// ===================================
// Model dimensions: 13.5cm radius, 8.5cm depth
// Real pool dimensions: 27m radius, 17m depth
const MODEL_RADIUS = 13.5; // model radius in cm
const MODEL_DEPTH = 8.5; // model depth in cm
const SCALE_RATIO = 200; // 1:200 scale (1cm model = 200cm = 2m real)

function calculateRealPool() {
    // Model calculations
    const modelRadius = MODEL_RADIUS; // cm
    const modelDepth = MODEL_DEPTH; // cm
    const modelArea = Math.PI * modelRadius * modelRadius; // πr² = π × 13.5² = 572.56 cm²
    const modelYinArea = modelArea / 2; // Half of total area for yin
    const modelYangArea = modelArea / 2; // Half of total area for yang
    const modelVolume = modelArea * modelDepth; // 572.56 × 8.5 = 4,866.76 cm³
    
    // Real world calculations using 1:200 scale
    // For area: scale² (200² = 40,000)
    // For volume: scale³ (200³ = 8,000,000)
    const realRadius = modelRadius * SCALE_RATIO / 100; // cm to m: 13.5 × 200 ÷ 100 = 27 m
    const realDepth = modelDepth * SCALE_RATIO / 100; // cm to m: 8.5 × 200 ÷ 100 = 17 m
    const realArea = modelArea * SCALE_RATIO * SCALE_RATIO / 10000; // cm² to m²: 572.56 × 40000 ÷ 10000 = 2,290.24 m²
    const realYinArea = realArea / 2; // Half of total area for yin
    const realYangArea = realArea / 2; // Half of total area for yang
    const realVolume = modelVolume * SCALE_RATIO * SCALE_RATIO * SCALE_RATIO / 1000000; // cm³ to m³: 4,866.76 × 8000000 ÷ 1000000 = 38,934.08 m³
    const realLiters = realVolume * 1000; // 1 cubic meter = 1000 liters
    
    // Update displays with animations
    animateValue('modelRadius', modelRadius.toFixed(1) + ' cm');
    animateValue('modelDepth', modelDepth.toFixed(1) + ' cm');
    animateValue('modelArea', modelArea.toFixed(2) + ' cm²');
    animateValue('modelYinArea', modelYinArea.toFixed(2) + ' cm²');
    animateValue('modelYangArea', modelYangArea.toFixed(2) + ' cm²');
    animateValue('modelVolume', modelVolume.toLocaleString('en-US', {maximumFractionDigits: 0}) + ' cm³');
    animateValue('realRadius', realRadius.toFixed(0) + ' m');
    animateValue('realDepth', realDepth.toFixed(0) + ' m');
    animateValue('realArea', realArea.toFixed(2) + ' m²');
    animateValue('realYinYangArea', realYinArea.toFixed(2) + ' m²');
    animateValue('realVolume', realVolume.toLocaleString('en-US', {maximumFractionDigits: 0}) + ' m³');
    animateValue('realLiters', realLiters.toLocaleString('en-US', {maximumFractionDigits: 0}) + ' L');
}

function animateValue(id, newValue) {
    const element = document.getElementById(id);
    if (element) {
        gsap.to(element, {
            innerHTML: newValue,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: function() {
                element.textContent = newValue;
            }
        });
    }
}

// Initialize calculator on load
window.addEventListener('load', () => {
    calculateRealPool();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -100 });
        }
    });
});

console.log('✨ Enhanced with GSAP, Three.js, and Lenis!');
console.log('🎯 Place your "3d-design.stl" file in: C:\\Users\\w.i\\Desktop\\WEB\\');
console.log('📦 STL file should be exported from your Blender model');
