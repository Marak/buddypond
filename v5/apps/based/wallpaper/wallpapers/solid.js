export default class SolidWallpaper {
  constructor(canvasId, settings) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.settings = settings || {
          color: '#000000' // Default color
      };
  }

  draw(color = this.settings.color) {
      // Fill the canvas with the specified color
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  changeColor(color) {
      // Update the color setting and redraw
      this.settings.color = color;
      this.draw();
  }

  resize() {
      // Redraw on resize with the current color
      this.draw();
  }

  start() {
      // Optionally give a short pause to allow other canvas operations to stop
      setTimeout(() => {
          this.draw();
      }, 33);
  }

  stop() {
      // Stopping the solid wallpaper doesn't need to clear anything
  }

  pause() {
      // Pausing the solid wallpaper doesn't need to do anything
  }
}
