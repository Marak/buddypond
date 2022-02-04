desktop.interdemoncable = {};

desktop.interdemoncable.load = function () {

  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('#desktop').append(`
    <a class="abs icon" style="left:20px;top:460px;" href="#icon_dock_interdemoncable">
      <img src="assets/images/icons/icon_portal.png" />
      Inter Dimensional Cable
    </a>`);

  $('#dock').append(`
    <li id="icon_dock_interdemoncable">
      <a href="#window_interdemoncable">
        <img height="22" width="22" src="assets/images/icons/icon_portal.png" />
        Inter Dimensional cable
      </a>
    </li>
    `);

    $('#desktop').append(`
    <div id="window_interdemoncable" class="abs window">
      <div class="abs window_inner">
        <div class="window_top">
          <span class="float_left">
            <img height="16" width="16" src="assets/images/icons/icon_portal.png" />
            Interdimensional Cable
          </span>
          <span class="float_right">
            <a href="#" class="window_min"></a>
            <a href="#" class="window_resize"></a>
            <a href="#icon_dock_interdemoncable" class="window_close"></a>
          </span>
        </div>
        <div class="abs window_content">
          <div class="window_main">
            <div id="interDemonCableplayer"></div>
            <div align="center">
              <a class="desktopButton ponderInterdemoncable orb" href="#">
                <img src="assets/images/orb.jpeg" width="100" height="100" title="Ponder the orb..."/>
              </a>
              <br/>
              <br/>
              <button class="ponderInterdemoncable desktopButton">Ponder the orb for next video</button>
            </div>
          </div>
        </div>
        <div class="abs window_bottom">
          Build: v4.20.69
        </div>
      </div>
      <span class="abs ui-resizable-handle ui-resizable-se"></span>
    </div>
      `);

  $('.ponderInterdemoncable').on('click', function(){
    desktop.playRandomVideo(desktop.interdemoncable.player, desktop.interdemoncable.playlist);
  });

  $('#window_interdemoncable').css('width', 644);
  $('#window_interdemoncable').css('height', 666);

  $('#window_interdemoncable').css('left', 777);
  $('#window_interdemoncable').css('top', 30);
};


desktop.playRandomVideo = function playRandomVideo(_player, playlist) {

  let keys = playlist;
  let key =   keys[Math.floor(Math.random() * keys.length)];

  if (_player) {
    let yt_id = key;
    desktop.log('Playing Youtube ID: ', yt_id)
    _player.loadVideoById(yt_id);
    setTimeout(function(){
      if (_player.play) {
        _player.play();
      }
    }, 5000)
    // CURRENT_VIDEO_URL = result.youtube.url;
  }
};

// Remark: youtube embed client REQUIRES the following methods be public
// TODO: better control and exports of pubic methods here to desktop
function onPlayerReady(event) {
  // event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data == 0) {
    desktop.playRandomVideo(desktop.mtv.player, desktop.ytPlaylist)
  }
}
function stopVideo() {
  desktop.mtv.player.stopVideo();
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady2(event) {
  // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange2(event) {
  if (event.data == 0) {
    desktop.playRandomVideo(desktop.interdemoncable.player, desktop.interdemoncable.playlist)
  }
}
function stopVideo2() {
  interdemoncable.stopVideo();
}

function onYouTubeIframeAPIReady() {

  desktop.mtv.player = new YT.Player('mtvPlayer', {
    height: '390',
    width: '640',
    videoId: 'rZhbnty03U4',
    playerVars: { 'autoplay': 0, 'controls': 1 },
    host: 'http://www.youtube.com',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    origin: window.document.location.origin
  });

  desktop.interdemoncable.player = new YT.Player('interDemonCableplayer', {
    height: '390',
    width: '640',
    videoId: 'rZhbnty03U4',
    playerVars: { 'autoplay': 0, 'controls': 1 },
    host: 'http://www.youtube.com',
    events: {
      'onReady': onPlayerReady2,
      'onStateChange': onPlayerStateChange2
    },
    origin: window.document.location.origin
  });
}