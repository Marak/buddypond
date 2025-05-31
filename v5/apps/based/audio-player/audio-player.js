import AudioPlayerClass from './AudioPlayer.js';
import PlayerKeyboardBindings from './lib/PlayerKeyboardBindings.js';

import menuBarConfig from './lib/menuBarConfig.js';


export default class AudioPlayer {
  constructor(bp) {
    this.bp = bp;
    this.AudioPlayer = AudioPlayerClass;
  }

  async init() {
    console.log("AudioPlayer init");
    await this.bp.appendCSS('/v5/apps/based/audio-track/render/pvrtybvx/style.css');

    // window.webAudioBeatDetector = {};
    // TODO: move this to audio-stripe.js
    // await this.bp.importModule('/v5/apps/based/audio-stripe/vendor/web-audio-beat-detector.js', {}, false);
    //await this.bp.appendScript('/v5/apps/based/audio-stripe/vendor/web-audio-beat-detector.js');
    ///await this.bp.appendScript('https://unpkg.com/web-audio-beat-detector@8.2.20/build/es5/bundle.js');
    await this.bp.appendScript('/v5/apps/based/audio-stripe/vendor/jsmediatags.min.js');
    // let aubio = await this.bp.importModule('/v5/apps/based/audio-stripe/vendor/aubio.js', {}, false);
    //let webAudioBeatDetector = await this.bp.importModule('/v5/apps/based/audio-stripe/vendor/web-audio-beat-detector.js', {}, false);
    //window.webAudioBeatDetector = webAudioBeatDetector.default;


    // window.aubio = aubio.default;



    // adds a document click handler that will revert the menuBar to default if clicked
    // anywhere outside of the menuBar or any of the audioPlayer windows
    $(document).on('click', (e) => {
      let menuBar = this.bp.apps.menubar;
      let audioPlayers = this.audioPlayers;
      let clickedOnAudioPlayer = false;
      let clickedOnMenuBar = false;
      let clickedOnWindow = false;

      // check if the click was on the menuBar
      if ($(e.target).closest('#menuBar').length) {
        clickedOnMenuBar = true;
      }

      // check if the click was on an audioPlayer window
      audioPlayers.forEach((ap) => {
        // check for data-type=audioPlayer
        if ($(e.target).closest(`[data-type="audioPlayer"]`).length) {
          clickedOnAudioPlayer = true;
        }
      });

      // if the click was not on the menuBar or an audioPlayer window, revert to default menu
      if (!clickedOnMenuBar && !clickedOnAudioPlayer) {
        // menuBar.setDefaultMenu();
      }
      
      if (clickedOnAudioPlayer) {
        // menuBar.setMenu("customMenu", menuBarConfig);
      }

    });
    this.audioPlayers = [];

  }

  play() {
    alert('play'); 
  }

  load(song) {
    alert(JSON.stringify(song));
  }

  async open(config) {
    console.log("AudioPlayer open", config);
    PlayerKeyboardBindings.bindKeys(this.bp);
    let playerId = 'audio-player-' + this.audioPlayers.length;
    let menuBar = this.bp.apps.menubar;

    // TODO: this should trigger on open and unload on close / onfocus
    menuBar.setMenu("customMenu", menuBarConfig);

    let audioPlayerWindow = this.bp.apps.ui.windowManager.createWindow({
      id: playerId,
      title: 'Audio Player',
      icon: `desktop/assets/images/icons/icon_audio-player_64.png`,
      x: 250,
      y: 75,
      width: 980,
      height: 360,
      minWidth: 200,
      minHeight: 200,
      parent: $('#desktop')[0],
      type: 'audioPlayer',
      resizable: true,
      minimizable: true,
      maximizable: true,
      closable: true,
      focusable: true,
      maximized: false,
      minimized: false,
      onClose: () => {
        // find the audio player and close it
        let audioPlayer = this.audioPlayers.find((ap) => {
          return ap.id === playerId;
        });
        audioPlayer.close();
        let menuBar = this.bp.apps.menubar;

        menuBar.setDefaultMenu();
        PlayerKeyboardBindings.unbindKeys(this.bp);
      }
    });
    console.log('new win', this.audioPlayerWindow)

    config.url = 'v5/apps/based/audio-player/vendor/One%20More%20Night%20[MetroGnome%20Remix].mp3';

    config.container = audioPlayerWindow.content;
    // if this is the first time, create the audio player and load a file
    let audioPlayer = new AudioPlayerClass(this.bp, config);
    audioPlayer.id = playerId;

    // TODO: audioPlayer.load()
    // TODO: audioPlayer.unload()
    await audioPlayer.init();
    await audioPlayer.load(config.url, {});

    this.audioPlayers.push(audioPlayer);

    await audioPlayer.play();
    // creates or opens a new window
    // if config.context has audio file, load it

  }

  createAudioPlayer(config) {
    let p = new this.AudioPlayer(config);
    // this.tracks.push(t);
    return p;
  }

}