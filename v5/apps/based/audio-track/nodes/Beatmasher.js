export default class BeatmasherEffect {
  constructor(track, options = {}) {
      this.track = track; // Reference to the Track instance
      this.context = track.audioContext; // Use Track's audio context
      this.buffer = track.audioBuffer;   // Use Track's audio buffer
      this.isActive = false;             // Effect status
      this.loopStart = 0;                // Start of the loop in seconds
      this.loopLength = options.loopLength || 0.2; // Default loop length (200ms)
      this.playbackRate = 1.0;           // Playback rate
      this.beatLength = options.beatLength || 0.5; // Default beat grid length (500ms)
      this.beatBending = options.beatBending !== undefined ? options.beatBending : false; // Beat bending toggle

      this.sourceNodes = [];
  }

  // Start the Beatmasher effect
  start(loopStart = 0) {
      if (this.isActive) return;
      this.isActive = true;
      console.log("BeatmasherEffect start", loopStart)
      this.loopStart = loopStart;
      this.scheduleLoop();
  }

  // Schedule and play the looped segment with optional tempo bend
  scheduleLoop() {
      if (!this.isActive) return;

      const source = this.context.createBufferSource();
      source.buffer = this.buffer;

      const segmentStart = this.loopStart;
      const segmentEnd = this.loopStart + this.loopLength;

      source.loop = true;
      source.loopStart = segmentStart;
      source.loopEnd = segmentEnd;

      // Create a gain node for smooth transitions
      const gainNode = this.context.createGain();
      source.connect(gainNode);

      // set the gain node's gain to 1 
      gainNode.gain.value = 1;

      // Add the gain node to the Track's audio graph
      this.track.addNode('beatmasher-gain', gainNode);

      // Apply playback rate bend if enabled
      if (this.beatBending) {
          this.applyTempoBend(source);
      }

      // Start playback
      source.start(0, segmentStart);
      this.sourceNodes.push(source);
  }

  // Apply tempo bending logic
  applyTempoBend(source) {
      const loopDuration = this.loopLength;

      // Gradual tempo bend using setTimeout
      const slowdownTime = loopDuration * 0.8; // Slowdown starts 80% into the loop
      const speedupTime = 0.2; // Speedup for the first 20% of the loop

      // Slowdown near the loop end
      setTimeout(() => {
          source.playbackRate.setValueAtTime(0.9, this.context.currentTime);
      }, slowdownTime * 1000);

      // Speedup at the loop start
      setTimeout(() => {
          source.playbackRate.setValueAtTime(1.1, this.context.currentTime);
          source.playbackRate.linearRampToValueAtTime(1.0, this.context.currentTime + 0.05);
      }, speedupTime * 1000);
  }

  // Adjust loop length dynamically
  setLoopLength(length, playbackRate = 1.0) {
    console.log('setting loopLength', length)
      this.loopLength = Math.max(0.05, length);
      console.log('using sourceNodes', this.sourceNodes)
      this.sourceNodes.forEach(source => {
          source.loopEnd = this.loopStart + this.loopLength;
          source.playbackRate.setValueAtTime(playbackRate, this.context.currentTime);
      });
  }

  // Stop the effect
  stop() {
      this.isActive = false;
      this.playbackRate = 1.0;
      this.sourceNodes.forEach(node => node.stop());
      this.sourceNodes = [];

      // Remove the gain node from the Track's audio graph
      this.track.removeNode('beatmasher-gain');
  }
}