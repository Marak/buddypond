export default function explode({
    duration = 2000, // Shorter duration for a quick, punchy effect
    gridSize = 10, // Number of grid cells (e.g., 10x10 grid) or use child elements
    maxDistance = 500, // Max pixel distance for pieces to travel
    intensity = 1, // Animation intensity
    useDomFragments = false // Set to true to use child elements instead of grid
} = {}) {
    // Prevent multiple explode effects
    if ($('body').hasClass('explode-active')) return;

    // Add explode class to body
    const $body = $('body');
    $body.addClass('explode-active');

    // Inject CSS for scanlines, jitter, and explosion pieces
    const $style = $('<style>').text(`
        .explode-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
        }
        .explode-piece {
            position: absolute;
            will-change: transform, opacity; /* Optimize for animation */
            overflow: hidden;
        }
        .explode-scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.1),
                rgba(0, 0, 0, 0.1) 2px,
                transparent 2px,
                transparent 4px
            );
            animation: scanlines ${duration / 2}ms linear infinite;
            z-index: 9999;
            pointer-events: none;
        }
        @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(4px); }
        }
        .explode-jitter {
            animation: jitter ${duration / 10}ms steps(1) infinite;
        }
        @keyframes jitter {
            0% { filter: hue-rotate(0deg); }
            33% { filter: hue-rotate(5deg); }
            66% { filter: hue-rotate(-5deg); }
            100% { filter: hue-rotate(0deg); }
        }
        @keyframes explode {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--tx), var(--ty)) rotate(var(--rotate)) scale(var(--scale));
                opacity: 0;
            }
        }
    `).appendTo('head');

    // Create container for explosion pieces
    const $container = $('<div>').addClass('explode-container').appendTo($body);

    // Create scanlines overlay (optional)
    const $scanlines = $('<div>').addClass('explode-scanlines explode-jitter').appendTo($body);

    // Target the #desktop container
    const targetElement = document.body;
    const rect = targetElement.getBoundingClientRect(); // Get position and size

    // Create explosion pieces
    const pieces = [];

    if (useDomFragments) {
        // Option 1: Use child elements as pieces
        const $children = $(targetElement).children().not('img, svg, video');
        $children.each(function () {
            const $child = $(this);
            // Clone the child element
            const $piece = $child.clone();
            const childRect = $child[0].getBoundingClientRect();

            // Position the piece at the child’s location
            $piece.css({
                left: childRect.left,
                top: childRect.top,
                width: childRect.width,
                height: childRect.height,
                position: 'absolute'
            });

            // Simplify styles for performance
            $piece.css({
                boxShadow: 'none',
                transform: 'none',
                backgroundImage: 'none'
            });

            // Animation properties
            const angle = Math.random() * Math.PI * 2; // Random direction
            const distance = (Math.random() * 0.5 + 0.5) * maxDistance * intensity; // 50-100% of maxDistance
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rotate = (Math.random() - 0.5) * 720; // ±360deg
            const scale = Math.random() * 0.5 + 0.5; // 0.5-1

            $piece.css({
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
                '--rotate': `${rotate}deg`,
                '--scale': scale,
                animation: `explode ${duration}ms ease-out forwards`
            });

            $piece.appendTo($container);
            pieces.push($piece);
        });
    } else {
        // Option 2: Use a grid of colored blocks
        const pieceWidth = rect.width / gridSize;
        const pieceHeight = rect.height / gridSize;
        const backgroundColor = $(targetElement).css('background-color') || '#ccc'; // Fallback color

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const $piece = $('<div>').addClass('explode-piece').css({
                    width: pieceWidth,
                    height: pieceHeight,
                    left: rect.left + x * pieceWidth,
                    top: rect.top + y * pieceHeight,
                    backgroundColor: backgroundColor // Use target’s background or fallback
                });

                // Animation properties
                const angle = Math.random() * Math.PI * 2; // Random direction
                const distance = (Math.random() * 0.5 + 0.5) * maxDistance * intensity; // 50-100% of maxDistance
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                const rotate = (Math.random() - 0.5) * 720; // ±360deg
                const scale = Math.random() * 0.5 + 0.5; // 0.5-1

                $piece.css({
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    '--rotate': `${rotate}deg`,
                    '--scale': scale,
                    animation: `explode ${duration}ms ease-out forwards`
                });

                $piece.appendTo($container);
                pieces.push($piece);
            }
        }
    }

    // Dim the original element during the effect (optional)
    $(targetElement).css({ opacity: 0.3 });

    // Cleanup after animation
    setTimeout(() => {
        $container.remove();
        $scanlines.remove();
        $style.remove();
        $body.removeClass('explode-active').css({ transform: 'none' });
        $(targetElement).css({ opacity: 1 }); // Restore original element
    }, duration);
}