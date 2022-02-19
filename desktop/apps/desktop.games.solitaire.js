desktop.games_solitaire = { };

desktop.games_solitaire.load = function loadSolitaireGames () {
  $('#window_games_solitaire').css('width', 662);
  $('#window_games_solitaire').css('height', 495);
  $('#window_games_solitaire').css('left', 50);
  $('#window_games_solitaire').css('top', 50);

  window.jsSolitaire.load();
  return true;
};

desktop.games_solitaire.openWindow = function openWindow () {
  window.jsSolitaire.initSolitaire();
  return true;
};

desktop.games_solitaire.closeWindow = function closeWindow () {
  window.jsSolitaire.closeSolitaire();
  return true;
};

