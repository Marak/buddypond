desktop.app.mirror = {};
desktop.app.mirror.label = "Mirror";

// "mirror" mode indicates that Snaps should be saved locally to file system
// This could also be "Snap" which indicates Snaps will be sent to the server or a buddy
desktop.app.mirror.mode = 'mirror';
desktop.app.mirror.fullMirror = false;
desktop.app.mirror.showingControls = true;

// Three view modes available for Mirror: Normal, Half, Full
desktop.app.mirror.viewMode = 'Normal';
desktop.app.mirror.devices = {
  videoinput: {},
  audioinput: {},
  audiooutput: {}
};

desktop.app.mirror.load = function loadDesktopMirror (params, next) {
  const assets = [ 
    'desktop/apps/desktop.mirror/CanvasVideo.js',
    'desktop/apps/desktop.mirror/snaps.js',
    'desktop/apps/desktop.mirror/jsman.js',
    'desktop/assets/js/gif.js',
    'mirror' ];

  desktop.load.remoteAssets(assets, function (err) {
    $('#window_mirror').css('width', 640);
    $('#window_mirror').css('height', 580);
    $('#window_mirror').css('left', 200);
    $('#window_mirror').css('top', 44);

    $('#window_mirror').resize(function(){
      if (desktop.app.mirror.viewMode === 'Full') {
        desktop.app.mirror.resizeFullVideo();
      }
    });

    $( "#snapDelaySlider" ).slider({
      value: 777,
      min: 1,
      max: 2222,
      change: function(event, ui){
        desktop.app.mirror.snapDelay = ui.value
        $('#snapsPreview').data('delay', ui.value);
        let delay = ui.value;
        desktop.app.mirror.createGIF(delay);
      }
    });

    function toggleMirrorControls () {
      if (desktop.app.mirror.showingControls) {
        desktop.app.mirror.showingControls = false;
        hideMirrorControls();
      } else {
        desktop.app.mirror.showingControls = true;
        showMirrorControls();
      }
    }

    function hideMirrorControls () {
      $('.mirrorControl').hide();
      $('.cameraControls').hide();
      $('.snapControl').hide();
      $('.snapControls').hide();
    }

    function showMirrorControls () {
      if (desktop.app.mirror.makingSnap) {
        $('.cameraControls').show();
        $('.snapControl').show();
        $('.snapControls').show();
        if (Object.keys(desktop.app.mirror.snaps).length > 1) {
          $('.snapDelaySliderControl').show();
        }
      } else {
        $('.mirrorControl').show();
        $('.cameraControls').show();
        $('.snapControl').hide();
        $('.snapControls').hide();
      }
    }

    function toggleMirrorSize () {
      // 3 view modes we can toggle, Normal, Half, Full
      if (desktop.app.mirror.viewMode === 'Normal') {
        $('#mirrorCanvasMe').css('width', 320);
        $('#mirrorCanvasMe').css('height', 240);
        $('#snapsPreview').css('width', 320);
        $('#snapsPreview').css('height', 240);
        $('#mirrorCanvasMe').css('padding-top', 32);
        $('#snapsPreview').css('padding-top', 32);
        $('#mirrorCanvasMe').css('position', 'relative');
        desktop.app.mirror.viewMode = 'Half';
        $('.showFullMirror').html(desktop.app.mirror.viewMode + ' View');
        return;
      }
      if (desktop.app.mirror.viewMode === 'Half') {
        $('#mirrorCanvasMe').css('padding-top', 0);
        $('#snapsPreview').css('padding-top', 0);
        desktop.app.mirror.resizeFullVideo();
        desktop.app.mirror.viewMode = 'Full';
        $('.showFullMirror').html(desktop.app.mirror.viewMode + ' View');
        return;
      }
      if (desktop.app.mirror.viewMode === 'Full') {
        $('#mirrorCanvasMe').css('width', 640);
        $('#mirrorCanvasMe').css('height', 480);
        $('#snapsPreview').css('width', 640);
        $('#snapsPreview').css('height', 480);
        $('#mirrorCanvasMe').css('padding-top', 0);
        $('#snapsPreview').css('padding-top', 0);
        $('#mirrorCanvasMe').css('position', 'relative');
        desktop.app.mirror.viewMode = 'Normal';
        $('.showFullMirror').html(desktop.app.mirror.viewMode + ' View');
        return;
      }
    }

    $('.showMirrorControls').on('click', function(){
      toggleMirrorControls();
    });

    $('.showFullMirror').on('click', function(){
      toggleMirrorSize();
    });

    if (desktop.app.mirror.showingControls) {
      showMirrorControls();
    }

    desktop.app.mirror.canvasVideo = new window.CanvasVideo(
      '#mirrorVideoMe', '#mirrorCanvasMe');

    $('.selectMirrorCamera').on('change', function(){
      let newDeviceLabel = $(this).val();
      desktop.set('mirror_selected_camera_device_label', newDeviceLabel);
      // TODO: use localstorage to set device preference
      desktop.app.mirror.startCamera(newDeviceLabel)
    });

    // adds all JSManipulate effects as keys to the drop down
    Object.keys(JSManipulate).forEach(function(filter){
      $('.selectMirrorFilter').append(`<option value="${filter}">${filter}</option>`);
    })

    $('.selectMirrorFilter').on('change', function(ev){
      desktop.app.mirror.canvasVideo.filter = ev.currentTarget.value.toLowerCase();
    });

    // starts snaps photo record
    let MAX_FRAMES_PER_SNAP = 6;
    let DEFAULT_SNAP_TIMER = 1000;
    let currentFrame = 0;
    desktop.app.mirror.snaps = [];
    desktop.app.mirror.snapsGIF = [];

    $('.takeSingleSnap').on('click', function(){
      desktop.app.mirror.makingSnap = true;
      desktop.app.mirror.takeSingleSnap();
    });

    $('.takeSnap').on('click', function(){
      desktop.app.mirror.makingSnap = true;
      desktop.app.mirror.takeSnap();
    });

    $('.approveSnap').on('click', function(){
      let msg = 'I sent a Snap!';
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('.takeSingleSnap').css('left', '122');
      $('.cameraControls').show();

      if (desktop.app.mirror.mode === 'mirror') {
        let src = $('#snapsPreview').attr('src');
        // TODO: create utility function for downloading files
        var url = src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
        window.open(url);
        return;
      }

      // close mirror ( fow now )
      JQDX.closeWindow('#window_mirror');
      let snapsGIF = $('#snapsPreview').attr('src');
      buddypond.sendSnaps(desktop.app.mirror.snapType, desktop.app.mirror.snapContext, msg, snapsGIF, desktop.app.mirror.snapDelay, function(err, data){
        desktop.app.mirror.snaps = [];
        currentFrame = 0;
        $('.gifFrames', '#window_mirror').html('');
        //$('#snapsPreview').attr('src', 'desktop/assets/images/gui/rainbow-tv-loading.gif');
        $('#snapsPreview').data('stopped', true);
        $('#snapDelaySlider').slider('value', 777);
        $('#snapDelaySlider').data('delay', 777);
        desktop.app.mirror.makingSnap = false;
      });
    });

    desktop.app.mirror.cancelSnap = function cancelSnap () {
      // TODO: show frame limit / timer
      desktop.app.mirror.snaps = [];
      currentFrame = 0;
      $('.cameraControls').show();
      $('.gifFrames', '#window_mirror').html('');
      //$('#snapsPreview').attr('src', 'desktop/assets/images/gui/rainbow-tv-loading.gif');
      $('#snapsPreview').data('stopped', true);
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.takeSingleSnap').css('left', '122');
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('.snapDelaySliderControl').hide();
      $('#snapDelaySlider').slider('value', 777);
      $('#snapDelaySlider').data('delay', 777);
      desktop.app.mirror.makingSnap = false;
    }

    $('.cancelSnap').on('click', function(){
      desktop.app.mirror.cancelSnap();
    });

    $('.continueSnap').on('click', function(){
      $('.cameraControls').show();
      $('.mirrorVideoHolder').show();
      $('#snapsPreview').hide();
      $('.snapDelaySliderControl').hide();
      $('.recordSnap').show();
      $('.confirmSnap').hide();
      $('.takeSnap').hide();
      $('.takeSingleSnap').css('left', 244);
      $('.takeSingleSnap').show();
      //$('#snapsPreview').data('stopped', true);
      //desktop.app.mirror.takeSingleSnap();
    });

    if (desktop.settings.mirror_snaps_camera_countdown_enabled) {
      $('.cameraCountdownEnabled').prop('checked', 'checked');
    }

    $('.cameraCountdownEnabled').on('change', function(){
      if ($(this).prop('checked')) {
        desktop.set('mirror_snaps_camera_countdown_enabled', true);
      } else {
        desktop.set('mirror_snaps_camera_countdown_enabled', false);
      }
    });

    next();
  });
}

