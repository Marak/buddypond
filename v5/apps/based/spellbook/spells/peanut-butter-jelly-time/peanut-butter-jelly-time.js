export default function peanutButterJellyTime({ count = 6, duration = 16000 } = {}) {
    // Prevent multiple peanutButterJellyTime effects
    if ($('body').hasClass('peanut-butter-jelly-time-active')) return;
    
    // Add active class to body
    const $body = $('body');
    $body.addClass('peanut-butter-jelly-time-active');
    
    // Inject CSS for peanutButterJellyTimes
    const $style = $('<style>').text(`
        .peanut-butter-jelly-time {
            position: fixed;
            width: 100px; /* Adjust size as needed */
            height: 100px;
            pointer-events: none;
            z-index: 9999;
        }
    `).appendTo('head');
    
    // Create peanutButterJellyTimes
    const peanutButterJellyTimes = [];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    for (let i = 0; i < count; i++) {
        // Create peanutButterJellyTime image
        const $peanutButterJellyTime = $('<img>').addClass('peanut-butter-jelly-time')
            .attr('src', 'v5/apps/based/spellbook/spells/peanut-butter-jelly-time/peanut.gif')
            .css({
                left: Math.random() * (viewportWidth - 100), // Random X, accounting for width
                top: Math.random() * (viewportHeight - 100) // Random Y, accounting for height
            })
            .appendTo($body);
        
        // Initialize motion properties
        const peanutButterJellyTime = {
            element: $peanutButterJellyTime,
            x: parseFloat($peanutButterJellyTime.css('left')),
            y: parseFloat($peanutButterJellyTime.css('top')),
            vx: (Math.random() - 0.5) * 200, // Random velocity (-100 to 100 px/s)
            vy: (Math.random() - 0.5) * 200,
            lastDirectionChange: 0
        };
        
        peanutButterJellyTimes.push(peanutButterJellyTime);
        
    }

    this.bp.play('v5/apps/based/spellbook/spells/peanut-butter-jelly-time/peanut-butter-jelly-time.mp3', { tryHard: 1, repeat: true, duration: duration });

    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Animation loop for zig-zag motion
    function animate() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const deltaTime = frameRate / 1000; // Time per frame in seconds
            
            peanutButterJellyTimes.forEach(peanutButterJellyTime => {
                // Randomly change direction every 0.3-0.7s
                if (elapsed - peanutButterJellyTime.lastDirectionChange > Math.random() * 400 + 300) {
                    peanutButterJellyTime.vx = (Math.random() - 0.5) * 200;
                    peanutButterJellyTime.vy = (Math.random() - 0.5) * 200;
                    peanutButterJellyTime.lastDirectionChange = elapsed;
                }
                
                // Update position
                peanutButterJellyTime.x += peanutButterJellyTime.vx * deltaTime;
                peanutButterJellyTime.y += peanutButterJellyTime.vy * deltaTime;
                
                // Bounce off viewport edges
                if (peanutButterJellyTime.x < 0) {
                    peanutButterJellyTime.x = 0;
                    peanutButterJellyTime.vx = -peanutButterJellyTime.vx;
                } else if (peanutButterJellyTime.x > viewportWidth - 100) {
                    peanutButterJellyTime.x = viewportWidth - 100;
                    peanutButterJellyTime.vx = -peanutButterJellyTime.vx;
                }
                if (peanutButterJellyTime.y < 0) {
                    peanutButterJellyTime.y = 0;
                    peanutButterJellyTime.vy = -peanutButterJellyTime.vy;
                } else if (peanutButterJellyTime.y > viewportHeight - 100) {
                    peanutButterJellyTime.y = viewportHeight - 100;
                    peanutButterJellyTime.vy = -peanutButterJellyTime.vy;
                }
                
                // Apply position
                peanutButterJellyTime.element.css({
                    left: peanutButterJellyTime.x,
                    top: peanutButterJellyTime.y
                });
            });
            
            // Schedule next frame
            setTimeout(animate, frameRate);
        } else {
            // Cleanup
            peanutButterJellyTimes.forEach(peanutButterJellyTime => peanutButterJellyTime.element.remove());
            $style.remove();
            $body.removeClass('peanut-butter-jelly-time-active');
        }
    }
    
    // Start animation
    animate();
}