desktop.app.gifstudio = {};
desktop.app.gifstudio.label = 'Gif Studio';
desktop.app.gifstudio.currentFrameIndex = 0;
desktop.app.gifstudio.renderingCount = 0;
desktop.app.gifstudio.gifDelay = 200;

// TODO: three view modes ( same as Mirror, Full, Normal, Half )
// TODO: create perfect loop by duplicating set and reversing it <<<<<<||>>>>>>
desktop.app.gifstudio.load = function loadDesktopGames (params, next) {
  desktop.load.remoteAssets([
    'desktop/assets/js/gif-frames.js',
    'desktop/assets/js/gif.js',
    'gifstudio' // this loads the sibling desktop.app.gifstudio.html file into <div id="window_gifstudio"></div>
  ], function (err) {

    $('#window_gifstudio').css('width', '44vw');
    $('#window_gifstudio').css('height', '77vh');
    $('#window_gifstudio').css('top', '9vh');
    $('#window_gifstudio').css('left', '6vw');

    let d = $(document);
    d.on('mousedown', '.openPaint', function (ev) {
      let holder = $(ev.target).parent();
      let img = $('.gifstudio_gifFrame', holder);
      img.crossOrigin = "Anonymous";
      let frameIndex = $(holder).index();
      desktop.app.gifstudio.currentFrameIndex = frameIndex;
      desktop.app.gifstudio.insertMode = 'replace';
      JQDX.openWindow('paint', {
        output: 'gifstudio',
        context: 'update-frame-' + desktop.app.gifstudio.currentFrameIndex,
        src: img.attr('src')
      });
    });

    d.on('mousedown', '.duplicateFrame', function (ev) {
      let holder = $(ev.target).parent();
      $(holder.clone()).insertAfter(holder);
      // wait a short moment for dom to insert and render base64 src ( should be less <3ms)
      setTimeout(function () {
        desktop.app.gifstudio.createGif(desktop.app.gifstudio.gifDelay);
      }, 33);
    });

    // Click remix GIF icon to remix gifs in Gif Studio App
    d.on('mousedown', '.removeFrame', function (ev) {
      let frameHolder = $(ev.target).parent();
      $(frameHolder).remove();
      // TODO: use correct delay scope
      desktop.app.gifstudio.createGif(desktop.app.gifstudio.gifDelay);
    });

    $('.clearGIF').on('click', function () {
      $('.gifstudio_gifFrame').parent().remove();
      // TODO: rainbow tv with opacity
      $('.gifstudio_gifPreview').attr('src', '');
      $('.gifstudio_gifPreview').hide();
      $('.gifFrames').html('');
    });

    $('.uploadGIF').on('change', function () {
      seralizeFileInput($(this).get(0));
    });

    // Click remix GIF icon to remix gifs in Gif Studio App
    d.on('mousedown', '.gifstudio_addFrame', function (ev) {

      let holder = $(ev.target);
      let frameIndex = $(holder).data('index') || 'last';

      let title = 'first-frame';

      if (frameIndex === 'last') {
        title = 'last-frame';
        frameIndex = Infinity;
      } else {
        frameIndex = -1;
      }

      desktop.app.gifstudio.currentFrameIndex = frameIndex;
      desktop.ui.openWindow('paint', { 
        output: 'gifstudio',
        context: title
      });
    });

    d.on('mousedown', '#window_gifstudio .sendGif', function (ev) {
      let form = $(ev.target).parent();
      let src = $('.gifstudio_gifPreview').attr('src');
      $('.gifstudio_gifPreview').show();
      let output = desktop.app.gifstudio.output;
      let context = desktop.app.gifstudio.context;
      buddypond.sendSnaps(output, context, 'I sent an Animation!', src, desktop.app.gifstudio.gifDelay, 'gif-studio', function (err, data) {
        console.log('Sent GIF as snap completed');
      });
      JQDX.closeWindow('#window_gifstudio');
      // open the window we just outputted to
      if (output === 'buddy') {
        // TODO: buddylist renamed to buddy
        output = 'buddylist'
      }
      JQDX.openWindow(output, {
        context: context
      });
    });

    d.on('mousedown', '#window_gifstudio .saveGif', function (ev) {
      let form = $(ev.target).parent();
      // TODO: move into helper
      // TODO: should also allow for file name and ext
      let src = $('.gifstudio_gifPreview', form).attr('src');
      let url = src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
      window.open(url);
      return false;
    });

    $( '#gifStudioDelaySlider' ).slider({
      value: 200,
      min: 100,
      max: 2222,
      change: function (event, ui) {
        desktop.app.gifstudio.gifDelay = ui.value;
        //$('#snapsPreview').data('delay', ui.value);
        let delay = ui.value;
        desktop.app.gifstudio.createGif(delay);
      }
    });
    next();
  });
};

