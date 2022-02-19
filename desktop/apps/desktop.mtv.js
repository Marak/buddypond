desktop.mtv = {};

desktop.mtv.player = null;
desktop.mtv.load = function () {

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('.ponderMTV').on('click', function(){
    desktop.playRandomVideo(desktop.mtv.player, desktop.ytPlaylist);
  });

  $('#window_mtv').css('width', 644);
  $('#window_mtv').css('height', 590);
  return true;
};

desktop.mtv.closeWindow = function () {
  desktop.mtv.player.pauseVideo();
}