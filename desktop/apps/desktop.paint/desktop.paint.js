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

    $('.sendPaint').on('click', function(){
      desktop.app.paint.send();
    });

    $('.sendGifStudio').on('click', function(){
      desktop.app.paint.send();
    });

    next();

  });
};

desktop.app.paint.send = function sendPaint () {

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
  let output = desktop.app.paint.output;
  let context = desktop.app.paint.context;

  setTimeout(function(){

    // send the paint to `gifstudio` as a frame ( either existing or new )
    if (output === 'gifstudio') {
      // TODO: should not be undefined here
      if (typeof desktop.app.gifstudio.currentFrameIndex === 'undefined') {
        desktop.app.gifstudio.currentFrameIndex = 0;
      }
      desktop.app.gifstudio.loadGifFrame(firstImg, desktop.app.gifstudio.currentFrameIndex);
      desktop.app.gifstudio.currentFrameIndex++;
      return;
    }

    // send the paint to pond or buddy chat windows as a Snap
    if (output === 'pond' || output === 'buddy') {
    
      // TODO: switch sending location here based on context, type, and metadata like gif frameIndex
      buddypond.sendSnaps(output, context, 'I sent a Paint', firstImg, 100, function(err, data){
        keys.forEach(function(k){
          if (k.search('image#') !== -1) {
            localStorage.removeItem(k);
            console.log('clearing key', firstKey)
          }
        });
      });
    }
  }, 333)
  // TODO: only close window on replace updates? or not at all?
  // JQDX.closeWindow('#window_paint');

}

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

  if (params.output) {
    desktop.app.paint.output = params.output;
  }

  if (params.context) {
    desktop.app.paint.context = params.context;
  }

  if (buddypond.me || desktop.app.paint.output) {
    $('.sendPaintHolder .sendPaint').html("SEND PAINT TO " + desktop.app.paint.output + '/' + desktop.app.paint.context);
    $('.sendPaintHolder').show();
  } else {
    $('.sendPaintHolder').hide();
  }

  if (desktop.app.paint.output === 'gifstudio') {
    $('.sendPaint').hide();
    $('.sendGifStudio').show();
  } else {
    $('.sendPaint').show();
    $('.sendGifStudio').hide();
  }

  if (params.src) {
    // send the base64 source as part of the frame
    $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html#load:' + encodeURI(params.src));
  } else {
    $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  }

  return true;
};

desktop.app.paint.closeWindow = function closeWindow () {
  // $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  return true;
};