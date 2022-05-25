desktop.app.login = {};
desktop.app.login.label = 'Login';

desktop.app.login.load = function loadDesktopLogin (params, next) {

  desktop.load.remoteAssets([
    'login' // this loads the sibling desktop.app.login.html file into <div id="window_login"></div>
  ], function (err) {

    let d = $(document);

    d.on('mousedown', '.splashImagesHolder', function (ev) {
      let gallery = $(ev.target).parent().parent();
      let app = gallery.data('app');
      if (app) {
        desktop.ui.openWindow(app);
      } else{
        desktop.ui.openWindow('profile');
      }
    });

    // TODO: Refactor these event handlers to use document ^^^
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
      JQDX.showWindow('login');
      $('#buddyname').focus();
    });

    // if user clicks logout link on top left menu, logout the user
    d.on('mousedown', '.logoutLink', function (ev) {
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
          alert('Hey Buddy...we could not verify the existing qtokenid.\n\nLogging out.\n\nPlease try again.');
          desktop.app.login.logoutDesktop(true);
          return;
        }

        // server is online and operational, but returned an error message to client state
        if (data.error) {
          alert(data.message);
          return next(null);
        }

        // token has not validated, log out the client
        if (data.success === false) {
          desktop.app.login.logoutDesktop();
          JQDX.showWindow('login');
        } else {
        // token is valid, show client login success
          buddypond.qtokenid = localToken;
          buddypond.me = me;
          desktop.ui.openWindowsFromSavedSettings();
          desktop.app.login.success({ source: 'localToken' });
        }

        if (location.hash) {
          desktop.routeFromHash();
        }

        return next(null);
      });
    } else {
      $('.totalConnected').hide();
      // re-opens previously opened windows
      desktop.ui.openWindowsFromSavedSettings();
      /*
      // if the buddy has not manually logged out at least once,
      // log them in anonymous for the first time
      if (!desktop.settings.buddy_logged_out) {
        desktop.app.login.auth('anonymous', 'password');
      } else {
        if (!desktop.hashMode) {
          JQDX.showWindow('login');
        }
      }
      */
      if (location.hash) {
        desktop.routeFromHash();
      } else {
        JQDX.showWindow('login');
      }

      /* Remove for now, buddypond.qtokenid is not safe to change like this, needs instance of sdk
      buddypond.authBuddy('anonymous', 'password', function (err, data) {
        if (data && data.qtokenid) {
          buddypond.qtokenid = data.qtokenid;
          buddypond.pondSendMessage('Lily', 'has loaded the Desktop', function (err, data) {
            // buddypond.qtokenid = null;
          });
        }
      });
      */
      return next(null);
    }

  });

};

