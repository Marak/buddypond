desktop.app.maps = {};
desktop.app.maps.label = 'maps';

desktop.app.maps.load = function loadmaps (params, next) {
  desktop.load.remoteAssets([
    'maps' // this loads the sibling desktop.app.maps.html file into <div id="window_maps"></div>
  ], function (err) {
    $('#window_maps').css('width', 540);
    $('#window_maps').css('height', 477);
    $('#window_maps').css('left', 50);
    $('#window_maps').css('top', 50);
    next();
  });
};

desktop.app.maps.openWindow = function openWindow () {
  $('#mapsIframe').attr('src', 'desktop/appstore/desktop.maps/vendor/index.html');
  return true;
};

desktop.app.maps.closeWindow = function closeWindow () {
  return true;
};