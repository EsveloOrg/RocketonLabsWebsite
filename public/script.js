// Noise Canvas
const noiseCanvas = document.getElementById('noise-canvas');
const noiseCtx = noiseCanvas.getContext('2d', { willReadFrequently: true });

// Gradient Canvas
const gradientCanvas = document.getElementById('gradient-canvas');
const gradientCtx = gradientCanvas.getContext('2d');

// Mouse tracking
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = mouseX;
let targetY = mouseY;

// Gradient blobs
const blobs = [
    { x: 0, y: 0, targetX: 0, targetY: 0, offsetX: 0, offsetY: 0, size: 400, opacity: 0.25 },
    { x: 0, y: 0, targetX: 0, targetY: 0, offsetX: 150, offsetY: -100, size: 350, opacity: 0.2 },
    { x: 0, y: 0, targetX: 0, targetY: 0, offsetX: -120, offsetY: 80, size: 300, opacity: 0.15 }
];

// Initialize blob positions
blobs.forEach(blob => {
    blob.x = window.innerWidth / 2 + blob.offsetX;
    blob.y = window.innerHeight / 2 + blob.offsetY;
    blob.targetX = blob.x;
    blob.targetY = blob.y;
});

// Resize handler
function resize() {
    noiseCanvas.width = window.innerWidth;
    noiseCanvas.height = window.innerHeight;
    gradientCanvas.width = window.innerWidth;
    gradientCanvas.height = window.innerHeight;
}

// Noise generation
function generateNoise() {
    const imageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 25;
    }

    noiseCtx.putImageData(imageData, 0, 0);
}

// Linear interpolation for smooth movement
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Draw gradients
function drawGradients() {
    gradientCtx.clearRect(0, 0, gradientCanvas.width, gradientCanvas.height);

    blobs.forEach(blob => {
        // Update target based on mouse
        blob.targetX = targetX + blob.offsetX;
        blob.targetY = targetY + blob.offsetY;

        // Smooth movement with lerp
        blob.x = lerp(blob.x, blob.targetX, 0.03);
        blob.y = lerp(blob.y, blob.targetY, 0.03);

        // Draw radial gradient
        const gradient = gradientCtx.createRadialGradient(
            blob.x, blob.y, 0,
            blob.x, blob.y, blob.size
        );

        gradient.addColorStop(0, `rgba(80, 80, 80, ${blob.opacity})`);
        gradient.addColorStop(0.5, `rgba(60, 60, 60, ${blob.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        gradientCtx.fillStyle = gradient;
        gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
    });
}

// Mouse/touch event handlers
function handleMouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
}

function handleTouchMove(e) {
    if (e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }
}

// Animation loop
let lastNoiseTime = 0;
const noiseInterval = 1000 / 30; // 30fps for noise

function animate(currentTime) {
    requestAnimationFrame(animate);

    // Throttle noise generation
    if (currentTime - lastNoiseTime >= noiseInterval) {
        generateNoise();
        lastNoiseTime = currentTime;
    }

    // Gradients update every frame for smoothness
    drawGradients();
}

// Event listeners
window.addEventListener('resize', resize);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('touchmove', handleTouchMove, { passive: true });

// Initialize
resize();
animate(0);
