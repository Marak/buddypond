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

    // Remark: I don't we need to use localstorage settings to pass SEND PAINT state around
    //         This was previously used to workaround JSPAINT, it might not be needed now due to other refactors
    //         Investigate and see if we can just call the function directly without localstorage workaround
    $('.sendGifStudio').on('click', function(){
      // TODO: only show gif studio button if frameIndex and context are gifStudio
      // TODO: paint_active_context needs to be set before this line?
      // close window and set desktop.settings.paint_send_active = true
      //desktop.set('paint_active_type', 'gifstudio');
      // desktop.set('paint_active_context', 'sending-a-gif');
      desktop.set('paint_send_active', true);
    });

    if (!desktop.settings.paint_active_context) {
      desktop.set('paint_active_type', 'pond');
      desktop.set('paint_active_context', 'Lily');
    }

    // TODO: switch to iframe message instead?
    // TODO: can this just be local scoped now?, no EE required?
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
        // TODO: why is it sending wrong data / no data at all?
        // TODO: check if context is gifstudio, if so, send the gif there as frameindex ( either existing or new )
        let type = desktop.app.paint.type || desktop.settings.paint_active_type;
        let context = desktop.app.paint.context || desktop.settings.paint_active_context;

        setTimeout(function(){

          // send the paint to `gifstudio` as a frame ( either existing or new )
          if (type === 'gifstudio') {
            desktop.app.gifstudio.loadGifFrame(firstImg, 2);
            desktop.set('paint_send_active', false);
            return;
          }

          // send the paint to pond or buddy chat windows as a Snap
          if (type === 'pond' || type === 'buddy') {
            
            // TODO: switch sending location here based on context, type, and metadata like gif frameIndex
            buddypond.sendSnaps(type, context, 'I sent a Paint', firstImg, 100, function(err, data){
              keys.forEach(function(k){
                if (k.search('image#') !== -1) {
                  localStorage.removeItem(k);
                  console.log('clearing key', firstKey)
                }
              });
              desktop.set('paint_send_active', false);
            });
          }
        }, 333)

        JQDX.closeWindow('#window_paint');
      }
    });

  });
};

desktop.app.paint.openWindow = function openWindow (params) {
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

  if (params.type) {
    desktop.app.paint.type = params.type;
  }

  if (params.context) {
    desktop.app.paint.context = params.context;
  }

  if (params.frameIndex) {
    // alert(params.frameIndex)
  }

  /* TODO: make sure offline works
  if (buddypond.me) {
    $('.sendPaintHolder').show();
  } else {
    $('.sendPaintHolder').hide();
  }
  */
  $('.sendPaintHolder').show();

  if (desktop.app.paint.type === 'gifstudio') {
    $('.sendPaint').hide();
    $('.sendGifStudio').show();
  } else {
    $('.sendPaint').show();
    $('.sendGifStudio').hide();
  }

  if (params.src) {
    // send the base64 source as part of the frame
    $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html#load:' + encodeURI(params.src));
    return;
  }

  if (desktop.settings.paint_active_url) {
    // desktop.set('paint_send_active', false);
    $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html#load:' + encodeURI(desktop.settings.paint_active_url));
  } else {
    $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  }

  return true;
};

desktop.app.paint.closeWindow = function closeWindow () {
  desktop.set('paint_send_active', false);
  desktop.set('paint_active_url', false);
  // $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  return true;
};