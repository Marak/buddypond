import defaultRender from './render/defaultRender.js';
import load from './load.js';

import setBPM from './lib/setBPM.js';

export default class Track {
  constructor(options = {}) {
    this.id = options.id || `track-${Math.random().toString(36).substr(2, 9)}`;
    this.metadata = options || {};
    this.metadata.cuePoints = this.metadata.cuePoints || [];
    this.provider = options.provider || null;

    // Audio properties
    this.source = null;
    this.audioNodes = new Map();

    // UI properties
    this.element = null;
    this.renderers = new Map();
    this.currentRenderer = 'default';

    // State
    this.isLoaded = false;
    this.isRendered = false;

    load(Track);


    // Event Listeners
    this.eventListeners = {};

    // Audio Graph / FX
    this.fx = {};

    // Setup initial audio elements
    this._initializeAudioElements();

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.masterBus = this.audioContext.createGain(); // Create a gain node as the master bus
    this.distributionNode = this.audioContext.createGain(); // Node for distribution


    // Connect nodes
    this.source = this.audioContext.createMediaElementSource(this.audioElement);
    this.source.disconnect();
    this.source.connect(this.masterBus);


    // Setup basic audio path
    this.masterBus.connect(this.distributionNode); // Connect master bus to distribution node
    this.distributionNode.connect(this.audioContext.destination); // Connect to output

    // Distribution node doesn't alter the signal
    this.distributionNode.gain.value = 1;

    // Initialize a map to hold analyzers
    this.analyzers = new Map();


    // this.addAnalyzer('master', this.audioContext.createAnalyser()); // Create a master analyzer

    /*
   this.analyser = this.audioContext.createAnalyser();
   this.masterBus.connect(this.analyser); // Connect the master bus to the analyser
   this.analyser.connect(this.audioContext.destination); // Connect the analyser to the destination
   this.analyser.fftSize = 2048; // Example FFT size
   this.analyser.smoothingTimeConstant = 0.8; // Example smoothing time constant
   */


    this.setRenderer('default', defaultRender);

    return this;

  }

