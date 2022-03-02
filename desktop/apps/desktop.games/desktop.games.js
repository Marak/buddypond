desktop.app.games = {};
desktop.app.games.label = "Games";
desktop.app.games.icon = 'folder';

desktop.app.games.load = function loadDesktopGames (params, next) {
  desktop.load.remoteAssets([
    'games' // this loads the sibling desktop.app.games.html file into <div id="window_games"></div>
  ], function (err) {
    $('#window_games').css('width', 444);
    $('#window_games').css('height', 150);
    $('#window_games').css('left', 200);
    $('#window_games').css('top', 250);
    next();
  });
};
