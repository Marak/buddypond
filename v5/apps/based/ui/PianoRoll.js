export default class PianoRoll {
    constructor({ notes, onKeyPlay, onModWheelChange }) {
      this.baseNotes = notes || this._defaultNotes();
      this.currentOctave = 0; // Octave shift state
      this.onKeyPlay = onKeyPlay || (() => {});
      this.onModWheelChange = onModWheelChange || (() => {});
      this.keyCount = 25; // Total keys in the piano roll
  
      this.isMouseDown = false; // For click-and-drag functionality
      this.container = this._createPianoRollContainer();
  
      this._addEventListeners();
      this._render();
      return this;
    }
  
    // Default notes if none provided
    _defaultNotes() {
      return [
        { name: "C", ratio: 1.0 },
        { name: "C#", ratio: 1.05946 },
        { name: "D", ratio: 1.12246 },
        { name: "D#", ratio: 1.18921 },
        { name: "E", ratio: 1.25992 },
        { name: "F", ratio: 1.33484 },
        { name: "F#", ratio: 1.41421 },
        { name: "G", ratio: 1.49831 },
        { name: "G#", ratio: 1.5874 },
        { name: "A", ratio: 1.68179 },
        { name: "A#", ratio: 1.7818 },
        { name: "B", ratio: 1.88775 },
      ];
    }
  
    // Create the full container with octave buttons
    _createPianoRollContainer() {
      const container = document.createElement("div");
      container.classList.add("piano-roll-wrapper");
  
      // Octave buttons
      const controls = document.createElement("div");
      controls.classList.add("piano-controls");
  
      const minusButton = document.createElement("button");
      minusButton.textContent = "- Octave";
      minusButton.classList.add("piano-octave-btn");
      minusButton.addEventListener("click", () => this._shiftOctave(-1));
  
      const plusButton = document.createElement("button");
      plusButton.textContent = "+ Octave";
      plusButton.classList.add("piano-octave-btn");
      plusButton.addEventListener("click", () => this._shiftOctave(1));
  
      const octaveIndicator = document.createElement("span");
      octaveIndicator.classList.add("octave-indicator");
      octaveIndicator.textContent = `Octave ${this.currentOctave}`;
      this.octaveIndicator = octaveIndicator;
  
      controls.appendChild(minusButton);
      controls.appendChild(octaveIndicator);
      controls.appendChild(plusButton);
      container.appendChild(controls);
  
      // Mod wheel slider
      const modWheelContainer = document.createElement("div");
      modWheelContainer.classList.add("mod-wheel-container");
  
      const modWheelLabel = document.createElement("span");
      modWheelLabel.textContent = "Mod Wheel";
      modWheelLabel.classList.add("mod-wheel-label");
  
      const modWheel = document.createElement("input");
      modWheel.type = "range";
      modWheel.min = "-100";
      modWheel.max = "100";
      modWheel.value = "0";
      modWheel.classList.add("mod-wheel");
  
      modWheel.addEventListener("input", (e) => this._handleModWheelChange(e.target.value));
      modWheel.addEventListener("mouseup", () => this._resetModWheel(modWheel));
  
      modWheelContainer.appendChild(modWheelLabel);
      modWheelContainer.appendChild(modWheel);
      controls.appendChild(modWheelContainer);
  
      // Piano roll container
      this.pianoContainer = document.createElement("div");
      this.pianoContainer.classList.add("piano-roll");
      container.appendChild(this.pianoContainer);
  
      return container;
    }
  
    // Render keys in the piano roll
    _render() {
      // Clear existing keys
      this.pianoContainer.innerHTML = "";
  
      // Generate 25 keys starting from base notes
      const notes = [];
      const centerIndex = Math.floor(this.keyCount / 2);
  
      for (let i = 0; i < this.keyCount; i++) {
        const baseNote = this.baseNotes[i % this.baseNotes.length];
        const octaveOffset = Math.floor((i - centerIndex) / this.baseNotes.length);
        notes.push({
          name: `${baseNote.name}`,
          ratio: baseNote.ratio * Math.pow(2, octaveOffset + this.currentOctave),
        });
      }
  
      notes.forEach((note, index) => {
        const keyButton = document.createElement("div");
        keyButton.classList.add(
          "piano-key",
          note.name.includes("#") ? "piano-black-key" : "piano-white-key"
        );
  
        // Align text for white keys to the bottom
        if (!note.name.includes("#")) {
          keyButton.style.display = "flex";
          keyButton.style.justifyContent = "center";
          keyButton.style.alignItems = "flex-end";
          keyButton.style.paddingBottom = "4px"; // Add some padding for better alignment
        }
  
        keyButton.textContent = note.name;
        keyButton.dataset.ratio = note.ratio;
  
        // Mouse interaction for individual keys
        keyButton.addEventListener("mousedown", () => this._playKey(note));
        keyButton.addEventListener("mouseenter", () => {
          if (this.isMouseDown) this._playKey(note);
        });
  
        this.pianoContainer.appendChild(keyButton);
      });
  
      // Update the octave indicator
      this.octaveIndicator.textContent = `Octave ${this.currentOctave}`;
    }
  
    // Shift the octave and re-render
    _shiftOctave(direction) {
      this.currentOctave += direction; // Adjust octave
      this._render(); // Re-render keys with new ratios
    }
  
    // Add global event listeners for click-and-drag functionality
    _addEventListeners() {
      document.addEventListener("mousedown", () => (this.isMouseDown = true));
      document.addEventListener("mouseup", () => (this.isMouseDown = false));
    }
  
    // Play a key and trigger the callback
    _playKey(note) {
      if (this.onKeyPlay) {
        this.onKeyPlay(note);
      }
    }
  
    // Handle mod wheel changes
    _handleModWheelChange(value) {
      const normalizedValue = value / 100; // Normalize value between -1 and 1
      this.onModWheelChange(normalizedValue);
    }
  
    // Reset mod wheel to center gradually
    _resetModWheel(modWheel) {
      const interval = setInterval(() => {
        const currentValue = parseFloat(modWheel.value);
        if (currentValue === 0) {
          clearInterval(interval);
          return;
        }
        modWheel.value = currentValue + (currentValue > 0 ? -1 : 1);
        this._handleModWheelChange(modWheel.value);
      }, 10);
    }
  }
  