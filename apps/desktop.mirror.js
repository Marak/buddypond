desktop.mirror = {};

desktop.mirror.load = function loadDesktopMirror () {
  
  desktop.createDesktopIcon()
  desktop.createDockIcon()
  desktop.createWindow()

}


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


// TODO: move into desktop.mirror.js
/*
$('#window_mirror').show();

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(function(stream){
  // desktop.videochat.stream = stream;
  console.log('got back from devices', stream)
  // got remote video stream, now let's show it in a video tag
  // const video = document.createElement('video');
  
  var video = document.querySelector("#mirrorVideo");
  
  video.srcObject = stream;


  
}).catch((err) => {
  console.log('errr', err)
  
})
*/