  async unload() {

    console.log('Unloading track:', this);

    this.metadata = {};

    // remove t.element from the DOM
    if (this.waveform) {
      this.waveform.destroy();
    }

    if (!this.isLoaded) return;
    // Cleanup audio nodes
    this.audioNodes.clear();
    if (this.source) {
      this.source.disconnect();
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    // clean-up audioContext and audioBuffer
    this.audioContext = null;
    this.audioBuffer = null;

    this.isLoaded = false;


    console.log('track should be fully unloaded now going to rebind with empty data', this);
    this.databind();


  }

  async remove() {
    await this.unload();
    await this.unrender();
  }

  // Rendering methods
  setRenderer(name, renderFunction) {
    // this.renderer = renderFunction; // set as active renderer, maybe can remove this
    this.renderers.set(name, renderFunction);
    this.currentRenderer = name;
  }

  databind() {
    const renderer = this.renderers.get(this.currentRenderer);
    if (!renderer) {
      throw new Error(`No renderer found for name: ${this.currentRenderer}`);
    }
    const databind = renderer.databind;
    if (!databind) {
      throw new Error(`No databind function found for renderer: ${this.currentRenderer}`);
    }
    return databind(this);
  }

  render() {
    if (this.isRendered) {
      return this.element;
    }

    const renderer = this.renderers.get(this.currentRenderer);
    const render = renderer.render;
    const databind = renderer.databind;
    console.log("using renderer:", this.currentRenderer, renderer);
    if (!renderer) {
      throw new Error(`No renderer found for name: ${this.currentRenderer}`);
    }

    this.element = render(this);
    this.isRendered = true;
    return this.element;
  }

  unrender() {
    if (!this.isRendered || !this.element) return;

    this.element.remove();
    this.element = null;
    this.isRendered = false;
  }

  // UI Data methods
  setData(data) {
    this.metadata = { ...this.metadata, ...data };

    if (this.isRendered) {
      this._updateRenderedData(data);
    }
  }

  switchLayout(rendererName) {
    if (!this.renderers.has(rendererName)) {
      throw new Error(`No renderer found for name: ${rendererName}`);
    }

    this.unrender();
    this.currentRenderer = rendererName;
    return this.render();
  }

  // Audio graph methods
  addNode(name, node) {
    console.log("Adding node:", name, node, this);
    if (!this.isLoaded || !this.source) {
      throw new Error('Cannot add node: track not loaded');
    }

    // If this node already exists, remove it first
    if (this.audioNodes.has(name)) {
      this.removeNode(name);
    }

    // Store the node
    this.audioNodes.set(name, node);

    // Reconnect the audio graph
    this._reconnectAudioGraph();
  }

  removeNode(name) {
    if (!this.audioNodes.has(name)) return;

    const node = this.audioNodes.get(name);
    node.disconnect();
    this.audioNodes.delete(name);

    // Reconnect the remaining nodes
    this._reconnectAudioGraph();
  }

  addAnalyzer(name, analyzer) {
    if (this.analyzers.has(name)) {
      this.removeAnalyzer(name); // Remove existing analyzer if it's already there
    }
    this.analyzers.set(name, analyzer);
    this.distributionNode.connect(analyzer); // Connect new analyzer
  }

  removeAnalyzer(name) {
    if (this.analyzers.has(name)) {
      this.distributionNode.disconnect(this.analyzers.get(name)); // Disconnect analyzer
      this.analyzers.delete(name);
    }
  }

  // Private methods
  async _initializeAudio() {
    // Implementation for initializing audio context and source
  }

  async _loadAudioFile(url) {
    // Implementation for loading audio file
  }

  _reconnectAudioGraph() {
    let lastNode = this.masterBus;
    this.audioNodes.forEach(node => {
      lastNode.disconnect(); // Disconnect from previous node
      lastNode.connect(node); // Connect current node
      lastNode = node; // Update lastNode
    });
    lastNode.disconnect(); // Ensure no double connections
    lastNode.connect(this.distributionNode); // Connect the final processing node to the analyser
    this.distributionNode.connect(this.audioContext.destination); // Connect the analyser to the destination
  }


  _updateRenderedData(data) {
    console.log("Updating rendered data:", data);
    // Implementation for updating DOM elements with new data
  }

  pause() {
    // check to make sure is not already playing
    if (!this.audioElement.paused) {
      this.audioElement.pause();
    }

  }

  play() {

    // check to make sure is not already playing
    if (this.audioElement.paused) {
      console.log("Playing audio track");
      this.audioElement.play();
    }
  }

  playPause() {
    if (this.audioElement.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  setTime(time) {
    this.audioElement.currentTime = time;
  }

  cueTo(cueNumber) {

    const cue = this.metadata.cuePoints[cueNumber - 1] ?? 0;
    let cueTime = cue.time;
    //cueTime -= 4;
    console.log("CUE TO TIME", cueTime);

    // Set the time first, then we can determine if phase lock of sync needs to be performed
    // a phase lock true will mean that we don't start / play / cue the track until time is ready ( forward delay )
    // This is like reverse direction of the current phaseLockPlayback which is a backward delay
    // for cueing with a forward motion, we need to delay the play / cue until the time is ready

    // will this "click?"? do we need to toggle volume or order?
    this.setTime(cueTime); // Snap precisely to cueTime


  }

  setCuePoint(cueNumber, time) {
    let cue = {
      time: time,
      name: `Cue ${cueNumber}`,
      type: 'cue'
    };
    this.metadata.cuePoints[cueNumber - 1] = cue;

    // update the cue point in the UI ??
    //transport.renderCuePoint(cueNumber - 1, t.detailedWaveform, t, cue)
    //transport.renderCuePoint(cueNumber - 1, t.overviewWaveform, t, cue)

    // optionally save the track with new metadata
    // library.updateTrackData(t);

  }

  isPlaying() {
    return !this.audioElement.paused;
  }

  emit(event, data) {
    // console.log("AudioTrack Emitting event:", event, data);
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  toggleMute() {
    this.audioElement.muted = !this.audioElement.muted;
  }

  toggleKeyLock() {
    this.audioElement.preservesPitch = !this.audioElement.preservesPitch;
  }

  mute() {
    this.audioElement.muted = true;
    // set the style on the volumeSliderIcon if exists
    if (this.transport.volumeSliderIcon) {
      this.transport.volumeSliderIcon.classList.remove('headphones-active');
      this.transport.volumeSliderIcon.classList.add('headphones-inactive');
    }
  }

  unmute() {
    this.audioElement.muted = false;
    // set the style on the volumeSliderIcon if exists
    if (this.transport.volumeSliderIcon) {
      this.transport.volumeSliderIcon.classList.remove('headphones-inactive');
      this.transport.volumeSliderIcon.classList.add('headphones-active');
    }
  }

  setVolume(value) {
    this.audioElement.volume = value;
  }

  getTitle() {

    let metadata = this.metadata;
    let trackTitle = metadata.fileName;

    if (!trackTitle) {
      return 'Load Track';
    }

    if (metadata.title) {
      trackTitle = metadata.title;
      if (metadata.artist) {
        trackTitle = `${metadata.artist} - ${metadata.title}`;
      }
    } else if (metadata.artist) {
      trackTitle = metadata.artist;
    }
    // clean up track title ( todo: rename files for real )
    trackTitle = trackTitle.replace('_(mp3.pm)', '');
    trackTitle = trackTitle.replace('.mp3', '');
    // replaces all instances of _ with space
    trackTitle = trackTitle.split('_').join(' ');

    console.log("GOT TRACK TITLE", trackTitle);
    return trackTitle;


  }

}

Track.prototype.getAudioBuffer = async function () {
  this.audioBuffer = await this.audioContext.decodeAudioData(audioData);
}

Track.prototype.setBPM = setBPM;



/*
class Track2 {
  constructor(options = {}) {
    this.id = options.id || `track-${Math.random().toString(36).substr(2, 9)}`;
    this.metadata = options.metadata || {};

    // Audio properties
    this.source = null;
    this.audioNodes = new Map();

    // UI properties
    this.element = null;
    this.renderers = new Map();
    this.currentRenderer = 'default';

    // State
    this.isLoaded = false;
    this.isRendered = false;

    // Playback state
    this.isPlaying = false;
    this.currentTime = 0;
    this.volume = 1.0;
    this.speed = 1.0;

    // Beat-matching properties
    this.beatGridOffset = 0;  // milliseconds offset for beat grid alignment
    this.syncEnabled = false;
    this.quantizeEnabled = false;

    // Loop and cue points
    this.loops = new Map();   // stored as {startTime, endTime, enabled}
    this.cuePoints = new Map(); // stored as {time, color, name}

    // Effects state
    this.effectsChain = [];   // order of effects in the chain
    this.effectsEnabled = new Map();  // which effects are active

    // Analysis results
    this.waveformData = null;
    this.beatData = null;
    this.phraseData = null;
  }

  // Existing methods...

  // New Playback Methods
  play(time = this.currentTime) {
    this.currentTime = time;
    this.isPlaying = true;
    // Implementation
  }

  pause() {
    this.isPlaying = false;
    // Implementation
  }

  seek(time) {
    this.currentTime = time;
    // Implementation
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    // Implementation
  }

  setSpeed(value) {
    this.speed = value;
    // Implementation
  }

  // Beat-matching Methods
  setBeatGridOffset(offset) {
    this.beatGridOffset = offset;
    // Update beat grid visualization
  }

  toggleSync() {
    this.syncEnabled = !this.syncEnabled;
    // Implementation
  }

  toggleQuantize() {
    this.quantizeEnabled = !this.quantizeEnabled;
    // Implementation
  }

  // Loop Methods
  addLoop(id, startTime, endTime) {
    this.loops.set(id, {
      startTime,
      endTime,
      enabled: false
    });
  }

  toggleLoop(id) {
    const loop = this.loops.get(id);
    if (loop) {
      loop.enabled = !loop.enabled;
      // Implementation
    }
  }

  // Cue Point Methods
  setCuePoint(id, options = {}) {
    this.cuePoints.set(id, {
      time: options.time || this.currentTime,
      color: options.color || '#ffffff',
      name: options.name || `Cue ${this.cuePoints.size + 1}`
    });
  }

  jumpToCue(id) {
    const cue = this.cuePoints.get(id);
    if (cue) {
      this.seek(cue.time);
    }
  }

  // Effects Methods
  setEffectParameter(effectId, param, value) {
    const node = this.audioNodes.get(effectId);
    if (node) {
      // Implementation
    }
  }

  reorderEffectChain(newOrder) {
    this.effectsChain = newOrder;
    this._reconnectAudioGraph();
  }

  // Analysis Methods
  async analyze() {
    await this._analyzeWaveform();
    await this._analyzeBeatGrid();
    await this._analyzePhrases();
  }

  // Beat Jump Methods
  beatJump(beats) {
    if (this.beatData) {
      // Implementation: Jump forward/backward by number of beats
    }
  }

  // Extended metadata methods
  addTag(tag) {
    if (!this.metadata.tags) {
      this.metadata.tags = new Set();
    }
    this.metadata.tags.add(tag);
  }

  setRating(rating) {
    this.metadata.rating = rating;
    this.setData({ rating });
  }

  // History tracking
  addToHistory(timestamp = Date.now()) {
    if (!this.metadata.playHistory) {
      this.metadata.playHistory = [];
    }
    this.metadata.playHistory.push(timestamp);
  }

  // Key detection and manipulation
  detectKey() {
    // Implementation: Analyze audio and detect musical key
  }

  setKey(key) {
    this.metadata.detectedKey = key;
    this.setData({ detectedKey: key });
  }

  // Extended private methods
  async _analyzeWaveform() {
    // Implementation: Generate waveform data
  }

  async _analyzeBeatGrid() {
    // Implementation: Detect beats and tempo
  }

  async _analyzePhrases() {
    // Implementation: Detect musical phrases
  }


}

*/