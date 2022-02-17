desktop.videochat = {};

desktop.videochat.CALL_IN_PROGRESS = false;
desktop.videochat.CURRENT_CALLER = null;

desktop.videochat.pollSignal = true;

desktop.videochat.devices = {
  videoinput: {},
  audioinput: {},
  audiooutput: {}
};

desktop.videochat.load = function loadVideochat () {
  desktop.videochat.loaded = true;
  desktop.log('Loading:', 'App.videochat');

  var tag = document.createElement('script');
  tag.src = "desktop/assets/js/simplepeer.min.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('.startVideoCall').on('click', function(){
    let buddyName = $(this).closest('.buddy_message').attr('data-window-context');
    // TODO: do not attempt to call buddies who are currently offline
    if (desktop.buddyListData.buddylist['buddies/' + buddyName] && desktop.buddyListData.buddylist['buddies/' + buddyName].isConnected) {
      desktop.videochat.startCall(true, buddyName);
    } else {
      alert('Cant call offline buddy. Try again later.');
    }
  });

  $('.endVideoCall').on('click', function(){
    let buddyName = $(this).closest('.buddy_message').attr('data-window-context');
    desktop.videochat.endCall(buddyName);
  });

  $('#window_videochat').css('width', 777);
  $('#window_videochat').css('height', 666);

  $('.selectCamera').on('change', function(){
    let newDeviceLabel = $(this).val();
    // TODO: use localstorage to set device preference
    desktop.videochat.replaceStream(newDeviceLabel);
  });

  $('.selectAudio').on('change', function(){
    let newDeviceLabel = $(this).val();
    console.log('Changing audio is not available yet');
    // desktop.videochat.replaceStream(newDeviceLabel);
  });

}

// get all camera and audio devices on local system
desktop.videochat.enumerateDevices = function enumerateDevices (cb) {
  navigator.mediaDevices.enumerateDevices({
    video: true,
    audio: true
  }).then(function(devices){
    // console.log(devices)
    $('.selectCamera').html('');
    $('.selectAudio').html('');
    devices.forEach(function(device, i){
      // device.index = i;
      desktop.videochat.alldevices = desktop.videochat.alldevices || {};
      desktop.videochat.alldevices[device.label] = device;
      desktop.videochat.devices[device.kind] = desktop.videochat.devices[device.kind] || {};
      desktop.videochat.devices[device.kind][device.label] = device;
      if (device.kind === 'videoinput') {
        //console.log('device', device.label);
        $('.selectCamera').append(`<option value="${device.label}">${device.label}</option>`);
      }
      if (device.kind === 'audioinput') {
        //console.log('device', device.label);
        $('.selectAudio').append(`<option value="${device.label}">${device.label}</option>`);
      }
    });
    cb(null, devices)
  }).catch((err) => {
    console.log('error in navigator.mediaDevices.enumerateDevices', err)
  });
}

desktop.videochat.startCall = function videoChatStartCall (isHost, buddyName, cb) {

  //
  // The videochat will not work if navigator.mediaDevices is not available.
  // Usually, this will only occur if there is SSL / HTTPS certificate issue
  //
  if (!navigator.mediaDevices) {
    alert('navigator.mediaDevices is undefined. \n\nAre you having HTTPS / SSL issues?');
    return;
  }

  // console.log('desktop.videochat.startCall', isHost, buddyName, desktop.videochat.CALL_IN_PROGRESS);
  if (desktop.videochat.CALL_IN_PROGRESS) {
    desktop.log('Warning: Ignoring videochat.startCall() since CALL_IS_PROGRESS is true');
    return false;
  }

  desktop.videochat.CALL_IN_PROGRESS = true;

  $('.endVideoCall').css('opacity', '1');
  $('.startVideoCall').css('opacity', '0.4');

  $('#window_videochat').show();
  JQD.util.window_flat();
  $('#window_videochat').addClass('window_stack').show();

  buddypond.callBuddy(buddyName, 'HELLO', function (err, re) {
    // console.log('got back call buddy', err, re)
    // create local webrtc peer connection,
    desktop.videochat.peer(isHost, buddyName);
    desktop.videochat.pollSignal = true;
    pollSignal();
  });

  // this will send out the OFFER signal data to buddy
  // then begin polling for signal data endpoint from buddy for ANSWER / CANDIDATE / RENEG, etc
  function pollSignal () {
    if (!desktop.videochat.pollSignal) {
      return;
    }
    buddypond.getBuddySignal(buddypond.me, function(err, data){
      // console.log('buddy.getBuddySignal', err, data);
      if (data && desktop.videochat.webrtc) {
        console.log('You sent you a Signal to: ' + buddyName + ' ' + data.type);
        desktop.videochat.webrtc.signal(data);
      }
      setTimeout(function(){
        pollSignal();
      }, 1000);
    });
  }
}

