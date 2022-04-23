desktop.app.globe = {};
desktop.app.globe.label = 'globe';

desktop.app.globe.load = function loadglobe (params, next) {
  desktop.load.remoteAssets([
    'globe' // this loads the sibling desktop.app.globe.html file into <div id="window_globe"></div>
  ], function (err) {
    $('#window_globe').css('width', 540);
    $('#window_globe').css('height', 600);
    $('#window_globe').css('left', 50);
    $('#window_globe').css('top', 50);
    next();
  });
};

desktop.app.globe.openWindow = function openWindow () {
  $('#globeIframe').attr('src', 'desktop/appstore/desktop.globe/vendor/index.html');
  return true;
};

desktop.app.globe.closeWindow = function closeWindow () {
  $('#globeIframe').attr('src', '');
  return true;
};