export default function pixelate({
    duration = 3000,
    maxPixelation = 10, // Pixelation intensity (lower = more pixelated)
    intensity = 2 // Shake intensity
} = {}) {
    // Prevent multiple pixelate effects
    if ($('body').hasClass('pixelate-active')) return;
    
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
    const ctx = canvas.getContext('2d');
    
    // Create scanlines overlay
    const $scanlines = $('<div>').addClass('pixelate-scanlines pixelate-jitter').appendTo($body);
    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Animation loop for pixelation and shake
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (elapsed < duration) {
            // Calculate pixelation intensity (peaks at 50% progress)
            const intensityProgress = Math.sin(progress * Math.PI); // 0 to 1 to 0
            const pixelSize = maxPixelation * (1 - intensityProgress * 0.8); // Min 20% of max
            
            // Capture page (html2canvas or similar could be used, but we'll simplify)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = false;
            const lowResWidth = canvas.width / pixelSize;
            const lowResHeight = canvas.height / pixelSize;
            
            // Draw page content (approximation since html2canvas isn't used)
            ctx.drawImage(document.body, 0, 0, lowResWidth, lowResHeight);
            ctx.drawImage(canvas, 0, 0, lowResWidth, lowResHeight, 0, 0, canvas.width, canvas.height);
            
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
}