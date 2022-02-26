desktop.app.solitaire = {};
desktop.app.solitaire.label = "Solitaire";

desktop.app.solitaire.load = function loadSolitaireGames (params, next) {
  desktop.load.remoteAssets([
    'solitaire' // this loads the sibling desktop.app.solitaire.html file into <div id="window_solitaire"></div>
  ], function (err) {
    $('#window_solitaire').css('width', 662);
    $('#window_solitaire').css('height', 495);
    $('#window_solitaire').css('left', 50);
    $('#window_solitaire').css('top', 50);
    next();
  });
};

desktop.app.solitaire.openWindow = function openWindow () {
  return true;
};

desktop.app.solitaire.closeWindow = function closeWindow () {
  $('#solitaireIframe').attr('src', 'desktop/apps/desktop.solitaire/vendor/solitaire.html');
  return true;
};