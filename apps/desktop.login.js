desktop.login = {};

desktop.login.auth = function authDesktop (buddyname) {
  desktop.log('buddypond.authBuddy ->', buddyname);
  $('#buddypassword').removeClass('error');
  buddypond.authBuddy(buddyname, $('#buddypassword').val(), function(err, data){

    if (err) {
      alert('server is down. please try again in a moment.');
      return;
    }

    desktop.log('buddypond.authBuddy <- qtokenid', data);

    if (data === false) {
      $('#buddypassword').addClass('error');
      $('.buddyLoginTable .invalidPassword').show()
      return;
    }
    desktop.log('Authentication successful')
    $('#me_title').html('Welcome - ' + buddyname);
    $('.logoutLink').show();
    $('.loginLink').hide();

    $('.console').val()
    $('.qtokenid').val(data);
    if (data === false) {
      // TODO: alert UI, try again
    } else {
      buddypond.qtokenid = data;
      $('#window_login').hide();
      $('#login_desktop_icon').hide();
      $('#logout_desktop_icon').show();
      $('#window_buddylist').show();
      $('#window_buddylist').css('width', 220)
      $('#window_buddylist').css('height', 440)
      $('#window_buddylist').css('left', 666)
      $('#window_buddylist').css('top', 111)
      $('.desktopConnected').show();
      $('.desktopDisconnected').hide();
      desktop.renderDockElement('buddylist');
      desktop.removeDockElement('login')
    }
    console.log(err, data)
  });
}

desktop.login.openWindow = function desktopLoginOpenWindow () {
  $('#buddyname').focus();
}
