desktop.app.videoplayer = {};
desktop.app.videoplayer.youtubeEmbedReady = false;

desktop.app.videoplayer.load = function (params, next) {
  desktop.load.remoteAssets([
    'https://www.youtube.com/iframe_api'
  ], function (err) {
    function waitForAsyncEmbedAction () {
      if (desktop.app.videoplayer.youtubeEmbedReady) {
        next();
      } else {
        setTimeout(function(){
          console.log('did not found embed, try again')
          waitForAsyncEmbedAction();
        }, 3000)
      }
    }
    waitForAsyncEmbedAction();
  });
};

desktop.app.videoplayer.playRandomVideo = function playRandomVideo(_player, playlist) {
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

function onYouTubeIframeAPIReady() {
  // TODO: emit?
  desktop.app.videoplayer.youtubeEmbedReady = true;
}

