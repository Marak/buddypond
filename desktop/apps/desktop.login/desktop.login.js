desktop.app.login = {};
desktop.app.login.label = "Login";

desktop.app.login.load = function loadDesktopLogin (params, next) {

  desktop.load.remoteAssets([
    'desktop/assets/js/jquery.dateformat.js',
    'login' // this loads the sibling desktop.app.login.html file into <div id="window_login"></div>
  ], function (err) {

    $('.loginForm').on('submit', function () {
      return false;
    });

    // if user clicks login button, attempt to auth with server
    $('.loginButton').on('click', function(){
      desktop.app.login.auth($('#buddyname').val());
    });

    // if user clicks on top left menu, focus on login form
    $('.loginLink').on('click', function(){
      desktop.ui.openWindow('login');
      $('#buddyname').focus();
    });

    // if user clicks logout link on top left menu, logout the user
    $('.logoutLink').on('click', function(){
      desktop.app.login.logoutDesktop()
    });

    desktop.ui.renderDockElement('login');

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
          return next(null);
        }

        // token has not validated, log out the client
        if (data.success === false) {
          desktop.app.login.logoutDesktop();
          desktop.app.login.openWindow();
        } else {
        // token is valid, show client login success
          buddypond.qtokenid = localToken;
          buddypond.me = me;
          desktop.app.login.success();
        }
        return next(null);
      });
    } else {
      $('.totalConnected').hide();
      desktop.app.login.openWindow();
      return next(null);
    }

  });

}

desktop.app.login.auth = function authDesktop (buddyname) {
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
      // TODO: desktop.set()
      localStorage.setItem("qtokenid", data.qtokenid);
      localStorage.setItem("me", buddypond.me);
      buddypond.qtokenid = data.qtokenid;
      desktop.app.login.success();
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

desktop.app.login.success = function desktopLoginSuccess () {
  $('#me_title').html('Welcome - ' + buddypond.me);
  $('.me').html(buddypond.me);
  desktop.app.audioplayer.play('desktop/assets/audio/WELCOME.wav', Infinity)
  $('.logoutLink').show();
  $('.loginLink').hide();
  // $('.qtokenid').val(data);
  $('#window_login').hide();
  $('.buddy_pond_not_connected').hide();
  $('#login_desktop_icon').hide();
  $('#profile_desktop_icon').show();
  $('.totalConnected').show();
  $('.desktopConnected').show();
  $('.desktopDisconnected').hide();
  desktop.ui.renderDockElement('buddylist');
  desktop.ui.removeDockElement('login');
  try {
    let dateString = DateFormat.format.date(new Date(), "ddd HH:mm:ss");
    $('.connection_ctime').html(dateString)
  } catch (err) {
    console.log('Warning: DateFormat was not defined, this should not happend', err);
  }
  $('.connection_packets_sent').html("1");
  $('.connection_packets_recieved').html("1");
  $('.editProfileLink').show();
  
  $('.editProfileLink').html('Edit Profile');
  $('.editProfileLink').removeClass('editProfileLinkDisabled');
  $('.loggedIn').show();

  // TODO: move this is a separate function
  /*
  if (desktop.settings.agent_merlin_active) {
    clippy.load('Merlin', function(agent) {
       desktop.app.Merlin = agent;
       agent.show();
       setTimeout(function(){
         if (!buddypond.email || buddypond.email.length < 3) {
           agent.speak('Welcome to Buddy Pond! Please be sure to set your email address in the top left nav bar!');
           setTimeout(function(){
             agent.hide();
           }, 12000);
         } else {
           agent.speak(`Welcome back ${buddypond.me}! Merlin thinks you are fantastic!`);
           agent.animate();
           setTimeout(function(){
             agent.hide();
           }, 19000);
         }
         agent.gestureAt(200,200);
       }, 3333);
     });
  }
  */


  // start packets update interval timer
  setInterval(function(){
    $('.connection_packets_sent').html(buddypond.packetsSent);
    $('.connection_packets_recieved').html(buddypond.packetsReceived);
    $('.connection_average_response_time').html(buddypond.averageResponseTime());
    $('.connection_last_response_time').html(buddypond.lastResponseTime());
  }, 1000);
  // TODO: switch to openWindow API, was causing race condition with loader
  //desktop.ui.openWindow('buddylist');
  //desktop.ui.openWindow('pond');
  $('#window_pond').show();
  $('#window_buddylist').show();
  desktop.app.pond.openWindow('Lily');

  // TODO: Remove this line, seems to be bug with loading the default Lily pond immediately
  setTimeout(function(){
    let el = $('.chat_messages', '.pond_message_main')
    $(el).scrollTop(9999);
  }, 1200)
  // TODO: Remove this line, seems to be bug with loading the default Lily pond immediately
  setTimeout(function(){
    $('.dock_title', '#icon_dock_pond_message_10').removeClass('rainbow');
  }, 3000);
}

desktop.app.login.openWindow = function desktopLoginOpenWindow () {
  $('.desktopConnected').hide();
  $('.logoutLink').hide();
  $('#window_login').show();
  $('#window_login').css('width', 800);
  $('#window_login').css('height', 400);
  $('#window_login').css('left', 222);
  $('#window_login').css('top', 111);
  $('#login_desktop_icon').show();
  $('#buddyname').focus();
}

desktop.app.login.logoutDesktop = function logoutDesktop () {
  localStorage.removeItem('qtokenid')
  localStorage.removeItem('me')
  // TODO: . root?
  document.location = "index.html";
}