export default function chickenJockey({ count = 6, duration = 6500 } = {}) {
    // Prevent multiple chicken jockey effects
    if ($('body').hasClass('chicken-jockey-active')) return;
    
    // Add active class to body
    const $body = $('body');
    $body.addClass('chicken-jockey-active');
    
    // Inject CSS for jockeys
    const $style = $('<style>').text(`
        .chicken-jockey {
            position: fixed;
            width: 100px; /* Adjust size as needed */
            height: 100px;
            pointer-events: none;
            z-index: 9999;
        }
    `).appendTo('head');
    
    // Create chicken jockeys
    const jockeys = [];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    for (let i = 0; i < count; i++) {
        // Create jockey image
        const $jockey = $('<img>').addClass('chicken-jockey')
            .attr('src', 'v5/apps/based/spellbook/spells/chicken-jockey/chicken-jockey.gif')
            .css({
                left: Math.random() * (viewportWidth - 100), // Random X, accounting for width
                top: Math.random() * (viewportHeight - 100) // Random Y, accounting for height
            })
            .appendTo($body);
        
        // Initialize motion properties
        const jockey = {
            element: $jockey,
            x: parseFloat($jockey.css('left')),
            y: parseFloat($jockey.css('top')),
            vx: (Math.random() - 0.5) * 200, // Random velocity (-100 to 100 px/s)
            vy: (Math.random() - 0.5) * 200,
            lastDirectionChange: 0
        };
        
        jockeys.push(jockey);
        
        // Play sound with slight delay and volume variation
        setTimeout(() => {
            this.bp.play('v5/apps/based/spellbook/spells/chicken-jockey/chicken-jockey.mp3', { tryHard: 1, volume: Math.random() * 0.3 + 0.2 });
            //const audio = new Audio('v5/apps/based/spellbook/spells/chicken-jockey/chicken-jockey.mp3');
            //audio.volume = Math.random() * 0.3 + 0.2; // 0.2 to 0.5 volume
            //audio.play().catch(err => console.warn('Audio playback failed:', err));
        }, i * 700); // Stagger sounds by 100ms
    }
    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Animation loop for zig-zag motion
    function animate() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const deltaTime = frameRate / 1000; // Time per frame in seconds
            
            jockeys.forEach(jockey => {
                // Randomly change direction every 0.3-0.7s
                if (elapsed - jockey.lastDirectionChange > Math.random() * 400 + 300) {
                    jockey.vx = (Math.random() - 0.5) * 200;
                    jockey.vy = (Math.random() - 0.5) * 200;
                    jockey.lastDirectionChange = elapsed;
                }
                
                // Update position
                jockey.x += jockey.vx * deltaTime;
                jockey.y += jockey.vy * deltaTime;
                
                // Bounce off viewport edges
                if (jockey.x < 0) {
                    jockey.x = 0;
                    jockey.vx = -jockey.vx;
                } else if (jockey.x > viewportWidth - 100) {
                    jockey.x = viewportWidth - 100;
                    jockey.vx = -jockey.vx;
                }
                if (jockey.y < 0) {
                    jockey.y = 0;
                    jockey.vy = -jockey.vy;
                } else if (jockey.y > viewportHeight - 100) {
                    jockey.y = viewportHeight - 100;
                    jockey.vy = -jockey.vy;
                }
                
                // Apply position
                jockey.element.css({
                    left: jockey.x,
                    top: jockey.y
                });
            });
            
            // Schedule next frame
            setTimeout(animate, frameRate);
        } else {
            // Cleanup
            jockeys.forEach(jockey => jockey.element.remove());
            $style.remove();
            $body.removeClass('chicken-jockey-active');
        }
    }
    
    // Start animation
    animate();
}