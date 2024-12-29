import StreamingWaveform from "../../ui/StreamingWaveform.js";

// Create Sliced Record Button
export default function  _createSlicedRecordButton() {
        const button = document.createElement("button");
        button.textContent = "Global Sliced Record";
        //button.innerHTML = `Record <i class="fa-duotone fa-solid fa-volume-high"></i>`;

        button.innerHTML = '<i class="fa-duotone fa-solid fa-cassette-tape"></i>';
        button.style.fontSize = "2.5rem";

        
        button.title = "Record audio from global output bus and slice into 8 pads";
        button.classList.add("sampler-record-button");
        button.style.gridColumn = "span 4";

        let recordingStream = null;
        let recorder = null;
        let recordedChunks = [];

        // TODO: refactor this into SamplerComponent.startGlobalRecording()
        button.addEventListener("mousedown", async () => {
            recordedChunks = [];
            const streamDestination = this.globalBus.audioContext.createMediaStreamDestination();
            this.globalBus.gainNode.connect(streamDestination);
            recordingStream = streamDestination.stream;


            // Start the waveform rendering
            this.waveform = new StreamingWaveform({
                audioContext: this.globalBus.audioContext,
                stream: recordingStream,
                parent: this.waveformContainer,
                width: 800,
                height: 280,
            });
            this.waveformContainer.style.position = "absolute";
            this.waveformContainer.style.top = "0";
            this.waveformContainer.style.left = "0";
            this.waveformContainer.style.zIndex = "9999";
            

            // TOOD: move to Sampler class
            recorder = new MediaRecorder(recordingStream);
            recorder.ondataavailable = (e) => recordedChunks.push(e.data);

            recorder.start();
            console.log("Sliced recording started...");
        });

        // TODO: refactor this into SamplerComponent.stopGlobalRecording()
        button.addEventListener("mouseup", async () => {

            if (this.waveform) {
                this.waveform.stop();
                console.log("Sliced recording stopped.");
                this.waveform.remove();
            }
            if (recorder && recorder.state === "recording") {
                recorder.stop();

                recorder.onstop = async () => {
                    console.log("Sliced recording stopped.");

                    // Process recorded audio
                    const blob = new Blob(recordedChunks, { type: "audio/webm" });
                    const arrayBuffer = await blob.arrayBuffer();
                    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                    this._sliceAndLoadToPads(audioBuffer);
                };
            }
        });

        return button;
    }

