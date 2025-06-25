export default function rainbow({
    duration = 9000, // Duration of the effect (ms)
    soundUrl = 'v5/apps/based/spellbook/spells/rainbow/assets/rainbow.mp3', // Path to MP3
    gifUrl = 'v5/apps/based/spellbook/spells/rainbow/assets/rainbow.gif', // Path to GIF
    rainbowCount = 2, // Number of rainbows
    rainbowWidth = 600, // Width of each rainbow (px)
    rainbowHeight = 300 // Height of each rainbow arc (px)
} = {}) {
    // Prevent multiple rainbow effects
    if ($('body').hasClass('rainbow-active')) return;

    // Add active class to body
    const $body = $('body');
    $body.addClass('rainbow-active');

    // Inject CSS for container and rainbows
    const $style = $('<style>').text(`
        .rainbow-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
        }
        .rainbow {
            position: absolute;
            width: ${rainbowWidth}px;
            height: ${rainbowHeight}px;
            object-fit: contain; /* Preserve GIF aspect ratio */
            opacity: 0.7; /* Semi-transparent */
            clip-path: inset(0 100% 0 0); /* Start hidden from right */
            animation: drawRainbow 2s ease-in-out forwards, rainbowFade ${duration}ms ease-in-out forwards;
            animation-delay: 0s; /* Overridden per rainbow */
            top: 50%; /* Center vertically */
        }
        @keyframes drawRainbow {
            0% { clip-path: inset(0 100% 0 0); } /* Hidden */
            100% { clip-path: inset(0 0 0 0); } /* Fully visible */
        }
        @keyframes rainbowFade {
            0% { opacity: 0; transform: translateY(50px); }
            10% { opacity: 0.7; transform: translateY(0); }
            90% { opacity: 0.7; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-50px); }
        }
    `).appendTo('head');

    // Create container for rainbows
    const $container = $('<div>').addClass('rainbow-container').appendTo($body);

    // Calculate center positions for two rainbows
    const totalWidth = rainbowWidth * rainbowCount;
    const baseLeft = `calc(50% - ${totalWidth / 2}px)`; // Center the pair

    for (let i = 0; i < rainbowCount; i++) {
        const offsetX = i * rainbowWidth; // 0 for first, 600px for second
        const $rainbow = $('<img>').addClass('rainbow').attr({
            src: gifUrl,
            loading: 'eager' // Load immediately
        }).css({
            left: `calc(${baseLeft} + ${offsetX}px)`, // Side by side
            animation: `drawRainbow 2s ease-in-out ${i * 500}ms forwards, rainbowFade ${duration}ms ease-in-out forwards`
        }).appendTo($container);

        // Staggered sound for each rainbow
    }

                try {
                this.bp.play(soundUrl, { tryHard: 1, volume: Math.random() * 0.3 + 0.2 }); // Volume 0.2–0.5
            } catch (e) {
                const audio = new Audio(soundUrl);
                audio.volume = Math.random() * 0.3 + 0.2;
                audio.play().catch(err => console.warn('Audio playback failed:', err));
            }


    // Cleanup after duration
    setTimeout(() => {
        $container.remove();
        $style.remove();
        $body.removeClass('rainbow-active');
    }, duration);
}