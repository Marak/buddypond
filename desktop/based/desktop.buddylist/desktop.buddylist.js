desktop.app.buddylist = {};
desktop.app.buddylist.label = 'Buddies';

desktop.app.buddylist.setBuddy = function setBuddy (buddyName, updates) {
  desktop.app.buddylist.profileState.updates['buddies/' + buddyName] = desktop.app.buddylist.profileState.updates['buddies/' + buddyName] || {};
  for (let p in updates) {
    desktop.app.buddylist.profileState.updates['buddies/' + buddyName][p] = updates[p];
  }
};

/*
  TODO:
  // sets local profile property of me, which propigates to server
  desktop.app.buddylist.setProfile('hello my profile')
  // gets most recent me profile from local
  desktop.app.buddylist.getProfile('hello my profile')
  // sets local profile status to "Away", which propigates to server
  desktop.app.buddylist.setStatus('Away')
*/

desktop.app.buddylist.subscribedBuddies = [];

desktop.app.buddylist.positiveAffirmations = [
  'Hello. You look nice today.',
  'You are the most amazing person I know.',
  'Your presence just lights up the room.',
  'You are perfect as you are.',
  'I am blessed to have you in my life.',
  'You know, you are my 3 a.m. friend.',
  'You look stunning today.',
  'You have a smile that could melt an iceberg.',
  'Your strength of mind and character amazes me.',
  'Your fun and cheerful outlook on life are infectious.',
  'You have the biggest heart of anyone I know.',
  'Your smile melts my heart, and your laughter is irresistible.',
  'You bring out the best in me.',
  'I am eternally grateful for your friendship.',
  'You are unstoppable.',
  'I am a better person because of our friendship.',
  'I have learned so much from you.',
  'The world is a better place because of people like you.',
  'I wish I could be half as good as you.',
  'I am blown away by your awesome sense of style.',
  'I am proud of you.',
  'You have a solution to every problem.',
  'I wish I could be as tolerant, forgiving, and compassionate as you.',
  'I admire the way you carry yourself.',
  'You are the reason I am happy and doing well today.',
  'You have this great gift to put others at ease and make them feel comfortable.',
  'I cherish our time together.',
  'You are a great role model for others.',
  'You are a true friend and I am grateful for your friendship.',
  'You have been there for me always. Now, I am right here to help you get through this.',
  'You are the kind of friend everyone should have.',
  'You have a heart of gold.',
  'You are a fighter. I admire how you never give up.',
  'Thank you for being my best friend.',
  'I sleep easy knowing that you are in my corner.',
  'I believe in you.'
];

buddypond.memePath = 'https://memes.buddypond.com/';
if (buddypond.mode === 'dev') {
  buddypond.memePath = window.origin;
}

