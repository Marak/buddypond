const AudioPlayerBindings = {
    eventListener: null,
    bindings: {
        'n': (bp) => bp.open('audio-player'),
        'p': (bp) => bp.open('audio-player', { context: 'playlist' })
    }
};

/**
 * Binds keyboard controls for the audio player.
 */
AudioPlayerBindings.bindKeys = function (bp, controller = 'keyboard') {
    if (!bp) {
        console.error('Audio player instance is required for binding keys.');
        return;
    }
    
    this.unbindKeys(); // Ensure no duplicate bindings

    this.eventListener = (e) => {
        if (this.bindings[e.key]) {
            e.preventDefault();
            this.bindings[e.key](bp);
        }
    };

    document.addEventListener('keydown', this.eventListener);
};

/**
 * Unbinds all keyboard events.
 */
AudioPlayerBindings.unbindKeys = function () {
    if (this.eventListener) {
        document.removeEventListener('keydown', this.eventListener);
        this.eventListener = null;
    }
};

export default AudioPlayerBindings;