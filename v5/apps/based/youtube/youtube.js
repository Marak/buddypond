export default class Youtube {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Youtube');

        let html = await this.bp.load('/v5/apps/based/youtube/youtube.html');

        let playlist = await this.bp.importModule('/v5/apps/based/youtube/data/playlist.js', {}, false);
        console.log("pppp", playlist)
        this.playlist = playlist.default;

        // Append the YouTube IFrame API script to the document
        await this.bp.appendScript('https://www.youtube.com/iframe_api');

        let youtubeWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'example',
            title: 'Youtube',
            x: 50,
            y: 100,
            width: 400,
            height: 300,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            icon: '/desktop/assets/images/icons/icon_interdimensionalcable_64.png',
            content: html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });

        // Create a new promise to await the readiness of the YouTube IFrame API
        let youtubeIframeApiReady = new Promise((resolve, reject) => {
            // Define the global event handler that YouTube IFrame API will call
            window.onYouTubeIframeAPIReady = () => {
                // Create the player instance
                this.player = new YT.Player('youtube-player', {
                    height: '390',
                    width: '640',
                    videoId: '6g9qORegPpU',
                    playerVars: { 'autoplay': 1, 'controls': 1 },
                    host: 'http://www.youtube.com',
                    events: {
                        'onReady': interDemonPlayerReady,
                        'onStateChange': interDemonPlayerStateChange
                    },
                    origin: window.document.location.origin
                });

                // Resolve the promise once the player is successfully created
                resolve();
            };
        });

        // Await the promise that resolves when the YouTube IFrame API is ready
        await youtubeIframeApiReady;

        function interDemonPlayerReady(event) {
            console.log(`interDemonPlayerReady`, event);
            /*
            if (desktop.app.interdimensionalcable.mode === 'closeAfterPlayed') {
              $('.orbHolder').hide();
              $('#window_interdimensionalcable').css('height', 440);
              desktop.app.interdimensionalcable.player.playVideo();
            } else {
              $('.orbHolder').show();
              $('#window_interdimensionalcable').css('height', 590);
              desktop.app.interdimensionalcable.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist);
            }
            next();
            */
        }

        function interDemonPlayerStateChange(event) {
            console.log(`interDemonPlayerStateChange`, event);
            /*
            if (event.data == 0) {
              if (desktop.app.interdimensionalcable.mode === 'closeAfterPlayed') {
                JQDX.closeWindow('#window_interdimensionalcable');
              } else {
                desktop.app.interdimensionalcable.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist);
              }
            }
              */
        }



        $('.orb-holder', youtubeWindow.content).on('click', () => {
            this.playRandomVideo();
        });


        return 'loaded Example';
    }

    playRandomVideo() {

        let randomVideo = this.playlist[Math.floor(Math.random() * this.playlist.length)];
        this.player.loadVideoById(randomVideo);

    }

}