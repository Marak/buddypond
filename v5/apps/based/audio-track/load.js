import FetchInWebWorker from '../fetch-in-webworker/fetch-in-webworker.js';

//await this.bp.appendScript('/v5/apps/based/audio-track/vendor/ffmpeg/ffmpeg/package/dist/umd/ffmpeg.js');
//await this.bp.appendScript('/v5/apps/based/audio-track/vendor/ffmpeg/util/package/dist/umd/index.js');


//import { FFmpeg } from "/v5/apps/based/audio-track/vendor/ffmpeg/ffmpeg/package/dist/esm/index.js";
//import { fetchFile } from "/v5/apps/based/audio-track/vendor/ffmpeg/util/package/dist/esm/index.js";

// HTTP Provider implementation
class HTTPAudioProvider {
    constructor(bp) {
        this.bp = bp;
        this.fetchInWebWorker = new FetchInWebWorker();

    }

    async loadAudioData(url, options = {}, onProgress = () => { }) {
        // Ensure HTTP protocol ???
        // url = url.replace('https', 'http');
                /* 
        const response = await fetch(url, options);
        // make a copy of response so we can parse it twice
        const responseCopy = response.clone();
        console.log('response', response);
        let blob = await response.blob();
        let arrayBuffer = await responseCopy.arrayBuffer();
        console.log('arrayBuffer', arrayBuffer);
        console.log('blob', blob);
        return { arrayBuffer, blob };
       */
        const response = await this.fetchInWebWorker.fetchWithProgress(
            url,
            {},
            onProgress
        );

        return {
            arrayBuffer: response.arrayBufferResponse,
            blob: response.blobResponse
        };
    }
}


