desktop.app.videochat = {};

desktop.app.videochat.label = "Video Call";

desktop.app.videochat.CALL_IN_PROGRESS = false;
desktop.app.videochat.CURRENT_CALLER = null;

desktop.app.videochat.pollSignal = true;

desktop.app.videochat.devices = {
  videoinput: {},
  audioinput: {},
  audiooutput: {}
};

desktop.app.videochat.load = function loadVideochat () {

  desktop.load.remoteAssets([
    'desktop/assets/js/simplepeer.min.js',
    'videochat' // this loads the sibling desktop.app.videochat.html file into <div id="window_videochat"></div>
  ], function (err) {

    desktop.app.videochat.loaded = true;

    let d = $(document);
    
    d.on('mousedown', '.startVideoCall', function () {
      if (buddypond.me === 'anonymous') {
        alert('You must create an account. anonymous cannot make video calls');
        return;
      }
      let buddyName = $(this).closest('.buddy_message').data('context');
      // TODO: do not attempt to call buddies who are currently offline
      if (desktop.buddyListData.buddylist['buddies/' + buddyName] && desktop.buddyListData.buddylist['buddies/' + buddyName].isConnected) {
        desktop.app.videochat.startCall(true, buddyName);
      } else {
        alert('Cant call offline buddy. Try again later.');
      }
    });

    d.on('mousedown', '.endVideoCall', function () {
      let buddyName = $(this).closest('.buddy_message').data('context');
      desktop.app.videochat.endCall(buddyName);
    });

    $('.selectCamera').on('change', function () {
      let newDeviceLabel = $(this).val();
      // TODO: use localstorage to set device preference
      desktop.app.videochat.replaceStream(newDeviceLabel);
    });

    $('.selectAudio').on('change', function () {
      let newDeviceLabel = $(this).val();
      alert('Changing audio is not available yet');
      // desktop.app.videochat.replaceStream(newDeviceLabel);
    });

  });
};

// get all camera and audio devices on local system
desktop.app.videochat.enumerateDevices = function enumerateDevices (cb) {
  navigator.mediaDevices.enumerateDevices({
    video: true,
    audio: true
  }).then(function (devices) {
    // console.log(devices)
    $('.selectCamera').html('');
    $('.selectAudio').html('');
    devices.forEach(function (device, i) {
      // device.index = i;
      desktop.app.videochat.alldevices = desktop.app.videochat.alldevices || {};
      desktop.app.videochat.alldevices[device.label] = device;
      desktop.app.videochat.devices[device.kind] = desktop.app.videochat.devices[device.kind] || {};
      desktop.app.videochat.devices[device.kind][device.label] = device;
      if (device.kind === 'videoinput') {
        //console.log('device', device.label);
        $('.selectCamera').append(`<option value="${device.label}">${device.label}</option>`);
      }
      if (device.kind === 'audioinput') {
        //console.log('device', device.label);
        $('.selectAudio').append(`<option value="${device.label}">${device.label}</option>`);
      }
    });
    cb(null, devices);
  }).catch((err) => {
    console.log('error in navigator.mediaDevices.enumerateDevices', err);
  });
};

desktop.app.videochat.startCall = function videoChatStartCall (isHost, buddyName, cb) {

  //
  // The videochat will not work if navigator.mediaDevices is not available.
  // Usually, this will only occur if there is SSL / HTTPS certificate issue
  //
  if (!navigator.mediaDevices) {
    alert('navigator.mediaDevices is undefined. \n\nAre you having HTTPS / SSL issues?');
    return;
  }

  // console.log('desktop.app.videochat.startCall', isHost, buddyName, desktop.app.videochat.CALL_IN_PROGRESS);
  if (desktop.app.videochat.CALL_IN_PROGRESS) {
    desktop.log('Warning: Ignoring videochat.startCall() since CALL_IS_PROGRESS is true');
    return false;
  }

  desktop.app.videochat.CALL_IN_PROGRESS = true;

  $('.endVideoCall').css('opacity', '1');
  $('.startVideoCall').css('opacity', '0.4');

  // Remark: This should just be desktop.ui.openWindow('videochat')
  desktop.app.videochat.openWindow();
  desktop.ui.showWindow('videochat');
  desktop.ui.renderDockIcon('videochat', 'Video Call');
  desktop.ui.renderDockElement('videochat');
  setTimeout(function(){
    JQDX.window_flat();
    $('#window_videochat').addClass('window_stack').show();
  }, 333);

  buddypond.callBuddy(buddyName, 'HELLO', function (err, re) {
    // console.log('got back call buddy', err, re)
    // create local webrtc peer connection,
    desktop.app.videochat.peer(isHost, buddyName);
    desktop.app.videochat.pollSignal = true;
    pollSignal();
  });

  // this will send out the OFFER signal data to buddy
  // then begin polling for signal data endpoint from buddy for ANSWER / CANDIDATE / RENEG, etc
  function pollSignal () {
    if (!desktop.app.videochat.pollSignal) {
      return;
    }
    buddypond.getBuddySignal(buddypond.me, function (err, data) {
      // console.log('buddy.getBuddySignal', err, data);
      if (data && desktop.app.videochat.webrtc) {
        console.log('You sent you a Signal to: ' + buddyName + ' ' + data.type);
        desktop.app.videochat.webrtc.signal(data);
      }
      setTimeout(function () {
        pollSignal();
      }, 1000);
    });
  }
};

