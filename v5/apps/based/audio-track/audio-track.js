import AudioTrackClass from './AudioTrack.js';

export default class AudioTrack {
  constructor(bp) {
    this.bp = bp;
    this.AudioTrack = AudioTrackClass;
    this.tracks = []
  }

  init () {
    console.log("AudioTrack init");
  }

  open (config) {
    console.log("AudioTrack open", config);
  }

  createAudioTrack (config) {
    let t = new this.AudioTrack(config);
    this.tracks.push(t);
    return t;
  }


}