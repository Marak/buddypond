desktop.app.interdimensionalcable = {};
desktop.app.interdimensionalcable.label = "IDC Cable";
desktop.app.interdimensionalcable.depends_on = ['videoplayer'];
desktop.app.interdimensionalcable.load = function (params, next) {

  desktop.load.remoteAssets([
    'data/interdimensionalcable.js',
    'interdimensionalcable' // this loads the sibling desktop.app.interdimensionalcable.html file into <div id="window_interdimensionalcable"></div>
  ], function (err) {

    function interDemonPlayerReady(event) {
      // event.target.playVideo();
    }

    function interDemonPlayerStateChange(event) {
      if (event.data == 0) {
        desktop.app.mtv.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist)
      }
    }

    desktop.app.interdimensionalcable.player = new YT.Player('interdimensionalcableplayer', {
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

    $('.ponderinterdimensionalcable').on('click', function(){
      desktop.app.mtv.playRandomVideo(desktop.app.interdimensionalcable.player, desktop.app.interdimensionalcable.playlist);
    });

    $('#window_interdimensionalcable').css('width', 644);
    $('#window_interdimensionalcable').css('height', 590);

    $('#window_interdimensionalcable').css('left', 377);
    $('#window_interdimensionalcable').css('top', 40);
    next();
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

desktop.app.interdimensionalcable.closeWindow = function () {
  if (desktop.app.interdimensionalcable.player && desktop.app.interdimensionalcable.player.pauseVideo) {
    desktop.app.interdimensionalcable.player.pauseVideo();
  }
}


// way easier to type
desktop.app.IDC = desktop.app.interdimensionalcable;