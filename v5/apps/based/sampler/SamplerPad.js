export default class SamplerPadEffect {
  constructor(audioContext, globalBus = null) {
    this.context = audioContext;
    this.buffers = Array(8).fill(null); // Storage for audio buffers (8 pads)
    this.recorder = null;
    this.recordedChunks = [];
    this.activeSources = new Map(); // Track active sources
    this.pitchStates = new Map(); // Track current pitch states for active sources
    this.gainNode = this.context.createGain(); // Gain node for volume control
    this.mode = Array(8).fill('one-shot'); // Default mode is 'one-shot' for each pad
    this.reversePlayback = Array(8).fill(false); // Reverse playback flag for each pad

    // Connect gainNode to global bus or directly to destination
    if (globalBus) {
      globalBus.addTrack(this.gainNode, this.context);
    } else {
      this.gainNode.connect(this.context.destination);
    }
  }


  async unload() {
    this.buffers = Array(8).fill(null);
    this.recorder = null;
    this.recordedChunks = [];
    this.activeSources.clear();
    this.pitchStates.clear();
  }

  async loadSample(file, padIndex) {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.buffers[padIndex] = audioBuffer;
    if (this.reversePlayback[padIndex]) {
      this.reverseBuffer(padIndex); // Reverse the buffer if the pad is set to reverse
    }
  }

  // TODO: we previously had the waveform generate, where did it go?
  async recordMicrophone(padIndex) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recorder = new MediaRecorder(stream);
    this.recordedChunks = [];

    let resolveBuffer;
    const bufferPromise = new Promise((resolve) => (resolveBuffer = resolve));

    this.recorder.ondataavailable = (e) => this.recordedChunks.push(e.data);
    this.recorder.onstop = async () => {
      const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers[padIndex] = audioBuffer;
      resolveBuffer(audioBuffer);
    };

    this.recorder.start();
    return { stream, bufferPromise }; // return both
  }

  stopMicrophoneRecording() {
    if (this.recorder && this.recorder.state === "recording") {
      this.recorder.stop();
    }
  }

  recordGlobalBus(globalBus, padIndex) {
    const streamDestination = globalBus.audioContext.createMediaStreamDestination();
    globalBus.gainNode.connect(streamDestination);

    this.recorder = new MediaRecorder(streamDestination.stream);
    this.recordedChunks = [];

    this.recorder.ondataavailable = (e) => this.recordedChunks.push(e.data);
    this.recorder.onstop = async () => {
      const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      this.buffers[padIndex] = await this.context.decodeAudioData(arrayBuffer);
    };

    this.recorder.start();
    return streamDestination.stream;
  }

  stopGlobalBusRecording() {
    if (this.recorder && this.recorder.state === "recording") {
      this.recorder.stop();
    }
  }

  playSampleAtPitch(padIndex, pitchRatio) {
    if (!this.buffers[padIndex]) return;

    const source = this.context.createBufferSource();
    source.buffer = this.buffers[padIndex];
    source.playbackRate.value = pitchRatio; // Adjust pitch
    source.connect(this.gainNode);
    // console.log('confirming this.gainNode', this.gainNode);

    source.start();
    // Store the source and initial pitch ratio for potential modulation
    this.activeSources.set(padIndex, source);
    this.pitchStates.set(padIndex, pitchRatio);
  }

  setReverse(padIndex, reverse) {
    this.reversePlayback[padIndex] = reverse;
    if (reverse) {
      this.reverseBuffer(padIndex);
    } else {
      // Reload or reassign the original buffer if turning off reverse
      this.loadSample(originalFile, padIndex); // Ensure `originalFile` is stored or accessible
    }
  }

  reverseBuffer(padIndex) {
    const buffer = this.buffers[padIndex];
    const numChannels = buffer.numberOfChannels;
    const reversedBuffer = this.context.createBuffer(numChannels, buffer.length, buffer.sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      const reversedData = reversedBuffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        reversedData[i] = channelData[buffer.length - 1 - i];
      }
    }

    this.buffers[padIndex] = reversedBuffer; // Replace the original buffer with reversed
  }

  // Method to set the playback mode
  setMode(padIndex, mode) {
    this.mode[padIndex] = mode; // mode could be 'one-shot', 'hold', or 'toggle'
  }

  playSample(padIndex, press = false) {
    if (!this.buffers[padIndex]) return;

    const source = this.context.createBufferSource();
    source.buffer = this.buffers[padIndex];
    source.connect(this.gainNode);

    const existingSource = this.activeSources.get(padIndex);
    if (existingSource && this.mode[padIndex] === 'loop' && existingSource.loop) {
      this.stopSample(padIndex);  // Stop loop if already playing
      return;
    }
    console.log('existingSource', existingSource, 'this.mode[padIndex]', this.mode[padIndex]);
    switch (this.mode[padIndex]) {
      case 'one-shot':
      case 'hold':
      case 'toggle':
      case 'loop':
        if (existingSource && (this.mode[padIndex] === 'toggle' || this.mode[padIndex] === 'loop')) {
          console.log("STOPPING");
          this.stopSample(padIndex);
          return;
        }
        source.loop = this.mode[padIndex] === 'loop';
        source.start();
        console.log('setting the activeSources', source);
        this.activeSources.set(padIndex, source);
        break;
    }
  }

  stopSample(padIndex) {
    const source = this.activeSources.get(padIndex);
    if (source) {
      source.loop = false;
      source.stop();
      this.activeSources.delete(padIndex);
    }
  }

  // Add event handlers to bind UI button presses/releases to these methods
  handlePadPress(padIndex) {
    if (this.mode[padIndex] === 'hold') {
      this.playSample(padIndex, true);
    } else {
      this.playSample(padIndex);
    }
  }

  handlePadRelease(padIndex) {
    if (this.mode[padIndex] === 'hold') {
      this.stopSample(padIndex);
    }
  }

  stopAllRecordings() { // Currently all the same stop functions ( shared recorder between global and mic )
    if (this.recorder && this.recorder.state === "recording") {
      this.recorder.stop();
    }
  }

  stopAllSamples() {

    // call stopSample on each active source
    this.activeSources.forEach((source) => {
      source.loop = false;
      source.stop();
    });
    //this.activeSources.forEach((source) => source.stop());
    this.activeSources.clear();
    this.pitchStates.clear();
  }

  setModWheel(value) {
    // TODO: more of a change based on value, we want more of a pitch bend
    const amplifiedValue = value * 5.5; // Increase multiplier as needed for stronger effect

    console.log('incoming value from -1 to 1', value);
    console.log('amplifiedValue', amplifiedValue);
    const activeSources = this.activeSources.entries();
    for (const [padIndex, source] of activeSources) {
      const basePitch = this.pitchStates.get(padIndex) || 1; // Get the initial pitch
      const pitchBendRatio = basePitch * Math.pow(2, amplifiedValue / 12); // Adjust relative to current pitch
      source.playbackRate.value = pitchBendRatio;
    }
  }

  adjustVolume(value) {
    // Normalize value to a range of 0 to 1
    const normalizedValue = Math.max(0, Math.min(1, value));
    this.gainNode.gain.setValueAtTime(normalizedValue, this.context.currentTime);
  }

}