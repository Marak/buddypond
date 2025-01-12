export default class RipplesWallpaper {
  constructor(canvasId, options) {
      this.options = options || {
          imageUrl: null, // URL of the background image
          dropRadius: 20, // Size of the drop in pixels
          perturbance: 0.03, // Amount of refraction caused by a ripple
          resolution: 256, // Width and height of the WebGL texture
          interactive: true, // Mouse interaction
          crossOrigin: '' // CrossOrigin attribute for the image
      };
  }

  async load(bp) {
      await bp.appendScript('/desktop/assets/js/jquery.ripples.js');
      $('body').ripples(this.options);
      $('#wallpaper').hide();
      $('#c').hide();
  }

  draw(color) {
      if (color) {
          this.changeColor(color);
      }
      // Redraw or reinitialize ripples with potentially new settings
      $('body').ripples('destroy');
      $('body').ripples(this.options);
  }

  changeColor(color) {
      // Directly modifying the CSS background color of the body
      $('body').css('background-color', color);
  }

  changeImage(imageUrl) {
      // Update the imageUrl in options and redraw the ripples
      this.options.imageUrl = imageUrl;
      this.draw();
  }

  resize() {
      // Optionally handle resizing logic, like recalculating parameters if needed
      // This implementation assumes no changes are needed on resize
  }

  start(bp) {
      this.load(bp);
  }

  stop() {
      $('body').ripples('destroy');
      $('#wallpaper').show();
      $('#c').show();
  }

  pause() {
      // To pause, we could stop interactions or similar - depends on what 'pause' should do
      // This is a placeholder for any actual functionality if needed
  }
}

/*
// Usage example:
const ripplesWallpaper = new RipplesWallpaper({
  imageUrl: 'path/to/image.jpg',
  perturbance: 0.04
});
ripplesWallpaper.start();

// Change background color
ripplesWallpaper.changeColor('#ff0000');

// Change background image
ripplesWallpaper.changeImage('path/to/another/image.jpg');

// Stop the ripple effect
ripplesWallpaper.stop();
*/
