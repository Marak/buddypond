let desktop = {};
desktop.log = console.log;

desktop.load = function () {
  
  
  $('.icon').on('click', function(){
    let appName = $(this).attr('href').replace('#app_', '');
    console.log(appName)
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