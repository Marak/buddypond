desktop.app.soundrecorder = {};
desktop.app.soundrecorder.label = 'Sound Recorder';

desktop.app.soundrecorder.load = function loadsoundrecorderGames (params, next) {
  desktop.load.remoteAssets([
    'soundrecorder' // this loads the sibling desktop.app.soundrecorder.html file into <div id="window_soundrecorder"></div>
  ], function (err) {
    $('#window_soundrecorder').css('width', 662);
    $('#window_soundrecorder').css('height', 388);
    $('#window_soundrecorder').css('left', 50);
    $('#window_soundrecorder').css('top', 50);

    $('.sendSound').on('click', function () {
      desktop.set('soundrecorder_send_active', true);
    });

    if (!desktop.settings.soundrecorder_active_context) {
      desktop.set('soundrecorder_active_type', 'pond');
      desktop.set('soundrecorder_active_context', 'Lily');
    }

    let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
    let eventer = window[eventMethod];
    let messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

    // Listen to message from child window
    eventer(messageEvent,function (e) {
      let key = e.message ? 'message' : 'data';
      let data = e[key];
      if (data === 'app_soundrecorder_needs_close') {
        JQDX.closeWindow('#window_soundrecorder');
      }
    },false);

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

  let qtokenidParam = '';
  if (buddypond.qtokenid) {
    qtokenidParam = '&qtokenid=' + buddypond.qtokenid;
  }
  if (params.soundUrl) {
    $('#soundrecorderIframe').attr('src', `desktop/appstore/desktop.soundrecorder/vendor/programs/sound-recorder/index.html?AC=3${qtokenidParam}${soundUrlQueryParam}${type}${context}`);
  } else {
    $('#soundrecorderIframe').attr('src', `desktop/appstore/desktop.soundrecorder/vendor/programs/sound-recorder/index.html?AC=3${qtokenidParam}${type}${context}`);
  }
  return true;
};

desktop.app.soundrecorder.closeWindow = function closeWindow () {
  return true;
};