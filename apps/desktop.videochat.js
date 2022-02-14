desktop.videochat = {};

desktop.videochat.CALL_IN_PROGRESS = false;
desktop.videochat.CURRENT_CALLER = null;

desktop.videochat.load = function loadVideochat () {
  desktop.videochat.loaded = true;
  desktop.log('Loading:', 'App.videochat');

  var tag = document.createElement('script');
  tag.src = "assets/js/simplepeer.min.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('.startVideoCall').on('click', function(){
    let buddyName = $(this).closest('.buddy_message').attr('data-window-context');
    // do not attempt to call buddies who are currently offline
    
    if (desktop.buddyListData.buddylist['buddies/' + buddyName].isConnected) {
      desktop.videochat.startCall(true, buddyName);
    } else {
      alert('Cant call offline buddy')
    }
  });

  $('.endVideoCall').on('click', function(){
    let buddyName = $(this).closest('.buddy_message').attr('data-window-context');
    desktop.videochat.endCall(buddyName);
  });

}

desktop.videochat.pollSignal = true;

desktop.videochat.startCall = function videoChatStartCall (isHost, buddyName, cb) {

  // console.log('desktop.videochat.startCall', isHost, buddyName, desktop.videochat.CALL_IN_PROGRESS);
  if (desktop.videochat.CALL_IN_PROGRESS) {
    desktop.log('Warning: Ignoring videochat.startCall() since CALL_IS_PROGRESS is true')
    return false;
  }

  $('.endVideoCall').css('opacity', '1');
  $('.startVideoCall').css('opacity', '0.4');
  desktop.videochat.CALL_IN_PROGRESS = true;

  $('#window_video_call').show();
  JQD.util.window_flat();
  $('#window_video_call').addClass('window_stack').show();

  buddypond.callBuddy(buddyName, 'HELLO', function (err, re) {
    console.log('got back call buddy', err, re)
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
        desktop.log('You sent you a Signal to: ' + buddyName + ' ' + data.type);
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
    desktop.videochat.localStream = stream;
  }).catch((err) => {
    console.log('errr', err)
  })
}

desktop.videochat.peer = function peerVideoChat (isHost, buddyName) {
  desktop.log('starting peer connection to: ' + buddyName + ' isHost: ' + isHost);

  // TODO: move this line into setter method?
  if (isHost) {
    desktop.buddylistProfileState.updates['buddies/' + buddyName] = null;
    console.log('supdated', 'buddies/' + buddyName, desktop.buddylistProfileState.updates)
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
   });

   p.on('close', function(err){
     desktop.log('WebRTC peer connection with ' + buddyName + ' is closed');
     desktop.videochat.endCall(buddyName);
   }); 

   p.on('connect', () => {
     console.log('CONNECT')
     desktop.log('WebRTC peer connection established');
     desktop.videochat.addLocalCamera();
   });

   p.on('data', data => {
     console.log('WebRTC data: ' + data)
   });

}

desktop.videochat.endCall = function videoChatEndCall (buddyName, cb) {

  desktop.videochat.pollSignal = false;
  $('.startVideoCall').css('opacity', '1');
  $('.endVideoCall').css('opacity', '0.4');
  $('#window_mirror').hide();

  if (!desktop.videochat.CALL_IN_PROGRESS) {
    return false;
  }
  desktop.videochat.CALL_IN_PROGRESS = false;
  desktop.buddylistProfileState.updates["buddies/" + buddyName] = desktop.buddylistProfileState.updates["buddies/" + buddyName] || {};
  desktop.buddylistProfileState.updates["buddies/" + buddyName].isCalling = false;
  if (desktop.videochat.webrtc && desktop.videochat.webrtc.destroy) {
    desktop.videochat.webrtc.destroy();
  }

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

  // clear signal polling timer
  // clear out webrtc connections
  buddypond.endBuddyCall(buddyName, function fireAndForget(){
    // TODO: move to setter
  });
}

// TODO: 
desktop.videochat.replaceStream = function replaceStream (index) {
  /*

    peer.replaceTrack(oldTrack, newTrack, stream)
    Replace a MediaStreamTrack with another track. Must also pass the MediaStream that the old track was attached to.

  */
}


function closeCallWindow () {
  $('#window_video_call').hide();
  desktop.videochat.CALL_IN_PROGRESS = false;
}

function openCallWindow (buddy, incoming) {
  // this is required to sub to buddies messages ( can be moved later )
  // desktop.openWindow('buddy_message', buddy);
  desktop.videochat.CURRENT_CALLER = buddy

  $('#window_video_call').show();

  $('.callInProgress').hide();

  if (incoming) {
    $('.outgoingCall').hide();
    $('.incomingCall').show();
  } else {
    $('.incomingCall').hide();
    $('.outgoingCall').show();
    $('.window-context-title', '#window_video_call').html('Outgoing Call');
  }
  // bring newly opened window to front
  JQD.util.window_flat();
  $('#window_video_call').addClass('window_stack').show();
  $('#window_video_call').css('width', 333);
  $('#window_video_call').css('height', 444);
  $('#window_video_call').position({
    my: "right top",
    at: 'left-' + 33 + ' top+' + 0,
    of: "#window_buddylist"
  });

}