// get all camera and audio devices on local system
desktop.app.mirror.enumerateDevices = function enumerateDevices (cb) {
  navigator.mediaDevices.enumerateDevices({
    video: true
  }).then(function(devices){
    $('.selectMirrorCamera').html('');
    let cameraCount = 0;
    devices.forEach(function(device, i){
      device.index = i;
      desktop.app.mirror.alldevices = desktop.app.mirror.alldevices || {};
      desktop.app.mirror.alldevices[device.label] = device;
      desktop.app.mirror.devices[device.kind] = desktop.app.mirror.devices[device.kind] || {};
      desktop.app.mirror.devices[device.kind][device.label] = device;
      if (device.kind === 'videoinput') {
        cameraCount++;
        let selected = '';
        if (desktop.settings.mirror_selected_camera_index === cameraCount) {
          selected = 'selected="selected"';
          device.label = 'ACTIVE';
        }
        //console.log('device', device.label);
        $('.selectMirrorCamera').append(`<option ${selected}>${device.label}</option>`);
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
  // console.log('starting with device label: ', deviceLabel)
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
        } else {
          // desktop.app.mirror.showFullMirror();
        }
      }

      video.srcObject = stream;
      desktop.app.mirror.localStream = stream;
      $('#mirrorPlaceHolder').fadeOut();
    }).catch((err) => {
      console.log('error in calling navigator.mediaDevices.getUserMedia', err)
    });
  });
}