desktop.app.login.auth = function authDesktop (buddyname, password, params) {
  params = params || {};
  desktop.log('buddypond.authBuddy ->', buddyname);
  $('#buddypassword').removeClass('error');

  if (typeof password !== 'undefined' && password === "") {
    // password is username big head
    password = buddyname;
  }

  buddypond.authBuddy(buddyname, password, function (err, data) {
    if (err) {
      console.log('err', err, data);
      alert('Welcome Buddy! The Pond is currently at capacity.\n\nPlease feel free to try again shortly.\n\nClick Around. All Apps and Files will continue to work offline.');
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
      desktop.app.login.success({ source: 'serverToken', freshAccount: data.freshAccount, pondLogin: params.pondLogin });
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

desktop.app.login.success = function desktopLoginSuccess (params) {

  //
  // Required for Desktop to load
  //
  $('#me_title').html('Welcome - ' + buddypond.me);
  $('.me').html(buddypond.me);
  desktop.play('WELCOME.wav', Infinity);
  $('.logoutLink').show();
  $('.loginLink').hide();
  desktop.ui.closeWindow('login');

  $('.buddy_pond_not_connected').hide();
  $('#login_desktop_icon').hide();
  $('#profile_desktop_icon').show();
  $('.totalConnected').show();
  $('.desktopConnected').show();
  $('.desktopDisconnected').hide();
  $('#icon_dock_login').hide();
  $('.loginIcon').hide();
  $('.pondMessagesHolder').show();
  $('.window_bottom_chat').show();

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
  $('.loginIcon .title').html('Logout');

  // start packets update interval timer
  setInterval(function () {
    $('.connection_packets_sent').html(buddypond.packetsSent);
    $('.connection_packets_recieved').html(buddypond.packetsReceived);
    $('.connection_average_response_time').html(buddypond.averageResponseTime());
    $('.connection_last_response_time').html(buddypond.lastResponseTime());
  }, 1000);

  // manually call resize event, special case for logged in session with refresh
  desktop.ui.windowResizeEventHandler();

  // for certain types of login loads, do not execution optional login UX
  if (params.pondLogin || desktop.hashMode || location.hash) {
    return;
  }

  //
  // Optional for user experience
  //
  desktop.ui.openWindow('merlin', {
    windowless: true
  });

  // TODO: move this is a separate function
  setTimeout(function () {
    if (!buddypond.email || buddypond.email.length < 3) {
      desktop.emit('merlin-speaks', `Hi ${buddypond.me}! Please be sure to set your email address on your Profile.`);
    } else {
      desktop.emit('merlin-speaks', `Welcome back ${buddypond.me}! Merlin thinks you are fantastic!`);
    }
    setTimeout(function () {
      desktop.emit('merlin-hides');
    }, 14444);
  }, 2000);

  // is the source of the login is a serverToken, this indicates a fresh login
  // for fresh logins, show the buddy list and join the default Lily Pond
  // if params.source === 'localToken', this indicates that localStorage remembered the session
  // and that the desktop should rely on localStorage desktop.settings.windows_open
  if (params.source === 'serverToken') {
    $('#window_buddylist').show();
    desktop.ui.openWindow('buddylist');
    desktop.ui.openWindow('pond');
    if (params.freshAccount) {
      desktop.ui.openWindow('pond', {
        context: 'Lily'
      });
    }
  }

  // announce all new buddies when they join
  // if params.freshAccount, this indicates a new account
  if (params.freshAccount) {
    let randomMessages = [
      'Hello. First time here...this place is awesome!',
      'what is this',
      'Marak did you make this?',
      'I am in love with Buddy Pond.',
      'has anyone seen my dog?',
      'I am the very model of a Modern Major General.',
      'hey guys please follow me on twitter @elonmusk',
      'omg this is amazing how did you do this',
      'asl?',
      'why did AOL redirect me here?',
      'how anyone seen my cat?',
      'good morning buddies!',
      'good afternoon buddies!',
      'good evening buddies!',
      'good morning',
      'good afternoon',
      'good evening',
      'salutations',
      '/say hello and hey',
      '/roll',
      'how can i contribute to the project?',
      'hail buddies!',
      'who wants to be my buddy?',
      'greetings',
      'hello',
      'hi',
      'Sarah Connor, where is she?',
      'My CPU is a nueral net processor. A learning computer.',
      'I am here for Good Buddy Points.',
      'I am here for Good Buddy Points. May I please speak with the HBIC?',
      'im just here to watch',
      'just came in from youtube. cool site',
      'just came in from twitter. cool site',
      'just came in from altavista. cool site',
      'wheres my lunch',
      'google brought me here',
      'found this on github. cool site',
      'who is the head buddy in charge? i must speak with them immediately',
      'where are the memes',
      'where is the meme',
      'is this real',
      'this is real?',
      'how many jQueries does this site use?',
      'i have over 9000 buddies. each greater than the last.',
      'github ate my homework has anyone seen it',
      'i tried to install npm but the readme failed to load',
      'can anyone tell me how to download buddy pond?',
      'buddyscript is run with /bs command',
      'woah using /midi and /piano together is awesome',
      'i just connected /globe and /hack commands and hacked the planet 😎',
      'has anyone seen Dave?',
      'Daves not here man',
      'does anyone want to subscribe to my blog its www the internet @ hotpages frontslash mail.me',
      'yooooooo',
      'can i get some good buddy points please?',
      'THIS IS B U D D Y P O N D',
      'have anyone seen the faker.js?',
      'where is zalgo, i must speak with him',
      '/meme terry',
      '/meme tripply',
      '\\bs',
      '\\idc',
      '\\mtv',
      '\\memepool'
    ];
    let allRandomMessages = randomMessages.concat(desktop.app.buddylist.positiveAffirmations);
    let randomMessage = allRandomMessages[Math.floor(Math.random() * allRandomMessages.length)];
    buddypond.pondSendMessage('Lily', randomMessage, function (err, data) {
    });
  }

  // TODO: show Merlin welcome message
  setTimeout(function(){
    desktop.commands.chat.welcome({ windowId: '#window_pond_message_Lily' });
  }, 2222);


};

desktop.app.login.openWindow = function desktopLoginOpenWindow () {
  $('.desktopConnected').hide();
  $('.logoutLink').hide();
  // $('#window_login').addClass('window_stack').show();
  $('#window_login').css('width', '74vw');
  $('#window_login').css('height', '75vh');
  $('#window_login').css('left', '22vw');
  $('#window_login').css('top', '9vh');
  $('#login_desktop_icon').show();

  desktop.ui.openWindow('merlin', {
    windowless: true
  });

  //$('#icon_dock_login').show();
  // manually call resize event, make login full screen
  setTimeout(function(){
    $('#buddyname').focus();
    $('#icon_dock_login').show();
    desktop.ui.windowResizeEventHandler();
  }, 500)
};

desktop.app.login.logoutDesktop = function logoutDesktop (immediate) {
  localStorage.removeItem('qtokenid');
  localStorage.removeItem('me');
  desktop.set('buddy_logged_out', true);
  desktop.set('windows_open', {});
  if (immediate) {
    document.location = 'index.html';
    return;
  }
  desktop.play('GOODBYE.wav', false, function () {
    document.location = 'index.html';
  });
};