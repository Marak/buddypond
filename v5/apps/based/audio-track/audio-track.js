import AudioTrackClass from './AudioTrack.js';

export default class AudioTrack {
  constructor(bp) {
    this.bp = bp;
    this.AudioTrack = AudioTrackClass;
    this.tracks = []
  }

  async init () {
    console.log("AudioTrack init");

    // TODO: implement ffmpeg for decoding audio outside of main thread
    //   await this.bp.appendScript('/v5/apps/based/audio-track/vendor/ffmpeg/ffmpeg/package/dist/umd/ffmpeg.js');
    //   await this.bp.appendScript('/v5/apps/based/audio-track/vendor/ffmpeg/util/package/dist/umd/index.js');
    //   await this.bp.appendScript('/v5/apps/based/audio-track/vendor/ffmpeg/util/package/dist/umd/index.js');

    //<script src="/assets/ffmpeg/package/dist/umd/ffmpeg.js"></script>
    //<script src="/assets/util/package/dist/umd/index.js"></script>

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