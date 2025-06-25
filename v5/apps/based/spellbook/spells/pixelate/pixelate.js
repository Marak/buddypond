export default async function pixelate({
    duration = 13000,
    maxPixelation = 20, // Reduced for finer pixelation
    intensity = 1 // Shake intensity
} = {}) {
    // Prevent multiple pixelate effects
    if ($('body').hasClass('pixelate-active')) return;

    // Load html2canvas
    await bp.appendScript('https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js');

    // Add pixelate class to body
    const $body = $('body');
    $body.addClass('pixelate-active');

    // Inject CSS for scanlines and jitter
    const $style = $('<style>').text(`
        .pixelate-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
        }
        .pixelate-scanlines {
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
        .pixelate-jitter {
            animation: jitter ${duration / 10}ms steps(1) infinite;
        }
        @keyframes jitter {
            0% { filter: hue-rotate(0deg); }
            33% { filter: hue-rotate(5deg); }
            66% { filter: hue-rotate(-5deg); }
            100% { filter: hue-rotate(0deg); }
        }
    `).appendTo('head');

    // Create canvas for pixelation
    const $canvas = $('<canvas>').addClass('pixelate-canvas').appendTo($body);
    const canvas = $canvas[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true 
    });

    // Create scanlines overlay
    const $scanlines = $('<div>').addClass('pixelate-scanlines pixelate-jitter').appendTo($body);

    // Frame rate for ~30 FPS
    const frameRate = 1000 / 30;
    const startTime = Date.now();

    // Target a specific container (replace '.pixelate-target' with your selector)
    const targetElement = document.querySelector('#desktop') || document.body;
    const rect = targetElement.getBoundingClientRect(); // Get position and size

    // Capture the target element using html2canvas
    html2canvas(targetElement, {
        scale: 1, // Avoid over-rendering for performance
        useCORS: true, // Handle cross-origin images
        backgroundColor: null, // Transparent background
            ignoreElements: (element) => {
            // Ignore <img>, <svg>, and <video> elements
            return element.tagName === 'IMG' || element.tagName === 'SVG' || element.tagName === 'VIDEO';
        },
         onclone: (clonedDoc) => {
            // Remove or hide <img> and <svg> elements in the cloned DOM
            const clonedTarget = clonedDoc.querySelector('.pixelate-target') || clonedDoc.body;
            clonedTarget.querySelectorAll('img, svg, video').forEach((element) => {
                element.remove(); // Remove images and SVGs
                // Alternatively, hide them: element.style.display = 'none';
            });
            // Optionally, remove CSS background images
            clonedTarget.querySelectorAll('*').forEach((element) => {
                  element.style.boxShadow = 'none';
                  element.style.transform = 'none';
                if (window.getComputedStyle(element).backgroundImage !== 'none') {
                    element.style.backgroundImage = 'none';
                }
            });
        }
    }).then((sourceCanvas) => {
        // Animation loop for pixelation and shake
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (elapsed < duration) {
                // Calculate pixelation intensity (peaks at 50% progress)
                const intensityProgress = Math.sin(progress * Math.PI); // 0 to 1 to 0
                const pixelSize = maxPixelation * (1 - intensityProgress * 0.8); // Min 20% of max

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.imageSmoothingEnabled = false;

                // Calculate low-resolution dimensions
                const lowResWidth = rect.width / pixelSize;
                const lowResHeight = rect.height / pixelSize;

                // Draw the captured content at its original position
                ctx.drawImage(
                    sourceCanvas,
                    0, 0, sourceCanvas.width, sourceCanvas.height, // Source
                    rect.left, rect.top, rect.width, rect.height // Destination
                );

                // Apply pixelation by scaling down and back up
                ctx.drawImage(
                    canvas,
                    rect.left, rect.top, rect.width, rect.height, // Source
                    rect.left, rect.top, lowResWidth, lowResHeight // Destination (low-res)
                );
                ctx.drawImage(
                    canvas,
                    rect.left, rect.top, lowResWidth, lowResHeight, // Source (low-res)
                    rect.left, rect.top, rect.width, rect.height // Destination (full size)
                );

                // Subtle shake
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
                $body.removeClass('pixelate-active').css({
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
        $body.removeClass('pixelate-active').css({
            transform: 'none'
        });
    });
}