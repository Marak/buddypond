export default function takeSingleSnap () {
    let that = this;
    let bp = this.bp;
    //$('#mirrorCanvasMe').css('width', 640);
    //$('#mirrorCanvasMe').css('height', 480);
    $('.recordSnap').hide();
  
    /*
    if (!desktop.settings.mirror_snaps_camera_countdown_enabled) {
      if (currentFrame === 0) {
        desktop.play('CAMERA_SNAP.wav');
        setTimeout(function () {
          desktop.app.mirror.recordSnaps(1);
        }, 44);
        return;
      }
    }
    */
    bp.play('desktop/assets/audio/CAMERA_COUNTDOWN.wav');
    $('.snapCountDown').show();
    setTimeout(function () {
      $('.snapCountDown').html('2...');
      setTimeout(function () {
        $('.snapCountDown').html('1...');
        setTimeout(function () {
          $('.snapCountDown').hide();
          $('.snapCountDown').html('3...');
          setTimeout(function () {
            if (that.currentFrame === 0) {
                bp.play('desktop/assets/audio/CAMERA_SNAP.wav');
                setTimeout(function () {
                    that.recordSnaps(1);
                }, 44);
            }
          }, 333);
        }, 1000);
      }, 1000);
    }, 1000);
  };