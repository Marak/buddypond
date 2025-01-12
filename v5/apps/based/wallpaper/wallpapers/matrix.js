export default class MatrixWallpaper {
  constructor(canvasId, settings) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.fontSize = 10;
      this.columns = this.canvas.width / this.fontSize;
      this.drops = [];
      this.timer = null;
      this.settings = settings || {
          color: '#00FF00', // Default color for the matrix text
          trailOpacity: 0.04 // Default trail opacity
      };

      // Initialize drops
      this.initializeDrops();
  }

  initializeDrops() {
      this.drops = Array.from({ length: this.columns }, () => 
          Math.floor(Math.random() * this.canvas.height)
      );
  }

  draw() {
      // Black translucent background for trail effect
      this.ctx.fillStyle = `rgba(0, 0, 0, ${this.settings.trailOpacity})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Matrix color and font
      this.ctx.fillStyle = this.settings.color;
      this.ctx.font = `${this.fontSize}px Arial`;

      // Characters used in the Matrix effect
      const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345666777788889@#$%^&*()*&^%+-/~{[|`]}';
      const charsArray = matrixChars.split('');

      for (let i = 0; i < this.drops.length; i++) {
          const text = charsArray[Math.floor(Math.random() * charsArray.length)];
          this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

          // Reset drops that fall off the canvas
          if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
              this.drops[i] = 0;
          }

          // Increment Y position of drops
          this.drops[i]++;
      }
  }

  start() {
      if (this.timer) return; // Avoid multiple timers
      this.timer = setInterval(() => this.draw(), 66);
  }

  stop() {
      if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
      }
  }

  pause() {
      this.stop(); // Pause is effectively the same as stop here
  }

  resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = this.canvas.width / this.fontSize;
      this.initializeDrops();
  }

  changeColor(color) {
      this.settings.color = color;
  }
}
