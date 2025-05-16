export default function cappuccinoAssassino({ count = 6, duration = 6500 } = {}) {
    // Prevent multiple cappuccinoAssassino effects
    if ($('body').hasClass('cappuccino-assassino-active')) return;
    
    // Add active class to body
    const $body = $('body');
    $body.addClass('cappuccino-assassino-active');
    
    // Inject CSS for cappuccinoAssassinos
    const $style = $('<style>').text(`
        .cappuccino-assassino {
            position: fixed;
            width: 100px; /* Adjust size as needed */
            height: 100px;
            pointer-events: none;
            z-index: 9999;
        }
    `).appendTo('head');
    
    // Create cappuccinoAssassinos
    const cappuccinoAssassinos = [];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    for (let i = 0; i < count; i++) {
        // Create cappuccinoAssassino image
        const $cappuccinoAssassino = $('<img>').addClass('cappuccino-assassino')
            .attr('src', 'v5/apps/based/spellbook/spells/cappuccino-assassino/cappuccino-assassino.webp')
            .css({
                left: Math.random() * (viewportWidth - 100), // Random X, accounting for width
                top: Math.random() * (viewportHeight - 100) // Random Y, accounting for height
            })
            .appendTo($body);
        
        // Initialize motion properties
        const cappuccinoAssassino = {
            element: $cappuccinoAssassino,
            x: parseFloat($cappuccinoAssassino.css('left')),
            y: parseFloat($cappuccinoAssassino.css('top')),
            vx: (Math.random() - 0.5) * 200, // Random velocity (-100 to 100 px/s)
            vy: (Math.random() - 0.5) * 200,
            lastDirectionChange: 0
        };
        
        cappuccinoAssassinos.push(cappuccinoAssassino);
        
    }

    this.bp.play('v5/apps/based/spellbook/spells/cappuccino-assassino/cappuccino-assassino.mp3', { tryHard: 1, repeat: true, duration: duration });

    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Animation loop for zig-zag motion
    function animate() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const deltaTime = frameRate / 1000; // Time per frame in seconds
            
            cappuccinoAssassinos.forEach(cappuccinoAssassino => {
                // Randomly change direction every 0.3-0.7s
                if (elapsed - cappuccinoAssassino.lastDirectionChange > Math.random() * 400 + 300) {
                    cappuccinoAssassino.vx = (Math.random() - 0.5) * 200;
                    cappuccinoAssassino.vy = (Math.random() - 0.5) * 200;
                    cappuccinoAssassino.lastDirectionChange = elapsed;
                }
                
                // Update position
                cappuccinoAssassino.x += cappuccinoAssassino.vx * deltaTime;
                cappuccinoAssassino.y += cappuccinoAssassino.vy * deltaTime;
                
                // Bounce off viewport edges
                if (cappuccinoAssassino.x < 0) {
                    cappuccinoAssassino.x = 0;
                    cappuccinoAssassino.vx = -cappuccinoAssassino.vx;
                } else if (cappuccinoAssassino.x > viewportWidth - 100) {
                    cappuccinoAssassino.x = viewportWidth - 100;
                    cappuccinoAssassino.vx = -cappuccinoAssassino.vx;
                }
                if (cappuccinoAssassino.y < 0) {
                    cappuccinoAssassino.y = 0;
                    cappuccinoAssassino.vy = -cappuccinoAssassino.vy;
                } else if (cappuccinoAssassino.y > viewportHeight - 100) {
                    cappuccinoAssassino.y = viewportHeight - 100;
                    cappuccinoAssassino.vy = -cappuccinoAssassino.vy;
                }
                
                // Apply position
                cappuccinoAssassino.element.css({
                    left: cappuccinoAssassino.x,
                    top: cappuccinoAssassino.y
                });
            });
            
            // Schedule next frame
            setTimeout(animate, frameRate);
        } else {
            // Cleanup
            cappuccinoAssassinos.forEach(cappuccinoAssassino => cappuccinoAssassino.element.remove());
            $style.remove();
            $body.removeClass('cappuccino-assassino-active');
        }
    }
    
    // Start animation
    animate();
}