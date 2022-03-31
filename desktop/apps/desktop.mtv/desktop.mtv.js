desktop.app.mtv = {};
desktop.app.mtv.label = 'Music Television';
desktop.app.mtv.depends_on = [ 'videoplayer' ];
desktop.app.mtv.player = null;
desktop.app.mtv.load = function (params, next) {

  desktop.load.remoteAssets([
    'desktop/apps/desktop.mtv/data/mtv.js',
    'mtv' // this loads the sibling desktop.app.mtv.html file into <div id="window_mtv"></div>
  ], function (err) {

    function mtvPlayerReady (event) {
      // event.target.playVideo();
    }

    function mtvPlayerStateChange (event) {
      if (event.data == 0) {
        desktop.app.mtv.playRandomVideo(desktop.app.mtv.player, desktop.app.ytPlaylist);
      }
    }

    desktop.app.mtv.player = new YT.Player('mtvPlayer', {
      height: '390',
      width: '640',
      videoId: 'rZhbnty03U4',
      playerVars: { 'autoplay': 1, 'controls': 1 },
      host: 'http://www.youtube.com',
      events: {
        'onReady': mtvPlayerReady,
        'onStateChange': mtvPlayerStateChange
      },
      origin: window.document.location.origin
    });

    $('.ponderMTV').on('click', function () {
      desktop.app.mtv.playRandomVideo(desktop.app.mtv.player, desktop.app.ytPlaylist);
    });

    $('#window_mtv').css('width', 644);
    $('#window_mtv').css('height', 590);
    next();
  });
};

desktop.app.mtv.playRandomVideo = function playRandomVideo (_player, playlist) {
  const keys = playlist;
  const key =   keys[Math.floor(Math.random() * keys.length)];
  if (_player) {
    const yt_id = key;
    desktop.log('Playing: https://www.youtube.com/watch?v=' + yt_id);
    _player.loadVideoById(yt_id);
    setTimeout(function () {
      if (_player.play) {
        _player.play();
      }
    }, 5000);
  }
};

desktop.app.mtv.closeWindow = function () {
  if (desktop.app.mtv.player && desktop.app.mtv.player.pauseVideo) {
    desktop.app.mtv.player.pauseVideo();
  }
};