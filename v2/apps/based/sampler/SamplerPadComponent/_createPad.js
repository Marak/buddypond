import StreamingWaveform from "../../ui/StreamingWaveform.js";

// Create a pad with button controls
export default function _createPad(padIndex, soundFile) {
    const padContainer = document.createElement("div");
    padContainer.classList.add("sampler-pad");

    // Waveform Container (behind the button)
    const waveformContainer = document.createElement("div");
    waveformContainer.classList.add("sampler-waveform-container");
    waveformContainer.style.position = "absolute";
    waveformContainer.style.top = "0";
    waveformContainer.style.left = "0";
    waveformContainer.style.zIndex = "0"; // Behind everything

    // Pad Button
    const button = document.createElement("button");

    button.classList.add("sampler-pad-button");
    button.style.position = "relative";
    button.style.zIndex = "1"; // Above the waveform
    // button.style.background = "transparent"; // Transparent background
    button.style.border = "1px solid #555";
    button.style.color = "#FFF";

    button.addEventListener("mousedown", () => {
        // check to see if there is actually a buffer loaded at this location
        if (this.sampler.buffers[padIndex]) {
            this.sampler.handlePadPress(padIndex);
            this.lastPlayedPad = padIndex; // Set last played pad
        } else {
            // trigger the click event on the file input to prompt the user to load a sample
            fileInput.click();
        }
    });

    button.addEventListener("mouseup", () => {
        this.sampler.handlePadRelease(padIndex);
    });

    // Pad label for button
    const label = document.createElement("div");

    if (soundFile) {
        let fileName = soundFile.split("/").pop();
        // remove the file extension
        fileName = fileName.split(".")[0];
        label.textContent = fileName;
    } else {
        label.textContent = `Pad ${padIndex + 1}`;
        // set bg to #333
        button.style.background = "#333";
    }

    label.classList.add("sampler-pad-label");
    button.appendChild(label);


    // Controls Container
    const controlsContainer = document.createElement("div");
    controlsContainer.classList.add("sampler-pad-controls");

    // TODO: replace default file input with fontawesome icon

    const { fileInput, iconButton } = this._createFileInput(button, this.sampler, padIndex);

    // Record Mic Button
    const recordMicButton = document.createElement("button");
    recordMicButton.textContent = "Record Mic";
    recordMicButton.innerHTML = `<i class="fa-duotone fa-solid fa-microphone-lines"></i> Record`;
    recordMicButton.title = "Record audio from microphone";

    recordMicButton.classList.add("sampler-record-button");

    // TODO: refactor this into SamplerComponent.startPadMicrophoneRecording()
    recordMicButton.addEventListener("mousedown", () => {
        recordingOverlay.style.display = "flex"; // Show the overlay

        if (recordMicButton.waveform) {
            recordMicButton.waveform.remove();

        }

        if (this.waveform) {
            this.waveform.remove();
        }

        button.style.background = 'none';

        recordingStartTime = Date.now();
        // Start timer
        timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - recordingStartTime) / 1000);
            const minutes = String(Math.floor(elapsed / 60)).padStart(1, "0");
            const seconds = String(elapsed % 60).padStart(2, "0");
            const milliseconds = String(Math.floor((elapsed % 1) * 1000)).padStart(3, "0");
            timer.textContent = `${minutes}:${seconds}:${milliseconds}`;
        }, 10);

        this.sampler.recordMicrophone(padIndex);
    });

    // TODO: refactor this into SamplerComponent.stopPadMicrophoneRecording()
    recordMicButton.addEventListener("mouseup", () => {
        recordingOverlay.style.display = "none"; // Hide the overlay
        clearInterval(timerInterval); // Stop the timer
        timer.textContent = "0:00";
        this.sampler.stopMicrophoneRecording();
    });

    const padPlaybackSelector = document.createElement("select");
    padPlaybackSelector.classList.add("sampler-pad-playback-selector");
    let padPlaybackModes = [{
        value: 'one-shot',
        label: 'One Shot'
    }, {
        value: 'hold',
        label: 'Hold'
    },
    {
        value: 'toggle',
        label: 'Toggle'
    },{
        value: 'loop',
        label: 'Loop'
    },
    /* TODO: reverse is a flag, not a mode
    {
        value: 'reverse',
        label: 'Reverse'
    }
    */
    
];

    padPlaybackModes.forEach((option) => {
        let opt = document.createElement('option');
        opt.value = option.value;
        opt.innerHTML = option.label;
        padPlaybackSelector.appendChild(opt);
    });

    padPlaybackSelector.addEventListener('change', (e) => {
        // when changing modes, stop the sample
        this.sampler.stopSample(padIndex);
        this.sampler.setMode(padIndex, e.target.value);
    });

    controlsContainer.appendChild(padPlaybackSelector);

    // Overlay for recording indicator
    const recordingOverlay = document.createElement("div");
    recordingOverlay.classList.add("recording-overlay");
    recordingOverlay.style.display = "none"; // Hidden by default
    recordingOverlay.style.position = "absolute";
    recordingOverlay.style.top = "0";
    recordingOverlay.style.left = "0";
    // recordingOverlay.style.width = "100%";
    recordingOverlay.style.height = "50%";
    //recordingOverlay.style.background = "rgba(0, 255, 0, 0.2)";
    // recordingOverlay.style.display = "flex";
    recordingOverlay.style.flexDirection = "column";
    recordingOverlay.style.alignItems = "center";
    recordingOverlay.style.justifyContent = "center";
    recordingOverlay.style.color = "black";
    recordingOverlay.style.fontSize = "14px";

    recordingOverlay.style.zIndex = "9999"; // Overlay on top of everything
    const oscilloscope = document.createElement("div");
    oscilloscope.style.width = "80%";
    oscilloscope.style.height = "50px";
    oscilloscope.style.background = "green"; // Placeholder for oscilloscope
    recordingOverlay.appendChild(oscilloscope);

    const timer = document.createElement("span");
    timer.textContent = "0:00";
    recordingOverlay.appendChild(timer);


    // Record Global Bus Button
    const recordGlobalButton = document.createElement("button");
    recordGlobalButton.textContent = "";
    recordGlobalButton.innerHTML = `<i class="fa-duotone fa-solid fa-volume-high"></i> Record`;
    recordGlobalButton.title = "Record audio from global bus";

    recordGlobalButton.classList.add("sampler-record-button");

    let recordingStartTime = 0;
    let timerInterval = null;

    // TODO: refactor this into SamplerComponent.startPadGlobalRecording()
    recordGlobalButton.addEventListener("mousedown", () => {
        let recordingStream = this.sampler.recordGlobalBus(this.globalBus, padIndex);
        recordingOverlay.style.display = "flex"; // Show the overlay
        button.style.background = 'none';

        if (this.waveform) {
            this.waveform.remove();
        }
        recordingStartTime = Date.now();
        console.log('sending recording stream to waveform', recordingStream);
        console.log("sending audio context to waveform", this.audioContext);

        // Start the waveform rendering
        this.waveform = new StreamingWaveform({
            audioContext: this.audioContext,
            stream: recordingStream,
            parent: waveformContainer,
            width: 196,
            height: 100,
        });

        // Start timer
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
            const minutes = String(Math.floor(elapsed / 60)).padStart(1, "0");
            const seconds = String(elapsed % 60).padStart(2, "0");
            timer.textContent = `${minutes}:${seconds}`;
        }, 1000);
    });

    // TODO: refactor this into SamplerComponent.stopPadGlobalRecording()
    recordGlobalButton.addEventListener("mouseup", () => {
        this.sampler.stopGlobalBusRecording();
        if (this.waveform) {
            this.waveform.stop();
        }
        recordingOverlay.style.display = "none"; // Hide the overlay
        clearInterval(timerInterval); // Stop the timer
        timer.textContent = "0:00";
        console.log('STOP RECORDING');

    });
    padContainer.appendChild(recordingOverlay);

    // Append controls
    controlsContainer.appendChild(recordGlobalButton);
    controlsContainer.appendChild(recordMicButton);
    controlsContainer.appendChild(fileInput);
    controlsContainer.appendChild(iconButton);
    padContainer.appendChild(waveformContainer); // Add waveform behind


    padContainer.appendChild(button);
    padContainer.appendChild(controlsContainer);

    return padContainer;
}