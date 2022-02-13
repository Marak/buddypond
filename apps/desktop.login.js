desktop.login = {};

desktop.login.load = function loadDesktopLogin () {

  desktop.renderDockElement('login');

  let localToken = localStorage.getItem("qtokenid");
  let me = localStorage.getItem("me");
  if (localToken) {
    buddypond.verifyToken(me, localToken, function(err, data){
      if (err) {
        alert('server is down. please try again in a moment.');
      }

      // server is online and operational, but returned an error message to client state
      if (data.error) {
        alert(data.message);
        return;
      }

      // token has not validated, log out the client
      if (data === false) {
        desktop.login.logoutDesktop();
        desktop.login.openWindow();
      } else {
      // token is valid, show client login success
        buddypond.qtokenid = localToken;
        buddypond.me = me;
        desktop.login.success();
      }
    });
  } else {
    $('.totalConnected').hide();
    desktop.login.openWindow();
  }

}

desktop.login.auth = function authDesktop (buddyname) {
  desktop.log('buddypond.authBuddy ->', buddyname);
  $('#buddypassword').removeClass('error');
  buddypond.authBuddy(buddyname, $('#buddypassword').val(), function(err, data){

    if (err) {
      console.log('err', err, data)
      alert('server is down. please try again in a moment.');
      return;
    }

    // server is online and operational, but returned an error message to client state
    if (data.error) {
      alert(data.message);
      return;
    }

    desktop.log('buddypond.authBuddy <- qtokenid', data);

    desktop.log('Authentication successful');

    localStorage.setItem("qtokenid", data);
    localStorage.setItem("me", buddypond.me);

    if (data === false) {
      $('#buddypassword').addClass('error');
      $('.buddyLoginTable .invalidPassword').show()
      return;
    } else {
      buddypond.qtokenid = data;
      desktop.login.success();
    }
    console.log(err, data)
  });
}

desktop.login.success = function desktopLoginSuccess () {
  $('#me_title').html('Welcome - ' + buddypond.me);
  $('.logoutLink').show();
  $('.loginLink').hide();
  // $('.qtokenid').val(data);
  $('#window_login').hide();
  $('#login_desktop_icon').hide();
  $('#logout_desktop_icon').show();
  $('.totalConnected').show();
  $('#window_buddylist').show();
  $('#window_buddylist').css('width', 220);
  $('#window_buddylist').css('height', 440);
  $('#window_buddylist').css('left', 666);
  $('#window_buddylist').css('top', 111);
  $('.desktopConnected').show();
  $('.desktopDisconnected').hide();
  desktop.renderDockElement('buddylist');
  desktop.removeDockElement('login');
  let dateString = DateFormat.format.date(new Date(), "ddd HH:mm:ss");
  $('.connection_ctime').html(dateString)
  $('.connection_packets_sent').html("1")
  $('.connection_packets_recieved').html("1")
}

desktop.login.openWindow = function desktopLoginOpenWindow () {
  $('.desktopConnected').hide();
  $('.logoutLink').hide();
  $('#logout_desktop_icon').hide();
  $('#window_login').show();
  $('#window_login').css('width', 800);
  $('#window_login').css('height', 400);
  $('#window_login').css('left', 222);
  $('#window_login').css('top', 111);
  $('#buddyname').focus();
}

desktop.login.logoutDesktop = function logoutDesktop () {
  localStorage.removeItem('qtokenid')
  localStorage.removeItem('me')
  document.location = ".";
}