desktop.app.mirror.resizeFullVideo = function resizeFullVideo () {
  $('#snapsPreview').css('width', $('#window_mirror').css('width'));
  $('#snapsPreview').css('height', $('#window_mirror').css('height'));

  $('#mirrorCanvasMe').css('width', $('#window_mirror').css('width'));
  $('#mirrorCanvasMe').css('height', $('#window_mirror').css('height'));

  $('#mirrorCanvasMe').css('position', 'absolute');
  $('#mirrorCanvasMe').css('top', 0);
  $('#mirrorCanvasMe').css('left', 0);
}

desktop.app.mirror.openWindow = function openWindow (params) {
  this.canvasVideo.bindPlayEvent();
  params = params || {};
  desktop.app.mirror.snapContext = params.context;
  desktop.app.mirror.snapType = params.type;

  if (params.context) {
    desktop.app.mirror.mode = 'snap';
    $('#window_mirror').css('width', 640);
    $('#window_mirror').css('height', 580);
    $('#mirrorCanvasMe').css('width', 640);
    $('#mirrorCanvasMe').css('height', 480);
    $('#snapDelaySlider').show();
  } else {
    desktop.app.mirror.mode = 'mirror';
  }

  if (desktop.app.mirror.mode === 'mirror') {
    $('.approveSnap').attr('title', 'Save to Local');
  } else {
    $('.approveSnap').attr('title', 'Approve and Send');
  }

  $('.snapControl').hide();
  $('.confirmSnap').hide();
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
      let firstCamera = desktop.app.mirror.devices.videoinput[Object.keys(desktop.app.mirror.devices.videoinput)[0]].label;
      let defaultCamera = desktop.settings.mirror_selected_camera_device_label;
      if (defaultCamera) {
        desktop.app.mirror.startCamera(defaultCamera);
      } else {
        desktop.app.mirror.startCamera(firstCamera);
      }
    })
  }).catch((err) => {
    console.log('error in navigator.mediaDevices.getUserMedia', err)
  });
}

desktop.app.mirror.closeWindow = function closeMirrorWindow () {
  this.canvasVideo.unbindPlayEvent();

  if (desktop.app.mirror.makingSnap) {
    desktop.app.mirror.cancelSnap();
  }

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
