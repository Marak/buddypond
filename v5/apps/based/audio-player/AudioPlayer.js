import pvrtybvxRenderer from '../audio-track/render/pvrtybvx/render.js';
import pvrtybvxDatabind from '../audio-track/render/pvrtybvx/databind.js';

export default class AudioPlayer {
  constructor(bp, config) {
    this.bp = bp;
    this.config = config;
    this.container = config.container;
  }

  async init() {
    console.log("AudioPlayer init", this.config);

    // create a new track
    let track = bp.apps['audio-track'].createAudioTrack({
      fileName: this.config.url,
      url: this.config.url
    });
    // TODO: transport tracks?, or is reference in AudioTrack.tracks enough? prob keep both
    this.track = track;
    console.log('created audio track', track);

    // set the renderer based on user preference
    track.setRenderer('pvrtybvx', {
      render: pvrtybvxRenderer,
      databind: pvrtybvxDatabind
    });
    console.log('set renderer', pvrtybvxRenderer);

    // render the track
    let trackElement = await track.render();
    console.log('rendered audio track', trackElement);

    // append the track to the body
    //document.body.appendChild(trackElement);
    this.container.appendChild(trackElement);

    // load the track
    await track.load();
    console.log("loaded audio track", track);

    // load the interface
    //await loadInterface(track, trackElement);
    await track.databind(trackElement);

    console.log('playing first track', track, track.play);
    await track.play();

  }

  close () {
    console.log("AudioPlayer close");
    this.track.unload(); // TODO: all tracks in transport
  }

}