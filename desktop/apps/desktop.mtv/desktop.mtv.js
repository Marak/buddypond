desktop.app.mtv = {};
desktop.app.mtv.label = "Music Television";

desktop.app.mtv.player = null;
desktop.app.mtv.load = function (params, next) {

  desktop.load.remoteAssets([
    'data/mtv.js',
    'mtv' // this loads the sibling desktop.app.mtv.html file into <div id="window_mtv"></div>
  ], function (err) {

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    /* 
      it would be better if we can add this script to the above desktop.loadRemoteAssets() call,
      right now youtube is being injected on Desktop Ready instead of lazy load
      see: https://github.com/Marak/buddypond/issues/13
    */
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $('.ponderMTV').on('click', function(){
      desktop.app.mtv.playRandomVideo(desktop.app.mtv.player, desktop.app.ytPlaylist);
    });

    $('#window_mtv').css('width', 644);
    $('#window_mtv').css('height', 590);
    next();
  });
};

desktop.app.mtv.playRandomVideo = function playRandomVideo(_player, playlist) {
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

desktop.app.mtv.closeWindow = function () {
  if (desktop.app.mtv.player && desktop.app.mtv.player.pauseVideo) {
    desktop.app.mtv.player.pauseVideo();
  }
}