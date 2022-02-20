desktop.solitaire = { };
desktop.solitaire.load = function loadSolitaireGames (params, next) {
  desktop.remoteLoadAppHTML('solitaire', function (responseText, textStatus, jqXHR) {
    window.jsSolitaire.load();
    
    $('#window_games_solitaire').css('width', 662);
    $('#window_games_solitaire').css('height', 495);
    $('#window_games_solitaire').css('left', 50);
    $('#window_games_solitaire').css('top', 50);
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