desktop.app.gifstudio.loadGifFrame = function loadGifFrame (img, index) {
  // Remark: strange issue with double encoding gif in JSPAINT adding a '"' symbol?
  img = img.substring(1, img.length-1);
  let action = 'replace';
  let currentFrames = $('#window_gifstudio .gifFrameHolder').length;
  // console.log('desktop.app.gifstudio.loadGifFrame', index, currentFrames)
  if (typeof index === 'undefined' || index === -1 || index > currentFrames) {
    action = 'insert';
  }
  desktop.app.gifstudio.renderFrame({ frameIndex: index }, img, desktop.app.gifstudio.insertMode);
  desktop.app.gifstudio.createGif(desktop.app.gifstudio.gifDelay, function (err, imgData) {
  });
};

desktop.app.gifstudio.createGif = function createGif (delay, cb) {
  cb = cb || function noop () {};

  let naturalWidth, naturalHeight;
  // get naturalWidth and naturalHeight of first frame ( to ensure correct resize )
  if ($('.gifstudio_gifFrame').length) {
    naturalWidth = $('.gifstudio_gifFrame').get(0).naturalWidth;
    naturalHeight = $('.gifstudio_gifFrame').get(0).naturalHeight;
  } else {
    naturalWidth = $('.gifstudio_gifPreview').get(0).naturalWidth;
    naturalHeight = $('.gifstudio_gifPreview').get(0).naturalHeight;
  }

  // do not attempt to render a gif which has no frames added
  // Remark: This may happen if .createGif() is called before frames have rendered or any frames have been added
  if ($('.gifstudio_gifFrame').length === 0) {
    alert('No frames to render. Please try again.');
    return cb(null, false);
  }

  desktop.app.gifstudio.renderingCount++;

  let gif = new GIF({
    workers: 2,
    quality: 3,
    width: naturalWidth, // uses original width and height of Image
    height: naturalHeight
  });

  gif.on('finished', function (blob) {
    desktop.app.gifstudio.renderingCount--;
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      let base64data = reader.result;
      // TODO: move this code to cb handler of parent caller?
      $('.gifstudio_gifPreview').attr('src', base64data);
      $('.gifstudio_gifPreview').show();
      cb(null, base64data);
    };
  });

  $('.gifstudio_gifFrame').each(function (i, e) {
    e.crossOrigin = 'Anonymous';
    gif.addFrame(e, { delay: delay });
  });

  // provide one tick of event loop to ensure that all frames render as base64 strings
  // Remark: Without this delay the last frame appears black on first render
  setTimeout(function(){
    gif.render();
  }, 1)
  
};

desktop.app.gifstudio.renderFrame = function renderFrame (frame, base64String, action) {

  let index = frame.frameIndex;
  let currentFrames = $('#window_gifstudio .gifFrameHolder').length;

  if (index === Infinity || index === 'Infinity' || index === -1) {
    action = 'insert';
  }

  if (action === 'replace') {
    $(`#window_gifstudio .gifFrameHolder:eq(${index})`).html(`
        <img data-frameindex="${frame.frameIndex}" src="${base64String}" class="gifstudio_gifFrame"/>
        <span class="removeFrame">
          X
        </span>
        <span class="dragFrameIcon">
          <img src="desktop/assets/images/icons/icon_drag_64.png"/>
        </span>
        <img class="openPaint" title="Edit in Paint" src="desktop/assets/images/icons/icon_paint_64.png"/>
        <img class="duplicateFrame" title="Duplicate Animation Frame" src="desktop/assets/images/icons/icon_duplicate_64.png"/>
    `);
    return;
  }

  // index is higher than set, insert after
  if (index >= currentFrames) {
    if (currentFrames === 0) {
      $('#window_gifstudio .gifFrames').append(`
        <div class="gifFrameHolder">
          <img data-frameindex="${frame.frameIndex}" src="${base64String}" class="gifstudio_gifFrame"/>
          <span class="removeFrame">
            X
          </span>
          <span class="dragFrameIcon">
            <img src="desktop/assets/images/icons/icon_drag_64.png"/>
          </span>
          <img class="openPaint" title="Edit in Paint" src="desktop/assets/images/icons/icon_paint_64.png"/>
          <img class="duplicateFrame" title="Duplicate Animation Frame" src="desktop/assets/images/icons/icon_duplicate_64.png"/>
        </div>
      `);
    } else {
      $(`
        <div class="gifFrameHolder">
          <img data-frameindex="${frame.frameIndex}" src="${base64String}" class="gifstudio_gifFrame"/>
          <span class="removeFrame">
            X
          </span>
          <span class="dragFrameIcon">
            <img src="desktop/assets/images/icons/icon_drag_64.png"/>
          </span>
          <img class="openPaint" title="Edit in Paint" src="desktop/assets/images/icons/icon_paint_64.png"/>
          <img class="duplicateFrame" title="Duplicate Animation Frame" src="desktop/assets/images/icons/icon_duplicate_64.png"/>
        </div>
      `).insertAfter($('#window_gifstudio .gifFrameHolder:last'));
    }
  }

  // index is lower than set, insert before
  if (index < currentFrames) {
    $(`
      <div class="gifFrameHolder">
        <img data-frameindex="${frame.frameIndex}" src="${base64String}" class="gifstudio_gifFrame"/>
        <span class="removeFrame">
          X
        </span>
        <span class="dragFrameIcon">
          <img src="desktop/assets/images/icons/icon_drag_64.png"/>
        </span>
        <img class="openPaint" title="Edit in Paint" src="desktop/assets/images/icons/icon_paint_64.png"/>
      </div>
    `).insertBefore($('#window_gifstudio .gifFrameHolder:first'));

    return;
  }
  /*. TODO: add back framecount to frameHolder?
      <span class="frameCount">
        ${frame.frameIndex}/${frameData.length}
      </span>
  */
};

