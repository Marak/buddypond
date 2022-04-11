desktop.app.login = {};
desktop.app.login.label = 'Login';

desktop.app.login.load = function loadDesktopLogin (params, next) {

  desktop.load.remoteAssets([
    'login' // this loads the sibling desktop.app.login.html file into <div id="window_login"></div>
  ], function (err) {

    $('.loginForm').on('submit', function () {
      return false;
    });

    // if user clicks login button, attempt to auth with server
    $('.loginButton').on('click', function () {
      desktop.app.login.auth($('#buddyname').val(), $('#buddypassword').val());
    });

    // everyone shares the anonymous account!
    $('.loginAnonButton').on('click', function () {
      desktop.app.login.auth('anonymous', 'password');
    });

    // if user clicks on top left menu, focus on login form
    $('.loginLink').on('click', function () {
      desktop.ui.openWindow('login');
      $('#buddyname').focus();
    });

    // if user clicks logout link on top left menu, logout the user
    $('.logoutLink').on('click', function () {
      desktop.app.login.logoutDesktop();
    });

    $('.splashImage').on('click', function(){
      let roll = Math.floor(Math.random() * 2);
      if (roll) {
        desktop.play('RIBBIT-J.wav');
      } else {
        desktop.play('RIBBIT.wav');
      }
    });

    //
    // Checks to see if there is a qtokenid stored locally, if so check to see if server has matching session
    //
    let localToken = localStorage.getItem('qtokenid');
    let me = localStorage.getItem('me');
    if (localToken) {
      buddypond.verifyToken(me, localToken, function (err, data) {
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

};

desktop.app.login.auth = function authDesktop (buddyname, password) {
  desktop.log('buddypond.authBuddy ->', buddyname);
  $('#buddypassword').removeClass('error');

  if (typeof password !== 'undefined' && password === "") {
    // password is username big head
    password = buddyname;
  }

  buddypond.authBuddy(buddyname, password, function (err, data) {

    if (err) {
      console.log('err', err, data);
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
      localStorage.setItem('qtokenid', data.qtokenid);
      localStorage.setItem('me', buddypond.me);
      buddypond.qtokenid = data.qtokenid;
      desktop.app.login.success();
    } else {
      if (data.banned) {
        alert(data.message);
      }
      $('.buddyPasswordRow').show();
      if (buddyname === password) {
        $('.buddyPasswordRow').show();
        $('#buddypassword').focus();
        $('#window_login').css('height', '62vh');
        $('#buddypassword').attr('placeholder', 'Enter Password')
      } else {
        $('#buddypassword').addClass('error');
        $('.buddyLoginTable .invalidPassword').show();
        $('#buddypassword').attr('placeholder', 'Invalid Password')
      }
    }
    console.log(err, data);
  });
};

desktop.app.login.success = function desktopLoginSuccess () {
  $('#me_title').html('Welcome - ' + buddypond.me);
  $('.me').html(buddypond.me);
  desktop.play('WELCOME.wav', Infinity);
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
  desktop.ui.removeDockElement('login');
  try {
    let dateString = DateFormat.format.date(new Date(), 'ddd HH:mm:ss');
    $('.connection_ctime').html(dateString);
  } catch (err) {
    console.log('Warning: DateFormat was not defined, this should not happend', err);
  }
  $('.connection_packets_sent').html('1');
  $('.connection_packets_recieved').html('1');
  $('.editProfileLink').show();
  
  $('.editProfileLink').html('Edit Profile');
  $('.editProfileLink').removeClass('editProfileLinkDisabled');
  $('.loggedIn').show();


  // TODO: move this is a separate function
  setTimeout(function () {
    if (!buddypond.email || buddypond.email.length < 3) {
      desktop.emit('merlin-speaks', 'Welcome to Buddy Pond! Please be sure to set your email address in the top left nav bar!');
    } else {
      desktop.emit('merlin-speaks', `Welcome back ${buddypond.me}! Merlin thinks you are fantastic!`);
    }
    setTimeout(function () {
      desktop.emit('merlin-hides');
    }, 14444);
  }, 2000);

  // start packets update interval timer
  setInterval(function () {
    $('.connection_packets_sent').html(buddypond.packetsSent);
    $('.connection_packets_recieved').html(buddypond.packetsReceived);
    $('.connection_average_response_time').html(buddypond.averageResponseTime());
    $('.connection_last_response_time').html(buddypond.lastResponseTime());
  }, 1000);

  // TODO: route default view based on query string
  let params = desktop.utils.parseQueryString(document.location.search);

  if (params.pond) {
    desktop.ui.openWindow('pond', {
      context: params.pond
    });
  } else {
    $('#window_buddylist').show();
    desktop.ui.openWindow('buddylist');
    desktop.ui.openWindow('pond');
    desktop.ui.openWindow('pond', {
      context: 'Lily'
    });
  }

  // manually call resize event, special case for logged in session with refresh
  desktop.ui.windowResizeEventHandler();

  //desktop.ui.positionWindow('#' + windowKey, 'left')
  // TODO: remove this line. required due to initial blink on lily pond
  setTimeout(function () {
    $('.dock_title', '#icon_dock_pond_message_10').removeClass('rainbow');
  }, 3000);
};

desktop.app.login.openWindow = function desktopLoginOpenWindow () {
  $('.desktopConnected').hide();
  $('.logoutLink').hide();
  $('#window_login').addClass('window_stack').show();
  $('#window_login').css('width', '30vw');
  $('#window_login').css('height', '55vh');
  $('#window_login').css('left', '33vw');
  $('#window_login').css('top', '16vh');
  $('#login_desktop_icon').show();
  $('#icon_dock_login').show();


  //$('#icon_dock_login').show();
  // manually call resize event, make login full screen
  desktop.ui.windowResizeEventHandler();
  setTimeout(function(){
    $('#buddyname').focus();
  }, 500)
  
};

desktop.app.login.logoutDesktop = function logoutDesktop () {
  localStorage.removeItem('qtokenid');
  localStorage.removeItem('me');
  desktop.play('GOODBYE.wav', false, function () {
    document.location = 'index.html';
  });
};