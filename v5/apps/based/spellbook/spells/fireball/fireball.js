export default function fireball(duration = 1500, intensity = 5) {
    // Prevent multiple fireballs
    if ($('body').hasClass('fireball-active')) return;
    
    // Add fireball class to body
    const $body = $('body');
    $body.addClass('fireball-active');
    this.bp.play('v5/apps/based/spellbook/spells/fireball/fireball.mp3');
    // Create overlay for fiery effect
    const $overlay = $('<div>').css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255, 50, 0, 0.95) 0%, rgba(255, 100, 0, 0.85) 60%, rgba(200, 0, 0, 0.6) 90%, rgba(0, 0, 0, 0) 100%)',
        opacity: 0,
        transform: 'scale(0.8)', // Start slightly larger
        pointerEvents: 'none',
        zIndex: 9999
    }).appendTo($body);
    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Shake and animate
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (elapsed < duration) {
            // Update overlay: pulse and fade
            const scale = 0.8 + progress * 2.2; // Grow from 0.8x to 3x for full coverage
            const opacity = Math.sin(progress * Math.PI) * 0.9; // Higher peak opacity
            $overlay.css({
                transform: `scale(${scale})`,
                opacity: opacity
            });
            
            // Subtle shake
            const shakeIntensity = intensity * (1 - progress); // Fade shake over time
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
            $overlay.remove();
            $body.css({
                transform: 'translate(0, 0)',
                position: ''
            }).removeClass('fireball-active');
        }
    }
    
    // Start animation
    animate();
}