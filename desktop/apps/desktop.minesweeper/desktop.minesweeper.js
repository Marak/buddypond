desktop.app.minesweeper = {};
desktop.app.minesweeper.label = 'Minesweeper';

desktop.app.minesweeper.load = function loadminesweeperGames (params, next) {
  desktop.load.remoteAssets([
    'desktop/apps/desktop.minesweeper/desktop.minesweeper.css',
    'minesweeper' // this loads the sibling desktop.app.minesweeper.html file into <div id="window_minesweeper"></div>
  ], function (err) {
    $('#window_minesweeper').css('width', 630);
    $('#window_minesweeper').css('height', 470);
    $('#window_minesweeper').css('left', 50);
    $('#window_minesweeper').css('top', 50);
    next();
  });
};

desktop.app.minesweeper.openWindow = function openWindow () {
  $('#minesweeperIframe').attr('src', 'desktop/apps/desktop.minesweeper/vendor/minesweeper.html');
  return true;
};

desktop.app.minesweeper.closeWindow = function closeWindow () {
  return true;
};