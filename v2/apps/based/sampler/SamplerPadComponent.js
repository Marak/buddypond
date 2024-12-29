import SamplerPadEffect from "./SamplerPad.js";
import PianoRoll from "../ui/PianoRoll.js";
import StreamingWaveform from "../ui/StreamingWaveform.js";
import sliderComponent from "../ui/Slider.js";


import _createPad from "./SamplerPadComponent/_createPad.js";
import _createFileInput from "./SamplerPadComponent/_createFileInput.js";
import _createSlicedRecordButton from "./SamplerPadComponent/_createSlicedRecordButton.js";
import _createLiveSlicedRecordButton from "./SamplerPadComponent/_createMicrophoneSlicedRecordButton.js";
import _sliceAndLoadToPads from "./SamplerPadComponent/_sliceAndLoadToPads.js";
import _sliceAudioBuffer from "./SamplerPadComponent/_sliceAudioBuffer.js";

export default class SamplerPadComponent {
    constructor(audioContext, globalBus, options = {}) {
        this.audioContext = audioContext;
        this.globalBus = globalBus;
        this.sampler = new SamplerPadEffect(audioContext, null); // TODO: should be globalBus / api.globalBus ( needs proper audio graph like track )
        this.fetch = options.fetch || window.fetch.bind(window);
        this.defaultSounds = options.defaultSounds || [
            "samples/lets-go.mp3",
            "samples/make-some-noise.mp3",
            "samples/drop-it.mp3",
            "samples/airhorn.mp3",
            null,
            null,
            null,
            null,
        ];

        // Container setup
        this.container = document.createElement("div");
        this.container.classList.add("sampler-pad-container", "track-active");


        // top container with main pad and volume
        this.topSection = document.createElement("div");
        this.topSection.classList.add("sampler-top-section");
        this.container.appendChild(this.topSection);

        // Holds 8 pad buttons
        this.buttonGrid = document.createElement("div");
        this.buttonGrid.classList.add("sampler-pad");
        this.buttonGrid.style.display = "grid";
        this.buttonGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
        this.buttonGrid.style.gap = "10px";
        this.buttonGrid.style.padding = "0px";
        //this.buttonGrid.style.background = "#333";
        this.buttonGrid.style.borderRadius = "10px";

        this.topSection.appendChild(this.buttonGrid);

        // Holds volume slider
        this.volumeContainer = document.createElement("div");
        this.volumeContainer.classList.add("sampler-volume-container");
        this.topSection.appendChild(this.volumeContainer);

        let that = this;
        let samplerSliderVolume = sliderComponent(null, 'sampler-0', {
            minValue: 0,
            maxValue: 1, // TODO: could be higher...needs better gain logic linear gain is not ideal after 1
            value: 1,
            trackWidth: '20px',
            trackHeight: '260px',
            thumbHeight: '48px',
            thumbWidth: '24px',
            sliderThumbStyles: {
                left: '18px',
            },
    
            showLabel: false,
            className: 'sampler-volume-slider',
            thumbClassName: 'volume-thumb',
            onChange: function (value) {
                that.sampler.adjustVolume(value);
            }
        });
        // track.transport.volumeSlider = volumeSlider;
        this.volumeSlider = samplerSliderVolume;
        this.volumeContainer.append(samplerSliderVolume.sliderContainer); // TODO: samplerSliderVolume.container




        // Sample Record Microphone / Record Global Bus
        this.sliceRecordContainer = document.createElement("div");
        this.sliceRecordContainer.classList.add("sampler-slice-record-container");
        this.topSection.appendChild(this.sliceRecordContainer);

        // Add Sliced Record Button
        const slicedRecordButton = this._createSlicedRecordButton();
        this.sliceRecordContainer.appendChild(slicedRecordButton);

        // Add Live Sliced Record Button
        const liveSlicedRecordButton = this._createLiveSlicedRecordButton()
        this.sliceRecordContainer.appendChild(liveSlicedRecordButton);


        const stopAllButton = document.createElement("button");
        stopAllButton.textContent = "Stop";
        stopAllButton.innerHTML = '<i class="fa-duotone fa-solid fa-stop"></i>';
        stopAllButton.style.fontSize = "2.5rem";

        stopAllButton.classList.add("sampler-stop-all-button", "sampler-record-button");

        stopAllButton.addEventListener("click", () => {
            this.sampler.stopAllSamples();
            this.sampler.stopAllRecordings();
        });

        this.sliceRecordContainer.appendChild(stopAllButton);

        const showPianoRoll = document.createElement("button");
        // showPianoRoll.textContent = "Show Piano";

        // use <i class="fa-duotone fa-solid fa-piano-keyboard"></i>
        showPianoRoll.innerHTML = '<i class="fa-duotone fa-solid fa-piano-keyboard"></i>';
         showPianoRoll.style.fontSize = "32px";
        showPianoRoll.classList.add("sampler-record-button");

        showPianoRoll.addEventListener("click", () => {
            /* TODO: add reverse button somewhere on pad
            this.sampler.setReverse(0, true);
            this.sampler.setReverse(1, true);
            this.sampler.setReverse(2, true);
            */
            if (this.controlsContainer.style.display === "flex") {
                this.controlsContainer.style.display = "none";
                showPianoRoll.textContent = "Show Piano";
            } else {
                this.controlsContainer.style.display = "flex";
                showPianoRoll.textContent = "Hide Piano";
            }
        });

        this.sliceRecordContainer.appendChild(showPianoRoll);

        // Bottom Pad Piano roll controls with global record

        this.controlsContainer = document.createElement("div");
        this.controlsContainer.classList.add("sampler-controls-container");


        // Initialize Pads
        this.pads = [];
        for (let i = 0; i < 8; i++) {

            if (this.defaultSounds[i]) {
                this._loadDefaultSound(i, this.defaultSounds[i]);
            }


            const padContainer = this._createPad(i, this.defaultSounds[i]);
            this.buttonGrid.appendChild(padContainer);
            this.pads.push(padContainer);

        }

        // Piano Roll
        const pianoRoll = new PianoRoll({
            onKeyPlay: (note) => {
                const frequency = 440 * note.ratio;
                const padIndex = this.lastPlayedPad || 0; // Default to pad 0
                this.sampler.playSampleAtPitch(padIndex, note.ratio);
            },
            onModWheelChange: (value) => {
                this.sampler.setModWheel(value);
            }
        });

        this.controlsContainer.appendChild(pianoRoll.container);

        // Sample Bank
        let sampleBanks = [
            {
                id: 'default',
                name: 'Pvrty Bvx v1',
                samples: [
                    "samples/lets-go.mp3",
                    "samples/make-some-noise.mp3",
                    "samples/drop-it.mp3",
                    "samples/airhorn.mp3",
                    null,
                    null,
                    null,
                    null,
                ]
            },
            {
                id: 'roland-808',
                name: 'Roland 808',
                samples: [
                    "samples/roland-808/kick.wav",
                    "samples/roland-808/snare.wav",
                    "samples/roland-808/hihat.wav",
                    "samples/roland-808/clap.wav",
                    "samples/roland-808/tom.wav",
                    "samples/roland-808/cymbal.wav",
                    "samples/roland-808/cowbell.wav",
                    "samples/roland-808/rimshot.wav",
                ]
            },
            {
                id: 'browser-storage',
                name: 'Browser Storage',
                disabled: true,
                samples: [] // TODO: loaded via function call to get from indexedDB ( needs binaries )
            }

        ];

        // get the piano-controls div by class, it's inside this.controlsContainer
        let pianoControls = this.controlsContainer.querySelector('.piano-controls');
        // create a new div to hold sample bank select dropdown
        let sampleBankSelectContainer = document.createElement('div');
        sampleBankSelectContainer.classList.add('sample-bank-select-container');
        // create a new select element
        let sampleBankSelect = document.createElement('select');
        sampleBankSelect.classList.add('sample-bank-select');



        // iterate through all sample banks
        // and create an option element for each
        sampleBanks.forEach((sampleBank) => {
            // create a new option element
            let option = document.createElement('option');
            option.value = sampleBank.id;
            option.text = sampleBank.name;
            if (sampleBank.disabled) {
                option.disabled = true;
            }
            // add the option element to the select element
            sampleBankSelect.add(option);
        });



        // add event listener to select element
        sampleBankSelect.addEventListener('change', (e) => {
            // TODO: test this
            return;
            // get the selected value
            let selectedValue = e.target.value;
            // get the pads by class
            let pads = this.container.querySelectorAll('.sampler-pad');
            // loop through the pads
            pads.forEach((pad, index) => {
                // get the waveform container by pad
                let waveformContainer = pad.querySelector('.sampler-waveform-container');
                // clear the waveform container
                waveformContainer.innerHTML = '';
                // if the selected value is default
                if (selectedValue === 'default') {
                    // load the default sound
                    this._loadDefaultSound(index, this.defaultSounds[index]);
                }
            });
        });

        // append the select element to the container
        sampleBankSelectContainer.appendChild(sampleBankSelect);
        // append the container to the piano-controls div

        // insert before last element
        pianoControls.insertBefore(sampleBankSelectContainer, pianoControls.lastElementChild);
        //pianoControls.appendChild(sampleBankSelectContainer);

        const waveformContainer = document.createElement("div");
        this.waveformContainer = waveformContainer;
        this.container.appendChild(waveformContainer);


        this.container.appendChild(this.controlsContainer);


        this.waveform = null;


        if (options.parent) {
            options.parent.appendChild(this.container);
        }

        this.lastPlayedPad = 0; // Track last played pad
    }

