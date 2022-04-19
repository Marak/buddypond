desktop.app.faq = {};
desktop.app.faq.label = 'FAQ';

desktop.app.faq.load = function loadfaqGames (params, next) {
  desktop.load.remoteAssets([
    'faq' // this loads the sibling desktop.app.faq.html file into <div id="window_faq"></div>
  ], function (err) {
    $('#window_faq').css('width', 662);
    $('#window_faq').css('height', 495);
    $('#window_faq').css('left', 50);
    $('#window_faq').css('top', 50);
    next();
  });
};

desktop.app.faq.openWindow = function openWindow () {
  return true;
};

desktop.app.faq.closeWindow = function closeWindow () {
  return true;
};