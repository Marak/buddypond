desktop.app.mantra = {};
desktop.app.mantra.label = 'Mantra';

desktop.app.mantra.load = function loadSolitaireGames (params, next) {

  desktop.load.remoteAssets([
    'mantra'
  ], function (err) {
    $('#window_mantra').css('width', 662);
    $('#window_mantra').css('height', 495);
    $('#window_mantra').css('left', 50);
    $('#window_mantra').css('top', 50);
  
      next();
  });

};

desktop.app.mantra.openWindow = function openWindow () {
  // TODO: embed mode for mantra, better embed configs
  $('#mantraIframe').attr('src', 'https://yantra.gg/mantra/home');
  return true;
};

desktop.app.mantra.closeWindow = function closeWindow () {
  return true;
};