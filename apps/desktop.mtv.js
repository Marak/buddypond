desktop.mtv = {};

desktop.mtv.player = null;
desktop.mtv.load = function () {

  desktop.log('Loading:', 'App.mtv')

  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $('#desktop').append(`
    <a class="abs icon" style="left:20px;top:380px;" href="#icon_dock_mtv">
      <img src="assets/images/icons/icon_mtv.png" />
      Music Television
    </a>
    `);

  $('#dock').append(`
    <li id="icon_dock_mtv">
      <a href="#window_mtv">
        <img height="22" width="22" src="assets/images/icons/icon_mtv.png" />
        Music Television
      </a>
    </li>
    `);

    $('#desktop').append(`
    <div id="window_mtv" class="abs window">
      <div class="abs window_inner">
        <div class="window_top">
          <span class="float_left">
            <img height="16" width="16" src="assets/images/icons/icon_mtv.png" />
            Music Television
          </span>
          <span class="float_right">
            <a href="#" class="window_min"></a>
            <a href="#" class="window_resize"></a>
            <a href="#icon_dock_mtv" class="window_close"></a>
          </span>
        </div>
        <div class="abs window_content">
          <div class="window_main">
            <div id="mtvPlayer"></div>
            <div align="center">
              <a class="desktopButton ponderMTV orb" href="#">
                <img src="assets/images/orb.jpeg" width="100" height="100" title="Ponder the orb..."/>
              </a>
              <br/>
              <br/>
              <button class="ponderMTV desktopButton">Ponder the orb for next video</button>
            </div>
          </div>
        </div>
        <div class="abs window_bottom">
          Build: v4.20.69
        </div>
      </div>
      <span class="abs ui-resizable-handle ui-resizable-se"></span>
    </div>
      `);

  $('.ponderMTV').on('click', function(){
    desktop.playRandomVideo(desktop.mtv.player, desktop.ytPlaylist);
  });

  $('#window_mtv').css('width', 644);
  $('#window_mtv').css('height', 666);
};

desktop.mtv.closeWindow = function () {
  desktop.mtv.player.pauseVideo();
}