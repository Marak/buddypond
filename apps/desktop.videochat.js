desktop.videochat = {};

desktop.videochat.load = function loadVideochat () {

  desktop.log('Loading: app.videochat')

  var tag = document.createElement('script');
  tag.src = "assets/js/simplepeer.min.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


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

desktop.videochat.peer = function peerVideoChat (isHost) {
  
  desktop.log('Attempting WebRTC peer. isHost:', isHost);
  // TODO: add get devices code
  const p = desktop.videochat.webrtc = new SimplePeer({
     initiator: isHost,
     trickle: false
   });

   p.on('error', err => console.log('error', err)); 
 
   p.on('signal', data => {
     console.log('SIGNAL', JSON.stringify(data))

     if (isHost) {
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
         buddypond.sendMessage('Bob', { type: 'videoCall' }, function(err, data){
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

   document.querySelector('form').addEventListener('submit', ev => {
     ev.preventDefault()
     p.signal(JSON.parse(document.querySelector('#incoming').value))
   });

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
   });

   p.on('data', data => {
     console.log('data: ' + data)
   });

}