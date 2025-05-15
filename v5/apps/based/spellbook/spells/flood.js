export default function flood(duration = 3000, intensity = 3) {
    // Prevent multiple floods
    if ($('body').hasClass('flood-active')) return;
    
    // Add flood class to body
    const $body = $('body');
    $body.addClass('flood-active');
    
    // Inject CSS for wave and bubble animations
    const $style = $('<style>').text(`
        .water-wave::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 20px;
            background: linear-gradient(to top, rgba(255, 255, 255, 0.4), transparent);
            animation: wave 1.5s infinite;
        }
        @keyframes wave {
            0% {
                transform: translateX(0) skew(0deg);
            }
            50% {
                transform: translateX(-10%) skew(5deg);
            }
            100% {
                transform: translateX(0) skew(0deg);
            }
        }
        @keyframes bubble {
            0% {
                transform: translateY(0);
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh);
                opacity: 0;
            }
        }
        .water-rise {
            height: 100% !important;
        }
    `).appendTo('head');
    
    // Create water overlay
    const $water = $('<div>').css({
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '0%', // Start at bottom
        background: 'linear-gradient(to top, rgba(0, 100, 200, 0.9), rgba(0, 150, 255, 0.7))',
        zIndex: 9998,
        pointerEvents: 'none',
        transition: `height ${duration}ms ease-in` // Smooth rise
    }).appendTo($body);
    
    // Add wave effect
    $water.addClass('water-wave');
    
    // Create bubbles
    const bubbleCount = 10;
    const bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
        const $bubble = $('<div>').css({
            position: 'absolute',
            bottom: '5%',
            left: `${Math.random() * 90 + 5}%`, // Random X position
            width: `${Math.random() * 20 + 10}px`, // Random size 10-30px
            height: `${Math.random() * 20 + 10}px`,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: `bubble ${Math.random() * 2000 + 1000}ms linear infinite` // Random speed
        }).appendTo($water);
        bubbles.push($bubble);
    }
    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Trigger water rise with slight delay to ensure transition applies
    setTimeout(() => {
        $water.addClass('water-rise');
    }, 50);
    
    // Animation loop for shake
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (elapsed < duration) {
            // Subtle shake
            const shakeIntensity = intensity * (1 - progress); // Fade shake
            const offsetX = (Math.random() - 0.5) * shakeIntensity * 2;
            const offsetY = (Math.random() - 0.5) * shakeIntensity * 2;
            $body.css({
                position: 'relative',
                transform: `translate(${offsetX}px, ${offsetY}px)`
            });
            
            // Schedule next frame
            setTimeout(animate, frameRate);
        } else {
            // Cleanup
            // hold the flood for a moment
            setTimeout(() => {
                $water.remove();
                bubbles.forEach($bubble => $bubble.remove());
                $style.remove();
                $body.css({
                    transform: 'translate(0, 0)',
                    position: ''
                }).removeClass('flood-active');
            }, 3000); // TODO: flood hold time

        }
    }
    
    // Start animation
    animate();
}