desktop.videochat.addLocalCamera = function videoChatAddLocalCamera () {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(function(stream){
    desktop.videochat.webrtc.addStream(stream) // <- add streams to peer dynamically
    // console.log('got back from devices', stream);
    var video = document.querySelector("#chatVideoMe");
    video.srcObject = stream;
    video.muted = true;
    desktop.videochat.localStream = stream;

    /*
      // Remark: this will emulate "Mute" button functionality ( both callers )
      desktop.videochat.localStream.getAudioTracks().forEach(function(track) {
        track.enabled = false;
      });
    */

  }).catch((err) => {
    console.log('errr', err)
  })
}

desktop.videochat.peer = function peerVideoChat (isHost, buddyName) {
  desktop.log('starting peer connection to: ' + buddyName + ' isHost: ' + isHost);

  if (isHost) {
    // can this be removed now?
    // desktop.buddylistProfileState.updates['buddies/' + buddyName] = null;
  }

  const p = desktop.videochat.webrtc = new SimplePeer({
     initiator: isHost
   });

   p.on('stream', stream => {
     desktop.log(buddyName + ' Camera Connected');
     var video = document.querySelector("#chatVideoBuddy");
     video.srcObject = stream;
     desktop.videochat.remoteStream = stream;
   })

   p.on('signal', data => {
     desktop.log(buddyName + ' sent you a Signal: ' + data.type);
     console.log('sending signal to ', buddyName, data)
     buddypond.sendBuddySignal(buddyName, data, function(err, result){
       console.log('buddy.sendBuddySignal', err, result);
     });
   });

   p.on('error', (err) => {
     console.log('ERROR', err)
     desktop.log('Error: WebRTC peer connection', err);
     $('#window_console').show();
     desktop.videochat.endCall(buddyName);
   });

   p.on('close', function(err){
     desktop.log('WebRTC peer connection with ' + buddyName + ' is closed');
     desktop.videochat.endCall(buddyName);
   }); 

   p.on('connect', () => {
     desktop.log('WebRTC peer connection established');
     desktop.videochat.enumerateDevices(function(err, devices){
       console.log('got back dvices that are ready', err, devices)
       desktop.videochat.addLocalCamera();
     });
   });

   p.on('data', data => {
     console.log('WebRTC data: ' + data)
   });

}

desktop.videochat.endCall = function videoChatEndCall (buddyName, cb) {

  desktop.videochat.pollSignal = false;
  $('.startVideoCall').css('opacity', '1');
  $('.endVideoCall').css('opacity', '0.4');
  $('#window_videochat').hide();

  if (desktop.videochat.localStream && desktop.videochat.localStream.getTracks) {
    desktop.videochat.localStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  if (desktop.videochat.remoteStream && desktop.videochat.remoteStream.getTracks) {
    desktop.videochat.remoteStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  if (!desktop.videochat.CALL_IN_PROGRESS) {
    return false;
  }
  desktop.videochat.CALL_IN_PROGRESS = false;
  desktop.buddylistProfileState.updates["buddies/" + buddyName] = desktop.buddylistProfileState.updates["buddies/" + buddyName] || {};
  desktop.buddylistProfileState.updates["buddies/" + buddyName].isCalling = false;
  if (desktop.videochat.webrtc && desktop.videochat.webrtc.destroy) {
    desktop.videochat.webrtc.destroy();
  }

  // clear signal polling timer
  // clear out webrtc connections
  buddypond.endBuddyCall(buddyName, function endBuddyCall(){
    // TODO: move to setter
    desktop.videochat.CALL_IN_PROGRESS = false;
  });
}


//
// Replaces the current video or input device with a new device while streaming
//
desktop.videochat.replaceStream = function replaceStream (label) {
  desktop.videochat.localStream.getTracks().forEach(function(track) {

    // only replace video devices ( for now )
    if (track.kind !== 'video') {
      // console.log('ignoring', track.label)
      return;
    }
    let newDevice = desktop.videochat.alldevices[label]

    desktop.videochat.enumerateDevices(function(err, devices){
      navigator.mediaDevices.getUserMedia({
        video: {
          'deviceId': newDevice.deviceId
        },
        audio: false
      }).then(function(stream){
        stream.getTracks().forEach(function(newTrack) {
          if (newTrack.label === label) {
            desktop.videochat.webrtc.replaceTrack(track, newTrack, desktop.videochat.localStream);
            var video = document.querySelector("#chatVideoMe");
            video.srcObject = stream;
            // desktop.videochat.localStream = stream;
            
            // Error: Cannot replace track that was never added.
            // TODO: allow multiple device switching during stream
            // desktop.videochat.webrtc.addTrack(newTrack, desktop.videochat.localStream);
            // desktop.videochat.webrtc.removeTrack(track);
            
            $('.selectCamera').val(newTrack.label);
          }
        });
      }).catch((err) => {
        console.log('error in calling navigator.mediaDevices.getUserMedia', err)
      });
    });

  });

}

desktop.videochat.closeWindow = function closeWindow () {
  $('#window_videochat').hide();
  $('.startVideoCall').css('opacity', '1.0');
  desktop.videochat.endCall();
}