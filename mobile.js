let desktop = {};
desktop.log = console.log;
desktop.app = { mtv: {}};
desktop.settings = {};
desktop.settings.wallpaper_color = 'green';
desktop.settings.wallpaper_name = 'matrix';
desktop.load = function () {

  $('.icon').on('click', function(){
    let appName = $(this).attr('href').replace('#app_', '');
    desktop.app.interdimensionalcable.closeWindow();
    desktop.app.mtv.closeWindow();
    $('.window').hide();
    if (desktop.app[appName] && desktop.app[appName].openWindow) {
      desktop.app[appName].openWindow();
    } else {
      $('#window_' + appName).show();
      $('.window', '#window_' + appName).show();
    }
    return false;
  })
  $('.window').hide();
  $('#window_login').show()

}

desktop.load.remoteAppHtml = function noop (params, cb) {
  cb(null);
}

desktop.load.remoteAssets = function noop (params, cb) {
  cb(null);
}

desktop.on = function noop () {}