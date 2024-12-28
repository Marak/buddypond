desktop.app.paint = {};
desktop.app.paint.label = 'Paint';

desktop.app.paint.load = function loadpaintGames (params, next) {
  desktop.load.remoteAssets([
    'paint' // this loads the sibling desktop.app.paint.html file into <div id="window_paint"></div>
  ], function (err) {
    $('#window_paint').css('width', 662);
    $('#window_paint').css('height', 495);
    $('#window_paint').css('left', 50);
    $('#window_paint').css('top', 50);

    $('.sendPaint').on('click', function () {
      if ($(this).hasClass('updateGif')) {
        desktop.app.paint.send({
          action: 'insert'
        });
      } else {
        desktop.app.paint.send({
          action: 'replace'
        });
      }
    });

    $('.sendGifStudio').on('click', function () {
      let action = $(this).data('action');
      desktop.app.paint.send({ action: action });
    });

    next();

  });
};

desktop.app.paint.send = function sendPaint (params) {
  $('.sendPaint').attr('disabled', true);

  params = params || {
    action: 'insert'
  };

  let keys = Object.keys(localStorage);
  let firstImg = null;
  let firstKey = null;
  keys.forEach(function (k) {
    if (k.search('image#') !== -1) {
      firstImg = localStorage.getItem(k);
      firstKey = k;
    }
  });

  if (!firstKey) {
    console.log('FAILED TO FIND IMAGE IN LOCALSTORAGE. SOMEONE PLEASE FIX JSPAINT INTEGRATION');
    $('.touchPaint').show();
    return;
  } else {
    $('.touchPaint').hide();
  }

  let output = desktop.app.paint.output;
  let context = desktop.app.paint.context;

  setTimeout(function () {
    // send the paint to `gifstudio` as a frame ( either existing or new )
    if (output === 'gifstudio') {
      // TODO: should not be undefined here
      if (typeof desktop.app.gifstudio.currentFrameIndex === 'undefined') {
        desktop.app.gifstudio.currentFrameIndex = 0;
      }
      if (params.action === 'insert') {
        desktop.app.gifstudio.currentFrameIndex++;
      }
      desktop.app.gifstudio.loadGifFrame(firstImg, desktop.app.gifstudio.currentFrameIndex, params.action);
      JQDX.closeWindow('#window_paint');
      // open the window we just outputted to
      // Remark: Assume gifstudio has already been loaded since we made it here
      // TODO: we should be able to call gifstudio.openWindow without it reloading entire gif
      // desktop.ui.openWindow('gifstudio');
      $('#window_gifstudio').show();
      $('.sendPaint').attr('disabled', false);
      return;
    }

    // send the paint to pond or buddy chat windows as a Snap
    if (output === 'pond' || output === 'buddy') {
      // TODO: switch sending location here based on context, type, and metadata like gif frameIndex
      buddypond.sendSnaps(output, context, 'I sent a Paint', firstImg, 100, function (err, data) {
        if (err) {
          alert('Issue sending Paint. Please try again or contact support.');
          desktop.log(err);
          $('.sendPaint').attr('disabled', false);
          return;
        }
        keys.forEach(function (k) {
          if (k.search('image#') !== -1) {
            localStorage.removeItem(k);
            console.log('clearing key', firstKey);
          }
        });
        JQDX.closeWindow('#window_paint');
        // open the window we just outputted to
        if (output === 'buddy') {
          // TODO: buddylist renamed to buddy
          output = 'buddylist'
        }
        /*
        JQDX.openWindow(output, {
          context: context
        });
        */
        // TODO: show the window using new API?
        $('.sendPaint').attr('disabled', false);
      });
    }
  }, 333);

};

desktop.app.paint.openWindow = function openWindow (params) {
  // clear out localstorage images on window open
  // this will clear out all images on browser refresh
  // Remark: It's best to do this for now since we dont want to cache to grow
  //         We can later add photo manager for localstorage images
  let keys = Object.keys(localStorage);
  keys.forEach(function (k) {
    if (k.search('image#') !== -1) {
      localStorage.removeItem(k);
    }
  });

  if (params.output) {
    desktop.app.paint.output = params.output;
  } else {
    desktop.app.paint.output = 'localhost';
  }

  if (params.context) {
    desktop.app.paint.context = params.context;
  } else {
    desktop.app.paint.context = 'file-system';
  }

  $('.paintOutputTarget').html(desktop.app.paint.output + '/' + desktop.app.paint.context);

  if ((desktop.app.paint.output && desktop.app.paint.output !== 'localhost')) {
    $('.sendPaintHolder .sendPaint').html('SEND PAINT');
    $('.sendPaintHolder').show();
  } else {
    $('.sendPaintHolder').hide();
  }

  if (desktop.app.paint.output === 'gifstudio') {
    $('.sendPaint').hide();
    $('.sendGifStudio').show();
    //$('.insertGif').html('Insert at frame: ' + desktop.app.gifstudio.currentFrameIndex);
    //$('.updateGif').html('Update frame: ' + desktop.app.gifstudio.currentFrameIndex)
    if (desktop.app.gifstudio.currentFrameIndex === Infinity) {
      //$('.insertGif').html('Add frame');
      $('.updateGif', '#window_paint').hide();
    } else {
      //$('.insertGif').html('Insert at frame: ' + desktop.app.gifstudio.currentFrameIndex);
      //$('.updateGif').html('Update frame: ' + desktop.app.gifstudio.currentFrameIndex)
      $('.updateGif', '#window_paint').show();
    }

    if (desktop.app.gifstudio.insertMode === 'replace') {
      $('.insertGif', '#window_paint').hide();
      $('.updateGif', '#window_paint').show();
    } else {
      $('.insertGif', '#window_paint').show();
      $('.updateGif', '#window_paint').hide();
    }

  } else {
    $('.sendPaint').show();
    $('.sendGifStudio').hide();
  }

  let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
  let eventer = window[eventMethod];
  let messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

  // Remark: Frame message passing for paint currently only being used to support top left menu File->Exit command
  // Listen to message from child window
  eventer(messageEvent,function (e) {
    let key = e.message ? 'message' : 'data';
    let data = e[key];
    if (data === 'app_paint_needs_close') {
      JQDX.closeWindow('#window_paint');
    }
  },false);

  if (params.src) {
    // send the base64 source as part of the frame
    $('#paintIframe').attr('src', 'desktop/appstore/desktop.paint/vendor/index.html#load:' + encodeURI(params.src));
  } else {
    $('#paintIframe').attr('src', 'desktop/appstore/desktop.paint/vendor/index.html');
  }

  return true;
};

desktop.app.paint.closeWindow = function closeWindow () {
  // $('#paintIframe').attr('src', 'desktop/apps/desktop.paint/vendor/index.html');
  return true;
};