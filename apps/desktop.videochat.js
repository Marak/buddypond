desktop.videochat = {};

desktop.videochat.CALL_IN_PROGRESS = false;

desktop.videochat.load = function loadVideochat () {

  desktop.log('Loading: app.videochat')

  var tag = document.createElement('script');
  tag.src = "assets/js/simplepeer.min.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('.startVideoCall').on('click', function(){
    let buddyName = $(this).attr('data-buddyname');
    desktop.videochat.peer(true, buddyName);
    // buddypond.videochat.peer...
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
    let buddyName = $(this).attr('data-buddyname');
    buddypond.declineCall('Dave', function(err, data){
      $('.apiResult').val(JSON.stringify(data, true, 2))
      console.log(err, data)
    });
    //desktop.videochat.peer();
    // buddypond.videochat.peer...
  });

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

*/

desktop.videochat.peer = function peerVideoChat (isHost, buddyName) {
  
  desktop.log('Attempting WebRTC peer. isHost:', isHost);
  // TODO: add get devices code
  const p = desktop.videochat.webrtc = new SimplePeer({
     initiator: isHost,
     trickle: false
   });

   p.on('error', err => console.log('error', err)); 

   p.on('close', function(err){
     // TODO: set some property in profile?
     closeCallWindow();
   }); 
   p.on('signal', data => {
     console.log('SIGNAL', JSON.stringify(data))

     if (isHost) {

       showCallWindow();

       // if host, call API to set offer in new redis handshake
       // make sure that previous answer is always cleared when making new offer
       buddypond.offerHandshake('Marak/Dave', JSON.stringify(data), function(err){
         if (err) {
           console.log(err);
         }

         function pollHandshake () {
           desktop.log('offer made, polling handshake for answer')
           // makes offer
           // setInterval to query API until response
           buddypond.getHandshake('Marak/Dave', function(err, data){
             if (data.offer && data.answer) {
               console.log('ddddd')
               if (typeof data.answer === 'string') {
                 data.answer = JSON.parse(data.answer);
               }
               // since offer and answer both exist, attempt to connect
               p.signal(data.answer)
             } else {
               // wait a few moments and repeat query
               setTimeout(pollHandshake, 1000);
             }
           });
         }

         // offer has been sent, send message to buddy to accept the connection
         buddypond.callBuddy('Marak', 'hello and hey', function(err, data){
           console.log("Buddy pond api returns");
           $('.apiResult').val(JSON.stringify(data, true, 2))
           console.log(err, data)
           pollHandshake();
         });

       });
     } else {
       // TODO: get handshake, perform retry logic if no exists
       // signal using the data back from redis
       // if not host, call API to set answer in existing redis handshake
       desktop.log('client is answering handshake');
       console.log('client is answering handshake');
       buddypond.answerHandshake('Marak/Dave', JSON.stringify(data), function(err){
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

   if (!isHost) {
     function pollHandshake2 () {
       console.log('polling handshake for offer')
       // makes offer
       // setInterval to query API until response
       buddypond.getHandshake('Marak/Dave', function(err, data){
         if (data.offer) {
           // since offer and answer both exist, attempt to connect
           console.log('got offer signa', data.offer)
           p.signal(JSON.parse(data.offer))
           /*
           */
           
         } else {
           // wait a few moments and repeat query
           setTimeout(pollHandshake2, 1000);
         }
       });
     }
     pollHandshake2();
   }

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

function closeCallWindow () {
  $('#window_video_call').hide();
  desktop.videochat.CALL_IN_PROGRESS = false;
}

function showCallWindow (buddy, incoming) {
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
