const loopControls = {};

// Main function to create loop controls
export default function createLoopControls(track, className) {
    let lc = new LoopControls(track, className);
    lc.createLoopButtons();
    lc.setValue('4');
    return lc.getContainer();
}

// Class to manage loop controls
class LoopControls {
    constructor(track, className) {
        this.track = track;
        this.trackId = track.id;
        this.className = className;
        this.loopButtons = [];
        this.currentStartIndex = 0;
        this.visibleCount = 3; // Number of buttons visible at a time
        this.selectedBeat = null;

        this.container = this.createContainer();
        this.buttonsWrapper = this.createButtonsWrapper();
        this.leftButton = this.createNavButton('left');
        this.rightButton = this.createNavButton('right');

        this.container.appendChild(this.leftButton);
        this.container.appendChild(this.buttonsWrapper);
        this.container.appendChild(this.rightButton);
    }

    // Create the main container for loop controls
    createContainer() {
        const container = document.createElement('div');
        container.id = `loopControls-${this.trackId}`;
        container.classList.add('loop-controls', this.className);
        return container;
    }

    // Create the wrapper for loop buttons
    createButtonsWrapper() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('loop-buttons-wrapper');
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('loop-buttons');
        wrapper.appendChild(buttonsContainer);
        return wrapper;
    }

    // Create navigation buttons (left/right)
    createNavButton(direction) {
        const button = document.createElement('button');
        button.textContent = direction === 'left' ? '<' : '>';
        button.classList.add('loop-nav', `loop-nav-${direction}`);
        button.addEventListener('click', () => this.scrollButtons(direction));
        return button;
    }

    // Create and populate loop buttons
    createLoopButtons(start = 1 / 64, end = 32) {
        const buttonsContainer = this.buttonsWrapper.querySelector('.loop-buttons');
        for (let i = start; i <= end; i *= 2) {
            const button = this.createLoopButton(i);
            this.loopButtons.push(button);
            buttonsContainer.appendChild(button);
        }
        this.updateVisibleButtons();
    }

    // Create a single loop button
    createLoopButton(beat) {
        const button = document.createElement('button');
        button.classList.add('loop-button');
        button.textContent = this.formatBeatText(beat);
        button.dataset.beat = beat;

        button.addEventListener('mousedown', () => {
            this.setLoopBeat(this.track, beat, button);
        });

        return button;
    }

    // Format beat text for display
    formatBeatText(beat) {
        const beatMap = {
            [1 / 64]: '1/64',
            [1 / 32]: '1/32',
            [1 / 16]: '1/16',
            [1 / 8]: '1/8',
            [1 / 4]: '1/4',
            [1 / 2]: '1/2',
            [1]: '1',
            [2]: '2',
            [4]: '4',
            [8]: '8',
            [16]: '16',
            [32]: '32'
        };
        return beatMap[beat] || beat;
    }

    // Scroll the visible loop buttons
    scrollButtons(direction) {
        if (direction === 'left' && this.currentStartIndex > 0) {
            this.currentStartIndex--;
        } else if (direction === 'right' && this.currentStartIndex < this.loopButtons.length - this.visibleCount) {
            this.currentStartIndex++;
        }
        this.updateVisibleButtons();

        let t = this.track;
        if (t.isLooping) {
            const newBeatButton = this.loopButtons[this.currentStartIndex];
            if (newBeatButton) {
                const newBeat = parseFloat(newBeatButton.dataset.beat);
                // TODO: in this case we need to ensure the new loop start position is the same as the current loop start position
                this.updateActiveLoop(t, newBeat);
            }

            this.loopButtons.forEach(button => button.classList.remove('btn-selected', 'btn-active'));
            newBeatButton.classList.add('btn-selected', 'btn-active');
        }
    }

    // Update the active loop with a new beat size
    updateActiveLoop(track, newBeat) {
        const buttons = document.querySelectorAll(`#loopControls-${this.trackId} .loop-button`);
        buttons.forEach((btn) => btn.classList.remove('btn-active'));

        const activeButton = this.loopButtons.find((btn) => parseFloat(btn.dataset.beat) === newBeat);
        if (activeButton) {
            activeButton.classList.add('btn-active');
            track.loopBeat = newBeat;
            startLoop(track, newBeat);
        }
    }

    // Update visibility of loop buttons
    updateVisibleButtons() {
        this.loopButtons.forEach((button, index) => {
            button.style.display =
                index >= this.currentStartIndex && index < this.currentStartIndex + this.visibleCount
                    ? 'inline-block'
                    : 'none';
        });
    }

    // Set the loop beat programmatically
    setBeat(beat) {
        const button = this.loopButtons.find((btn) => btn.dataset.beat == beat);
        if (button) {
            this.scrollToButton(button);
            button.click();
        }
    }

    // Scroll to a specific button to make it visible
    scrollToButton(targetButton) {
        const targetIndex = this.loopButtons.indexOf(targetButton);
        if (targetIndex === -1) return;

        if (targetIndex < this.currentStartIndex) {
            this.currentStartIndex = targetIndex;
        } else if (targetIndex >= this.currentStartIndex + this.visibleCount) {
            this.currentStartIndex = targetIndex - this.visibleCount + 1;
        }
        this.updateVisibleButtons();
    }

    // Set the loop beat and update the UI
    setLoopBeat(track, beat, button) {
        const buttons = document.querySelectorAll(`#loopControls-${this.trackId} .loop-button`);
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));

        if (track.isLooping && track.loopBeat === beat) {
            stopLoop(track);
        } else {
            button.classList.add('btn-selected');
            startLoop(track, beat);
        }
    }

    // Get the main container for rendering
    getContainer() {
        return this.container;
    }

    // Set the slider value (beat) without activating the loop
    setValue(beat) {
        this.selectedBeat = beat;
        const button = this.loopButtons.find((btn) => btn.dataset.beat === beat);
        if (button) {
            this.scrollToButton(button);
        }
    }
}

