desktop.app.soundrecorder = {};
desktop.app.soundrecorder.label = "Sound Recorder";

desktop.app.soundrecorder.load = function loadsoundrecorderGames (params, next) {
  desktop.load.remoteAssets([
    'soundrecorder' // this loads the sibling desktop.app.soundrecorder.html file into <div id="window_soundrecorder"></div>
  ], function (err) {
    $('#window_soundrecorder').css('width', 662);
    $('#window_soundrecorder').css('height', 388);
    $('#window_soundrecorder').css('left', 50);
    $('#window_soundrecorder').css('top', 50);

    $('.sendSound').on('click', function(){
      desktop.set('soundrecorder_send_active', true);
    });

    if (!desktop.settings.soundrecorder_active_context) {
      desktop.set('soundrecorder_active_type', 'pond');
      desktop.set('soundrecorder_active_context', 'Lily');
    }
    
    next();
  });
};

desktop.app.soundrecorder.openWindow = function openWindow (params) {

  params = params || {};

  let soundUrlQueryParam = '';
  let context = '';
  let type = '';

  if (params.type) {
    type = '&type=' + params.type;
  }

  if (params.context) {
    context = '&context=' + params.context;
  }

  if (params.soundUrl) {
    desktop.app.soundrecorder.activeSound = params.soundUrl;
    soundUrlQueryParam = '&src=' + params.soundUrl;
    // desktop.app.soundrecorder.mode = 'closeAfterPlayed';
  }

  if (params.soundUrl) {
    // desktop.set('paint_send_active', false);
    $('#soundrecorderIframe').attr('src', `desktop/apps/desktop.soundrecorder/vendor/programs/sound-recorder/index.html?qtokenid=${buddypond.qtokenid}${soundUrlQueryParam}${type}${context}`);
  } else {
    $('#soundrecorderIframe').attr('src', `desktop/apps/desktop.soundrecorder/vendor/programs/sound-recorder/index.html?qtokenid=${buddypond.qtokenid}${type}${context}`);
  }
  return true;
};

desktop.app.soundrecorder.closeWindow = function closeWindow () {
  return true;
};