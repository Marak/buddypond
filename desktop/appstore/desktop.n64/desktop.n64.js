desktop.app.n64 = {};
desktop.app.n64.label = 'n64';

desktop.app.n64.load = function loadn64Games (params, next) {
  desktop.load.remoteAssets([
    'n64' // this loads the sibling desktop.app.n64.html file into <div id="window_n64"></div>
  ], function (err) {
    $('#window_n64').css('width', '44vw');
    $('#window_n64').css('height', '75vh');
    $('#window_n64').css('top', '9vh');
    $('#window_n64').css('left', '26vw');
    next();
  });
};

desktop.app.n64.openWindow = function openWindow () {
  return true;
};

desktop.app.n64.closeWindow = function closeWindow () {
  $('#n64Iframe').attr('src', 'desktop/apps/desktop.n64/vendor/index.html');
  return true;
};