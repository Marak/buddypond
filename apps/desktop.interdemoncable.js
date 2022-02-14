desktop.interdemoncable = {};

desktop.interdemoncable.load = function () {

  desktop.log('Loading: App.interdemoncable')

  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
    desktop.log('Playing: https://www.youtube.com/watch?v=' + yt_id)
    _player.loadVideoById(yt_id);
    setTimeout(function(){
      if (_player.play) {
        _player.play();
      }
    }, 5000)
  }
};

desktop.interdemoncable.closeWindow = function () {
  desktop.interdemoncable.player.pauseVideo();
}

// Remark: youtube embed client REQUIRES the following methods be public
function mtvPlayerReady(event) {
  // event.target.playVideo();
}

function mtvPlayerStateChange(event) {
  if (event.data == 0) {
    desktop.playRandomVideo(desktop.mtv.player, desktop.ytPlaylist)
  }
}

function interDemonPlayerReady(event) {
  // event.target.playVideo();
}

function interDemonPlayerStateChange(event) {
  if (event.data == 0) {
    desktop.playRandomVideo(desktop.interdemoncable.player, desktop.interdemoncable.playlist)
  }
}

function onYouTubeIframeAPIReady() {

  desktop.mtv.player = new YT.Player('mtvPlayer', {
    height: '390',
    width: '640',
    videoId: 'rZhbnty03U4',
    playerVars: { 'autoplay': 0, 'controls': 1 },
    host: 'http://www.youtube.com',
    events: {
      'onReady': mtvPlayerReady,
      'onStateChange': mtvPlayerStateChange
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
      'onReady': interDemonPlayerReady,
      'onStateChange': interDemonPlayerStateChange
    },
    origin: window.document.location.origin
  });
}