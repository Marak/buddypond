// HTTP Provider implementation
class HTTPAudioProvider {
    constructor(bp) {
        this.bp = bp;
    }

    async loadAudioData(url, options = {}, onProgress = () => { }) {
        // Ensure HTTP protocol
        url = url.replace('https', 'http');
        const response = await fetch(url, options);
        // make a copy of response so we can parse it twice
        const responseCopy = response.clone();
        console.log('response', response);
        let blob = await response.blob();
        let arrayBuffer = await responseCopy.arrayBuffer();
        console.log('arrayBuffer', arrayBuffer);
        console.log('blob', blob);
        return { arrayBuffer, blob };
        /*
        const response = await this.bp.apps['fetch-in-webworker'].fetchWithProgress.fetch(
            url,
            {},
            onProgress
        );

        return {
            arrayBuffer: response.arrayBufferResponse,
            blob: response.blobResponse
        };
        */
    }
}




export default function bindPrototypeMethods(AudioTrack) {

    AudioTrack.prototype.load = async function (options = {}) {
        if (this.options?.noFile) return this;
    
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
        console.log('Audio data:', this.audioData);
        // Decode audio
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.metadata.fileSize = this.audioBuffer.length;

        // Extract channel data
        const channelData = extractAudioBuffer(this.audioBuffer);
    };

    
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
