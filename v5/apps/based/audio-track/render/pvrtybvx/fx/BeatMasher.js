// import BeatmasherEffect from "./BeatmasherEffect";
import BeatmasherEffect from '../../../nodes/Beatmasher.js';

export default class BeatmasherComponent {
  constructor(track, options = {}) {
    this.track = track; // Track object with audioContext and audioBuffer
    this.beatmasher = new BeatmasherEffect(
      track,
      { loopLength: 0.2, beatLength: track.metadata.beatLength }
    );

    this.isActive = false; // Track if the beatmasher is active

    // Container setup
    this.container = options.container || document.createElement("div");
    this.container.classList.add("beatmasher");
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.width = "100%";
    this.container.style.padding = "10px";
    this.container.style.border = "1px solid #ccc";
    this.container.style.borderRadius = "5px";
    this.container.style.background = "#f8f8f8";

    // Toggle Button
    this.toggleButton = document.createElement("button");
    this.toggleButton.textContent = "Enable Beatmasher";
    this.toggleButton.style.marginBottom = "10px";
    this.toggleButton.addEventListener("click", () => this.toggleEffect());

    // Slider for Loop Length
    this.slider = document.createElement("input");
    this.slider.type = "range";
    this.slider.min = 1; // 50ms minimum
    this.slider.max = track.metadata.beatLength * 2 * 1000; // 2 beats maximum
    this.slider.value = 200; // Default loop length (200ms)
    this.slider.style.width = "100%";
    this.slider.addEventListener("input", () => this.updateLoopLength());

    const sliderLabel = document.createElement("label");
    sliderLabel.textContent = "Loop Length (ms)";
    sliderLabel.style.marginBottom = "5px";

    // Beat Bending Checkbox
    const beatBendingContainer = document.createElement("div");
    beatBendingContainer.style.display = "flex";
    beatBendingContainer.style.alignItems = "center";
    beatBendingContainer.style.marginTop = "10px";

    const beatBendingCheckbox = document.createElement("input");
    beatBendingCheckbox.type = "checkbox";
    beatBendingCheckbox.checked = true; // Default: beat bending is enabled
    beatBendingCheckbox.style.marginRight = "5px";
    beatBendingCheckbox.addEventListener("change", () => {
      this.toggleBeatBending(beatBendingCheckbox.checked);
    });

    const beatBendingLabel = document.createElement("label");
    beatBendingLabel.textContent = "Enable Beat Bending";

    beatBendingContainer.appendChild(beatBendingCheckbox);
    beatBendingContainer.appendChild(beatBendingLabel);

    // Append components
    this.container.appendChild(this.toggleButton);
    this.container.appendChild(sliderLabel);
    this.container.appendChild(this.slider);
    this.container.appendChild(beatBendingContainer);

    // Add container to options parent if provided
    if (options.parent) {
      options.parent.appendChild(this.container);
    }

    return this;
  }

  // Toggle the beatmasher effect on/off
  toggleEffect() {
    if (this.isActive) {
      this.beatmasher.stop();
      this.isActive = false;
      this.toggleButton.textContent = "Enable Beatmasher";
      this.toggleButton.style.background = "";
    } else {
      const currentTime = this.track.audioElement.currentTime;
      this.beatmasher.start(currentTime % this.track.audioBuffer.duration);
      this.isActive = true;
      this.toggleButton.textContent = "Disable Beatmasher";
      this.toggleButton.style.background = "#d9534f";
      this.toggleButton.style.color = "#fff";
    }
  }

  // Update the loop length based on slider input
  updateLoopLength() {
    const loopLengthInSeconds = this.slider.value / 1000; // Convert ms to seconds
    this.beatmasher.setLoopLength(loopLengthInSeconds);
  }

  // Toggle beat bending on/off
  toggleBeatBending(isEnabled) {
    this.beatmasher.beatBending = isEnabled; // Update beatBending flag in BeatmasherEffect
  }
}
