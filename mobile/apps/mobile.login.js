desktop.login = {};

desktop.login.load = function loadDesktopLogin () {

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
      if (data.success === false) {
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

    if (data.success) {
      desktop.log('Authentication successful');
      localStorage.setItem("qtokenid", data.qtokenid);
      localStorage.setItem("me", buddypond.me);
      buddypond.qtokenid = data.qtokenid;
      desktop.login.success();
    } else {
      if (data.banned) {
        alert(data.message);
      }
      $('#buddypassword').addClass('error');
      $('.buddyLoginTable .invalidPassword').show()
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
  $('#profile_desktop_icon').show();
  $('.totalConnected').show();
  $('#window_buddylist').show();
  $('.desktopConnected').show();
  $('.desktopDisconnected').hide();
  let dateString = DateFormat.format.date(new Date(), "ddd HH:mm:ss");
  $('.connection_ctime').html(dateString)
  $('.connection_packets_sent').html("1");
  $('.connection_packets_recieved').html("1");

  $('.loggedIn').show();

  // start packets update interval timer
  setInterval(function(){
    $('.connection_packets_sent').html(buddypond.packetsSent);
    $('.connection_packets_recieved').html(buddypond.packetsReceived);
    $('.connection_average_response_time').html(buddypond.averageResponseTime());
    $('.connection_last_response_time').html(buddypond.lastResponseTime());
  }, 1000);

}

desktop.login.openWindow = function desktopLoginOpenWindow () {
  $('.desktopConnected').hide();
  $('.logoutLink').hide();
  $('#window_login').show();
  $('#buddyname').focus();
  $('#login_desktop_icon').show();
}

desktop.login.logoutDesktop = function logoutDesktop () {
  localStorage.removeItem('qtokenid')
  localStorage.removeItem('me')
  // TODO: . root?
  document.location = "index.html";
}