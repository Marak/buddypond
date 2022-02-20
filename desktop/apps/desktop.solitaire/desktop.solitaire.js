desktop.solitaire = {};
desktop.solitaire.label = "Solitaire";

desktop.solitaire.load = function loadSolitaireGames (params, next) {
  desktop.loadRemoteAssets([
    'desktop/apps/desktop.solitaire/vendor/js-solitaire.css',
    'desktop/apps/desktop.solitaire/vendor/js-solitaire.js',
    'solitaire' // this loads the sibling desktop.solitaire.html file into <div id="window_solitaire"></div>
  ], function (err) {
    $('#window_solitaire').css('width', 662);
    $('#window_solitaire').css('height', 495);
    $('#window_solitaire').css('left', 50);
    $('#window_solitaire').css('top', 50);
    window.jsSolitaire.load();
    next();
  });
};

desktop.solitaire.openWindow = function openWindow () {
  window.jsSolitaire.initSolitaire();
  return true;
};

desktop.solitaire.closeWindow = function closeWindow () {
  window.jsSolitaire.closeSolitaire();
  return true;
};