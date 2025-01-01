


window.bp_v_5 = async function bp_v_5() {
  let localBuddyChatCommands = Object.keys(desktop.app.console._allowCommands).map(function (a) { return '/' + a });
  let remoteBuddyChatCommands = Object.keys(desktop.app.console._allowCommands).map(function (a) { return '\\' + a });
  let allCommands = localBuddyChatCommands.concat(remoteBuddyChatCommands);

  // TODO: load commands from buddyScript
  // console.log('allCommands', allCommands);

  // TODO: move all bp code to app.js file
  //
  // Legacy bindings for BuddyPond v3 API
  //
  // Remark: BuddyPond v5 runs alongside the old buddy pond until all
  // code is migrated to the new API. This is a temporary solution.
  // Everything in BuddyPond v5 is *much* more modular and easier to use.
  bp.setConfig({
    host: _host
  });

  bp.on('auth::logout', 'old-bp-logout', function () {
    $('.loggedIn').flexHide();

    $('.loggedOut').flexShow();
    //$('.loggedOut').addClass('show');
    bp.apps.client.api.logout(function (err, data) {
      console.log('logout', err, data);
    });
  });

  bp.on('auth::qtoken', 'old-bp-login', function (qtoken) {
    buddypond.qtokenid = qtoken.qtokenid;
    bp.me = qtoken.me;
    $('.loggedIn').flexShow();
    //$('.loggedIn').addClass('show');
    $('.loggedOut').flexHide();

    $('#me_title').html('Welcome ' + bp.me);


  });


  // TODO: map the new API to the old API
  // chatWindowButtons should emit events
  await bp.start([{
    name: 'ui',
    parent: $('#desktop').get(0),
    window: {
      onFocus(window) {
        // console.log('custom onFocus window focused');

        // get all the legacy windows and check z-index to ensure
        // our window is +1 of the highest z-index
        let legacyWindows = $('.window');
        let highestZ = 0;
        let anyVisible = false;
        legacyWindows.each((i, el) => {
          let z = parseInt($(el).css('z-index'));
          if (z > highestZ) {
            highestZ = z;
          }
          if ($(el).is(':visible')) {
            anyVisible = true;
          }
        });
        // set the z-index of the current window to highestZ + 1
        if (legacyWindows.length > 0 && anyVisible) {
          console.log('legacyWindows', legacyWindows);
          console.log('highestZ', highestZ);
          console.log('setting window depth to', highestZ + 1);
          window.setDepth(highestZ + 1);
        }
      },
    },
  },
    'menubar',

  {
    name: 'client',
    config: {
      host: buddypond.endpoint,
      wsHost: _wsHost,
      api: _api
    }

  }, 'buddyscript', 'toastr', 'powerlevel', {
    name: 'buddylist',
    autocomplete: allCommands,
    // wil probably need the autocomplete fn handler
    // autocompleteOnSuggestion: fn, etc, will see
    chatWindowButtons: [{
      text: 'BuddySound',
      image: 'desktop/assets/images/icons/icon_soundrecorder_64.png',
      onclick: (ev) => {
        console.log('BuddySound button clicked', ev);
        let context = ev.target.dataset.context;
        let type = ev.target.dataset.type;
        JQDX.openWindow('soundrecorder', { type: type || 'buddy', context: context });
      }
    },
    {
      text: 'BuddyGif',
      image: 'desktop/assets/images/icons/icon_gifstudio_64.png',
      onclick: (ev) => {
        let context = ev.target.dataset.context;
        let type = ev.target.dataset.type;
        JQDX.openWindow('gifstudio', { type: type || 'buddy', context: context, output: type || 'buddy' });
      }
    },
    {
      text: 'BuddyPaint',
      image: 'desktop/assets/images/icons/icon_paint_64.png',
      onclick: (ev) => {
        let context = ev.target.dataset.context;
        let type = ev.target.dataset.type;
        JQDX.openWindow('paint', { type: type || 'buddy', output: type || 'buddy', context: context });
      }
    },
    {
      text: 'BuddySnap',
      image: 'desktop/assets/images/icons/svg/1f4f7.svg',
      onclick: (ev) => {
        let context = ev.target.dataset.context;
        let type = ev.target.dataset.type;
        desktop.ui.openWindow('mirror', { type: type || 'buddy', context: context, output: type || 'buddy' });
      }
    },
    {
      text: 'BuddyEmoji',
      image: 'desktop/assets/images/icons/svg/1f600.svg',
      className: 'emojiPicker',
      onclick: (ev) => {

        // focus on the .emojiPicker input
        $('.emojiPicker').focus();

        // we need to add class activeTextArea to the active textarea
        // so we can append the emoji to the correct textarea
        // remove the activeTextArea from all other textareas
        $('.activeTextArea').removeClass('activeTextArea');

        let messageControls = $(ev.target).closest('.aim-message-controls');
        // find the closest textarea to the ev.target
        $('.aim-input', messageControls).addClass('activeTextArea');



      }
    },
    {
      text: 'BuddyHelp',
      image: 'desktop/assets/images/icons/svg/1f9ae.svg',
      align: 'right',
      onclick: (ev) => {
        let win = $(ev.target).closest('.aim-window');
        let windowId = '#' + win.attr('id');
        //alert(windowId)
        desktop.commands.chat.help({ windowId: windowId });

      }
    }


    ]
  },
    'card'

  ]);

  // TODO: better load order here, make sure all legacy stuff binds before we open buddylist, etc
  await bp.load('motd');
  await bp.open('buddylist');

  await bp.importModule({
    name: 'desktop',
    parent: $('#desktop').get(0),
  });

  renderDesktopShortCuts();


  /*
  bp.apps.desktop.addShortCut({
    name: 'pond',
    icon: 'pond',
    label: 'Pond',
    class: 'pond'
  });
  */


  // bp.open('emulator');
  // bp.open('sampler');

  // map all the legacy desktop.commands to the new API
  for (let command in desktop.commands.chat) {
    bp.apps.buddyscript.addCommand(command, desktop.commands.chat[command]);
  }

  // extract commands from legacy desktop.v5_bridge.commandSet
  let legacyCommandSet = desktop.app.console._allowCommands;
  // legacyCommandSet.forEach((command) => {
  for (let commandName in legacyCommandSet) {
    let legacyCommand = legacyCommandSet[commandName];
    if (typeof legacyCommand.command === 'function') {
      bp.apps.buddyscript.addCommand(commandName, legacyCommand.command);
    }
    if (typeof legacyCommand.command === 'string') {
      bp.apps.buddyscript.addCommand(commandName, function (context) {
        console.log('eval cccccommand', commandName, legacyCommand.command);
        eval(legacyCommand.command);
      });
    }

  }
  //for (let command in desktop.v5_bridge.commandSet) {
  //console.log('ADDING COMMAND to buddyScript', command, desktop.v5_bridge.commandSet[command]);
  //bp.apps.buddyscript.addCommand(command.command, desktop.v5_bridge.commandSet[command]);
  //} 


  let selectMusicPlaylist = `
    <select name="selectPlaylist" class="selectPlaylist float_right">
    <option>Select music playlist...</option>
    <option value="1427128612">Buddy House 2 ( 10 Tracks )</option>
    <option value="1397493787">Buddy House 1 ( 10 Tracks )</option>
    <option value="1397230333">Buddy House 0 ( 33 Tracks )</option>
    <option value="942151069">Andrew Potthast: Bangas</option>
    <option value="938848927">Andrew Potthast: Burning Man Set</option>
    <option value="839091662">Featured Buddy: Andrew Potthast</option>
    <option value="1427279635">Featured Buddy: ioqpvs</option>
  </select>
  `;

  let selectTheme = `
  <select name="selectTheme" class="selectTheme float_right">
    <option value="Light">Light Theme</option>
    <option value="Dark">Dark Theme</option>
    <option value="Nyan">Nyan Theme</option>
    <option value="Hacker">Hacker Theme</option>
    <option value="Water">Water Theme</option>
    <option value="Customize">Customize Theme</option>
    <!--
  <option value="Customize">EPIC MODE ( my poor browser ) </option>
  <option value="Customize">Comic Theme</option> 
-->
  </select>

  `;

  let networkStatsStr = `
      <span class="totalConnected loggedIn">
        <span class="totalConnectedCount">0</span> Buddies Online</span>
        <span class="totalOnlineCount">0</span><!--Buddies Online--></span>
        <span class="desktopDisconnected loggedOut">Disconnected</span>
            
  `;

  let volumeStr = `
  <div class="volume">
  <span class="volumeIcon volumeToggle volumeFull">🔊</span>
  <span class="volumeIcon volumeToggle volumeMuted">🔇</span>
  
  <!-- <input type="range" min="0" max="100" value="100" class="volumeSlider"> -->
  </div>
  `;

  let clockStr = `
  <span class="" id="clock"></span>
`;



  let menuTemplate = [

    {
      label: '<span id="me_title" class="me_title">Welcome - You look nice today!</span>',
      submenu: [
        { label: 'We are stoked to be your Buddy', click: () => api.ui.toggleDeviceSettings() },

        {
          label: `
                <a class="editProfileLink" title="Login to Edit Profile" href="#">Edit Profile</a>

            `, click: () => api.ui.toggleDeviceSettings()
        },
        {
          label: `
                  <li class="loggedOut">
                    <span class="loginLink">Login</span>
                  </li>
                  <li class="loggedIn">
                    <span class="logoutLink">Logout</span>
                  </li>

                
                `, click: () => {
                  this.bp.apps.client.logout();
                  // close all chat windows and ponds
                  this.bp.apps.ui.windowManager.windows.forEach((window) => {
                    //console.log("window", window);
                    if (window.app === 'buddylist' && (window.type === 'buddy' || window.type === 'pond')) {
                      window.close();
                    }
                    if (window.app === 'pond') {
                      window.close();
                    }
                  });

                }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Full Screen', click: () => JQDX.openFullscreen($('body').get(0)) }, // legacy API
        {
          label: 'Hide All Windows', click: () => {

            // Legacy API
            desktop.ui.displayMode = 'min';
            // If any windows are visible, hide all.
            $('div.window').hide();

            // New API
            bp.apps.ui.windowManager.minimizeAllWindows();

          }
        },
        {
          label: 'Set Active Window to Wallpaper', disabled: true, click: () => {

            // legacy API
            if (!desktop.ui.wallpaperWindow) {
              desktop.ui.wallpaperWindow = true;
              desktop.ui.removeWindowWallpaper()
              desktop.ui.setActiveWindowAsWallpaper();
              $('.setWindowAsWallpaper').html('Remove Window as Wallpaper');
            } else {
              desktop.ui.wallpaperWindow = false;
              desktop.ui.removeWindowWallpaper();
              $('.setWindowAsWallpaper').html('Set Active Window to Wallpaper');
            }
            return false;


          }
        }
      ]
    },
    {
      label: selectMusicPlaylist,
      flex: 1
    },
    {
      label: selectTheme
    },

    {
      label: networkStatsStr
    },
    {
      label: volumeStr
    },

    {
      label: clockStr
    }

  ];

  const menuBar = bp.apps.menubar.createMenu(menuTemplate);
  // console.log(menuBar);
  document.body.appendChild(menuBar);



  $('.volumeToggle').on('click', function () {
    if (desktop.settings.audio_enabled) {
      desktop.set('audio_enabled', false);
    } else {
      desktop.set('audio_enabled', true);
    }
  });

  if (!desktop.settings.audio_enabled) {
    $('.volumeFull').hide();
    $('.volumeMuted').show();
  } else {
    $('.volumeFull').show();
    $('.volumeMuted').hide();
  }
  $('.logoutLink').on('click', function () {
    bp.apps.client.logout();
  });

  $('.loginLink').on('click', function () {
    bp.open('buddylist');
  });

  // TODO: move this to somewhere? its a UI widget scoped to the desktop itself ( nav bar )
  // TODO: add a logic section for handling navbar widgets ( click, conneciton status etc)
  $('.selectPlaylist').on('change', function () {
    $('#soundcloudiframe').remove();
    $('#soundcloudplayer').html('');
    if (desktop.app.soundcloud) {
      desktop.app.soundcloud.embeded = false;
    }
    desktop.ui.openWindow('soundcloud', { playlistID: $(this).val() });
  });

  $('.selectTheme').on('change', function () {
    let theme = $(this).val();
    if (theme === 'Customize') {
      desktop.ui.openWindow('profile', { context: 'themes' })
    } else {
      desktop.app.themes.applyTheme(desktop.app.themes.themes[theme]);
      desktop.set('active_theme', theme);
    }
  });



  desktop.setClock();
  bp.on('buddy::message::gotfiltered', 'show-toast-info', function (message) {
    // console.log('buddy-message-gotfiltered', message);

    // make toastr that stays for 5 seconds
    toastr.options.timeOut = 5000;

    toastr.info('Your message was filtered due to being at Power Level 1.');

    // desktop.ui.openWindow('buddy_message', { context: message });
  });


  desktop.on('window::dragstart', 'legacy-correct-window-z-index', function (event) {

    let windowId = event.windowId;
    let window = $(windowId);
    // console.log('windowwindowwindow', window)
    let newWindows = bp.apps.ui.windowManager.windows;
    // console.log('newWindows', newWindows);
    let newWindowsSorted = newWindows.sort((a, b) => {
      return a.z - b.z;
    });

    if (newWindowsSorted.length) {
      // set the z-index of windowId to the highest z-index + 1
      let highestZ = newWindowsSorted[newWindowsSorted.length - 1].z;
      // console.log('highestZ', highestZ);
      $(`${windowId}`).css('z-index', highestZ + 1);
      // console.log('focus windowId', windowId);

    }


  });
  // Legacy windows
  // we need the same logic for drag start and drag stop on 
  $(document).on('click', function (ev) {
    //  console.log('click', ev.target);
    // if target has class window or has parent with class window
    if ($(ev.target).closest('.window').length) {


      // we need to address the z-index / focus on this window
      let windowId = $(ev.target).closest('.window').attr('id');
      //console.log("current windowId", windowId);
      //console.log('current window zIndex', $(ev.target).css('z-index'));
      // we need to figure out the correct z-index to set this window
      // its not only the legacy BP windows now its also the new windows
      let newWindows = bp.apps.ui.windowManager.windows;
      // console.log('newWindows', newWindows);
      let newWindowsSorted = newWindows.sort((a, b) => {
        return a.z - b.z;
      });

      // set the z-index of windowId to the highest z-index + 1
      let highestZ = newWindowsSorted[newWindowsSorted.length - 1].z;
      //console.log('highestZ', highestZ);
      $(`#${windowId}`).css('z-index', highestZ + 1);
      //console.log('focus windowId', windowId);
    }
    // the event must bubble up to the document
    // so we can capture the window click event

    return true;
  });
}



function renderDesktopShortCuts() {

  $('.desktop-shortcuts-container').html('');

  for (let appName in desktop.settings.apps_installed) {
    let app = desktop.app.appstore.apps[appName];
    //desktop.ui.renderDesktopShortCut(appName, app);
    //console.log('renderDesktopShortCuts', appName, app);
    bp.apps.desktop.addShortCut({
      name: appName,
      icon: `desktop/assets/images/icons/icon_${appName}_64.png`,
      label: app.label || appName,
    }, {
      onClick: () => {
        bp.open(appName);
      }

    });


  }


  bp.apps.desktop.addShortCut({
    name: 'sampler',
    icon: `desktop/assets/images/icons/icon_midifighter_64.png`,
    label: 'Sampler',
  }, {
    onClick: () => {
      bp.open('sampler');
    }

  });



  desktop.ui.renderDesktopShortCut('merlin', {
    name: 'merlin', label: 'Merlin Automated Assistant'
  });

  /*
  desktop.ui.renderDesktopShortCut('download', {
    name: 'download',
    href: 'https://github.com/marak/buddypond',
    label: 'Download Buddy Pond',
    icon: 'drive'
  });
  */

  /*
  desktop.ui.renderDesktopShortCut('appstore', {
    name: 'appstore', label: 'App Store'
  });
  */

  /*
  desktop.ui.renderDesktopShortCut('login', {
    name: 'login', label: 'Login', icon: 'login', class: 'loginIcon loginShortcut'
  });

  desktop.ui.renderDesktopShortCut('logout', {
    name: 'logout', label: 'Logout', icon: 'login', class: 'loggedIn logoutShortcut'
  });
  */
  
  // TODO: Folders, make Desktop icons use Folder
  // TODO: Refactor shortcuts into File.js class
  // This way all Folders will have drag and drop and contain files
  // "shortcuts" will be files of a type ( like a symlink ), possibly not needed at all
  /*
  bp.apps.desktop.addFolder({
    name: 'Games',
    items: [
      'Mantra',
      'MineSweeper',
      'NES',
      'Solitaire'
    ]
  })
  */

  function arrangeDesktop() {
    if (bp.isMobile()) {
      bp.apps.desktop.arrangeShortcuts(4, {
        rowWidth: 256,
        rowHeight: 256
      })
    
    } else {
      bp.apps.desktop.arrangeShortcuts(3); // Arrange the icons in a grid of 4 columns
    } 
  
  }
  window.arrangeDesktop = arrangeDesktop;

  arrangeDesktop();
  $('.loggedIn').flexHide();
  
  // add window resize event to re-arraange shortcuts
  window.addEventListener('resize', function () {
    arrangeDesktop();
  });
  
  




  setTimeout(function () {
    desktop.ui.windowResizeEventHandler(null, true); // adjusts shortcut padding if needed
  }, 333)

}