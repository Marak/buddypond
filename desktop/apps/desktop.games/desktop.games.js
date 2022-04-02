desktop.app.games = {};
desktop.app.games.label = 'Games';
desktop.app.games.icon = 'folder';

desktop.app.games.load = function loadDesktopGames (params, next) {
  desktop.load.remoteAssets([
    'games' // this loads the sibling desktop.app.games.html file into <div id="window_games"></div>
  ], function (err) {
    $('#window_games').css('width', '30vw');
    $('#window_games').css('height', '22vh');
    $('#window_games').css('top', '9vh');
    $('#window_games').css('left', '3vw');
    next();
  });
};
