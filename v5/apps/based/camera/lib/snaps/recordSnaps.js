export default function recordSnaps(maxFrames, delay, mode) {
  let that = this;
  $('.cameraControls').hide();
  delay = delay || $('#snapsPreview').data('delay') || that.DEFAULT_SNAP_TIMER;
  $('#snapsPreview').data('delay', delay);
  that.snapDelay = delay;
  mode = mode || 'photo';
  $('.recordSnap').hide();
  $('.mirrorVideoHolder').css('opacity', '1');
  // runs until max frames or hits stop
  let destinationCanvas = document.getElementById('snaps');
  let destCtx = destinationCanvas.getContext('2d');

  if (maxFrames > 1) {
    bp.play('desktop/assets/audio/CAMERA_SHUTTER.wav', {
      tryHard: true
    });
  }

  destinationCanvas.width = 320;
  destinationCanvas.height = 240;
  destCtx.scale(0.5, 0.5);

  destCtx.drawImage(document.getElementById('mirrorCanvasMe'), 0, 0);

  let imagebase64data = destinationCanvas.toDataURL('image/png');
  let gifbase64data = destinationCanvas.toDataURL('image/gif');

  $('.gifFrames', this.cameraWindow.content).append(`<img src="${gifbase64data}"/>`);
  imagebase64data = imagebase64data.replace('data:image/png;base64,', '');
  that.snaps.push(imagebase64data);

  that.currentFrame++;
  $('.mirrorVideoHolder').css('opacity', '0.88');
  $('#snapsPreview').data('stopped', false);
  $('.mirrorVideoHolder').css('opacity', '1');
  if (that.currentFrame >= maxFrames) {
    that.currentFrame = 0;
    setTimeout(function () {

      that.createGif(delay);
      $('.mirrorVideoHolder').hide();
      $('#snapsPreview').show();
      $('.confirmSnap').show();
      if (mode === 'photo') {
        $('.retrySnap').hide();
        $('.retrySingleSnap').show();
        if (Object.keys(that.snaps).length > 1) {
          $('.snapDelaySliderControl').show();
        }
      } else {
        $('.continueSnap').hide();
        $('.retrySingleSnap').hide();
        $('.retrySnap').show();
        $('.snapDelaySliderControl').show();
      }
    }, that.CAMERA_SHUTTER_DELAY); // TODO: make configurable with existing delay slider
    return;
  }
  setTimeout(function () {
    that.recordSnaps(maxFrames, delay, mode);
  }, delay);
};