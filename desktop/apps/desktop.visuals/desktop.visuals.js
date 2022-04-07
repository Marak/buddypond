desktop.app.visuals = {};
desktop.app.visuals.label = 'visuals';

desktop.app.visuals.load = function loadVisuals (params, next) {
  desktop.load.remoteAssets([
    'visuals' // this loads the sibling desktop.app.visuals.html file into <div id="window_visuals"></div>
  ], function (err) {
    $('#window_visuals').css('width', 662);
    $('#window_visuals').css('height', 495);
    $('#window_visuals').css('left', 50);
    $('#window_visuals').css('top', 50);
    next();
  });
};

desktop.app.visuals.openWindow = function openWindow () {
  return true;
};

desktop.app.visuals.closeWindow = function closeWindow () {
  $('#visualsIframe').attr('src', 'desktop/apps/desktop.visuals/vendor/index.html');
  return true;
};