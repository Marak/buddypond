desktop.app.mirror = {};
desktop.app.mirror.label = "Mirror";

desktop.app.mirror.devices = {
  videoinput: {},
  audioinput: {},
  audiooutput: {}
};

desktop.app.mirror.load = function loadDesktopMirror (params, next) {
  const assets = [ 'desktop/apps/desktop.mirror/CanvasVideo.js', 'mirror' ];

  desktop.load.remoteAssets(assets, function (err) {
    $('#window_mirror').css('width', 686);
    $('#window_mirror').css('height', 622);
    $('#window_mirror').css('left', 200);
    $('#window_mirror').css('top', 44);
    $( "#snapDelaySlider" ).slider({
      value: 777,
      min: 1,
      max: 2222,
      change: function(event, ui){
        desktop.app.mirror.snapDelay = ui.value
        $('#snapsPreview').data('delay', ui.value);
      }
    });
    desktop.app.mirror.canvasVideo = new window.CanvasVideo(
      '#mirrorVideoMe', '#mirrorCanvasMe');

    $('.selectMirrorCamera').on('change', function(){
      let newDeviceLabel = $(this).val();
      // TODO: use localstorage to set device preference
      desktop.app.mirror.startCamera(newDeviceLabel)
    });

    $('.selectMirrorFilter').on('change', function(ev){
      desktop.app.mirror.canvasVideo.filter = ev.currentTarget.value.toLowerCase();
    });

    // starts snaps photo record
    let MAX_FRAMES_PER_SNAP = 6;
    let DEFAULT_SNAP_TIMER = 1000;
    let currentFrame = 0;
    desktop.app.mirror.snaps = [];

    function recordSnaps (maxFrames, delay, mode) {
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

      // Get base64 data to send to server for upload
      var imagebase64data = destinationCanvas.toDataURL("image/png");
      imagebase64data = imagebase64data.replace('data:image/png;base64,', '');
      desktop.app.mirror.snaps.push(imagebase64data);

      currentFrame++;
      $('.mirrorVideoHolder').css('opacity', '0.88');
      $('#snapsPreview').data('stopped', false);
      $('.mirrorVideoHolder').css('opacity', '1');
      if (currentFrame >= maxFrames) {
        currentFrame = 0;
        setTimeout(function(){
          $('.mirrorVideoHolder').hide();
          $('#snapsPreview').show();
          desktop.playSnaps({
            el: '#snapsPreview',
            snaps: desktop.app.mirror.snaps,
            index: 0,
            delay: delay
          });
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
        recordSnaps(maxFrames, delay, mode);
      }, delay)
    }

    $('.takeSingleSnap').on('click', function(){
      takeSingleSnap();
    });

    function takeSingleSnap () {
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
                  recordSnaps(1);
                }, 44)
              }
            }, 333)
          }, 1000)
        }, 1000)
      }, 1000)
    }

    function takeSnap () {
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
                  recordSnaps(10, 100, 'film');
                }, 44)
              }
            }, 333)
          }, 1000)
        }, 1000)
      }, 1000)
    }

    $('.retrySnap').on('click', function(){
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('#snapsPreview').hide();
      $('#snapsPreview').data('stopped', true);
      desktop.app.mirror.snaps = [];
      currentFrame = 0;
      takeSnap();
    })

    $('.retrySingleSnap').on('click', function(){
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('#snapsPreview').hide();
      $('#snapsPreview').data('stopped', true);
      $('#snapDelaySlider').hide();
      $('#snapDelaySlider').slider('value', 777);
      $('#snapDelaySlider').data('delay', 777);
      desktop.app.mirror.snaps = [];
      currentFrame = 0;
      takeSingleSnap();
    })

    $('.takeSnap').on('click', function(){
      takeSnap();
    });

    $('.approveSnap').on('click', function(){
      let msg = 'I sent a Snap!';
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('#snapDelaySlider').hide();
      // close mirror ( fow now )
      JQDX.closeWindow('#window_mirror');
      buddypond.sendSnaps(desktop.app.mirror.snapType, desktop.app.mirror.snapContext, msg, JSON.stringify(desktop.app.mirror.snaps), desktop.app.mirror.snapDelay, function(err, data){
        desktop.app.mirror.snaps = [];
        currentFrame = 0;
        $('#snapsPreview').data('stopped', true);
        $('#snapDelaySlider').slider('value', 777);
        $('#snapDelaySlider').data('delay', 777);
      });
    });

    $('.cancelSnap').on('click', function(){
      // TODO: show frame limit / timer
      desktop.app.mirror.snaps = [];
      currentFrame = 0;
      $('#snapsPreview').data('stopped', true);
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('#snapDelaySlider').slider('value', 777);
      $('#snapDelaySlider').data('delay', 777);
    });

    $('.continueSnap').on('click', function(){
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('#snapsPreview').hide();
      $('#snapsPreview').data('stopped', true);
      takeSingleSnap();
    });

    next();
  });
}

