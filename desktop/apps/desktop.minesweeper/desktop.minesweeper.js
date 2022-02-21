desktop.minesweeper = {};
desktop.minesweeper.label = "Minesweeper";

desktop.minesweeper.load = function loadminesweeperGames (params, next) {
  desktop.loadRemoteAssets([
    'desktop/apps/desktop.minesweeper/desktop.minesweeper.css',
    'minesweeper' // this loads the sibling desktop.minesweeper.html file into <div id="window_minesweeper"></div>
  ], function (err) {
    $('#window_minesweeper').css('width', 630);
    $('#window_minesweeper').css('height', 470);
    $('#window_minesweeper').css('left', 50);
    $('#window_minesweeper').css('top', 50);
    next();
  });
};

desktop.minesweeper.openWindow = function openWindow () {
  return true;
};

desktop.minesweeper.closeWindow = function closeWindow () {
  return true;
};