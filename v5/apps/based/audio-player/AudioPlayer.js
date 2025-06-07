import AudioTrack from '../audio-track/AudioTrack.js';
import pvrtybvxRenderer from '../audio-track/render/pvrtybvx/render.js';
import pvrtybvxDatabind from '../audio-track/render/pvrtybvx/databind.js';
import DeckKeyboardBindings from './lib/DeckKeyboardBindings.js';

export default class AudioPlayer {
  constructor(bp, config) {
    this.bp = bp;
    this.config = config;
    this.container = config.container;
    this.audioTracks = [];
  }

  async init() {
    console.log("AudioPlayer init", this.config);

    // create a new track
    this.track = new AudioTrack({
    });

    // set the renderer based on user preference
    this.track.setRenderer('pvrtybvx', {
      render: pvrtybvxRenderer,
      databind: pvrtybvxDatabind
    });

    // render the track
    let trackElement = await this.track.render();
    console.log('rendered audio track', trackElement);
    this.track.element = trackElement;
    // append the track to the container
    this.container.appendChild(trackElement);

    // bind keyboard controls to the track
    DeckKeyboardBindings.bindKeys(this.track);


  }

  async play () {
    await this.track.play();
  }

  // load a new track by URL, defaulting to this.config.url if no URL is provided
  async load(url) {

    console.log("AudioPlayer load", url);


    // load the track
    await this.track.load({
      url: url
    });

    console.log('created audio track', this.track);

    // databind the track after rendering and loading
    await this.track.databind(this.track.element);

  }

  // unload the current track and unbind keyboard controls
  async unload() {
    console.log("AudioPlayer unload");
    await this.track.unload();
    DeckKeyboardBindings.unbindKeys(this.track);
  }

  // close the AudioPlayer and unload all tracks
  async close() {
    console.log("AudioPlayer close");
    await this.track.unload();
    DeckKeyboardBindings.unbindKeys(this.track);
  }
}