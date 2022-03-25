desktop.app.gifstudio = {};
desktop.app.gifstudio.label = "Games";
desktop.app.gifstudio.icon = 'folder';

desktop.app.gifstudio.type = 'pond';
desktop.app.gifstudio.context = 'Lily';

// TODO: three view modes ( same as Mirror, Full, Normal, Half )
desktop.app.gifstudio.load = function loadDesktopGames (params, next) {
  desktop.load.remoteAssets([
    'desktop/assets/js/gif-frames.js',
    'desktop/assets/js/gif.js',
    'gifstudio' // this loads the sibling desktop.app.gifstudio.html file into <div id="window_gifstudio"></div>
  ], function (err) {
    $('#window_gifstudio').css('width', 640);
    $('#window_gifstudio').css('height', 480);
    $('#window_gifstudio').css('left', 200);
    $('#window_gifstudio').css('top', 120);

    $('.openApp').on('click', function(){
      let app = $(this).attr('href');
      app = app.replace('#', '');
      JQDX.openWindow(app); 
      return false;
    })

    let d = $(document);
    d.on('mousedown', '.openPaint', function (ev) {
      let holder = $(ev.target).parent();
      let img = $('.gifstudio_gifFrame', holder);
      JQDX.openWindow('paint', {
        type: 'gifstudio',
        context: 'editing-a-gif-frame',
        src: img.attr('src'),
        frameIndex: img.data('frameindex')
      });
    });

    // Click remix GIF icon to remix gifs in Gif Studio App
    d.on('mousedown', '.removeFrame', function(ev) {
      let frameHolder = $(ev.target).parent();
      $(frameHolder).remove();
      // TODO: use correct delay scope
      desktop.app.gifstudio.createGIF(desktop.app.mirror.gifDelay || 200)
      /*
      , function (){
        let src = $('.gifstudio_gifPreview').attr('src');
        $('.gifFrames').html('');
        desktop.app.gifstudio.drawFrames({ url: src, frames: 'all' })
      });
      */
    });

    // Click remix GIF icon to remix gifs in Gif Studio App
    d.on('mousedown', '.gifstudio_addFrame', function(ev) {
      JQDX.openWindow('paint', { 
        type: 'gifstudio',
        context: 'adding-a-new-frame',
        frameIndex: 88 // TODO: get last frame index
      });
    });

    d.on('mousedown', '#window_gifstudio .sendGif', function(ev) {
      let form = $(ev.target).parent();
      let src = $('.gifstudio_gifPreview').attr('src')
      console.log('ahhhh', src)
      buddypond.sendSnaps(desktop.app.gifstudio.type, desktop.app.gifstudio.context, 'I sent a GIF!', src, desktop.app.gifstudio.gifDelay, function(err, data){
        alert('sent gif as snap')
      });
      JQDX.closeWindow('#window_gifstudio');
    });

    d.on('mousedown', '#window_gifstudio .saveGif', function(ev) {
      let form = $(ev.target).parent();
      let src = $('.gifstudio_gifFrame', form).attr('src');
      var url = src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
      window.open(url);
      return false;
    });

    $( "#gifStudioDelaySlider" ).slider({
      value: 200,
      min: 100,
      max: 2222,
      change: function(event, ui){
        desktop.app.gifstudio.gifDelay = ui.value
        //$('#snapsPreview').data('delay', ui.value);
        let delay = ui.value;
        desktop.app.gifstudio.createGIF(delay);
      }
    });

    next();
  });
};


desktop.app.gifstudio.loadGifFrame = function loadGifFrame (img, index) {
  console.log(img)
  img = img.substring(1, img.length -1)
  // img = img.substring(img.length -2, 1)
  // $('#window_gifstudio .gifFrames .gifstudio_gifFrame').last().attr('src', img);

  // $('#window_gifstudio .gifFrames .gifstudio_gifFrame').last().remove();

  // $('#window_gifstudio .gifFrames').hide();
  desktop.app.gifstudio.renderFrame(index, img)
  setTimeout(function(){
    desktop.app.gifstudio.createGIF(desktop.app.mirror.gifDelay || 200, function (err, imgData){
      // desktop.app.gifstudio.drawFrames({ url: imgData, frames: 'all' })
    });
  }, 333)
}

// TODO: create perfect loop by duplicating set and reversing it <<<<<<||>>>>>>

desktop.app.gifstudio.createGIF = function createGIF (delay, cb) {
  cb = cb || function noop () {};
  var gif = new GIF({
    workers: 2,
    quality: 3,
    width: 320,
    height: 240
  });

  gif.on('finished', function(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      var base64data = reader.result;
      // TODO: move this code to cb handler of parent caller?
      $('.gifstudio_gifPreview').attr('src', base64data);
      $('.gifstudio_gifPreview').show();
      cb(null, base64data);
    }
  });

  $('.gifstudio_gifFrame').each(function(i, e){
    console.log('feeding frame', i, e)
    gif.addFrame(e, { delay: delay });
  })

  gif.render();
  
}

desktop.app.gifstudio.renderFrame = function renderFrame (frame, base64String) {
  $('#window_gifstudio .gifFrames').append(`
    <div class="gifFrameHolder">
      <img data-frameindex="${frame.frameIndex}" src="${base64String}" class="gifstudio_gifFrame"/>
      <span class="removeFrame">
        X
      </span>
      <span class="dragFrameIcon">
        <img src="desktop/assets/images/icons/icon_drag_64.png"/>
      </span>
      <img class="openPaint" title="Open in Paint" src="desktop/assets/images/icons/icon_paint_64.png"/>
    </div>
  `);
  /*
      <span class="frameCount">
        ${frame.frameIndex}/${frameData.length}
      </span>
  */
}

desktop.app.gifstudio.drawFrames = function drawFrames (options) {
  gifFrames(options).then(function (frameData) {
    frameData.forEach(function(frame){
      let stream = frame.getImage();
      var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(stream._obj.buffer)));
      base64String = 'data:image/png;base64,' + base64String;
      desktop.app.gifstudio.renderFrame(frame, base64String);
    });
    $('.gifFrames', '#window_gifstudio').append(`
      <span class="gifFrameHolder">
        <span class="gifstudio_addFrame" title="Add new Frame to GIF">
          ➕
        </span>
      </span>
    `);
    // $('.gifstudio_gifPreview').attr('src', '');
    // desktop.app.gifstudio.createGIF(100);
  });
}

desktop.app.gifstudio.openWindow = function openWindow (params) {

  /*
  if (params.frameIndex) {
  }
  */
  $('.gifstudio_gifPreview').hide();
  // https://buddypond.com/snaps/Marak/8ed7916c-9cd5-4c23-8c44-46b5c60bb609.gif
  let gifURL = '';

  if (params.src) {
    // send the base64 source as part of the frame
    gifURL = params.src;
  }

  // TODO: can load either base64 src or image
  //$('#window_gifstudio .gifFrames').html('');
  if (gifURL) {
    $('.gifstudio_gifPreview').attr('src', gifURL);
    $('.gifstudio_gifPreview').show();
    desktop.app.gifstudio.drawFrames({ url: gifURL, frames: 'all' })
  } else {
    $('#window_gifstudio .gifFrames').append(`
      <span class="gifFrameHolder">
        <span class="gifstudio_addFrame" title="Add new Frame to GIF">
          ➕
        </span>
      </span>
    `);
    
  }


  return true;
};
