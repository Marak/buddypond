




desktop.app.mirror.takeSnap = function takeSnap () {
  //$('#mirrorCanvasMe').css('width', 640);
  //$('#mirrorCanvasMe').css('height', 480);
  $('.recordSnap').hide();

  if (!desktop.settings.mirror_snaps_camera_countdown_enabled) {
    if (currentFrame === 0) {
      setTimeout(function () {
        desktop.app.mirror.recordSnaps(10, 100, 'film');
      }, 44);
      return;
    }
  }

  desktop.play('CAMERA_COUNTDOWN.wav');
  $('.snapCountDown').show();
  setTimeout(function () {
    $('.snapCountDown').html('2...');
    setTimeout(function () {
      $('.snapCountDown').html('1...');
      setTimeout(function () {
        $('.snapCountDown').hide();
        $('.snapCountDown').html('3...');
        setTimeout(function () {
          if (currentFrame === 0) {
            setTimeout(function () {
              desktop.app.mirror.recordSnaps(10, 100, 'film');
            }, 44);
          }
        }, 333);
      }, 1000);
    }, 1000);
  }, 1000);
};