export default function skullFlash({
    duration = 15000, // Duration of the effect (ms)
    soundUrl = 'v5/apps/based/spellbook/spells/death/death.mp3', // Path to MP3
    skullSize = 200, // Size of skull emoji (px)
    rotationAngle = 15, // Max rotation angle (degrees)
    textDelay = 6000 // Delay before text appears (ms)
} = {}) {
    // Prevent multiple skull flash effects
    if ($('body').hasClass('skull-flash-active')) return;

    // Add active class to body
    const $body = $('body');
    $body.addClass('skull-flash-active');

    // Inject CSS for black overlay, skull, and text
    const $style = $('<style>').text(`
        .skull-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 100001;
            pointer-events: none;
        }
        .skull-emoji {
            position: fixed;
            font-size: ${skullSize}px;
            color: white; /* White skull for contrast */
            z-index: 100001;
            pointer-events: none;
            animation: skullRotate 2s ease-in-out infinite;
        }
        @keyframes skullRotate {
            0% { transform: translate(-50%, -50%) rotate(-${rotationAngle}deg); }
            50% { transform: translate(-50%, -50%) rotate(${rotationAngle}deg); }
            100% { transform: translate(-50%, -50%) rotate(-${rotationAngle}deg); }
        }
        .death-text {
            position: fixed;
            left: 50%;
            top: 50%;
            line-height: 300px;
            transform: translate(-50%, -50%);
            color: red;
            font-size: 100px; /* Large text */
            font-family: 'Arial', sans-serif; /* Bold, readable font */
            font-weight: bold;
            text-align: center;
            z-index: 100002; /* Above skull */
            pointer-events: none;
            opacity: 0; /* Start hidden */
            animation: fadeIn 1s ease-in forwards ${textDelay}ms; /* Fade in after delay */
        }
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
    `).appendTo('head');

    // Create black overlay
    const $overlay = $('<div>').addClass('skull-overlay').appendTo($body);

    // Create skull emoji
    const $skull = $('<span>').addClass('skull-emoji').text('💀').css({
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)' // Center the skull
    }).appendTo($body);

    // Create "YOU HAVE DIED" text
    const $text = $('<div>').addClass('death-text').text('YOU HAVE DIED').appendTo($body).fadeIn(3000);

    // Play sound
    try {
        this.bp.play(soundUrl, { tryHard: 1, volume: 0.5 });
    } catch (e) {
        // Fallback to Audio object
        const audio = new Audio(soundUrl);
        audio.volume = 0.5;
        audio.play().catch(err => console.warn('Audio playback failed:', err));
    }

    // Cleanup after duration
    setTimeout(() => {
        $overlay.remove();
        $skull.remove();
        $text.remove();
        $style.remove();
        $body.removeClass('skull-flash-active');
    }, duration);
}