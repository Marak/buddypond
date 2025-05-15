export default function hamsterDance({ duration = 7700 } = {}) {
    if ($('body').hasClass('hamster-dance-active')) return;

    const $body = $('body');
    $body.addClass('hamster-dance-active');

    // Inject CSS
    const $style = $('<style>').text(`
        .hamster-dance-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
            overflow: hidden;
            background: black;
        }
        .hamster-dance-flex {
            display: flex;
            flex-wrap: wrap;
        }
        .hamster-dance-img {
            width: 60px;
            height: 60px;
            margin: 5px;
            flex-shrink: 0;
        }
    `).appendTo('head');

    // Create main container
    const $container = $('<div class="hamster-dance-container"></div>');
    const $flex = $('<div class="hamster-dance-flex"></div>').appendTo($container);

    // Define hamster image URLs (replace these with your actual URLs)
    const hamsterImages = [
        'v5/apps/based/spellbook/spells/hamster-dance/hamster1.gif',
        'v5/apps/based/spellbook/spells/hamster-dance/hamster2.gif',
        'v5/apps/based/spellbook/spells/hamster-dance/hamster3.gif',
        'v5/apps/based/spellbook/spells/hamster-dance/hamster4.gif'
    ];

    let hamsterWidth = 60;
    let hamsterHeight = 70;

    // we need to generate enough images to fill the screen
    const screenWidth = $(window).width();
    const screenHeight = $(window).height();
    const hamsterCount = Math.ceil((screenWidth * screenHeight) / (hamsterWidth * hamsterHeight));
    const hamsterImagesCount = Math.ceil(hamsterCount / hamsterImages.length);

    // Add images, each repeated 15 times before moving on to the next
    for (let j = 0; j < hamsterImagesCount; j++) {

    hamsterImages.forEach(src => {
            for (let i = 0; i < 15; i++) {
                $('<img class="hamster-dance-img">')
                    .attr('src', src)
                    .appendTo($flex);
            }
    });

}
// Add the container to body
    $container.appendTo('body');

    // Play Hamster Dance song on repeat
    this.bp.play('v5/apps/based/spellbook/spells/hamster-dance/hamster-dance.mp3', {
        duration: duration,
        repeat: true
    });


    // Remove after duration
    setTimeout(() => {
        $container.remove();
        $style.remove();
        $body.removeClass('hamster-dance-active');
    }, duration);
}
