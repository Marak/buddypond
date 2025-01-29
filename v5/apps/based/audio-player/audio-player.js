import AudioPlayerClass from './AudioPlayer.js';

export default class AudioPlayer {
  constructor(bp) {
    this.bp = bp;
    this.AudioPlayer = AudioPlayerClass;
  }

  async init () {
    console.log("AudioPlayer init");
    await this.bp.appendCSS('/v5/apps/based/audio-track/render/pvrtybvx/style.css');

    // window.webAudioBeatDetector = {};
    // TODO: move this to audio-stripe.js
    // await this.bp.importModule('/v5/apps/based/audio-stripe/vendor/web-audio-beat-detector.js', {}, false);
    //await this.bp.appendScript('/v5/apps/based/audio-stripe/vendor/web-audio-beat-detector.js');
    ///await this.bp.appendScript('https://unpkg.com/web-audio-beat-detector@8.2.20/build/es5/bundle.js');
    await this.bp.appendScript('/v5/apps/based/audio-stripe/vendor/jsmediatags.min.js');
    let aubio = await this.bp.importModule('/v5/apps/based/audio-stripe/vendor/aubio.js', {}, false);
    //let webAudioBeatDetector = await this.bp.importModule('/v5/apps/based/audio-stripe/vendor/web-audio-beat-detector.js', {}, false);
    //window.webAudioBeatDetector = webAudioBeatDetector.default;

    window.aubio = aubio.default;
  
  }

  load(song) {
    alert(JSON.stringify(song));
  }

  open (config) {
    console.log("AudioPlayer open", config);


    if (!this.audioPlayerWindow) {

        this.audioPlayerWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'audio-player',
            title: 'Audio Player',
            icon: 'desktop/assets/images/icons/icon_midifighter_64.png',
            x: 250,
            y: 75,
            width: 980,
            height: 360,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onClose: () => {
                this.audioPlayerWindow = null;
                this.audioPlayer.close();
            }
        });


        config.url = 'Maroon%205%20-%20One%20More%20Night%20[MetroGnome%20Remix].mp3';

        config.container = this.audioPlayerWindow.content;
        // if this is the first time, create the audio player and load a file
        this.audioPlayer = new AudioPlayerClass(this.bp, config);
        
        this.audioPlayer.init();

    }

    // creates or opens a new window
    // if config.context has audio file, load it

  }

  createAudioPlayer (config) {
    let p = new this.AudioPlayer(config);
    // this.tracks.push(t);
    return p;
  }

}