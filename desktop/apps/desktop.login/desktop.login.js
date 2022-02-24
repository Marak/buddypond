desktop.login = {};
desktop.login.label = "Login";

desktop.login.load = function loadDesktopLogin (params, next) {

  desktop.loadRemoteAssets([
    'desktop/assets/css/clippy.css',
    'desktop/assets/js/clippy.min.js',
    'login' // this loads the sibling desktop.login.html file into <div id="window_login"></div>
  ], function (err) {

    $('.loginForm').on('submit', function () {
      return false;
    });

    // if user clicks login button, attempt to auth with server
    $('.loginButton').on('click', function(){
      desktop.login.auth($('#buddyname').val());
    });

    // if user clicks on top left menu, focus on login form
    $('.loginLink').on('click', function(){
      $('#window_login').show();
      $('#buddyname').focus();
    });

    // if user clicks logout link on top left menu, logout the user
    $('.logoutLink').on('click', function(){
      desktop.login.logoutDesktop()
    });

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
          return next(null);
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
        return next(null);
      });
    } else {
      $('.totalConnected').hide();
      desktop.login.openWindow();
      return next(null);
    }

  });

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
  $('.buddy_pond_not_connected').hide();
  $('#login_desktop_icon').hide();
  $('#profile_desktop_icon').show();
  $('.totalConnected').show();
  $('.desktopConnected').show();
  $('.desktopDisconnected').hide();
  desktop.renderDockElement('buddylist');
  desktop.removeDockElement('login');
  let dateString = DateFormat.format.date(new Date(), "ddd HH:mm:ss");
  $('.connection_ctime').html(dateString)
  $('.connection_packets_sent').html("1");
  $('.connection_packets_recieved').html("1");

  $('.loggedIn').show();

  clippy.load('Merlin', function(agent) {
     desktop.Merlin = agent;
     agent.show();
     setTimeout(function(){
       if (!buddypond.email || buddypond.email.length < 3) {
         agent.speak('Welcome to Buddy Pond! Please be sure to set your email address in the Profile App!');
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

  // start packets update interval timer
  setInterval(function(){
    $('.connection_packets_sent').html(buddypond.packetsSent);
    $('.connection_packets_recieved').html(buddypond.packetsReceived);
    $('.connection_average_response_time').html(buddypond.averageResponseTime());
    $('.connection_last_response_time').html(buddypond.lastResponseTime());
  }, 1000);
  $('#window_pond').show();
  desktop.pond.openWindow();

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

desktop.login.openWindow = function desktopLoginOpenWindow () {
  $('.desktopConnected').hide();
  $('.logoutLink').hide();
  $('#window_login').show();
  $('#window_login').css('width', 800);
  $('#window_login').css('height', 400);
  $('#window_login').css('left', 222);
  $('#window_login').css('top', 111);
  $('#buddyname').focus();
  $('#login_desktop_icon').show();
}

desktop.login.logoutDesktop = function logoutDesktop () {
  localStorage.removeItem('qtokenid')
  localStorage.removeItem('me')
  // TODO: . root?
  document.location = "index.html";
}