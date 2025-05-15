export default function vortex(duration = 4400, intensity = 4, pause = 500) {
    // Prevent multiple vortices
    if ($('body').hasClass('vortex-active')) return;
    
    // Add vortex class to body
    const $body = $('body');
    $body.addClass('vortex-active');
    
    // Inject CSS for vortex and particle animations
    const $style = $('<style>').text(`
        .vortex-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, rgba(50, 50, 100, 0.5) 50%, rgba(0, 0, 0, 0) 80%);
            zIndex: 9998;
            pointerEvents: none;
            animation: vortex-swirl ${duration + pause}ms ease-in-out;
        }
        @keyframes vortex-swirl {
            0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
            50% { transform: rotate(180deg) scale(1); opacity: 0.7; }
            ${duration / (duration + pause) * 100}% { transform: rotate(360deg) scale(1.2); opacity: 0.7; }
            100% { transform: rotate(360deg) scale(1.2); opacity: 0; }
        }
        .v	.vortex-particle {
            position: fixed;
            width: 5px;
            height: 5px;
            background: rgba(200, 200, 255, 0.8);
            border-radius: 50%;
            pointerEvents: none;
            zIndex: 9999;
            animation: particle-spiral ${duration * 0.8}ms ease-in;
        }
        @keyframes particle-spiral {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(0, 0) scale(0); opacity: 0; }
        }
    `).appendTo('head');
    
    // Create vortex overlay
    const $vortex = $('<div>').addClass('vortex-overlay').appendTo($body);
    
    // Create particles
    const particleCount = 15;
    const particles = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 300 + 100;
        const $particle = $('<div>').addClass('vortex-particle').css({
            left: centerX + Math.cos(angle) * radius,
            top: centerY + Math.sin(angle) * radius
        }).appendTo($body);
        particles.push($particle);
    }
    
    // Select elements to animate
    const $elements = $body.children().not('.vortex-overlay, .vortex-particle');
    const originalPositions = $elements.map(function() {
        const $el = $(this);
        return {
            element: $el,
            offset: $el.offset(),
            transform: $el.css('transform'),
            scale: 1 // Assume initial scale is 1
        };
    }).get();
    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Animation loop for element spiraling, shrinking, and shake
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1); // Cap at 1 for main animation
        
        if (elapsed < duration + pause) {
            if (elapsed < duration) {
                // Animate elements toward center with spiral and shrink
                $elements.each(function() {
                    const $el = $(this);
                    const spiralProgress = progress * 2; // Faster spiral
                    const angle = spiralProgress * 2 * Math.PI; // 2 full circles
                    const distance = (1 - progress) * 200; // Pull toward center
                    const scale = 1 - progress; // Shrink to 0
                    const offsetX = Math.cos(angle) * distance;
                    const offsetY = Math.sin(angle) * distance;
                    $el.css({
                        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${angle}rad) scale(${scale})`,
                        position: 'relative'
                    });
                });
                
                // Subtle shake
                const shakeIntensity = intensity * (1 - progress);
                const shakeX = (Math.random() - 0.5) * shakeIntensity * 2;
                const shakeY = (Math.random() - 0.5) * shakeIntensity * 2;
                $body.css({
                    position: 'relative',
                    transform: `translate(${shakeX}px, ${shakeY}px)`
                });
            } else {
                // Pause: keep elements hidden (scale 0)
                $elements.each(function() {
                    $(this).css({
                        transform: 'translate(0, 0) rotate(0rad) scale(0)',
                        position: 'relative'
                    });
                });
            }
            
            // Schedule next frame
            setTimeout(animate, frameRate);
        } else {
            // Restore elements smoothly
            const restoreDuration = 300; // Short restore animation
            $elements.each(function(i) {
                const $el = $(this);
                const { offset, transform } = originalPositions[i];
                $el.css({
                    transition: `transform ${restoreDuration}ms ease-out`,
                    transform: transform || 'none',
                    position: ''
                });
            });
            
            // Cleanup after restore animation
            setTimeout(() => {
                $vortex.remove();
                particles.forEach($particle => $particle.remove());
                $style.remove();
                $body.css({
                    transform: 'translate(0, 0)',
                    position: ''
                }).removeClass('vortex-active');
                $elements.css('transition', ''); // Remove transition
            }, restoreDuration);
        }
    }
    
    // Start animation
    animate();
}