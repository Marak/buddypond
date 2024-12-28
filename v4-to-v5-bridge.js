window.bp_v_5 = async function bp_v_5() {
    let localBuddyChatCommands = Object.keys(desktop.app.console._allowCommands).map(function (a) { return '/' + a });
    let remoteBuddyChatCommands = Object.keys(desktop.app.console._allowCommands).map(function (a) { return '\\' + a });
    let allCommands = localBuddyChatCommands.concat(remoteBuddyChatCommands);
    console.log('allCommands', allCommands);
    
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
    
    
    bp.on('auth::qtoken', 'old-bp-login', function () {
      $('.loggedIn').show();
      $('.loggedOut').hide();
    });
    // TODO: map the new API to the old API
    // chatWindowButtons should emit events
    await bp.start([{
      name: 'ui',
      parent: $('#desktop').get(0),
      window: {
        onFocus(window) {
          console.log('window focused');
    
          // get all the legacy windows and check z-index to ensure
          // our window is +1 of the highest z-index
          let legacyWindows = $('.window');
          let highestZ = 0;
          legacyWindows.each((i, el) => {
            let z = parseInt($(el).css('z-index'));
            if (z > highestZ) {
              highestZ = z;
            }
          });
          console.log('highestZ', highestZ);
          console.log('setting window depth to', highestZ + 1);
          // set the z-index of the current window to highestZ + 1
          window.setDepth(highestZ + 1);
    
    
        },
      },
    }, {
      name: 'client',
      config: {
        host: _host,
        wsHost: _wsHost
    }
    
    }, 'buddyscript', 'emoji-picker', 'toastr', 'powerlevel', {
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
    }]);
    bp.open('buddylist');
    
    // map all the legacy desktop.commands to the new API
    for (let command in desktop.commands.chat) {
      console.log('ADDING COMMAND to buddyScript', command, desktop.commands.chat[command]);
      bp.apps.buddyscript.addCommand(command, desktop.commands.chat[command]);
    }
    
    
    bp.on('buddy::message::gotfiltered', 'show-toast-info', function (message) {
      console.log('buddy-message-gotfiltered', message);
    
      // make toastr that stays for 5 seconds
      toastr.options.timeOut = 5000;
    
      toastr.info('Your message was filtered due to being at Power Level 1.');
    
      // desktop.ui.openWindow('buddy_message', { context: message });
    });
    
    
    desktop.on('window::dragstart', 'legacy-correct-window-z-index', function(event){
    
      let windowId = event.windowId;
      let window = $(windowId);
    
      let newWindows = bp.apps.ui.windowManager.windows;
        console.log('newWindows', newWindows);
        let newWindowsSorted = newWindows.sort((a, b) => {
          return a.z - b.z;
        });
    
        // set the z-index of windowId to the highest z-index + 1
        let highestZ = newWindowsSorted[newWindowsSorted.length - 1].z;
        console.log('highestZ', highestZ);
        $(`${windowId}`).css('z-index', highestZ + 1);
        console.log('focus windowId', windowId);
    
    
    });
    // Legacy windows
    // we need the same logic for drag start and drag stop on 
    $(document).on('click', function (ev) {
      console.log('click', ev.target);
      // if target has class window or has parent with class window
      if ($(ev.target).closest('.window').length) {
        // we need to address the z-index / focus on this window
        let windowId = $(ev.target).closest('.window').attr('id');
        console.log("current windowId", windowId);
        console.log('current window zIndex', $(ev.target).css('z-index'));
        // we need to figure out the correct z-index to set this window
        // its not only the legacy BP windows now its also the new windows
        let newWindows = bp.apps.ui.windowManager.windows;
        console.log('newWindows', newWindows);
        let newWindowsSorted = newWindows.sort((a, b) => {
          return a.z - b.z;
        });
    
        // set the z-index of windowId to the highest z-index + 1
        let highestZ = newWindowsSorted[newWindowsSorted.length - 1].z;
        console.log('highestZ', highestZ);
        $(`#${windowId}`).css('z-index', highestZ + 1);
        console.log('focus windowId', windowId);
      }
    });
}