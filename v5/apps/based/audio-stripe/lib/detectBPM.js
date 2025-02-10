export default class BPMDetectPlugin {

    constructor(track) {
        this.track = track;
        this.bpm = 0;
        this.audioBuffer = null;
    }

    async init(trackId, audioElement, audioContext) {
        this.audioBuffer = this.track.audioBuffer;
        this.duration = this.audioBuffer.duration;
        this.trackId = trackId;
        if (this.audioBuffer) {
            this.trackLength = audioElement.duration;
        }
    }

    // Method to detect BPM, can be called anytime after initialization
    async detectBPM() {
        let audioBuffer = this.track.audioBuffer;
        return 125; // for now, need to add back web-audio-beat-detector, aubio is too slow
        // Load the Aubio.js module
        const aubioModule = await aubio();

        // Create a new instance of the Tempo class
        const sampleRate = audioBuffer.sampleRate;
        // large files / whole files
        let bufferSize = 1024; // Size of the buffer for each analysis frame
        let hopSize = 512;     // Number of samples between each analysis frame

        const tempo = new aubioModule.Tempo(bufferSize, hopSize, sampleRate);

        // Get the audio data from the buffer
        const audioData = audioBuffer.getChannelData(0);
        if (!audioData || !(audioData instanceof Float32Array)) {
            throw new Error('Invalid audio data: Ensure audio decoding is correct.');
        }

        // Process the audio data in chunks
        for (let i = 0; i < audioData.length; i += hopSize) {
            const frame = audioData.slice(i, i + bufferSize);

            // Ensure the frame has valid data
            if (frame.length < bufferSize) {
                console.warn('Skipping incomplete frame at the end of audio data.');
                continue; // Skip the final chunk if it's incomplete
            }

            const isBeat = tempo.do(frame);

        }


        // Get the estimated BPM
        const bpm = tempo.getBpm();

        console.log(`Estimated BPM: ${bpm}`);

        // beatTimes is now an array of strings with the beat times in seconds
        // conver this to an array of numbers with precision to 3 decimal places
        // beatTimes = beatTimes.map(time => Number(parseFloat(time).toFixed(3)));

        // console.log('Detected beat times (in seconds):', beatTimes);


        return bpm;

    }
}