const KeyboardBindings = {
    deckControlMappings: {
        deckA: {},
        deckB: {}
    },
    eventListener: null,
};

/**
 * Generate key bindings for a given track.
 */
function createDeckBindings(track, deck) {
    if (deck === 'deckA') {
        return {
            '1': () => track.cueTo(1),
            '2': () => track.cueTo(2),
            '3': () => track.cueTo(3),
            '4': () => track.cueTo(4),
            'w': () => track.playPause()
        };
    } else if (deck === 'deckB') {
        return {
            '5': () => track.cueTo(1),
            '6': () => track.cueTo(2),
            '7': () => track.cueTo(3),
            '8': () => track.cueTo(4),
            's': () => track.playPause()
        };
    }
    return {};
}

/**
 * Binds keyboard controls to the given track and deck.
 */
KeyboardBindings.bindKeys = function (track, deck = 'deckA') {
    if (!track || !deck) {
        console.error('Track instance and deck name are required for binding keys.');
        return;
    }

    this.unbindKeys(deck); // Ensure no duplicate bindings
    this.deckControlMappings[deck] = createDeckBindings(track, deck);

    this.eventListener = (e) => {
        if (this.deckControlMappings[deck][e.key]) {
            e.preventDefault();
            this.deckControlMappings[deck][e.key]();
        }
    };

    document.addEventListener('keydown', this.eventListener);
};

/**
 * Unbinds all keyboard events for a given deck.
 */
KeyboardBindings.unbindKeys = function (deck = 'deckA') {
    if (this.eventListener) {
        document.removeEventListener('keydown', this.eventListener);
        this.eventListener = null;
    }
    if (deck && this.deckControlMappings[deck]) {
        this.deckControlMappings[deck] = {};
    }
};

export default KeyboardBindings;
