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

    $('.sendPaint').on('click', function(){
      // close window and set desktop.settings.paint_send_active = true
      desktop.set('paint_send_active', true);
    });

    desktop.on('desktop.settings.paint_send_active', 'close-paint-window', function () {
      if (desktop.settings.paint_send_active) {
        let keys = Object.keys(localStorage);
        let firstImg = null;
        let firstKey = null;
        keys.forEach(function(k){
          if (k.search('image#') !== -1) {
            firstImg = localStorage.getItem(k);
            firstKey = k;
          }
        });

        // TODO: use context from local settings
        setTimeout(function(){
          buddypond.sendSnaps(desktop.settings.paint_active_type, desktop.settings.paint_active_context, 'I sent a Paint', firstImg, 100, function(err, data){
            localStorage.removeItem(firstKey);
            desktop.set('paint_send_active', false);
          });
        }, 1200)

        JQDX.closeWindow('#window_paint');
      }
    });

  });
};

desktop.app.paint.openWindow = function openWindow () {
  return true;
};

desktop.app.paint.closeWindow = function closeWindow () {
  $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  return true;
};