desktop.app.gifstudio.drawFrames = function drawFrames (options) {
  $('.gifFrameHolder', '#window_gifstudio').remove();
  gifFrames(options).then(function (frameData) {
    frameData.forEach(function (frame) {
      let stream = frame.getImage();
      let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(stream._obj.buffer)));
      base64String = 'data:image/png;base64,' + base64String;
      desktop.app.gifstudio.renderFrame(frame, base64String, 'insert');
    });

  }).catch(function () {
    desktop.app.gifstudio.renderFrame({ frameIndex: 0 }, options.url);
  });
};

// TODO: move to helpers / util file
const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

desktop.app.gifstudio.openWindow = function openWindow (params) {

  if (buddypond.me) {
    $('.sendGif', '#window_gifstudio').show();
  } else {
    $('.sendGif', '#window_gifstudio').hide();
  }

  let gifURL = '';

  if (params.src) {
    // send the base64 source as part of the frame
    gifURL = params.src;
  }

  if (params.output) {
    desktop.app.gifstudio.output = params.output;
    desktop.app.gifstudio.context = params.context;
    $('.outputTarget').html(params.output + '/' + params.context);
    $('.sendGif', '#window_gifstudio').show();
  } else {
    $('.outputTarget').html('');
    $('.sendGif', '#window_gifstudio').hide();
  }
  $('.gifFrameHolder', '#window_gifstudio').remove();


  if (!gifURL) {
    gifURL = 'desktop/appstore/desktop.gifstudio/assets/rainbow.gif';
  }

  toDataURL(gifURL)
    .then(dataUrl => {
      gifURL = dataUrl;
      $('.gifstudio_gifPreview').attr('src', gifURL);
      $('.gifstudio_gifPreview').show();
      desktop.app.gifstudio.drawFrames({ url: gifURL, frames: 'all' });
    });

};

// TODO: move these functions to helper file
function seralizeFileInput (fileInput) {

  // TODO: rainbow tv gif
  $('.gifstudio_gifPreview').hide();
  $('.gifstudio_gifPreview').attr('src', '');

  let reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);

  reader.onload = function () {
    let src = reader.result;
    $('.gifstudio_gifPreview').attr('src', src);
    $('.gifstudio_gifPreview').show();
    desktop.app.gifstudio.drawFrames({ url: src, frames: 'all' });
  };

  reader.onerror = function (error) {
  	console.log('Error: ', error);
  };
}

function dropHandler (ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  $('#drop_zone').removeClass('drop_zone_active');
  $('#drop_zone').addClass('drop_zone_inactive');
  seralizeFileInput(ev.dataTransfer);

  return;
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        let file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }
}

function dragOverHandler (ev) {
  console.log('File(s) in drop zone');
  $('#drop_zone').removeClass('drop_zone_inactive');
  $('#drop_zone').addClass('drop_zone_active');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function dragLeaveHandler (ev) {
  console.log('File(s) in drop zone');
  $('#drop_zone').removeClass('drop_zone_active');
  $('#drop_zone').addClass('drop_zone_inactive');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}