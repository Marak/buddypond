(function initCanvasVideo() {
  class CanvasVideo {
    constructor(videoSelector, canvasSelector) {
      this.video = document.querySelector(videoSelector);
      this.canvas = document.querySelector(canvasSelector);
      this.canvasContext = this.canvas.getContext('2d');

      this.filter = null;
      this.timerCallback = this.timerCallback.bind(this);
    }

    unbindPlayEvent() {
      this.video.removeEventListener('play', this.timerCallback);
    }

    bindPlayEvent() {
      this.video.addEventListener('play', this.timerCallback);
    }
    greyscale() {
      const frame = this.canvasContext
        .getImageData(0, 0, this.videoWidth, this.videoHeight);

      const l = frame.data.length / 4;
      for (let i = 0; i < l; ++i) {
        const grey = (
          frame.data[i * 4 + 0] +
          frame.data[i * 4 + 1] +
          frame.data[i * 4 + 2]
        ) / 3;

        frame.data[i * 4 + 0] = grey;
        frame.data[i * 4 + 1] = grey;
        frame.data[i * 4 + 2] = grey;
      }

      this.canvasContext.putImageData(frame, 0, 0);
    }

    custom (filterName) {
      const frame = this.canvasContext
        .getImageData(0, 0, this.videoWidth, this.videoHeight);

      let Filter = JSManipulate[filterName]
      if (Filter) {
        Filter.filter(frame, Filter.defaultValues);
      }

      this.canvasContext.putImageData(frame, 0, 0);
    }

    applyFilter() {
      if (!this.filter) { return; }
      if (this.filter === 'greyscale') {
        this[this.filter]();
      } else {
        this.custom(this.filter);
      }
    }

    computeFrame() {
      this.canvasContext
        .drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);

      this.applyFilter();
    }

    timerCallback() {
      if (this.video.paused || this.video.ended) { return; }

      this.videoWidth = this.video.videoWidth;
      this.videoHeight = this.video.videoHeight;

      this.canvas.width = this.videoWidth;
      this.canvas.height = this.videoHeight;

      this.computeFrame();
      setTimeout(() => { this.timerCallback(); }, 16);
    }
  }

  window.CanvasVideo = CanvasVideo;
})();