desktop.app.mirror.openWindow = function openWindow (params) {
  this.canvasVideo.bindPlayEvent();
  params = params || {};
  desktop.app.mirror.snapContext = params.context;
  desktop.app.mirror.snapType = params.type;

  if (params.context) {
    $('#window_mirror').css('width', 640);
    $('#window_mirror').css('height', 580);
  }

  $('.confirmSnap').hide();
  $('.recordSnap').hide();
  $('#snapDelaySlider').hide();
  $('#snapDelaySlider').slider('value', 777);
  $('#snapDelaySlider').data('delay', 777);

  // The mirror will not work if navigator.mediaDevices is not available.
  // Usually, this will only occur if there is SSL / HTTPS certificate issue
  //
  if (!navigator.mediaDevices) {
    alert('navigator.mediaDevices is undefined. \n\nAre you having HTTPS / SSL issues?');
  }

  // when mirror loads, get local cameras and start camera with default setting
  // this is required for enumerateDevices to have any data
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(function(stream){
    //desktop.app.mirror.enumerateDevices();
    desktop.app.mirror.enumerateDevices(function(err, devices){
      // console.log('starting camera with devices', devices)
      desktop.app.mirror.startCamera(desktop.app.mirror.devices.videoinput[Object.keys(desktop.app.mirror.devices.videoinput)[0]].label);
    })
  }).catch((err) => {
    console.log('error in navigator.mediaDevices.getUserMedia', err)
  });
}

// get all camera and audio devices on local system
desktop.app.mirror.enumerateDevices = function enumerateDevices (cb) {
  navigator.mediaDevices.enumerateDevices({
    video: true
  }).then(function(devices){
    // console.log(devices)
    $('.selectMirrorCamera').html('');
    devices.forEach(function(device, i){
      device.index = i;
      desktop.app.mirror.alldevices = desktop.app.mirror.alldevices || {};
      desktop.app.mirror.alldevices[device.label] = device;
      desktop.app.mirror.devices[device.kind] = desktop.app.mirror.devices[device.kind] || {};
      desktop.app.mirror.devices[device.kind][device.label] = device;
      if (device.kind === 'videoinput') {
        //console.log('device', device.label);
        $('.selectMirrorCamera').append(`<option>${device.label}</option>`);
      }
      if (device.kind === 'audioinput') {
        //console.log('device', device.label);
        // $('.selectAudio').append(`<option>${device.label}</option>`);
      }
    });
    cb(null, devices)
  }).catch((err) => {
    console.log('errr', err)
  });
}

// opens local camera device and streams it to <video> tag
// takes in optional device label
// if no label is provided, will default to first camera found in array
desktop.app.mirror.startCamera = function startCamera (deviceLabel) {
  //console.log('starting with device label: ', deviceLabel)
  desktop.app.mirror.enumerateDevices(function(err, devices){
    let deviceId = desktop.app.mirror.devices.videoinput[deviceLabel].deviceId;
    navigator.mediaDevices.getUserMedia({
      video: {
        'deviceId': deviceId
      },
      audio: false
    }).then(function(stream){
      stream.getTracks().forEach(function(track) {
        $('.selectMirrorCamera').val(track.label)
      });
      var video = document.querySelector("#mirrorVideoMe");

      video.onplay = function() {
        if (desktop.app.mirror.snapContext) {
          $('.recordSnap').show();
        }
      }

      video.srcObject = stream;
      desktop.app.mirror.localStream = stream;

    }).catch((err) => {
      console.log('error in calling navigator.mediaDevices.getUserMedia', err)
    });
  });
}

desktop.app.mirror.closeWindow = function closeMirrorWindow () {
  this.canvasVideo.unbindPlayEvent();

  // when closing the window for the Mirror App
  // stop all tracks associated with open stream
  if (desktop.app.mirror.localStream && desktop.app.mirror.localStream.getTracks) {
    desktop.app.mirror.localStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
};

/*
// used for screen shares
desktop.app.mirror.getDisplayMedia = function getDisplayMedia () {
  navigator.mediaDevices.getDisplayMedia({
    video: true
  }).then(function(devices){
    console.log(devices)
  }).catch((err) => {
    console.log('errr', err)
  });
}
*/
