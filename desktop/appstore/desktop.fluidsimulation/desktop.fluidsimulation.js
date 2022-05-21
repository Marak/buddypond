desktop.app.fluidsimulation = {};
desktop.app.fluidsimulation.label = 'fluidsimulation';

desktop.app.fluidsimulation.load = function loadVisuals (params, next) {
  desktop.load.remoteAssets([
    'fluidsimulation' // this loads the sibling desktop.app.fluidsimulation.html file into <div id="window_fluidsimulation"></div>
  ], function (err) {
    $('#window_fluidsimulation').css('width', 662);
    $('#window_fluidsimulation').css('height', 495);
    $('#window_fluidsimulation').css('left', 50);
    $('#window_fluidsimulation').css('top', 50);
    next();
  });
};

desktop.app.fluidsimulation.openWindow = function openWindow () {
  $('#fluidsimulationIframe').attr('src', 'desktop/appstore/desktop.fluidsimulation/vendor/index.html');
  return true;
};

desktop.app.fluidsimulation.closeWindow = function closeWindow () {
  $('#fluidsimulationIframe').attr('src', '');
  return true;
};