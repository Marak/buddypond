export default async function confettiBurst({
    duration = 10000, // Duration of the effect (ms)
    soundUrl = 'v5/apps/based/spellbook/spells/confetti/confetti-burst.wav', // Path to wav
    burstCount = 4, // Number of confetti bursts
    particleCount = 400 // Number of particles per burst
} = {}) {
    // Prevent multiple confetti burst effects
    if ($('body').hasClass('confetti-burst-active')) return;

    // Add active class to body
    const $body = $('body');
    $body.addClass('confetti-burst-active');

    // Inject CSS for container
    const $style = $('<style>').text(`
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
        }
    `).appendTo('head');

    // Create container for particles
    const $container = $('<div>').addClass('confetti-container').attr('id', 'confetti-container').appendTo($body);

    await bp.appendScript('https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js');
        startConfetti();

    function startConfetti() {
        // alert("Confetti burst effect started!"); // Debug alert
        // Initialize bursts with random positions and staggered timing
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                // Trigger confetti burst
               confetti({
                    particleCount: particleCount,
                    spread: 70,
                    startVelocity: 60,
                    origin: {
                        x: Math.random(), // Random x (0 to 1)
                        y: Math.random() * 0.4 // Random y, biased toward top (0 to 0.4)
                    },
                    colors: ['#ff5555', '#55ff55', '#5555ff', '#ffff55'], // Vibrant colors
                    shapes: ['square', 'circle'] // Mix of shapes
                });

                // Play sound for each burst
                try {
                    this.bp.play(soundUrl, { tryHard: 1, volume: Math.random() * 0.3 + 0.2 }); // Volume 0.2–0.5
                } catch (e) {
                    const audio = new Audio(soundUrl);
                    audio.volume = Math.random() * 0.3 + 0.2;
                    audio.play().catch(err => console.warn('Audio playback failed:', err));
                }
            }, i * 1000); // Stagger bursts by 1000ms
        }

        // Cleanup after duration
        setTimeout(() => {
            $container.remove();
            $style.remove();
            $body.removeClass('confetti-burst-active');
        }, duration);
    }
}