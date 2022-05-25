desktop.app.ayyowars = {};
desktop.app.ayyowars.label = 'Ayyo Wars';

desktop.app.ayyowars.load = function loadayyowarsGames (params, next) {
  desktop.load.remoteAssets([
    'ayyowars' // this loads the sibling desktop.app.ayyowars.html file into <div id="window_ayyowars"></div>
  ], function (err) {
    $('#window_ayyowars').css('width', 662);
    $('#window_ayyowars').css('height', 495);
    $('#window_ayyowars').css('left', 50);
    $('#window_ayyowars').css('top', 50);
    next();
  });
};

desktop.app.ayyowars.openWindow = function openWindow () {
  $('#ayyowarsIframe').attr('src', 'desktop/appstore/desktop.ayyowars/vendor/demo.html');
  return true;
};

desktop.app.ayyowars.closeWindow = function closeWindow () {
  return true;
};