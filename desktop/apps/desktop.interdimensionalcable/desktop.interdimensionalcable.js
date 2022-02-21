desktop.interdimensionalcable = {};
desktop.interdimensionalcable.label = "IDC Cable";

desktop.interdimensionalcable.load = function (params, next) {

  desktop.loadRemoteAssets([
    'data/interdimensionalcable.js',
    'interdimensionalcable' // this loads the sibling desktop.interdimensionalcable.html file into <div id="window_interdimensionalcable"></div>
  ], function (err) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    /* 
      we could add this script to the above desktop.loadRemoteAssets() call,
      but that will result in the IDC App having to wait for youtube to respond for App to complete load
    */
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $('.ponderinterdimensionalcable').on('click', function(){
      desktop.playRandomVideo(desktop.interdimensionalcable.player, desktop.interdimensionalcable.playlist);
    });

    $('#window_interdimensionalcable').css('width', 644);
    $('#window_interdimensionalcable').css('height', 590);

    $('#window_interdimensionalcable').css('left', 377);
    $('#window_interdimensionalcable').css('top', 40);
    next();
  });
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

desktop.interdimensionalcable.closeWindow = function () {
  if (desktop.interdimensionalcable.player && desktop.interdimensionalcable.player.pauseVideo) {
    desktop.interdimensionalcable.player.pauseVideo();
  }
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
    desktop.playRandomVideo(desktop.interdimensionalcable.player, desktop.interdimensionalcable.playlist)
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

  desktop.interdimensionalcable.player = new YT.Player('interdimensionalcableplayer', {
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

// way easier to type
desktop.IDC = desktop.interdimensionalcable;