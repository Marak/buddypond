desktop.videochat = {};

desktop.videochat.CALL_IN_PROGRESS = false;
desktop.videochat.CURRENT_CALLER = null;

desktop.videochat.load = function loadVideochat () {
  desktop.videochat.loaded = true;
  desktop.log('Loading: app.videochat')

  var tag = document.createElement('script');
  tag.src = "assets/js/simplepeer.min.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('.startVideoCall').on('click', function(){
    let buddyName = $(this).attr('data-buddyname');
    desktop.videochat.startCall(true, buddyName)
  });

  $('.acceptIncomingCall').on('click', function(){
    let buddyName = $(this).attr('data-buddyname');
    desktop.videochat.peer(false, buddyName);
    // buddypond.videochat.peer...
  });

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
    //desktop.videochat.peer();
    // buddypond.videochat.peer...
  });
  
  /*
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(function(stream){
    desktop.videochat.stream = stream;
    console.log('got back from devices',   err, stream)
  }).catch(() => {})
  */

}

desktop.videochat.pollSignal = true;

desktop.videochat.startCall = function videoChatStartCall (isHost, buddyName, cb) {
  // create local webrtc peer connection,
  desktop.videochat.peer(isHost, buddyName)
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
        desktop.videochat.webrtc.signal(data);
      }
      setTimeout(function(){
        pollSignal();
      }, 1000);
    });
  }
  desktop.videochat.pollSignal = true;
  pollSignal();
  
}

desktop.videochat.endCall = function videoChatEndCall (buddyname, cb) {
  desktop.videochat.webrtc.destroy();
  desktop.videochat.pollSignal = false;
  // clear signal polling timer
  // clear out webrtc connections
}


/*

var Peer = require('simple-peer')

// get video/voice stream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(gotMedia).catch(() => {})

function gotMedia (stream) {
  var peer1 = new Peer({ initiator: true, stream: stream })
  var peer2 = new Peer()

  peer1.on('signal', data => {
    peer2.signal(data)
  })

  peer2.on('signal', data => {
    peer1.signal(data)
  })

  peer2.on('stream', stream => {
    // got remote video stream, now let's show it in a video tag
    var video = document.querySelector('video')

    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }

    video.play()
  })
}


var Peer = require('simple-peer') // create peer without waiting for media

var peer1 = new Peer({ initiator: true }) // you don't need streams here
var peer2 = new Peer()

peer1.on('signal', data => {
  peer2.signal(data)
})

peer2.on('signal', data => {
  peer1.signal(data)
})

peer2.on('stream', stream => {
  // got remote video stream, now let's show it in a video tag
  var video = document.querySelector('video')

  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = window.URL.createObjectURL(stream) // for older browsers
  }

  video.play()
})

function addMedia (stream) {
  peer1.addStream(stream) // <- add streams to peer dynamically
}

// then, anytime later...
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(addMedia).catch(() => {})

*/

desktop.videochat.peer = function peerVideoChat (isHost, buddyName) {
  desktop.log('starting peer connection to: ' + buddyName + ' isHost: ' + isHost);

  // TODO: move this line into setter method?
  if (isHost) {
    desktop.buddylistProfileState.updates['buddies/' + buddyName] = null;
    console.log('supdated', 'buddies/' + buddyName, desktop.buddylistProfileState.updates)
  }

  const p = desktop.videochat.webrtc = new SimplePeer({
     initiator: isHost,
     isStream: false
   });

   p.on('signal', data => {
     desktop.log('WebRTC SIGNAL: ' + JSON.stringify(data));
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
     desktop.log('WebRTC peer connection closed');
     // TODO: set some property in profile?
     // closeCallWindow();
   }); 

   p.on('connect', () => {
     console.log('CONNECT')
     desktop.log('WebRTC peer connection established');
   });

   p.on('data', data => {
     console.log('WebRTC data: ' + data)
   });

}


desktop.videochat.peerOld = function peerVideoChatOld (isHost, buddyName) {
  
  
  /*
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(gotMedia).catch(() => {})
  */
  
  if (isHost) {
    // offer has been sent, send message to buddy to accept the connection
    buddypond.callBuddy(buddyName, 'hello and hey', function(err, data){
      console.log("Buddy pond api returns");
      $('.apiResult').val(JSON.stringify(data, true, 2))
      console.log(err, data)
      openCallWindow(buddyName);
      // pollHandshake();
      gotMedia();
    });
  } else {
    gotMedia();
  }
  
  
  function gotMedia(stream) {
    let isStream = false;
    desktop.log('Attempting WebRTC peer. isHost:', isHost);
    // TODO: add get devices code
    if (isHost) {
      isStream = true;
    }
    const p = desktop.videochat.webrtc = new SimplePeer({
       initiator: isHost,
       isStream: false,
       tickle: false
     });

     p.on('error', err => console.log('error', err)); 

     p.on('close', function(err){
       // TODO: set some property in profile?
       closeCallWindow();
     }); 

     /*
     p.on('stream', stream => {
       alert('stream started')
       // got remote video stream, now let's show it in a video tag
       var video = $('#webcamVideo')

       if ('srcObject' in video) {
         video.srcObject = stream
       } else {
         video.src = window.URL.createObjectURL(stream) // for older browsers
       }

       video.play()
     })
     */

     p.on('signal', data => {
       console.log('SIGNAL', JSON.stringify(data))

       if (data.type === "renegotiate" || data.type === 'candidate') {
         return;
       }
       if (isHost) {
         // if host, call API to set offer in new redis handshake
         // make sure that previous answer is always cleared when making new offer
         buddypond.signalBuddy(desktop.videochat.CURRENT_CALLER, JSON.stringify(data), function(err){
           if (err) {
             console.log(err);
           }
         });
       } else {
         // TODO: get handshake, perform retry logic if no exists
         // signal using the data back from redis
         // if not host, call API to set answer in existing redis handshake
         desktop.log('client is answering handshake');
         console.log('client is answering handshake');
         buddypond.signalBuddy(desktop.videochat.CURRENT_CALLER, JSON.stringify(data), function(err){
           if (err) {
             console.log(err);
           }
           // answers offer
           // this should connect host, no retry should be needed unless request
           // to api fails
           // TODO: add reconnect logic for failed GETS to API here
         });
       
       }
       console.log('SIGNAL', JSON.stringify(data))
       //document.querySelector('#outgoing').textContent = JSON.stringify(data)
     });

     /*
     document.querySelector('form').addEventListener('submit', ev => {
       ev.preventDefault()
       p.signal(JSON.parse(document.querySelector('#incoming').value))
     });
     */

     p.on('connect', () => {
       console.log('CONNECT')
       desktop.log('WebRTC peer connection established.');
     
       // send message to expire this handshake connection in redis
       // this ensures that old handshakes are not reused if browser reloads
       desktop.log('buddypond.clearHandshake -> videoCall');
       /*
       buddypond.clearHandshake('Bob', { type: 'videoCall', buddytext: 'end' }, function(err, data){
         console.log("Buddy pond api returns");
         $('.apiResult').val(JSON.stringify(data, true, 2))
         p.send('whatever' + Math.random())
       
       });
       */
       desktop.videochat.CALL_IN_PROGRESS = true;
       $('.callInProgress', '#window_video_call').show();
     });

     p.on('data', data => {
       console.log('data: ' + data)
     });
  }


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