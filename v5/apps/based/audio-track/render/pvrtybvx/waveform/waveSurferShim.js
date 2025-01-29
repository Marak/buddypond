// wavesurfer-shim.js
class WaveSurferShim {
    constructor(options) {
        this.media = options.media || null;
        this.currentTime = 0;
        this.playbackRate = 1;
        this.volume = 1;
        this.eventListeners = {};
        this.container = options.container || document.body;
        this.waveColor = options.waveColor || 'green';
        this.progressColor = options.progressColor || 'blue';
        this.width = options.width || 500;
        this.height = options.height || 100;
        this.peaks = options.peaks || null;
        this.showWaveform = true;

        if (typeof options.showWaveform === 'boolean') {
            this.showWaveform = options.showWaveform;
        }

        if (!this.media) {
            console.warn("WaveSurferShim initialized without a media element.");
        }

        this._setupMediaListeners();

        // check to make sure we wish to have visual waveform
        // in mobile mode we are just using shim API, no visual waveform
        if (this.showWaveform) {
            this._createCanvas();

            if (this.peaks) {
                this._renderWaveform(this.peaks);
            }
            this._startAnimationLoop();
        }
    }

    _createCanvas() {
        // Create and configure canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.border = '1px solid #ccc';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    _renderWaveform(peaks) {
        if (!peaks) {
            console.warn("WaveSurferShim: No peaks provided for rendering.");
            return;
        }

        const samples = this._downsampleData(peaks, this.width);

        // Draw the waveform
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = this.waveColor;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        for (let i = 0; i < samples.length; i++) {
            const x = (i / samples.length) * this.width;
            const y = (1 - samples[i]) * (this.height / 2); // Normalize and center
            const centerY = this.height / 2;

            // Draw top half
            this.ctx.moveTo(x, centerY);
            this.ctx.lineTo(x, y);

            // Draw bottom half (inverted)
            this.ctx.moveTo(x, centerY);
            this.ctx.lineTo(x, centerY + (centerY - y));
        }

        this.ctx.stroke();
    }

    _updateProgress() {
        if (!this.media) return;

        if (!this.showWaveform) {
            return;
        }
        const progress = this.media.currentTime / this.media.duration;

        // Redraw waveform and overlay progress
        this._renderWaveform(this.peaks);
        this.ctx.fillStyle = this.progressColor;
        this.ctx.globalAlpha = 0.5; // Make the progress overlay slightly transparent
        this.ctx.fillRect(0, 0, this.width * progress, this.height);
        this.ctx.globalAlpha = 1; // Reset transparency
    }

    _downsampleData(data, width) {
        const sampleRate = Math.floor(data.length / width);
        const samples = [];
        for (let i = 0; i < data.length; i += sampleRate) {
            samples.push(data[i]);
        }
        return samples.map(value => (value + 1) / 2); // Normalize to [0, 1]
    }

    _startAnimationLoop() {
        const update = () => {
            this._updateProgress();
            requestAnimationFrame(update);
        };
        update();
    }


    play() {
        if (this.media) {
            this.media.play();
            this._emit('play');
            this._startProgress();
        } else {
            console.warn("WaveSurferShim: No media element to play.");
        }
    }

    pause() {
        if (this.media) {
            this.media.pause();
            this._emit('pause');
            this._stopProgress();
        } else {
            console.warn("WaveSurferShim: No media element to pause.");
        }
    }

    seekTo(time) {
        this.currentTime = time;
        if (this.media) {
            this.media.currentTime = time;
        }
        this._updateProgress();
    }

    _startProgress() {
        if (this.media) {
            this.progressInterval = setInterval(() => this._updateProgress(), 5);
        }
    }

    _stopProgress() {
        clearInterval(this.progressInterval);
    }

 
    getVolume() {
        return this.volume;
    }

    getDuration() {
        return this.media ? this.media.duration : 0;
    }

    seekTo(time) {
        this.currentTime = time;
        if (this.media) {
            this.media.currentTime = time;
        }
    }

    setTime(time) {
        this.currentTime = time;
        if (this.media) {
            this.media.currentTime = time;
        }
    }

    isPlaying() {
        return this.media ? !this.media.paused : false;
    }
    getCurrentTime() {
        return this.media ? this.media.currentTime : this.currentTime;
    }

    setPlaybackRate(rate) {
        this.playbackRate = rate;
        if (this.media) {
            this.media.playbackRate = rate;
        }
    }

    getPlaybackRate() {
        return this.playbackRate;
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.media) {
            this.media.volume = volume;
        }
    }

    destroy() {
        console.log("WaveSurferShim: destroy called.");
        if (this.media) {
            this.media.pause();
            this.media = null;
        }

        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        if (this._timeUpdateTimeout) {
            clearTimeout(this._timeUpdateTimeout);
        }

        this.eventListeners = {};
    }

    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    _emit(event, ...args) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(...args));
        }
    }


    _setupMediaListeners() {
        //if (!this.media) return;


        if (this.media) {
            this.media.addEventListener('loadeddata', () => {
                this._emit('ready');
            });
            this.media.addEventListener('timeupdate', () => {
                // this event timeupdate is taking up a lot of CPU?
                // we are seeing Commit / Animation Frame fired near this event
                // even with showWaveform set to false 
                this._emit('audioprocess', this.getCurrentTime());
            });

            this.media.addEventListener('seeked', () => {
                this._emit('seeking', this.getCurrentTime());
            });

        } else {
        }
        setTimeout(() => {
            this._emit('ready');
        }, 0);

    }
}

// Factory function to mimic WaveSurfer.create()
WaveSurferShim.create = function (options) {

    let container = options.container || document.body;
    console.log("FFFF", options)
    let waveform = new WaveSurferShim(options);

    // create a new shim div with options.width and options.height
    let shim = document.createElement('div');
    shim.style.width = options.width + 'px';
    shim.style.height = options.height + 'px';
    // shim.style.backgroundColor = options.waveColor || 'green';
    shim.style.color = options.color || 'white';
    shim.style.border = '1px solid white';
    shim.style.borderRadius = '5px';

    // Add the shim to the container
    //container.appendChild(shim);

    waveform.container = shim;
    console.log("WAAAV", waveform);


    waveform.regions = {};
    waveform.regions.addRegion = function (options) {
        let region = document.createElement('div');
        region.style.position = 'absolute';
        region.style.backgroundColor = options.color || 'rgba(255, 0, 0, 0.3)';
        region.style.height = '100%';
        region.style.width = (options.end - options.start) * options.width + 'px';
        region.style.left = options.start * options.width + 'px';
        //shim.appendChild(region);
    };

    return waveform;
};

// Export as the default module
export default WaveSurferShim;


