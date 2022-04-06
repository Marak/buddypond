desktop.app.nes = {};
desktop.app.nes.label = 'nes';

desktop.app.nes.load = function loadnesGames (params, next) {
  desktop.load.remoteAssets([
    'nes' // this loads the sibling desktop.app.nes.html file into <div id="window_nes"></div>
  ], function (err) {
    $('#window_nes').css('width', 662);
    $('#window_nes').css('height', 495);
    $('#window_nes').css('left', 50);
    $('#window_nes').css('top', 50);
    next();
  });
};

desktop.app.nes.openWindow = function openWindow () {
  return true;
};

desktop.app.nes.closeWindow = function closeWindow () {
  $('#nesIframe').attr('src', 'desktop/apps/desktop.nes/vendor/SaltyNES.html');
  return true;
};