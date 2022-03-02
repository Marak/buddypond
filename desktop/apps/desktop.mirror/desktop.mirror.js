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

    next();
  });
}

desktop.app.mirror.openWindow = function openWindow () {
  this.canvasVideo.bindPlayEvent();

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
