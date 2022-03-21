desktop.app.mirror.createGIF = function createGIF (delay) {
  var gif = new GIF({
    workers: 2,
    quality: 3,
    width: 320,
    height: 240
  });

  gif.on('finished', function(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      var base64data = reader.result;
      $('#snapsPreview').attr('src', base64data);
    }
  });

  $('.gifFrames img').each(function(i, e){
    gif.addFrame(e, { delay: delay });
  })

  gif.render();
}

desktop.app.mirror.recordSnaps = function recordSnaps (maxFrames, delay, mode) {

  delay = delay || DEFAULT_SNAP_TIMER;
  $('#snapsPreview').data('delay', delay);
  desktop.app.mirror.snapDelay = delay;
  mode = mode || 'photo';
  $('.recordSnap').hide();
  $('.mirrorVideoHolder').css('opacity', '1');
  // runs until max frames or hits stop
  var destinationCanvas = document.getElementById('snaps');
  var destCtx = destinationCanvas.getContext('2d');

  if (maxFrames > 1) {
    desktop.play('CAMERA_SHUTTER.wav', true);
  }

  destinationCanvas.width = 320;
  destinationCanvas.height = 240;

  destCtx.scale(0.5, 0.5);
  destCtx.drawImage(document.getElementById("mirrorCanvasMe"), 0, 0);

  var imagebase64data = destinationCanvas.toDataURL("image/png");
  var gifbase64data = destinationCanvas.toDataURL("image/gif");

  $('.gifFrames').append(`<img src="${gifbase64data}"/>`)
  imagebase64data = imagebase64data.replace('data:image/png;base64,', '');
  desktop.app.mirror.snaps.push(imagebase64data);

  currentFrame++;
  $('.mirrorVideoHolder').css('opacity', '0.88');
  $('#snapsPreview').data('stopped', false);
  $('.mirrorVideoHolder').css('opacity', '1');
  if (currentFrame >= maxFrames) {
    currentFrame = 0;
    setTimeout(function(){

      desktop.app.mirror.createGIF(delay);

      $('.mirrorVideoHolder').hide();
      $('#snapsPreview').show();

      $('.confirmSnap').show();
      if (mode === 'photo') {
        $('.retrySnap').hide();
        $('.retrySingleSnap').show();
        if (Object.keys(desktop.app.mirror.snaps).length > 1) {
          $('#snapDelaySlider').show();
        }
      } else {
        $('.continueSnap').hide();
        $('.retrySingleSnap').hide();
        $('.retrySnap').show();
      }
    }, 55)
    return;
  }
  setTimeout(function(){
    desktop.app.mirror.recordSnaps(maxFrames, delay, mode);
  }, delay)
}


desktop.app.mirror.takeSingleSnap = function takeSingleSnap () {
  $('.recordSnap').hide();
  desktop.play('CAMERA_COUNTDOWN.wav');
  $('.snapCountDown').show();
  setTimeout(function(){
    $('.snapCountDown').html('2...');
    setTimeout(function(){
      $('.snapCountDown').html('1...');
      setTimeout(function(){
        $('.snapCountDown').hide();
        $('.snapCountDown').html('3...');
         setTimeout(function(){
          if (currentFrame === 0) {
            desktop.play('CAMERA_SNAP.wav');
            setTimeout(function(){
              desktop.app.mirror.recordSnaps(1);
            }, 44)
          }
        }, 333)
      }, 1000)
    }, 1000)
  }, 1000)
}

desktop.app.mirror.takeSnap = function takeSnap () {
  $('.recordSnap').hide();
  desktop.play('CAMERA_COUNTDOWN.wav');
  $('.snapCountDown').show();
  setTimeout(function(){
    $('.snapCountDown').html('2...');
    setTimeout(function(){
      $('.snapCountDown').html('1...');
      setTimeout(function(){
        $('.snapCountDown').hide();
        $('.snapCountDown').html('3...');
        setTimeout(function(){
          if (currentFrame === 0) {
            setTimeout(function(){
              desktop.app.mirror.recordSnaps(10, 100, 'film');
            }, 44)
          }
        }, 333)
      }, 1000)
    }, 1000)
  }, 1000)
}