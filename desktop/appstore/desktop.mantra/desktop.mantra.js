desktop.app.mantra = {};
desktop.app.mantra.label = 'Mantra';

desktop.app.mantra.load = function loadSolitaireGames (params, next) {

  desktop.load.remoteAssets([
    'mantra'
  ], function (err) {
    $('#window_mantra').css('width', '80vw');
    $('#window_mantra').css('height', '60vh');
    $('#window_mantra').css('min-width', '300px');
    $('#window_mantra').css('min-height', '600px');

    $('#window_mantra').css('left', 100);
    $('#window_mantra').css('top', '9vh');
    next();
  });

};

desktop.app.mantra.openWindow = function openWindow () {
  // TODO: embed mode for mantra, better embed configs
  // Remark: We should probably have custom game.html file in this directory
  // and just load BuddyPond.js World
  $('#mantraIframe').attr('src', 'https://yantra.gg/mantra/home');
  return true;
};

desktop.app.mantra.closeWindow = function closeWindow () {
  return true;
};