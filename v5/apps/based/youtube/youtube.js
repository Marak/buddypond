export default class Youtube {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.youtubeWindow = null;
        this.player = null;
        // default video static to start rZhbnty03U4
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/youtube/youtube.html');
        // is importModule not using the correct host path here?
        let playlistModule = await this.bp.importModule('/v5/apps/based/youtube/data/playlist.js', {}, false);
        this.playlist = playlistModule.default;

        if (!window.YT) {
            await this.bp.appendScript('https://www.youtube.com/iframe_api');
            window.onYouTubeIframeAPIReady = () => {
                this.apiReady = true;
            };
        } else {
            this.apiReady = true;
        }
    }

    async close() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
        if (this.youtubeWindow) {
            this.youtubeWindow = null;
        }
    }

    async open(options = {}) {
        if (this.youtubeWindow) {
            if (this.player && options.context) {
                this.player.loadVideoById(options.context);
            }
            return;
        }

        this.youtubeWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'youtube-window',
            title: 'Interdimensional Cable',
            x: 50,
            y: 100,
            width: 600,
            height: 480,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            icon: '/desktop/assets/images/icons/icon_interdimensionalcable_64.png',
            content: this.html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onClose: () => this.close()
        });

        // Wait for YouTube API to be ready
        while (!this.apiReady) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        $('.orb-holder', this.youtubeWindow.content).on('click', () => {
            this.playRandomVideo();
        });

        let startingVideo = options.context || this.playlist[Math.floor(Math.random() * this.playlist.length)];

        this.player = new YT.Player('youtube-player', {
            height: '390',
            width: '640',
            videoId: startingVideo,
            playerVars: { autoplay: 1, controls: 1 },
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange': (event) => this.onPlayerStateChange(event),
                'onError': (event) => this.onPlayerError(event)
            },
            origin: window.location.origin
        });
    }

    onPlayerReady(event) {
        console.log('YouTube Player Ready', event);
    }

    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            this.playRandomVideo();
        }
    }

    onPlayerError(event) {
        console.warn('YouTube Player Error:', event);

        // Handle different error types
        const errorCodes = [100, 101, 150]; // Common unavailable video errors
        if (errorCodes.includes(event.data) || event.data === 2) {
            console.warn('Video unavailable, selecting a new one...');
            this.playRandomVideo();
        }
    }

    playRandomVideo() {
        if (!this.player || !this.playlist) return;
        let randomVideo = this.playlist[Math.floor(Math.random() * this.playlist.length)];
        this.player.loadVideoById(randomVideo);
    }
}