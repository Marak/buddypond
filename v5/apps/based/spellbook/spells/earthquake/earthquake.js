export default function earthquake(duration = 6800, intensity = 30) {

    // ensure that duration is a number
    if (isNaN(duration)) {
        duration = 2000; // default to 2 seconds
    } else {
        duration = parseInt(duration);
    }

    // ensure that intensity is a number
    if (isNaN(intensity)) {
        intensity = 10; // default to 10
    } else {
        intensity = parseInt(intensity);
    }

     // cap intensity at 100
     if (intensity > 100) {
        intensity = 100;
    }

    // Cache body element with jQuery
    const $body = $('body');
    
    // Prevent multiple shakes
    if ($body.hasClass('earthquake')) return;
    
    // Add styles for shaking
    $body.addClass('earthquake');
    $body.css({
        'position': 'relative',
        'transition': 'transform 0.05s ease-in-out'
    });
    
    // Frame rate for ~60 FPS
    const frameRate = 1000 / 60;
    const startTime = Date.now();
    
    // Shake loop
    function shake() {
        const elapsed = Date.now() - startTime;
        
        if (elapsed < duration) {
            // Calculate random offsets
            const offsetX = (Math.random() - 0.5) * intensity * 2;
            const offsetY = (Math.random() - 0.5) * intensity * 2;
            
            // Apply transform
            $body.css('transform', `translate(${offsetX}px, ${offsetY}px)`);
            
            // Schedule next frame
            setTimeout(shake, frameRate);
        } else {
            // Reset styles
            $body.css({
                'transform': 'translate(0, 0)',
                'position': '',
                'transition': ''
            });
            $body.removeClass('earthquake');
        }
    }
    
    // Start shaking
    this.bp.play('v5/apps/based/spellbook/spells/earthquake/earthquake.mp3');

    shake();
}