desktop.app.piano = {};
desktop.app.piano.label = 'piano';

desktop.app.piano.load = function loadpiano (params, next) {
  desktop.load.remoteAssets([
    'piano' // this loads the sibling desktop.app.piano.html file into <div id="window_piano"></div>
  ], function (err) {
    $('#window_piano').css('width', 662);
    $('#window_piano').css('height', 495);
    $('#window_piano').css('left', 50);
    $('#window_piano').css('top', 50);
    desktop.on('midi-message', 'send-midi-data-to-piano-app', function(data){
      let iframe = $('#pianoIframe')[0].contentWindow;
      iframe.postMessage(data, window.origin);
    })
    next();
  });
};

desktop.app.piano.openWindow = function openWindow () {
  $('#pianoIframe').attr('src', 'desktop/appstore/desktop.piano/vendor/index.html');
  return true;
};

desktop.app.piano.closeWindow = function closeWindow () {
  return true;
};