desktop.mirror = {};

//
// The mirror will not work if navigator.mediaDevices is not available.
// Usually, this will only occur if there is SSL / HTTPS certificate issue
//
if (!navigator.mediaDevices) {
  alert('Webcam cannot be accessed: navigator.mediaDevices is undefined. \n\nAre you having HTTPS / SSL issues?');
}

desktop.mirror.devices = {
  videoinput: {},
  audioinput: {},
  audiooutput: {}
};

desktop.mirror.load = function loadDesktopMirror () {

  // desktop.createDesktopIcon()
  //desktop.createDockIcon()
  // desktop.createWindow()
  $('#window_mirror').show();
  $('#window_mirror').css('width', 686);
  $('#window_mirror').css('height', 622);
  $('#window_mirror').css('left', 200);
  $('#window_mirror').css('top', 44);

  $('.getDisplayMedia').on('click', function(){
    desktop.mirror.getDisplayMedia();
  });

  $('.selectCamera').on('change', function(){
    let newDevice = $(this).val();
    // TODO: use localstorage to set device preference
    console.log('change device', newDevice);
    let device = desktop.mirror.devices.videoinput[newDevice];
    //    desktop.mirror.startCamera($(this)[0].selectedIndex)
  });

  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(function(stream){
    //desktop.mirror.enumerateDevices();
    desktop.mirror.startCamera();
  }).catch((err) => {
    console.log('errr', err)
  });

  
}

// use for screen shares
desktop.mirror.getDisplayMedia = function getDisplayMedia () {
  navigator.mediaDevices.getDisplayMedia({
    video: true
  }).then(function(devices){
    console.log(devices)
  }).catch((err) => {
    console.log('errr', err)
  });
}

// get all camera and audio devices on local system
desktop.mirror.enumerateDevices = function enumerateDevices (cb) {
  navigator.mediaDevices.enumerateDevices({
    video: true
  }).then(function(devices){
    console.log(devices)
    $('.selectCamera').html('');
    devices.forEach(function(device, i){
      device.index = i;
      desktop.mirror.devices[device.kind] = desktop.mirror.devices[device.kind] || {};
      desktop.mirror.devices[device.kind][device.label] = device;
      if (device.kind === 'videoinput') {
        //console.log('device', device.label);
        $('.selectCamera').append(`<option>${device.label}</option>`);
      }
      if (device.kind === 'audioinput') {
        //console.log('device', device.label);
        $('.selectAudio').append(`<option>${device.label}</option>`);
      }
    });
    cb(null, devices)
  }).catch((err) => {
    console.log('errr', err)
  });
}

// opens the camera device
desktop.mirror.startCamera = function startCamera (deviceIndex) {

  if (typeof deviceIndex === 'undefined') {
    // TODO: check to see if we have a saved default device in local storage
    deviceIndex = 0;
  }
  // console.log('searching for device index', deviceIndex)
  desktop.mirror.enumerateDevices(function(err, devices){
    // console.log('got back devices', devices);
    let defaultDevice = desktop.mirror.defaultDevice = devices[deviceIndex];
    // console.log('loading ', defaultDevice.label, defaultDevice.id)
    navigator.mediaDevices.getUserMedia({
      video: {
        'deviceId': defaultDevice.deviceId
      },
      audio: false
    }).then(function(stream, b, c){
      // console.log('loading device...', defaultDevice.label);
      stream.getTracks().forEach(function(track) {
        $('.selectCamera').val(track.label)
      });
      var video = document.querySelector("#mirrorVideoMe");
      video.srcObject = stream;
      desktop.mirror.localStream = stream;
    }).catch((err) => {
      console.log('errr', err)
    });
  });

}

desktop.mirror.closeWindow = function closeMirrorWindow () {
  // when closing the window for the Mirror App
  // stop all tracks associated with open stream
  if (desktop.mirror.localStream && desktop.mirror.localStream.getTracks) {
    desktop.mirror.localStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
};


/*

      TODO: default this html so it doesnt have to repeat for each App...
      <a class="abs icon" style="left:20px;top:333px;" href="#icon_dock_mirror">
        <img src="assets/images/icons/icon_32_computer.png" />
        Mirror
      </a>
      
      <li id="icon_dock_mirror">
        <a href="#window_mirror">
          <img src="assets/images/icons/icon_22_computer.png" />
          Mirror
        </a>
      </li>
      


*/
