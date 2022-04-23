desktop.app.lofi = {};
desktop.app.lofi.label = 'Music Television';
desktop.app.lofi.depends_on = [ 'videoplayer' ];
desktop.app.lofi.player = null;
desktop.app.lofi.load = function (params, next) {

  desktop.load.remoteAssets([
    'lofi' // this loads the sibling desktop.app.lofi.html file into <div id="window_lofi"></div>
  ], function (err) {

    function lofiPlayerReady (event) {
      // event.target.playVideo();
    }

    function lofiPlayerStateChange (event) {
      if (event.data == 0) {
      }
    }
    desktop.app.lofi.player = new YT.Player('lofiPlayer', {
      height: '390',
      width: '640',
      videoId: '5qap5aO4i9A',
      playerVars: { 'autoplay': 1, 'controls': 1 },
      host: 'http://www.youtube.com',
      events: {
        'onReady': lofiPlayerReady,
        'onStateChange': lofiPlayerStateChange
      },
      origin: window.document.location.origin
    });

    $('#window_lofi').css('height', 390);
    $('#window_lofi').css('width', 644);
    $('#window_lofi').css('left', 400);
    $('#window_lofi').css('top', 40);

    next();
  });
};

desktop.app.lofi.closeWindow = function () {
  if (desktop.app.lofi.player && desktop.app.lofi.player.pauseVideo) {
    desktop.app.lofi.player.pauseVideo();
  }
};