export default function bindPrototypeMethods(AudioTrack) {

    AudioTrack.prototype.load = async function (options = {}) {
        if (this.options?.noFile) return this;
    
        if (options.url) {
            this.metadata.url = options.url;
        }

        try {
    
            // Ensure we have a provider
            if (!this.provider) {
                this.provider = new HTTPAudioProvider(this.bp);
            }
            console.log("Loading audio track:", this.metadata.url, this);
    
            // Load audio data from provider
            const { arrayBuffer, blob } = await this.provider.loadAudioData(
                this.metadata.url,
                options,
                (progress) => this.loadingProgress(progress)
            );
    
            // Decode and process audio
            await this._processAudioData(arrayBuffer, blob);
    
            // Setup media source and handle platform-specific loading
            return await this._setupMediaSource(blob);
        } catch (error) {
            console.error(`Failed to load track: ${this.metadata.url}`, error);
            throw error;
        }
    };
    
    AudioTrack.prototype._setupMediaSource = async function (blob) {
        return new Promise(async (resolve, reject) => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
            if (isIOS) {
                // Directly use blob URL for iOS
                this.audioElement.src = URL.createObjectURL(blob);
                this.audioElement.addEventListener("canplaythrough", () => {
                    // set the duration on t.metadata.duration
                    this.metadata.duration = this.audioElement.duration;
                    resolveLoad();
                });
                this.audioElement.addEventListener("error", rejectLoad);
            } else {
                // Use MediaSource for other platforms
                const mediaSource = new MediaSource();
                this.audioElement.src = URL.createObjectURL(mediaSource);
    
                mediaSource.addEventListener("sourceopen", async () => {
                    try {
                        const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
                        const arrayBuffer = await blob.arrayBuffer();
                        // set the duration on t.metadata.duration
                        this.metadata.duration = this.audioBuffer.duration;
                        sourceBuffer.addEventListener("updateend", resolveLoad);
                        sourceBuffer.addEventListener("error", rejectLoad);
                        sourceBuffer.appendBuffer(arrayBuffer);
                    } catch (err) {
                        console.error("Error with MediaSource or SourceBuffer:", err);
                        rejectLoad(err);
                    }
                });
            }
    
            const resolveLoad = () => {
                if (this.isLoaded) return;
                this.isLoaded = true;
                console.log("Track loaded:", this.metadata.url);
                resolve(this);
            };
    
            const rejectLoad = (err) => {
                console.error("Audio element error:", err);
                reject(`Failed to load track: ${this.metadata.url}`);
            };
    
            // Load and setup the media if not using MediaSource
            if (isIOS || (this.url && this.url.endsWith('.wav'))) {
                this.audioElement.load();
            }
        });
    };
    
    AudioTrack.prototype._initializeAudioElements = function () {
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = "anonymous";
        this.audioElement.preservesPitch = true;
    };

    AudioTrack.prototype._processAudioData = async function (arrayBuffer, blob) {
        this.audioData = arrayBuffer;
        this.blob = blob;
        console.log('Audio data received:', this.audioData);
    
        // Decode using Web Worker
        // this.audioBuffer = await this._decodeAudioWithFFmpeg(arrayBuffer);
        // decode with audioContext
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.metadata.fileSize = this.audioBuffer.length;
    
        // Extract channel data
        const channelData = extractAudioBuffer(this.audioBuffer);
    };
    AudioTrack.prototype._decodeAudioWithFFmpeg = async function (arrayBuffer) {

        let ffmpeg = new FFmpeg();

            await ffmpeg.load();
            console.log("✅ FFmpeg WASM loaded successfully");
    
        return new Promise(async (resolve, reject) => {
            try {
                console.log("⏳ Decoding audio with FFmpeg...");
    
                // Write audio data into FFmpeg virtual filesystem
                const inputFileName = 'input.mp3';
                const outputFileName = 'output.raw';
                await ffmpeg.writeFile(inputFileName, await fetchFile(arrayBuffer));
    
                // Convert input audio to raw PCM Float32
                await ffmpeg.exec([
                    '-i', inputFileName, 
                    '-f', 'f32le', 
                    '-acodec', 'pcm_f32le', 
                    '-ar', '44100', // Force 44.1kHz sample rate
                    '-ac', '2', // Stereo output
                    outputFileName
                ]);
    
                // Read decoded PCM data
                const outputData = await ffmpeg.readFile(outputFileName);
    
                // Convert PCM data to Web Audio API's AudioBuffer
                const sampleRate = 44100; // Match conversion settings
                const numberOfChannels = 2; // Stereo
                const frameCount = outputData.length / (numberOfChannels * 4); // 4 bytes per Float32 sample
    
                const audioContext = new AudioContext();
                const audioBuffer = audioContext.createBuffer(numberOfChannels, frameCount, sampleRate);
    
                // De-interleave PCM data into separate channels
                const interleaved = new Float32Array(outputData.buffer);
                for (let i = 0; i < numberOfChannels; i++) {
                    const channelData = new Float32Array(frameCount);
                    for (let j = 0; j < frameCount; j++) {
                        channelData[j] = interleaved[j * numberOfChannels + i];
                    }
                    audioBuffer.copyToChannel(channelData, i);
                }
    
                console.log("✅ Audio decoded successfully");
                resolve(audioBuffer);
            } catch (err) {
                console.log(err)
                reject(new Error(`❌ FFmpeg decoding failed: ${err.message}`));
            }
        });
    };
    

    /*
    TODO: use the audioWOrker instead of the audioContext.decodeAudioData
    const audioWorker = new Worker('audioWorker.js');

function decodeAudioWithFFmpeg(arrayBuffer) {
    return new Promise((resolve, reject) => {
        audioWorker.onmessage = (e) => {
            if (e.data.error) {
                reject(new Error(e.data.error));
            } else {
                resolve(e.data);
            }
        };
        audioWorker.postMessage(arrayBuffer, [arrayBuffer]); // Transfer data
    });
}

// Example usage:
fetch('your-audio-file.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => decodeAudioWithFFmpeg(arrayBuffer))
    .then(decodedData => {
        console.log('Decoded WAV received:', decodedData);
        // Use AudioContext.decodeAudioData here if needed
    })
    .catch(err => console.error('FFmpeg decoding failed:', err));



    */

    
    // Helper methods for tracking load progress
    AudioTrack.prototype.loadingProgress = function (progress) {
        // Implement loading progress updates
        this.emit('audio-track::loading::progress', progress);
    };

    AudioTrack.prototype.loadingComplete = function (progress) {
        // Implement loading completion
        this.emit('audio-track::loading::complete', progress);
    };

}


// Extract channel data from AudioBuffer
function extractAudioBuffer(audioBuffer) {
    const channelData = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channelData.push(audioBuffer.getChannelData(i));
    }
    return channelData;
}
