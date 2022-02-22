(function initCanvasVideo() {
  class CanvasVideo {
    constructor() {
      this.video = document.querySelector('#mirrorVideoMe');
      this.canvas = document.querySelector('#mirrorCanvasMe');
      this.canvasContext = this.canvas.getContext('2d');

      this.videoWidth = 640;
      this.videoHeight = 480;

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

    applyFilter() {
      if (!this.filter || !this[this.filter]) { return; }
      this[this.filter]();
    }

    computeFrame() {
      this.canvasContext
        .drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);

      this.applyFilter();
    }

    timerCallback() {
      if (this.video.paused || this.video.ended) { return; }

      this.computeFrame();
      setTimeout(() => { this.timerCallback(); }, 16);
    }
  }

  window.CanvasVideo = CanvasVideo;
})();
