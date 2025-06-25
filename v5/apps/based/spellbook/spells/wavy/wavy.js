export default async function wavy({
    duration = 13000,
    maxWaveAmplitude = 20, // Maximum pixel displacement for waves
    waveFrequency = 0.01, // Controls wave tightness (higher = tighter waves)
    intensity = 5 // Animation intensity
} = {}) {
    // Prevent multiple effects
    if ($('body').hasClass('wavy-active')) return;

    // Load html2canvas
    await bp.appendScript('https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js');

    // Add wavy class to body
    const $body = $('body');
    $body.addClass('wavy-active');

    // Inject CSS for scanlines and jitter (optional)
    const $style = $('<style>').text(`
        .wavy-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
        }
        .wavy-scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.1),
                rgba(0, 0, 0, 0.1) 2px,
                transparent 2px,
                transparent 4px
            );
            animation: scanlines ${duration / 2}ms linear infinite;
            z-index: 9999;
            pointer-events: none;
        }
        @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(4px); }
        }
        .wavy-jitter {
            animation: jitter ${duration / 10}ms steps(1) infinite;
        }
        @keyframes jitter {
            0% { filter: hue-rotate(0deg); }
            33% { filter: hue-rotate(5deg); }
            66% { filter: hue-rotate(-5deg); }
            100% { filter: hue-rotate(0deg); }
        }
    `).appendTo('head');

    // Create canvas for wavy effect
    const $canvas = $('<canvas>').addClass('wavy-canvas').appendTo($body);
    const canvas = $canvas[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Create scanlines overlay
    const $scanlines = $('<div>').addClass('wavy-scanlines wavy-jitter').appendTo($body);

    // Frame rate for ~30 FPS
    const frameRate = 1000 / 30;
    const startTime = Date.now();

    // Target the #desktop container
    const targetElement = document.querySelector('#desktop') || document.body;
    const rect = targetElement.getBoundingClientRect(); // Get position and size

    // Capture the target element using html2canvas
    html2canvas(targetElement, {
        scale: 1,
        useCORS: true,
        backgroundColor: null,
        ignoreElements: (element) => {
            return element.tagName === 'IMG' || element.tagName === 'SVG' || element.tagName === 'VIDEO';
        },
        onclone: (clonedDoc) => {
            const clonedTarget = clonedDoc.querySelector('#desktop') || clonedDoc.body;
            clonedTarget.querySelectorAll('img, svg, video').forEach((element) => {
                element.remove();
            });
            clonedTarget.querySelectorAll('*').forEach((element) => {
                element.style.boxShadow = 'none';
                element.style.transform = 'none';
                if (window.getComputedStyle(element).backgroundImage !== 'none') {
                    element.style.backgroundImage = 'none';
                }
            });
        }
    }).then((sourceCanvas) => {
        // Create an offscreen canvas for pixel manipulation
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = rect.width;
        offscreenCanvas.height = rect.height;
        const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

        // Animation loop for wavy effect
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (elapsed < duration) {
                // Calculate wave intensity (peaks at 50% progress)
                const intensityProgress = Math.sin(progress * Math.PI); // 0 to 1 to 0
                const amplitude = maxWaveAmplitude * intensityProgress * intensity;

                // Clear the main canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the source canvas onto the offscreen canvas
                offscreenCtx.clearRect(0, 0, rect.width, rect.height);
                offscreenCtx.drawImage(sourceCanvas, 0, 0, rect.width, rect.height);

                // Get pixel data for manipulation
                const imageData = offscreenCtx.getImageData(0, 0, rect.width, rect.height);
                const pixels = imageData.data;
                const newImageData = offscreenCtx.createImageData(rect.width, rect.height);
                const newPixels = newImageData.data;

                // Apply wavy distortion
                for (let y = 0; y < rect.height; y++) {
                    for (let x = 0; x < rect.width; x++) {
                        const index = (y * rect.width + x) * 4;
                        // Calculate wave displacement
                        const waveOffsetX = Math.sin(y * waveFrequency + progress * Math.PI * 2) * amplitude;
                        const waveOffsetY = Math.sin(x * waveFrequency + progress * Math.PI * 2) * amplitude;
                        const srcX = Math.floor(x + waveOffsetX);
                        const srcY = Math.floor(y + waveOffsetY);

                        // Ensure source coordinates are within bounds
                        if (srcX >= 0 && srcX < rect.width && srcY >= 0 && srcY < rect.height) {
                            const srcIndex = (srcY * rect.width + srcX) * 4;
                            newPixels[index] = pixels[srcIndex]; // Red
                            newPixels[index + 1] = pixels[srcIndex + 1]; // Green
                            newPixels[index + 2] = pixels[srcIndex + 2]; // Blue
                            newPixels[index + 3] = pixels[srcIndex + 3]; // Alpha
                        }
                    }
                }

                // Draw the distorted image data back to the offscreen canvas
                offscreenCtx.putImageData(newImageData, 0, 0);

                // Draw the offscreen canvas to the main canvas at the correct position
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(offscreenCanvas, rect.left, rect.top);

                // Subtle shake (optional)
                const shakeIntensity = intensity * intensityProgress;
                const shakeX = (Math.random() - 0.5) * shakeIntensity * 2;
                const shakeY = (Math.random() - 0.5) * shakeIntensity * 2;
                $canvas.css({
                    transform: `translate(${shakeX}px, ${shakeY}px)`
                });

                // Schedule next frame
                setTimeout(animate, frameRate);
            } else {
                // Cleanup
                $canvas.remove();
                $scanlines.remove();
                $style.remove();
                $body.removeClass('wavy-active').css({
                    transform: 'none'
                });
            }
        }

        // Start animation
        animate();
    }).catch((error) => {
        console.error('Error capturing element with html2canvas:', error);
        // Cleanup in case of error
        $canvas.remove();
        $scanlines.remove();
        $style.remove();
        $body.removeClass('wavy-active').css({
            transform: 'none'
        });
    });
}