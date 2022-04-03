desktop.app.buddylist = {};
desktop.app.buddylist.label = 'Buddy List';

desktop.app.buddylist.subscribedBuddies = [];

desktop.app.buddylist.positiveAffirmations = [
  'Hello. You like nice today.',
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
    $('#window_buddylist').css('height', '66vh');
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
      let form = $(ev.target).parent();
      let context = $('.buddy_message_to', form).val();
      JQDX.showWindow('mirror', { type: 'buddy', context: context });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('mousedown', '.insertBuddyPaint', function (ev) {
      let form = $(ev.target).parent();
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
      let form = $(ev.target).parent().parent();
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
      let form = $(ev.target).parent();
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
};

desktop.app.buddylist.sendMessage = function sendBuddyMessage (context) {
  let message = {};
  let form = $(context).parent();
  message.text = $('.buddy_message_text', form).val();
  message.to = $('.buddy_message_to', form).val();
  message.from = $('.buddy_message_from', form).val();

  if (message.text.trim() === '') {
    return;
  }

  // empty text area input
  $('.buddy_message_text', form).val('');
  $('.emoji-wysiwyg-editor').html('');

  const processed = desktop.commands.processInternalMessage(message, '#window_buddy_message_' + message.to);

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

function processIncomingBuddyRequests (data) {
  // process buddyrequests here so that automatons can perform actions on incoming buddyrequests ( auto-accept buddies )
  for (let buddy in data.buddyrequests) {
    let buddyrequest = data.buddyrequests[buddy];
    buddyrequest = JSON.parse(buddyrequest);
    if (buddyrequest.to === buddypond.me) {
      // incoming request to me
      desktop.emit('Buddy::IncomingBuddyRequest', buddyrequest);
    } else {
      // outgoing request to buddy
    }
  }
}

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

function openNewBuddyMessagesNow (data) {
  let buddylist = data.buddylist;
  Object.keys(buddylist).forEach(function (b) {
    let profile = buddylist[b];
    if (profile && profile.newMessages === true) {
      let buddyName = b.replace('buddies/', '');
      // TODO: move to newMessage event?
      desktop.ui.openWindow('buddylist', { context: buddyName });
    }
  });
}

function checkForIncomingVoiceCall (data) {
  let buddylist = data.buddylist;
  Object.keys(buddylist).forEach(function (b) {
    let profile = buddylist[b];
    if (profile && profile.isCalling === true) {
      let buddyName = b.replace('buddies/', '');
      desktop.app.buddylist.profileState.updates[b] = desktop.app.buddylist.profileState.updates[b] || {};
      desktop.app.buddylist.profileState.updates[b].isCalling = false;
      // TODO: add isOnCall flag? another icon?
      //.      needs separate event?
      desktop.app.videochat.startCall(false, buddyName, function (err, re) {
        // console.log('call has started', err, re)
      });
    }
  });
}

function renderBuddyListIfUpdated (data, renderBuddyListIfUpdated) {

  desktop.cache.buddyListDataCache = {};

  let buddies = Object.keys(data.buddylist);
  if (buddies.length > 0) {
    $('.you_have_no_buddies').hide();
  }
  // a buddy request counts as a buddy in UX ( for now )
  if (Object.keys(data.buddyrequests).length > 0) {
    $('.you_have_no_buddies').hide();
  }
  $('.loading').remove();
  if (buddies) {
    if (buddies.length === 0) {
      $('.buddylist').html('No buddies yet.');
    } else {
      $('.buddylist').html('');
      desktop.cache.buddyListDataCache = {};
      desktop.cache.buddyListDataCache[renderBuddyListIfUpdated] = true;

      //
      // SORT BUDDY LIST
      // we have buddies to render, let's sort them!
      //
      buddies = buddies.sort(function (a, b) {
        let profileA = data.buddylist[a];
        let profileB = data.buddylist[b];
        if (profileA.isConnected) {
          return -1;
        }
        if (profileB.isConnected) {
          return 1;
        }
        if (!profileA.ctime && !profileA.dtime) {
          return 1;
        }
        if (profileA.dtime && profileB.dtime) {
          if (new Date(profileA.dtime).getTime() > new Date(profileB.dtime).getTime()) {
            return -1;
          }
        }
        if (profileA.ctime && profileB.ctime) {
          if (new Date(profileA.ctime).getTime() < new Date(profileB.ctime).getTime()) {
            return -1;
          }
        }
        return 0;
      });
      //
      // END SORT BUDDY LIST
      //

      buddies.forEach(function (buddyKey) {
        let buddy = buddyKey.replace('buddies/', '');
        let profile = data.buddylist[buddyKey];

        let isConnected = '';
        if (profile && profile.isConnected) {
          isConnected = '<span>🟢</span>';
        } else {
          isConnected = '<span>🟠</span>';
        }

        // phone call icon next to buddy name
        let isCalling = '';
        if (profile && profile.isCalling) {
          isCalling = '<span>📞</span>';
        }

        // new messages chat icon next to buddy name
        let newMessages = '';
        if (profile && profile.newMessages) {
          newMessages = '<span>💬</span>';
        }
        /*
        if (desktop.app.videochat.loaded && profile && profile.isCalling) {
          openCallWindow(buddy, true);
        }
        */
        $('.buddylist').append('<li>' + newMessages + isConnected + isCalling + '<a class="messageBuddy rainbowLink" href="#">' + buddy + '</a></li>');
      });
      $('.apiResult').val(JSON.stringify(data, true, 2));
      // render buddy list
      $('.messageBuddy').on('click', function () {
        let position = {};
        position.my = position.my || 'left top';
        position.at = position.at || 'left+33 top+33';
        let context = $(this).html();

        // let windowKey = desktop.ui.openWindow('buddy_message', { context: context }, position);
        desktop.ui.openWindow('buddylist', { context: context });
        // desktop.app.buddylist.openWindow({ context: context});
        
        let windowId = '#window_buddy_message_' + context;
        if (!isMobile) {
          $('.buddy_message_text', windowId).focus();
        }
        $('.buddy_message_to', windowId).val(context);
        $('.buddy_message_from', windowId).val(buddypond.me);
      });
    }
  }
}

function renderBuddyRequests (data) {

  if (data.buddyrequests) {
    // desktop.cache.buddyListDataCache = {}
    // desktop.cache.buddyListDataCache[str] = true;
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

desktop.app.buddylist.updateBuddyList = function updateBuddyList () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function () {
      desktop.app.buddylist.updateBuddyList();
    }, 10);
    return;
  } else {
    //ex: let buddyProfile = { "Dave": { "newMessages": true } };
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

      // process incoming buddy list data for local profile and incoming notifications
      checkForNewStreamers(data);
      processIncomingBuddyRequests(data);
      updateLocalDesktopProfile(data);
      openNewBuddyMessagesNow(data);
      checkForIncomingVoiceCall(data);

      // notification checks have completed, check to see if we need to re-render the buddy list
      let serializedBuddyList = JSON.stringify(data);
      // the data used to generated the buddy list has not changed since the last update
      // since no data has changed, return here and do not re-render / continue rendering
      if (desktop.cache.buddyListDataCache[serializedBuddyList]) {
        // TODO: use key count for garbage collection and trim if size grows
        setTimeout(function () {
          desktop.app.buddylist.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }

      // there is new buddylist data since the last update, re-render the buddylist
      renderBuddyListIfUpdated(data, serializedBuddyList);

      // there are new buddy requests ( either incoming or outgoing ) since last update, re-render the buddy requests
      if (data.buddyrequests) {
        renderBuddyRequests(data);
      }

      // since new data has been rendered ensure that buddy list is showing
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

desktop.app.buddylist.processMessages = function processMessagesBuddylist (data, cb) {

  // console.log('desktop.app.buddylist.processMessages', data);
  //desktop.cache.buddyMessageCache[str] = true;
  let html = {};
  // TODO: this should apply per conversation, not global for all users
  data.messages.forEach(function (message) {
    // route message based on incoming type / format
    // default message.type is undefined and defaults to "text" type

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

    //
    // New messages are coming in from server, we'll need to render them
    //
    // Get all the open buddy_message windows
    // let openBuddyWindows = desktop.ui.openWindows['buddy_message'];
    // Find the specific window which is open for this buddy
    // let windowId = '#' + openBuddyWindows[buddyKey];
    let windowId = '#window_buddy_message_' + buddyKey;

    // accumulate all the message html so we can perform a single document write,
    // instead of a document write per message
    html[windowId] = html[windowId] || '';

    message.text = forbiddenNotes.filter(message.text);

    desktop.app.tts.processMessage(message);

    // replace cards
    
    let dataContext = message.from;
    if (message.from === buddypond.me) {
      dataContext = message.to;
    }
    
    if (message.card && message.card.type === 'snaps') {
      message.card.snapURL = desktop.origin + '/' + message.card.snapURL;
      let arr = message.card.snapURL.split('.');
      let ext = arr[arr.length -1];
      if (ext === 'gif') {
        $('.chat_messages', windowId).append(`
         <span class="message">
          <img class="remixGif" title="Remix in GIF Studio" data-output="buddy" data-context="${dataContext}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
          <img class="remixPaint" title="Remix in Paint" data-output="buddy" data-context="${dataContext}" src="desktop/assets/images/icons/icon_paint_64.png"/>
          <img id="${message.uuid}" class="snapsImage image" src="${message.card.snapURL}"/>
        </span>
        <br/>
        `);
      } else {
        $('.chat_messages', windowId).append(`
         <span class="message">
          <img class="remixGif" title="Remix in GIF Studio" data-output="buddy" data-context="${dataContext}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
          <img class="remixPaint" title="Remix this Paint" data-output="buddy" data-context="${dataContext}" src="desktop/assets/images/icons/icon_paint_64.png"/>
          <img id="${message.uuid}" class="paintsImage image" src="${message.card.snapURL}"/>
         </span>
         <br/>
        `);
      }
      // don't reply the large media cards ( asks server to ignores them on further getMessages calls)
      desktop.messages._processedCards.push(message.uuid);
      desktop.messages._processed.push(message.uuid);
      //return;
    }

    if (message.card && message.card.type === 'meme') {
      message.card.filename = desktop.origin + '/memes/' + message.card.filename;
      $('.chat_messages', windowId).append(`
         <span class="message">
           <strong>${message.card.title}</strong><br/><em>Levenshtein: ${message.card.levenshtein} Jaro Winkler: ${message.card.winkler}</em>
           <br/>
           <img class="remixGif" title="Remix in GIF Studio" data-output="buddy" data-context="${dataContext}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
           <img class="remixPaint" title="Remix in Paint" data-output="buddy" data-context="${dataContext}" src="desktop/assets/images/icons/icon_paint_64.png"/>
           <img class="card-meme image" src="${message.card.filename}"/>
         </span>
         <br/>
      `);
      desktop.messages._processed.push(message.uuid);
      return;
    }

    let str = '';
    let geoFlag = '';
    if (message.location) {
      if (message.location !== 'outer space') {
        geoFlag = `<img class="geoFlag" src="desktop/assets/geo-flags/flags/4x3/${message.location}.svg"/>`;
      }
    }

    if (message.from === buddypond.me) {
      str += '<span class="datetime">' + message.ctime + ' </span>' + geoFlag + message.from + ': <span class="message"></span><br/>';
    } else {
      str += '<span class="datetime">' + message.ctime + ' </span> <span class="purple">' + geoFlag + message.from + ': </span><span class="message purple"></span><br/>';
      let now = new Date().getTime();
      // TODO: better control of IM sounds, check ctime and only play fresh sounds
      if (now - desktop.app.buddylist.lastNotified > 3333) {
        desktop.app.notifications.notifyBuddy(`🐸 ${message.from}: ${message.text}`);
        desktop.app.buddylist.lastNotified = now;
      }
    }

    $('.chat_messages', windowId).append(`<div class="chatMessage">${str}</div>`);
    $('.message', windowId).last().text(message.text);

    if (message.card && message.card.type === 'audio') {
      message.card.soundURL = desktop.origin + '/' + message.card.soundURL;
      $('.message', windowId).last().append(`
        <strong><a href="#openSound" class="openSound" data-soundurl="${message.card.soundURL}">Play <img class="playSoundIcon" src="desktop/assets/images/icons/icon_soundrecorder_64.png"/></a></strong>
      `);
    }

    let currentlyDisplayedMessages = $('.chatMessage', windowId);
    // console.log('currentlyDisplayedMessages', windowId, currentlyDisplayedMessages.length)
    if (currentlyDisplayedMessages.length > 99) {
      currentlyDisplayedMessages.first().remove();
    }

    // take the clean text that was just rendered for the last message and check for special embed links
    desktop.smartlinks.replaceYoutubeLinks($('.message', windowId).last());

    desktop.messages._processed.push(message.uuid);
    //desktop.cache.buddyMessageCache[buddypond.me + '/' + buddyKey] = desktop.cache.buddyMessageCache[buddypond.me + '/' + buddyKey] || [];
    //desktop.cache.buddyMessageCache[buddypond.me + '/' + buddyKey].push(message.uuid);
  });

  //
  // All messages have been processed and HTML has been accumulated
  // Iterate through the generated HTML and write to the correct windows
  //
  for (let key in html) {
    $('.no_chat_messages', key).hide();
    try {
      if (data.messages.length > 0) {
        //      let el = $('.chat_messages', '.pond_message_main')
        setTimeout(function () {
          let el = $('.window_content', key);
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
    desktop.app.buddylist.profileState.updates['buddies/' + params.context] = desktop.app.buddylist.profileState.updates['buddies/' + params.context] || {};
    desktop.app.buddylist.profileState.updates['buddies/' + params.context].newMessages = false;

    if ($(windowId).length === 0) {
      desktop.app.buddylist.renderChatWindow(params.context);
      $('.window-context-title', windowId).html('Chat with ' + params.context);
      if (!isMobile) {
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
        JQDX.window_maximize(windowId);
      } else {
        $(windowId).css('width', '44vw');
        $(windowId).css('height', '66vh');
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
  desktop.app.buddylist.profileState.updates['buddies/' + context] = desktop.app.buddylist.profileState.updates['buddies/' + context] || {};
  desktop.app.buddylist.profileState.updates['buddies/' + context].newMessages = false;
};