desktop.app.videochat.addLocalCamera = function videoChatAddLocalCamera () {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(function (stream) {
    desktop.app.videochat.webrtc.addStream(stream); // <- add streams to peer dynamically
    // console.log('got back from devices', stream);
    let video = document.querySelector('#chatVideoMe');
    video.srcObject = stream;
    video.muted = true;
    desktop.app.videochat.localStream = stream;

    /*
      // Remark: this will emulate "Mute" button functionality ( both callers )
      desktop.app.videochat.localStream.getAudioTracks().forEach(function(track) {
        track.enabled = false;
      });
    */

  }).catch((err) => {
    console.log('errr', err);
  });
};

desktop.app.videochat.peer = function peerVideoChat (isHost, buddyName) {
  desktop.log('starting peer connection to: ' + buddyName + ' isHost: ' + isHost);

  if (isHost) {
    // can this be removed now?
    // desktop.app.buddylist.profileState.updates['buddies/' + buddyName] = null;
  }

  const p = desktop.app.videochat.webrtc = new SimplePeer({
    initiator: isHost
  });

  p.on('stream', stream => {
    desktop.log(buddyName + ' Camera Connected');
    let video = document.querySelector('#chatVideoBuddy');
    video.srcObject = stream;
    desktop.app.videochat.remoteStream = stream;
  });

  p.on('signal', data => {
    desktop.log(buddyName + ' sent you a Signal: ' + data.type);
    console.log('sending signal to ', buddyName, data);
    buddypond.sendBuddySignal(buddyName, data, function (err, result) {
      console.log('buddy.sendBuddySignal', err, result);
    });
  });

  p.on('error', (err) => {
    console.log('ERROR', err);
    desktop.log('Error: WebRTC peer connection', err);
    if (desktop.ui.view !== 'Mobile') {
      $('#window_console').show();
    }
    desktop.app.videochat.endCall(buddyName);
  });

  p.on('close', function (err) {
    desktop.log('WebRTC peer connection with ' + buddyName + ' is closed');
    desktop.app.videochat.endCall(buddyName);
  }); 

  p.on('connect', () => {
    desktop.log('WebRTC peer connection established');
    desktop.app.videochat.enumerateDevices(function (err, devices) {
      console.log('got back dvices that are ready', err, devices);
      desktop.app.videochat.addLocalCamera();
    });
  });

  p.on('data', data => {
    console.log('WebRTC data: ' + data);
  });

};

desktop.app.videochat.endCall = function videoChatEndCall (buddyName, cb) {

  desktop.app.videochat.pollSignal = false;
  $('.startVideoCall').css('opacity', '1');
  $('.endVideoCall').css('opacity', '0.4');

  // Remark: This should be using desktop.ui.closeWindow('video') instead
  $('#window_videochat').hide();
  $('#icon_dock_videochat').hide();

  if (desktop.app.videochat.localStream && desktop.app.videochat.localStream.getTracks) {
    desktop.app.videochat.localStream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  if (desktop.app.videochat.remoteStream && desktop.app.videochat.remoteStream.getTracks) {
    desktop.app.videochat.remoteStream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  if (!desktop.app.videochat.CALL_IN_PROGRESS) {
    return false;
  }
  desktop.app.videochat.CALL_IN_PROGRESS = false;
  desktop.app.buddylist.profileState.updates['buddies/' + buddyName] = desktop.app.buddylist.profileState.updates['buddies/' + buddyName] || {};
  desktop.app.buddylist.profileState.updates['buddies/' + buddyName].isCalling = false;
  if (desktop.app.videochat.webrtc && desktop.app.videochat.webrtc.destroy) {
    desktop.app.videochat.webrtc.destroy();
  }

  // clear signal polling timer
  // clear out webrtc connections
  buddypond.endBuddyCall(buddyName, function endBuddyCall () {
    // TODO: move to setter
    desktop.app.videochat.CALL_IN_PROGRESS = false;
  });
};


//
// Replaces the current video or input device with a new device while streaming
//
desktop.app.videochat.replaceStream = function replaceStream (label) {
  desktop.app.videochat.localStream.getTracks().forEach(function (track) {

    // only replace video devices ( for now )
    if (track.kind !== 'video') {
      // console.log('ignoring', track.label)
      return;
    }
    let newDevice = desktop.app.videochat.alldevices[label];

    desktop.app.videochat.enumerateDevices(function (err, devices) {
      navigator.mediaDevices.getUserMedia({
        video: {
          'deviceId': newDevice.deviceId
        },
        audio: false
      }).then(function (stream) {
        stream.getTracks().forEach(function (newTrack) {
          if (newTrack.label === label) {
            desktop.app.videochat.webrtc.replaceTrack(track, newTrack, desktop.app.videochat.localStream);
            let video = document.querySelector('#chatVideoMe');
            video.srcObject = stream;
            // desktop.app.videochat.localStream = stream;
            
            // Error: Cannot replace track that was never added.
            // TODO: allow multiple device switching during stream
            // desktop.app.videochat.webrtc.addTrack(newTrack, desktop.app.videochat.localStream);
            // desktop.app.videochat.webrtc.removeTrack(track);
            
            $('.selectCamera').val(newTrack.label);
          }
        });
      }).catch((err) => {
        console.log('error in calling navigator.mediaDevices.getUserMedia', err);
      });
    });

  });

};




desktop.app.videochat.openWindow = function closeWindow () {
  $('#window_videochat').css('width', '77vw');
  $('#window_videochat').css('height', '66vh');
  $('#window_videochat').css('top', '5vh');
  $('#window_videochat').css('left', '5vw');
};

desktop.app.videochat.closeWindow = function closeWindow () {
  $('#window_videochat').hide();
  $('.startVideoCall').css('opacity', '1.0');
  let buddyName = $(this).closest('.buddy_message').data('context');
  desktop.app.videochat.endCall(buddyName);
};