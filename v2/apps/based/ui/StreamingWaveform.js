export default class StreamingWaveform {
    constructor({ audioContext, stream = null, buffer = null, parent, width, height }) {
        this.audioContext = audioContext;
        this.stream = stream; // MediaStream input
        this.buffer = buffer; // AudioBuffer input
        this.parent = parent;

        // Canvas setup
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("streaming-waveform");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width || 800; // Default width
        this.canvas.height = height || 150; // Default height
        this.parent.appendChild(this.canvas);

        this.isDrawing = false;
        this.currentX = 0; // Current x position for left-to-right drawing

        // Web Audio setup
        this.analyser = null;

        if (this.stream) {
            this._setupStream();
        } else if (this.buffer) {
            this._drawBuffer();
        }

        // Playhead state
        this.playHeadPosition = 0;
    }

    // If a stream is provided, connect it to an analyser node
    _setupStream() {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 1024; // Smooth waveform

        const inputSource = this.audioContext.createMediaStreamSource(this.stream);
        inputSource.connect(this.analyser);

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this._startDrawing();
    }

    // Start drawing the waveform for a stream
    _startDrawing() {
        this.isDrawing = true;

        const draw = () => {
            if (!this.isDrawing) return;

            requestAnimationFrame(draw);

            this.analyser.getByteTimeDomainData(this.dataArray);

            // Clear only the next slice area
            this.ctx.fillStyle = "#222";
            this.ctx.fillRect(this.currentX, 0, 2, this.canvas.height); // Clear old data slice

            // Draw the new waveform slice
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();

            const sliceHeight = this.canvas.height / 2;

            for (let i = 0; i < this.bufferLength; i++) {
                const value = this.dataArray[i] / 255.0;
                const y = sliceHeight + (value - 0.5) * sliceHeight;

                if (i === 0) {
                    this.ctx.moveTo(this.currentX, y);
                } else {
                    this.ctx.lineTo(this.currentX, y);
                }
            }

            this.ctx.stroke();

            // Move the draw position right
            this.currentX += 2;

            // If we reach the end, reset to the start
            if (this.currentX >= this.canvas.width) {
                this.currentX = 0;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };

        draw();
    }

    // Set the playhead position (value between 0 and 1)
    setPlayHeadPosition(position) {
        if (position < 0 || position > 1) return;

        this.playHeadPosition = position;
        this._redrawBufferWithPlayhead();
    }

    // Draw an AudioBuffer
    _drawBuffer() {
        this.rawData = this.buffer.getChannelData(0); // First channel
        this.totalSamples = this.rawData.length;
        this.samplesPerPixel = Math.ceil(this.totalSamples / this.canvas.width);
        this._redrawBufferWithPlayhead();
    }

    // Redraw the buffer waveform and playhead
    _redrawBufferWithPlayhead() {
        const sliceHeight = this.canvas.height / 2;

        // Clear canvas
        this.ctx.fillStyle = "#222";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the waveform
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#00ff00";
        this.ctx.beginPath();

        for (let x = 0; x < this.canvas.width; x++) {
            const start = x * this.samplesPerPixel;
            const end = start + this.samplesPerPixel;

            let min = 1.0;
            let max = -1.0;

            for (let i = start; i < end; i++) {
                const value = this.rawData[i] || 0;
                if (value > max) max = value;
                if (value < min) min = value;
            }

            const yMin = sliceHeight + min * sliceHeight;
            const yMax = sliceHeight + max * sliceHeight;

            if (x === 0) {
                this.ctx.moveTo(x, yMin);
            } else {
                this.ctx.lineTo(x, yMin);
            }
            this.ctx.lineTo(x, yMax);
        }
        this.ctx.stroke();

        // Draw the playhead
        this._drawPlayhead();
    }

    // Draw the playhead as a vertical line
    _drawPlayhead() {
        const playheadX = Math.floor(this.playHeadPosition * this.canvas.width);

        this.ctx.strokeStyle = "#FF0000"; // Playhead color
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(playheadX, 0);
        this.ctx.lineTo(playheadX, this.canvas.height);
        this.ctx.stroke();
    }

    remove() {
        this.canvas.remove();
    }

    // Stop live waveform drawing
    stop() {
        this.isDrawing = false;
    }

    // Clear the canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentX = 0;
    }
}