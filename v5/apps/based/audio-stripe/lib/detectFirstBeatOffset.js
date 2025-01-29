export default async function detectFirstBeatOffset(track) {
    // console.log('detectFirstBeatOffset', track);

    const audioContext = track.audioContext;
    const audioElement = track.audioElement;

    // Fetch and decode the audio data
    //const audioData = await api.fetch(audioElement.src).then(response => response.arrayBuffer());
    //const audioBuffer = await audioContext.decodeAudioData(audioData);
    const audioData = track.audioData;
    const audioBuffer = track.audioBuffer;

    const duration = audioBuffer.duration;

    // Create an OfflineAudioContext for analysis
    const offlineContext = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);

    // Create a buffer source in the offline context
    const offlineSource = offlineContext.createBufferSource();
    offlineSource.buffer = audioBuffer;
    offlineSource.connect(offlineContext.destination);

    // Start the source and render the audio offline
    offlineSource.start(0);
    const renderedBuffer = await offlineContext.startRendering();

    // Analyze the rendered buffer
    const channelData = renderedBuffer.getChannelData(0);  // Use the first channel's data
    const sampleRate = renderedBuffer.sampleRate;
    const threshold = 0.01;  // Adjust threshold for a more noticeable beat spike

    // Sliding window analysis to detect the first beat
    let firstBeatOffset = 0;
    const windowSize = 512;  // Similar to fftSize
    const stepSize = windowSize / 4;

    // Create an Analyser node
    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = windowSize;
    offlineSource.connect(analyser);

    // Analyze frequency data within each window
    const frequencyData = new Float32Array(analyser.frequencyBinCount);
    // let firstBeatOffset = 0;
    const lowFrequencyRange = 50;  // Focus on first 50 bins for low frequencies

    for (let i = 0; i < channelData.length; i += stepSize) {
        analyser.getFloatFrequencyData(frequencyData);

        const lowFrequencyEnergy = frequencyData.slice(0, lowFrequencyRange).reduce((sum, val) => sum + val, 0);
        if (lowFrequencyEnergy > threshold) {
            firstBeatOffset = i / sampleRate;
            break;
        }
    }



    for (let i = 0; i < channelData.length; i += stepSize) {
        const window = channelData.slice(i, i + windowSize);

        // Check if any sample in the window exceeds the threshold
        if (window.some(value => Math.abs(value) > threshold)) {
            firstBeatOffset = i / sampleRate;
            // console.log(`Detected first beat offset at: ${firstBeatOffset} seconds`);
            break;
        }
    }

    return { firstBeatOffset, duration };
}