// Stop the loop for a track
function stopLoop(track) {
    console.log("STOPPING LOOP", track.id);

    if (track.loopRegion) {
        track.loopRegion.remove();
        track.loopRegion = null;
        track.isLooping = false;
    }

    if (track.regionOutHandler) {
        track.regionOutHandler = null;
    }
}

// Start the loop for a track
function startLoop(track, beat, previousBeat = null) {
    console.log("LOOPING TRACK", track.id, beat);
    // TODO: when updating the updateActiveLoop / startLoop, we should always respect the current loop start position
    // such that if the loop is extended, it should extend from the current loop start position ( this does not work )
    // and if the loop is shortened, it should shorten from the current loop start position ( this appears already working? )

    track.isLooping = true;
    track.loopBeat = Number(beat);
    const waveform = track.waveform;

    const bpm = track.metadata.bpm || 120;
    const secondsPerBeat = 60 / bpm;
    const loopDuration = secondsPerBeat * beat;
    console.log('Loop Duration:', loopDuration, 'Current BPM:', bpm);

    const currentPosition = waveform.getCurrentTime();
    let closestBeat = 0;

    const gridSnaps = track.metadata.beatGrid;
    for (let i = 0; i < gridSnaps.length; i++) {
        if (gridSnaps[i] <= currentPosition) {
            closestBeat = gridSnaps[i];
        } else {
            break;
        }
    }

    if (previousBeat) {
        closestBeat = previousBeat;
    }

    console.log('Closest Beat:', closestBeat);

    const loopEnd = closestBeat + loopDuration;
    const loopStart = closestBeat;
    track.loopStart = loopStart;
    track.loopEnd = loopEnd;

    if (track.loopRegion) {
        track.loopRegion.remove();
    }

    track.loopRegion = waveform.regions.addRegion({
        start: loopStart,
        end: loopEnd,
        loop: false,
        drag: false,
        resize: false,
        color: 'rgba(0, 123, 255, 0.3)'
    });

    if (!track.regionOutHandler) {
        track.regionOutHandler = (region) => {
            if (region === track.loopRegion && !track.looping) {
                console.log('Region out - restarting loop');
                const loopStartTime = track.loopRegion.start;
                track.looping = true;

                waveform.regions.un('region-out', track.regionOutHandler);
                track.setTime(loopStartTime);

                setTimeout(() => {
                    track.looping = false;
                    waveform.regions.on('region-out', track.regionOutHandler);
                }, 10);
            }
        };

        waveform.regions.on('region-out', track.regionOutHandler);
    } else {
        if (currentPosition < loopStart || currentPosition > loopEnd) {
            track.regionOutHandler(track.loopRegion);
        }
    }
}