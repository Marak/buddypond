import StreamingWaveform from "../../ui/StreamingWaveform.js";

export default function _createLiveSlicedRecordButton() {
    const button = document.createElement("button");
    //button.textContent = "Mic Sliced Record";
    button.title = "Record audio from microphone and slice into 8 pads";
    button.classList.add("sampler-record-button");
    button.style.gridColumn = "span 4";

    button.innerHTML = `<i class="fa-duotone fa-solid fa-microphone-lines"></i>`;
    button.style.fontSize = "2.5rem";

    let recordingStream = null;
    let recorder = null;
    let recordedChunks = [];
    let mediaStreamSource = null;

    // TODO: refactor this into SamplerComponent.startMicrophoneRecording()
    button.addEventListener("mousedown", async () => {
        recordedChunks = [];

        try {
            // Request access to the microphone
            recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Connect the microphone stream to the audio context
            mediaStreamSource = this.audioContext.createMediaStreamSource(recordingStream);

            // Start the waveform rendering
            this.waveform = new StreamingWaveform({
                audioContext: this.audioContext,
                stream: recordingStream,
                parent: this.waveformContainer,
                width: 800,
                height: 280,
            });
            this.waveformContainer.style.position = "absolute";
            this.waveformContainer.style.top = "0";
            this.waveformContainer.style.left = "0";

            // Setup MediaRecorder for the microphone stream
            recorder = new MediaRecorder(recordingStream);
            recorder.ondataavailable = (e) => recordedChunks.push(e.data);

            recorder.start();
            console.log("Live sliced recording started...");
        } catch (error) {
            console.error("Microphone access denied or failed:", error);
        }
    });


    // TODO: refactor this into SamplerComponent.stopMicrophoneRecording()
    button.addEventListener("mouseup", async () => {
        if (recorder && recorder.state === "recording") {
            recorder.stop();

            recorder.onstop = async () => {
                console.log("Live sliced recording stopped.");

                if (this.waveform) {
                    this.waveform.stop();
                    this.waveform.remove();
                }

                // Stop microphone stream
                recordingStream.getTracks().forEach(track => track.stop());

                // Process recorded audio
                const blob = new Blob(recordedChunks, { type: "audio/webm" });
                const arrayBuffer = await blob.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                // Slice and load the audio buffer into the pads
                this._sliceAndLoadToPads(audioBuffer);
            };
        }
    });

    return button;
}
