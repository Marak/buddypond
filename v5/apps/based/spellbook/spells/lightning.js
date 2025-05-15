export default function lightning(duration = 5000, boltCount = 5, intensity = 3) {
    // Prevent multiple lightning effects
    if ($('body').hasClass('lightning-active')) return;
    
    // Add lightning class to body
    const $body = $('body');
    $body.addClass('lightning-active');
    
    // Create flash overlay for lightning effect
    const $flash = $('<div>').css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0)',
        pointerEvents: 'none',
        zIndex: 9998
    }).appendTo($body);
    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Create lightning bolts
    const bolts = [];
    for (let i = 0; i < boltCount; i++) {
        const $bolt = $('<img>').attr('src', '/v5/apps/based/spellbook/spells/lightning-bolt.webp').css({
            position: 'fixed',
            top: '-20%', // Start above viewport
            left: `${Math.random() * 90}%`, // Random X position (0-90% to avoid clipping)
            width: '10%', // Adjust size as needed
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 9999
        }).appendTo($body);
        bolts.push($bolt);
    }
    
    // Animation loop
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (elapsed < duration) {
            // Flash effect: quick bursts at random intervals
            const flashChance = Math.random();
            if (flashChance > 0.9) {
                $flash.css('background', 'rgba(255, 255, 255, 0.8)');
                setTimeout(() => $flash.css('background', 'rgba(255, 255, 255, 0)'), 100);
            }
            
            // Animate bolts
            bolts.forEach(($bolt, i) => {
                const boltProgress = (progress + i / boltCount) % 1; // Stagger bolts
                const yPos = -20 + boltProgress * 140; // Move from -20% to 120% (top to bottom)
                const opacity = Math.sin(boltProgress * Math.PI); // Fade in and out
                $bolt.css({
                    top: `${yPos}%`,
                    opacity: opacity
                });
            });
            
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
            $flash.remove();
            bolts.forEach($bolt => $bolt.remove());
            $body.css({
                transform: 'translate(0, 0)',
                position: ''
            }).removeClass('lightning-active');
        }
    }
    
    // Start animation
    animate();
}