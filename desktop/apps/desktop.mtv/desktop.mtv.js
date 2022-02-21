desktop.mtv = {};
desktop.mtv.label = "Music Television";

desktop.mtv.player = null;
desktop.mtv.load = function (params, next) {

  desktop.loadRemoteAssets([
    'data/mtv.js',
    'mtv' // this loads the sibling desktop.mtv.html file into <div id="window_mtv"></div>
  ], function (err) {

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    /* 
      we could add this script to the above desktop.loadRemoteAssets() call,
      but that will result in the mtv App having to wait for youtube to respond for App to complete load
    */
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $('.ponderMTV').on('click', function(){
      desktop.playRandomVideo(desktop.mtv.player, desktop.ytPlaylist);
    });

    $('#window_mtv').css('width', 644);
    $('#window_mtv').css('height', 590);
    next();
  });
};

desktop.mtv.closeWindow = function () {
  if (desktop.mtv.player && desktop.mtv.player.pauseVideo) {
    desktop.mtv.player.pauseVideo();
  }
}