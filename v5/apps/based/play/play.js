// Buddy Pond - Play.js - Marak Squires 2024
export default class Play {
    // Map to track playing files and avoid concurrent plays
    static playing = new Map();

    constructor(bp, options = {}) {
        this.bp = bp;
        this.settings = { ...options };
    }

    async init () {
        this.bp.play = this.play.bind(this);

    }

    async play(mediaPath, { tryHard = 0, onEnd = () => {}, onError = () => {} } = {}) {

        if (this.bp.settings.audio_enabled === false) {
            return;
        }

        // Check if media is already playing and if retries are not allowed
        if (Play.playing.get(mediaPath) && !tryHard) {
            console.log(`Warning: Already playing ${mediaPath}. Will not play the same media file concurrently.`);
            return;
        }

        // Mark the media as playing
        Play.playing.set(mediaPath, true);

        // Create the media element (audio or video based on file type or a specified option)
        const media = new Audio(mediaPath); // This can be replaced with 'new Video()' if handling video

        // Function to handle retry logic
        const attemptPlay = () => {
            media.play().then(() => {
                onEnd();
            }).catch(error => {
                // console.error('Playback failed:', error.message);
                Play.playing.set(mediaPath, false); // Reset playing flag on failure
                if (tryHard > 0) {
                    setTimeout(() => {
                        tryHard--;
                        attemptPlay();
                    }, 3333); // Retry after a delay
                } else {
                    onError(error);
                }
            });
        };

        // Add event listener for when the media ends
        media.addEventListener('ended', () => {
            Play.playing.set(mediaPath, false);
            onEnd();
        });

        // Start playback attempt
        attemptPlay();
    }
}
