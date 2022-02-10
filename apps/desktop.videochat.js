desktop.videochat = {};

desktop.videochat.CALL_IN_PROGRESS = false;
desktop.videochat.CURRENT_CALLER = null;

desktop.videochat.load = function loadVideochat () {
  desktop.videochat.loaded = true;
  desktop.log('Loading: app.videochat');

  var tag = document.createElement('script');
  tag.src = "assets/js/simplepeer.min.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('.startVideoCall').on('click', function(){
    // TODO: where to get buddy name from?
    let buddyName = $(this).closest('.buddy_message').attr('data-window-context');
    desktop.videochat.startCall(true, buddyName);
  });

  $('.endVideoCall').on('click', function(){
    let buddyName = $(this).closest('.buddy_message').attr('data-window-context');
    desktop.videochat.endCall(buddyName);
  });

  $('.acceptIncomingCall').on('click', function(){
    let buddyName = $(this).closest('.buddy_message').attr('data-window-context');
    alert(buddyName)
    // desktop.videochat.peer(false, buddyName);
    // buddypond.videochat.peer...
  });

  /*
  $('.declineIncomingCall').on('click', function(){
    closeCallWindow();
    if (desktop.videochat.webrtc && desktop.videochat.webrtc.destroy) {
      desktop.videochat.webrtc.destroy();
    }
    // alert(desktop.videochat.CURRENT_CALLER)
    buddypond.declineCall(desktop.videochat.CURRENT_CALLER, function(err, data){
      $('.apiResult').val(JSON.stringify(data, true, 2))
      console.log(err, data)
    });
  });
  */
}

desktop.videochat.pollSignal = true;

desktop.videochat.startCall = function videoChatStartCall (isHost, buddyName, cb) {

  // console.log('desktop.videochat.startCall', isHost, buddyName, desktop.videochat.CALL_IN_PROGRESS);
  if (desktop.videochat.CALL_IN_PROGRESS) {
    desktop.log('Warning: Ignoring videochat.startCall() since CALL_IS_PROGRESS is true')
    return false;
  }

  /*
  if (!desktop.videochat.webrtc) {
    return false;
  }
  */

  $('.endVideoCall').css('opacity', '1');
  $('.startVideoCall').css('opacity', '0.4');
  desktop.videochat.CALL_IN_PROGRESS = true;

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
    console.log('getting signal for me')
    buddypond.getBuddySignal(buddypond.me, function(err, data){
      console.log('buddy.getBuddySignal', err, data);
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

desktop.videochat.endCall = function videoChatEndCall (buddyName, cb) {
  if (!desktop.videochat.CALL_IN_PROGRESS) {
    return false;
  }
  desktop.videochat.CALL_IN_PROGRESS = false;
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

  desktop.videochat.pollSignal = false;
  $('.startVideoCall').css('opacity', '1');
  $('.endVideoCall').css('opacity', '0.4');
  // clear signal polling timer
  // clear out webrtc connections
  buddypond.endBuddyCall(buddyName, function fireAndForget(){
  });
}

desktop.videochat.addLocalCamera = function videoChatAddLocalCamera () {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(function(stream){
    desktop.videochat.webrtc.addStream(stream) // <- add streams to peer dynamically
    // console.log('got back from devices', stream);
    var video = document.querySelector("#mirrorVideoMe");
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
     var video = document.querySelector("#mirrorVideoBuddy");
     video.srcObject = stream;
     desktop.videochat.remoteStream = stream;
   })

   p.on('signal', data => {
     desktop.log(buddyName + ' sent you a Signal: ' + data.type);
     // TODO: move this line into setter method?
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
     // TODO: set some property in profile?
     // closeCallWindow();
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