desktop.app.interdimensionalcable = {};
desktop.app.interdimensionalcable.label = "IDC Cable";
desktop.app.interdimensionalcable.depends_on = ['videoplayer'];
desktop.app.interdimensionalcable.activeVideo = 'rZhbnty03U4'; // default tv static
desktop.app.interdimensionalcable.mode = 'playlist';
desktop.app.interdimensionalcable.load = function (params, next) {

  desktop.load.remoteAssets([
    'data/interdimensionalcable.js',
    'interdimensionalcable' // this loads the sibling desktop.app.interdimensionalcable.html file into <div id="window_interdimensionalcable"></div>
  ], function (err) {

    function interDemonPlayerReady(event) {
      if (desktop.app.interdimensionalcable.mode === 'closeAfterPlayed') {
        desktop.app.interdimensionalcable.player.playVideo(desktop.app.interdimensionalcable.activeVideo);
      } else {
        desktop.app.interdimensionalcable.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist)
      }
      next();
    }

    function interDemonPlayerStateChange(event) {
      if (event.data == 0) {
        if (desktop.app.interdimensionalcable.mode === 'closeAfterPlayed') {
          desktop.ui.closeWindow('interdimensionalcable');
        } else {
          desktop.app.interdimensionalcable.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist)
        }
      }
    }

    // if a single videoId is provided, close the window after the video is complete
    if (params.videoId) {
      desktop.app.interdimensionalcable.mode = 'closeAfterPlayed';
      desktop.app.interdimensionalcable.activeVideo = params.videoId;
    }

    // if a playlist is provided, loop the playlist forever
    desktop.app.interdimensionalcable.player = new YT.Player('interdimensionalcableplayer', {
      height: '390',
      width: '640',
      videoId: desktop.app.interdimensionalcable.activeVideo,
      playerVars: { 'autoplay': 0, 'controls': 1 },
      host: 'http://www.youtube.com',
      events: {
        'onReady': interDemonPlayerReady,
        'onStateChange': interDemonPlayerStateChange
      },
      origin: window.document.location.origin
    });

    $('.ponderinterdimensionalcable').on('click', function(){
      desktop.app.interdimensionalcable.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist);
    });

    $('#window_interdimensionalcable').css('width', 644);
    $('#window_interdimensionalcable').css('height', 590);

    $('#window_interdimensionalcable').css('left', 377);
    $('#window_interdimensionalcable').css('top', 40);
  });

};

desktop.app.interdimensionalcable.playRandomVideo = function playRandomVideo(_player, playlist) {
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

desktop.app.interdimensionalcable.openWindow = function (params) {
  params = params || {};
  if (params.videoId) {
    desktop.app.interdimensionalcable.activeVideo = params.videoId;
    desktop.app.interdimensionalcable.mode = 'closeAfterPlayed';
    if (desktop.app.interdimensionalcable.player && desktop.app.interdimensionalcable.player.loadVideoById) {
      desktop.app.interdimensionalcable.player.loadVideoById(desktop.app.interdimensionalcable.activeVideo);
    }
  } else {
    desktop.app.interdimensionalcable.mode = 'playlist';
    desktop.app.interdimensionalcable.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist)
  }
}

desktop.app.interdimensionalcable.closeWindow = function () {
  // TODO: remove embeds? unload entire App?
  // TODO: same for mtv, we should remove FAANG coms if IDC / MTV is inactive
  if (desktop.app.interdimensionalcable.player && desktop.app.interdimensionalcable.player.pauseVideo) {
    desktop.app.interdimensionalcable.player.pauseVideo();
  }
}

// way easier to type
desktop.app.IDC = desktop.app.interdimensionalcable;