desktop.app.buddylist.load = function desktopLoadBuddyList (params, next) {

  desktop.load.remoteAssets([
    'desktop/assets/js/emojipicker.js',
    'buddylist' // this loads the sibling desktop.app.buddylist.html file into <div id="window_buddylist"></div>
  ], function (err) {
    const emojiTriggers = [
      {
        selector: '.emojiPicker',
        insertInto: '.activeTextArea'
      }
    ];

    $('#window_buddylist').css('width', '15vw');
    $('#window_buddylist').css('height', '75vh');
    $('#window_buddylist').css('top', '9vh');
    $('#window_buddylist').css('left', '77vw');

    function updatePositiveAffirmation () {
      let key = desktop.app.buddylist.positiveAffirmations[Math.floor(Math.random() * desktop.app.buddylist.positiveAffirmations.length)];
      $('.positiveAffirmation').html(key);
    }

    // update the positive affirmation on an interval
    setInterval(function () {
      $('.positiveAffirmation').fadeOut({
        duration: 4444,
        complete: function () {
          updatePositiveAffirmation();
          $('.positiveAffirmation').fadeIn({
            duration: 4444,
            complete: function () {}
          });
        }
      });
    }, 199800); // 3 minutes, 33 seconds

    $('.positiveAffirmation').on('click', function () {
      updatePositiveAffirmation();
    });

    $('.sendMessageForm').on('submit', function () {
      return false;
    });

    $('.addBuddyForm').on('submit', function () {
      return false;
    });

    $('.sendBuddyRequest').on('click', function () {
      $('.you_have_no_buddies').html('Buddy Request Sent!');
      let buddyName = $('.buddy_request_name').val() || $(this).html();
      if (!buddyName) {
        $('.buddy_request_name').addClass('error');
        return;
      }
      $('.buddy_request_name').removeClass('error');
      $('.buddy_request_name').val('');
      $('.pendingOutgoingBuddyRequests').append('<li>' + buddyName + '</li>');
      desktop.log('buddypond.addBuddy ->', buddyName);
      buddypond.addBuddy(buddyName, function (err, data) {
        if (!data.success) {
          alert(data.message);
        }
        desktop.log('buddypond.addBuddy <-', data);
      });
    });

    $('.inviteBuddy').on('click', function () {
      let randomInviteMessages = [
        `Miss AOL Instant Messenger? I'm "${buddypond.me}" on https://buddypond.com`,
        `I have officially migrated to the cloud. You can message me at "${buddypond.me}" on https://buddypond.com`
      ];
      let inviteMessage = randomInviteMessages[Math.floor(Math.random() * randomInviteMessages.length)];
      window.open(`https://twitter.com/intent/tweet?url=${inviteMessage}`);
      return false;
    });

    $('.buddyListHolder').hide();
    $('#buddyname').focus();

    $('.buddy_message_text').keyup(function (e) {
      if (e.shiftKey==1) {
        return false;
      }
      if (e.keyCode == 13) {
        $(this).trigger('enterKey');
        return false;
      }
    });

    let d = $(document);

    d.on('mousedown', '.messageBuddy',  function () {
      let position = {};
      position.my = position.my || 'left top';
      position.at = position.at || 'left+33 top+33';
      let context = $(this).parent().data('buddy');
      desktop.ui.openWindow('buddylist', { context: context });
      let windowId = '#window_buddy_message_' + context;
      if (desktop.ui.view === 'Mobile') {
        $('.buddy_message_text', windowId).focus();
      }
      $('.buddy_message_to', windowId).val(context);
      $('.buddy_message_from', windowId).val(buddypond.me);
    });

    d.on('mousedown', '.buddy_emoji_picker', function (ev) {
      let holder = $(ev.target).parent().parent();
      let textarea = $('.buddy_message_text', holder);
      $('.activeTextArea').removeClass('activeTextArea');
      $(textarea).addClass('activeTextArea');
      $('.buddy_message_text', holder).focus();
    });

    d.keypress(function (ev) {
      if (ev.which === 13) {
        if ($(ev.target).hasClass('buddy_message_text')) {
          desktop.app.buddylist.sendMessage($(ev.target));
          return false;
        }
      }
    });

    // cancel all form submits ( or entire page will redirect )
    d.on('submit', '.buddy_send_message_form', function () {
      return false;
    });

    d.on('mousedown', '.sendBuddyMessage', function (ev) {
      desktop.app.buddylist.sendMessage(this);
      return false;
    });

    d.on('mousedown', '.insertBuddySnap', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let context = $('.buddy_message_to', form).val();
      desktop.ui.openWindow('mirror', { type: 'buddy', context: context });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('mousedown', '.insertBuddyPaint', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let context, output;
      output = 'buddy';
      context = $('.buddy_message_to', form).val();
      JQDX.openWindow('paint', { 
        output: output,
        context: context
      });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('mousedown', '.insertBuddyGif', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let context, output;
      output = 'buddy';
      context = $('.buddy_message_to', form).val();
      JQDX.openWindow('gifstudio', { 
        output: output,
        context: context
      });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('mousedown', '.insertBuddySound', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let to;
      to = $('.buddy_message_to', form).val();
      JQDX.openWindow('soundrecorder', { type: 'buddy', context: to });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('click', '.purple:not(.message)', function () {
      const parent = $(this).parents('.window.buddy_message');
      const textBox = parent.find('textarea[name="buddy_message_text"]');
      parent.find('textarea[name="buddy_message_text"]').val(
        `${textBox.val()}@${$(this).text().split(':')[0]}`
      );
    });

    try {
      new EmojiPicker({
        trigger: emojiTriggers,
        closeButton: true,
        //specialButtons: green
      });
    } catch (err) {
      console.log('Warning: EmojiPicker was not ready. This should not happen', err);
    }
    next();
  });

};

desktop.app.buddylist.renderChatWindow = function (context) {
  let clone = $('#window_buddy_message_0').html();
  let dockItemClone = $('#icon_dock_buddy_message_0').html();

  let window_id = 'window_buddy_message_' + context;
  let _clone = clone.replace('icon_dock_buddy_message_0', 'icon_dock_buddy_message_' + context);
  _clone = _clone.replace('buddy_message_text_0', 'buddy_message_text_' + context);
  _clone = _clone.replace('emoji_picker_0', 'buddy_emoji_picker');

  let buddyChatStr = '<div id="' + window_id + '" class="abs window buddy_message"  data-app="buddylist" data-type="buddy_message" data-context="' + context + '">' + _clone + '</div>';
  $('#desktop').append(buddyChatStr);
  let dockStr = dockItemClone.replace('window_buddy_message_0', 'window_buddy_message_' + context);
  dockStr = '<li id="icon_dock_buddy_message_' + context +'">' + dockStr + '</li>';
  $('#dock').append(dockStr);
  desktop.ui.renderDockElement('buddy_message_' + context, context);

  let localBuddyChatCommands = Object.keys(desktop.app.console._allowCommands).map(function(a){ return '/' + a });
  let remoteBuddyChatCommands = Object.keys(desktop.app.console._allowCommands).map(function(a){ return '\\' + a });
  let allCommands = localBuddyChatCommands.concat(remoteBuddyChatCommands);
  $( ".buddy_message_text", '#' + window_id ).autocomplete({
   source: allCommands,
   search: function( event, ui ) {
     // only trigger autocomplete searches if user has started message with oper code ( / or \ )
     let opers = ['/', '\\'];
     let firstChar = event.target.value.substr(0, 1);
     if (opers.indexOf(firstChar) === -1) {
       return false;
     }
     return true;
   }
  });

};

desktop.app.buddylist.sendMessage = function sendBuddyMessage (context) {
  let message = {};
  let form = $(context).parent();
  message.text = $('.buddy_message_text', form).val();
  message.to = $('.buddy_message_to', form).val();
  message.from = $('.buddy_message_from', form).val();
  message.type = 'buddy';

  if (message.text.trim() === '') {
    return;
  }

  // empty text area input
  $('.buddy_message_text', form).val('');
  $('.emoji-wysiwyg-editor').html('');

  const processed = desktop.commands.preProcessMessage(message, '#window_buddy_message_' + message.to);

  if (processed) {
    return;
  }

  // desktop.log(`${message.from} sent message to ${message.to}`);

  buddypond.sendMessage(message.to, message.text, function (err, data) {
    // console.log('buddypond.sendMessage', err, data)
    // Remark: This will check for local user text commands such as /quit
    //         These are done *after* the message is sent to the server to ensure,
    //         that the message is sent before buddy logs out
    desktop.commands.postProcessMessage(message);
  });
  return false;
};

desktop.app.buddylist.profileState = {
  'updates': {
    /*
    "buddies/Tara": {
      "newMessages":false,
      "isAwesome":true
    },
    "buddies/Larry": {
      "newMessages":false
    }
    */
  }
};

function updateLocalDesktopProfile (data) {

  $('.me').html(buddypond.me);

  // initial profile set
  if (!buddypond.email && data.email && $('.buddy_email').val() === '') {
    buddypond.email = data.email;
    $('.buddy_email').val(data.email);
  }

  $('.totalConnectedCount').html(data.system.totalIsConnected);
  if (data.myProfile) {
    // Remark: this cache is cleared each time the user clicks "Update Profile"
    desktop.app.profileCache = desktop.app.profileCache || {};
    if (!desktop.app.profileCache[data.myProfile]) {
      $('.publicProfilePreview').text(data.myProfile);
      $('.profileMarkdown').val(data.myProfile);
      desktop.app.profileCache[data.myProfile] = true;
    } else {
      // do nothing, do not re-render the same text twice
    }
  }
  desktop.app.buddylist.profileState = { updates: {} };
}

function renderBuddyRequests (data) {

  $('.you_have_no_buddies').hide();

  if (data.buddyrequests) {

    $('.pendingIncomingBuddyRequests').html('');
    $('.pendingOutgoingBuddyRequests').html('');
    $('.loading').remove();

    for (let buddy in data.buddyrequests) {
      let buddyrequest = data.buddyrequests[buddy];
      buddyrequest = JSON.parse(buddyrequest);
      // TODO: top list is buddies, button list is requests ( with buttons )
      if (buddyrequest.to === buddypond.me) {
        $('.pendingIncomingBuddyRequests').append('<li>' + buddyrequest.from + ' - <a href="#" class="approveBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Approve</a> / <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Remove</a> </li>');
      } else {
        $('.pendingOutgoingBuddyRequests').append('<li>' + buddyrequest.to + ' - <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.to +'">Remove</a></li>');
      }
    }

    $('.apiResult').val(JSON.stringify(data, true, 2));

    desktop.app.buddylist.pendingIncomingBuddyRequests = desktop.app.buddylist.pendingIncomingBuddyRequests || 0;

    let totalIncomingBuddyRequests = $('.pendingIncomingBuddyRequests li').length;

    if (totalIncomingBuddyRequests > desktop.app.buddylist.pendingIncomingBuddyRequests) {
      desktop.app.buddylist.pendingIncomingBuddyRequests = totalIncomingBuddyRequests;

      // Remark: short delay is used here to provide nice login experience if Buddy has requests
      //         allows WELCOME sound to play
      //         A better solution here is to here priority option for playing sound with queue
      setTimeout(function () {
        desktop.play('YOUVEGOTMAIL.wav');
      }, 2222);
    }

    if (totalIncomingBuddyRequests === 0) {
      $('.pendingIncomingBuddyRequestsHolder').hide();
    } else {
      $('.pendingIncomingBuddyRequestsHolder').show();
    }

    if ($('.pendingOutgoingBuddyRequests li').length == 0) {
      $('.pendingOutgoingBuddyRequestsHolder').hide();
    } else {
      $('.pendingOutgoingBuddyRequestsHolder').show();
    }

    // TODO: remove links in real-time from client for approve / deny ( no lags or double clicks )
    //  '.pendingIncomingBuddyRequests'
    $('.denyBuddyRequest').on('click', function () {
      $(this).parent().hide();
      buddypond.denyBuddy($(this).attr('data-buddyname'), function (err, data) {
        $('.apiResult').val(JSON.stringify(data, true, 2));
      });
      return false;
    });

    $('.approveBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function () {
      $(this).parent().hide();
      let buddyName = $(this).attr('data-buddyname');
      buddypond.approveBuddy(buddyName, function (err, data) {
        $('.apiResult').val(JSON.stringify(data, true, 2));
      });
      return false;
    });
  }

}

// move to streamsquad EE
function checkForNewStreamers (data) {
  // check MOTM to see if a new streamer has come online
  if (data.system && data.system.motm && data.system.motm.streaming) {
    // get the first streamer out of the array ( for now )
    let streamer = data.system.motm.streaming;
    if (Object.keys(streamer).length > 1) {
      desktop.emit('streamer-is-online', streamer);
    } else {
      desktop.emit('streamer-is-offline');
    }
  }
}

function renderOrUpdateBuddyInBuddyList (data) {
  let buddyname = data.name;
  let buddydata = data.buddydata;

  let connectedStatusIcon = '🟠';
  if (buddydata.isConnected) {
    connectedStatusIcon = '🟢';
  }

  // phone call icon next to buddy name
  let isCalling = '';
  if (buddydata && buddydata.isCalling) {
    isCalling = '<span>📞</span>';
  }

  // new messages chat icon next to buddy name
  let newMessages = '';
  if (buddydata && buddydata.newMessages) {
    newMessages = '<span>💬</span>';
  }

  // see if this buddy is already rendered
  let exists = false;
  $('.buddylist li').each(function(i, e){
    if ($(e).data('buddy') === buddyname) {
      exists = e;
    }
  });

  if (exists) {
    // for now
    $(exists).remove();
  }

  let buddyListItem = `<li data-buddy="${buddyname}"><span>${newMessages}${connectedStatusIcon}${isCalling}</span> <a class="messageBuddy" href="#">${buddyname}</a></li>`;
  if (buddydata.isConnected) {
    $('.buddylist').prepend(buddyListItem);
  } else {
    $('.buddylist').append(buddyListItem);
  }

}

desktop.on('profile::buddy::in', 'render-buddy-on-buddylist', function(data){
  // TODO: renderer should be smart enough to find if exists and update, or create new
  renderOrUpdateBuddyInBuddyList(data);
  desktop.play('BUDDY-IN.wav');
})

desktop.on('profile::buddy::out', 'render-buddy-out-buddylist', function(data){
  renderOrUpdateBuddyInBuddyList(data);
  if (data.wasOnline) {
    desktop.play('BUDDY-OUT.wav');
  }
});

desktop.on('profile::buddy::newmessage', 'open-message-window', function(data){
  desktop.ui.openWindow('buddylist', { context: data.name });
});

// TODO: move to video chat app
desktop.on('profile::buddy::calling', 'open-call-window', function(data){
  desktop.app.videochat.startCall(false, data.name, function (err, re) {
    // console.log('call has started', err, re)
  });
});

desktop.app.buddylist.updateBuddyList = function updateBuddyList () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function () {
      desktop.app.buddylist.updateBuddyList();
    }, 10);
    return;
  } else {
    /*
    
      When performing the outgoing request to fetch buddylist updates,
      also send the current local buddylist.profileState ( of me ) to push updates
    
      This allows modification of desktop.app.buddylist.profileState scope locally,
      which will then be sent to the server and propipigate to your buddies

    */
    buddypond.getBuddyProfile(desktop.app.buddylist.profileState, function (err, data) {
      if (err || typeof data !== 'object') {
        desktop.log(err);
        // TODO: show disconnect error in UX
        setTimeout(function () {
          desktop.app.buddylist.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER); // TODO: expotential backoff algo
        return;
      }

      desktop.buddyListData = data;
      checkForNewStreamers(data);
      updateLocalDesktopProfile(data);

      desktop.buddylist = desktop.buddylist || {};

      if (data.buddylist) {
        // incoming buddy list, see if it is diff
        for (let b in data.buddylist) {
          
          let incoming = data.buddylist[b];
          let buddyName = b.replace('buddies/', '');
          
          // emit new messages event
          if (incoming && incoming.newMessages) {
            desktop.emit('profile::buddy::newmessage', {
              name: buddyName
            });
          }

          if (incoming && incoming.isCalling) {
            desktop.emit('profile::buddy::calling', {
              name: buddyName
            });
          }

          // the desktop has not seen this buddy yet, render it
          if (!desktop.buddylist[b]) {
            if (data.buddylist[b].isConnected) {
              desktop.emit('profile::buddy::in', {
                name: buddyName,
                buddydata: data.buddylist[b]
              });
            } else {
              desktop.emit('profile::buddy::out', {
                name: buddyName,
                buddydata: data.buddylist[b],
                wasOnline: false
              });
            }
            desktop.buddylist[b] = data.buddylist[b];
          } else {
            // check for diff in profile, if incoming profile fresh, re-render in buddylist
            let prev = desktop.buddylist[b];
            let buddyName = b.replace('buddies/', '');
            if (JSON.stringify(prev) !== JSON.stringify(incoming)) {
              /*
              console.log('diff detected')
              console.log('prev', prev);
              console.log('incoming', incoming);
              */
              if (incoming.isConnected) {
                if (incoming.isConnected !== prev.isConnected) {
                  desktop.emit('profile::buddy::in', {
                    name: buddyName,
                    buddydata: incoming
                  });
                }
              } else {
                desktop.emit('profile::buddy::out', {
                  name: buddyName,
                  buddydata: incoming,
                  wasOnline: true
                });
              }
              desktop.buddylist[b] = incoming;
            }
          }
        }
      }

      // there are new buddy requests ( either incoming or outgoing ) since last update, re-render the buddy requests
      if (data.buddyrequests) {
        let prev = desktop.buddyrequests;
        let incoming = data.buddyrequests;
        if (JSON.stringify(prev) !== JSON.stringify(incoming)) {
          renderBuddyRequests(data);
          desktop.buddyrequests = data.buddyrequests;
        }
      }

      // since new data has been rendered ensure that buddy list is showing
      // TODO: can we remove these hide() / show() statements?
      $('.loggedIn').show();
      $('.buddy_list_not_connected').hide();
      // TODO: move this to buddy pond scope
      $('.buddy_pond_not_connected').hide();
      $('.buddyListHolder').show();

      setTimeout(function () {
        desktop.app.buddylist.updateBuddyList();
      }, desktop.DEFAULT_AJAX_TIMER);
    });
  }

};

desktop.app.buddylist.lastNotified = 0;

// TODO: replace with EE
desktop.app.buddylist.processMessages = function processMessagesBuddylist (data, cb) {

  // console.log('desktop.app.buddylist.processMessages', data);
  let html = {};

  data.messages.forEach(function (message) {

    if (message.type === 'pond') {
      return;
    }

    let buddyKey = message.from;
    if (buddyKey === buddypond.me) {
      buddyKey = message.to;
    }

    // first, check if this is an Agent message which gets processed first
    if (message.type === 'agent') {
      if (desktop.app.spellbook[message.text]) {
        desktop.app.spellbook[message.text]();
        return;
      }
    }

    let windowId = '#window_buddy_message_' + buddyKey;
    html[windowId] = html[windowId] || '';
    desktop.app.messages.renderChatMessage(message, windowId);
    desktop.messages._processed.push(message.uuid);
  });

  for (let key in html) {
    $('.no_chat_messages', key).hide();
    try {
      if (data.messages.length > 0) {
        //      let el = $('.chat_messages', '.pond_message_main')
        setTimeout(function () {
          let el = $('.buddy_message_main', key);
          $(el).scrollTop(999999);
        }, 1111);
      }
    } catch (err) {
      console.log('Waring: Was unable to scrollTop on pond messages', err);
    }
  }

  cb(null, true);
};

desktop.app.buddylist.openWindow = function (params) {

  params = params || {};
  if (params.context) {
    // for buddy chat windows, if there is a context we will want to create a new window instance

    let windowId = '#window_buddy_message_' + params.context;

    // check to see if window already exists, if so do not re-render
    // Remark: In the future, we shouldn't have to make this check as it will be expected window is always removed
    if (desktop.app.buddylist.subscribedBuddies.indexOf(params.context) === -1) {
      desktop.app.buddylist.subscribedBuddies.push(params.context);
    }

    // Ensures that notifications are marked as read on the client ( dont want spamming popups after close )
    desktop.app.buddylist.setBuddy(params.context, { newMessages: false })

    if ($(windowId).length === 0) {
      desktop.app.buddylist.renderChatWindow(params.context);
      $('.window-context-title', windowId).html('Chat with ' + params.context);
      if (desktop.ui.view === 'Mobile') {
        $('.buddy_message_text', windowId).focus();
      }
      $('.buddy_message_to', windowId).val(params.context);
      $('.buddy_message_from', windowId).val(buddypond.me);

      $(windowId).css('left', '30vw');

      if (params.context === 'Paint') {
        $('.buddy_message_text', windowId).hide();
        $('.buddy_emoji_picker', windowId).hide();
        $('.insertSound', windowId).hide();
        $('.insertSnap', windowId).hide();
      } else {
        $('.buddy_message_text', windowId).show();
        $('.buddy_emoji_picker', windowId).show();
        $('.insertSound', windowId).show();
        $('.insertSnap', windowId).show();
      }

      if (desktop.ui.view === 'Mobile') {
        JQDX.window_maximize($(windowId));
      } else {
        $(windowId).css('width', '44vw');
        $(windowId).css('height', '72vh');
        $(windowId).css('top', '9vh');
        $(windowId).css('left', '30vw');
        // flatten other windows, show that window as active top stack
        JQDX.window_flat();
        $(windowId).addClass('window_stack').show();
      }
    }

    return;
  }

};

desktop.app.buddylist.closeWindow = function (params) {
  // if instance window, we'll want to remove it from DOM
  // this is so we don't get many shadow windows with render HTML hidden in DOM not being used

  // Remark: This is currently commented out due to message cache invalidation
  //         We will need to invalidate the message cache for this buddy_message context,
  //         so then when / if it is re-opened it will re-load messages
  //$('#window_buddy_message_' + params.context).remove();
  if (params.context) {
    let index = desktop.app.buddylist.subscribedBuddies.indexOf(params.context);
    desktop.app.buddylist.subscribedBuddies.splice(index, 1);
  }
};

//
// desktop.app.buddylist.onWindowOpen() is called when a desktop.ui.openWindow() instances opens
//
desktop.app.buddylist.onWindowOpen = function (windowId, context) {
  // Remark: this will switch context when new window opens during existing conversation
  //         could be considered either good or bad UX behavior
  //         current decisions is to have user bring attention to the new conversation immediately
  //         this way receiving user will immediately make context
  ///        switch decision ( respond to new window or switch back to original )
  $('.buddy_message_text', windowId).focus();
  $('.buddy_message_to', windowId).val(context);
  $('.buddy_message_from', windowId).val(buddypond.me);

  // Ensures that notifications are marked as read on the client ( dont want spamming popups after close )
  desktop.app.buddylist.setBuddy(context, { newMessages: false })
};