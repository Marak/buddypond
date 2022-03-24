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

    if (!desktop.settings.paint_active_context) {
      desktop.set('paint_active_type', 'pond');
      desktop.set('paint_active_context', 'Lily');
    }

    desktop.on('desktop.settings.paint_send_active', 'send-paint-close-window', function () {

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
        if (!firstKey) {
          console.log("FAILED TO FIND IMAGE IN LOCALSTORAGE. SOMEONE PLEASE FIX JSPAINT INTEGRATION")
          $('.touchPaint').show();
          return;
        } else {
          $('.touchPaint').hide();
        }
        let type = desktop.settings.paint_active_type;
        let context = desktop.settings.paint_active_context;
        // TODO: why is it sending wrong data / no data at all?
        setTimeout(function(){
          buddypond.sendSnaps(type, context, 'I sent a Paint', firstImg, 100, function(err, data){
            keys.forEach(function(k){
              if (k.search('image#') !== -1) {
                localStorage.removeItem(k);
                console.log('clearing key', firstKey)
              }
            });
            desktop.set('paint_send_active', false);
          });
        }, 333)

        JQDX.closeWindow('#window_paint');
      }
    });

  });
};

desktop.app.paint.openWindow = function openWindow () {
  // clear out localstorage images on window open
  // this will clear out all images on browser refresh
  // Remark: It's best to do this for now since we dont want to cache to grow
  //         We can later add photo manager for localstorage images
  let keys = Object.keys(localStorage);
  keys.forEach(function(k){
    if (k.search('image#') !== -1) {
      localStorage.removeItem(k);
    }
  });

  if (desktop.settings.paint_active_url) {
    // desktop.set('paint_send_active', false);
    $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html#load:' + encodeURI(desktop.settings.paint_active_url));
  } else {
    $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  }
  if (buddypond.me) {
    $('.sendPaintHolder').show();
  } else {
    $('.sendPaintHolder').hide();
  }
  return true;
};

desktop.app.paint.closeWindow = function closeWindow () {
  desktop.set('paint_send_active', false);
  desktop.set('paint_active_url', false);
  // $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  return true;
};