    unload() {
        // Clean-up // TODO: double check this
        this.sampler.unload();
        this.container.remove();
    }

    adjustVolume(value) {
        // calls into sampler.adjustVolume
        this.sampler.adjustVolume(value);
        // updates the slider value
        this.volumeSlider.setValue(value);
    }

    async _loadDefaultSound(padIndex, url) {
        console.log("Loading default sound:", url);
        const response = await this.fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sampler.buffers[padIndex] = audioBuffer;

        // get the wavecontainer by padIndex
        let waveformContainer = this.pads[padIndex].querySelector('.sampler-waveform-container');
        // render a waveform for this sound file
        const waveform = new StreamingWaveform({
            buffer: this.sampler.buffers[padIndex],
            parent: waveformContainer,
            width: 196,
            height: 100,
        });

    }
}


SamplerPadComponent.prototype._createPad = _createPad;
SamplerPadComponent.prototype._createFileInput = _createFileInput;
SamplerPadComponent.prototype._createSlicedRecordButton = _createSlicedRecordButton;
SamplerPadComponent.prototype._createLiveSlicedRecordButton = _createLiveSlicedRecordButton;
SamplerPadComponent.prototype._sliceAndLoadToPads = _sliceAndLoadToPads;
SamplerPadComponent.prototype._sliceAudioBuffer = _sliceAudioBuffer;