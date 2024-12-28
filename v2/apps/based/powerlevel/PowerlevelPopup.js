export default class PowerLevelPopup {
    constructor(container = document.body) {
      this.container = container;
    }
  
    show(level, options = {}) {
      // Create the main effect div and apply styles
      this.effectDiv = document.createElement('div');
      this.effectDiv.className = 'powerlevel-effect';
  
      // Set the content of the effect
      this.effectDiv.innerHTML = `
        <div>
          <h1>Congratulations</h1>
          <h2>Your Power Level has increased!</h2>
          <h1>Level ${level}</h1>
        </div>
      `;
  
      // Append the effect to the specified container and play sound
      this.container.appendChild(this.effectDiv);
      // bp.play('sound.wav'); // Ensure 'bp.play' is defined or handle it accordingly
  
      // Remove the effect after a certain duration
      setTimeout(() => this.remove(), options.duration || 5000);
    }
  
    remove() {
      if (this.effectDiv && this.container.contains(this.effectDiv)) {
        this.container.removeChild(this.effectDiv);
      }
    }
  }