desktop.app.midifighter = {};
desktop.app.midifighter.label = 'midifighter';

desktop.app.midifighter.load = function loadmidifighterGames (params, next) {
  desktop.load.remoteAssets([
    'midifighter' // this loads the sibling desktop.app.midifighter.html file into <div id="window_midifighter"></div>
  ], function (err) {
    $('#window_midifighter').css('width', 662);
    $('#window_midifighter').css('height', 550);
    $('#window_midifighter').css('left', 50);
    $('#window_midifighter').css('top', 50);
    next();
  });
};

desktop.app.midifighter.openWindow = function openWindow () {
  return true;
};

desktop.app.midifighter.closeWindow = function closeWindow () {
  $('#midifighterIframe').attr('src', 'desktop/apps/desktop.midifighter/vendor/index.html');
  return true;
};