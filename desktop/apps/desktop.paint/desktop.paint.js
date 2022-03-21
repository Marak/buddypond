desktop.app.paint = {};
desktop.app.paint.label = "Paint";
desktop.app.paint.icon = "folder";

desktop.app.paint.load = function loadpaintGames (params, next) {
  desktop.load.remoteAssets([
    'paint' // this loads the sibling desktop.app.paint.html file into <div id="window_paint"></div>
  ], function (err) {
    $('#window_paint').css('width', 662);
    $('#window_paint').css('height', 495);
    $('#window_paint').css('left', 50);
    $('#window_paint').css('top', 50);
    next();
  });
};

desktop.app.paint.openWindow = function openWindow () {
  return true;
};

desktop.app.paint.closeWindow = function closeWindow () {
  $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  return true;
};