let desktop = {};
desktop.log = console.log;
desktop.settings = {};
desktop.load = function () {

  $('.icon').on('click', function(){
    let appName = $(this).attr('href').replace('#app_', '');
    desktop.interdimensionalcable.closeWindow();
    desktop.mtv.closeWindow();
    $('.window').hide();
    if (desktop[appName] && desktop[appName].openWindow) {
      desktop[appName].openWindow();
    } else {
      $('#window_' + appName).show();
      $('.window', '#window_' + appName).show();
    }
    return false;
  })
  $('.window').hide();
  $('#window_login').show()

}

desktop.loadRemoteAppHtml = function noop (params, cb) {
  cb(null);
}

desktop.loadRemoteAssets = function noop (params, cb) {
  cb(null);
}