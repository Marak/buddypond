desktop.buddylist = {};

desktop.buddylist.load = function desktopLoadBuddyList () {

  desktop.log('Loading:', 'App.buddylist');

  // clone window_buddy_message_0 ten times
  // clone icon_dock_buddy_message_0 ten times 
  // this creates 10 windows available for chatting with buddies
  let clone = $('#window_buddy_message_0').html();
  let dockItemClone = $('#icon_dock_buddy_message_0').html();
  let emojiTriggers = [];
  emojiTriggers.push({
    selector: '.emoji_picker_10',
    insertInto: '.buddy_message_text_10'
  });
  for (let i = 1; i<11; i++) {
    emojiTriggers.push({
      selector: '.emoji_picker_' + i,
      insertInto: '.buddy_message_text_' + i
    });
    let window_id = 'window_buddy_message_' + i;
    let _clone = clone.replace('icon_dock_buddy_message_0', 'icon_dock_buddy_message_' + i);
    _clone = _clone.replace('buddy_message_text_0', 'buddy_message_text_' + i);
    _clone = _clone.replace('emoji_picker_0', 'emoji_picker_' + i);
    let buddyChatStr = '<div id="' + window_id + '" class="abs window buddy_message" data-window-index="' + i + '" data-window-type="buddy_message">' + _clone + '</div>'
    // console.log('appending', buddyChatStr)
    $('#desktop').append(buddyChatStr);
    let dockStr = dockItemClone.replace('window_buddy_message_0', 'window_buddy_message_' + i)
    dockStr = '<li id="icon_dock_buddy_message_' + i +'">' + dockStr + '</li>'
    $('#dock').append(dockStr);
    // register these new elements into the windowPool
    // these ids are used later when desktop.openWindow('buddy_message') is called
    desktop.windowPool['buddy_message'].push(window_id)
  }

  $('#window_buddylist').css('width', 220);
  $('#window_buddylist').css('height', 440);
  $('#window_buddylist').css('left', 666);
  $('#window_buddylist').css('top', 66);

  $('.sendMessageForm').on('submit', function(){
    return false;
  })

  $('.sendBuddyMessage').on('click', function(){
    desktop.buddylist.sendMessage(this);
    return false;
  });

  $('.sendBuddyRequest').on('click', function(){
    $('.you_have_no_buddies').html('Buddy Request Sent!');
    var buddyName = $('.buddy_request_name').val() || $(this).html();
    if (!buddyName) {
      $('.buddy_request_name').addClass('error')
      return;
    }
    $('.buddy_request_name').removeClass('error')
    $('.buddy_request_name').val('');
    $('.pendingOutgoingBuddyRequests').append('<li>' + buddyName + '</li>')
    desktop.log('buddypond.addBuddy ->', buddyName)
    buddypond.addBuddy(buddyName, function(err, data){
      if (!data.success) {
        alert(data.message);
      }
      desktop.log('buddypond.addBuddy <-', data)
    });
  });

  $('.inviteBuddy').on('click', function(){
    alert('TODO: Add Import Buddies from Twitter feature');
    return false;
  });

  $('.buddyListHolder').hide();
  $('#buddyname').focus();

  $('.buddy_message_text').bind("enterKey",function(e){
    desktop.buddylist.sendMessage(this);
    return false;
  });

  $('.buddy_message_text').keyup(function(e){
      if (e.shiftKey==1) {
        return false;
      }
      if (e.keyCode == 13) {
        $(this).trigger("enterKey");
        return false;
      }
  });

  new EmojiPicker({
      trigger: emojiTriggers,
      closeButton: true,
      //specialButtons: green
  });

}

desktop.buddylist.sendMessage = function sendBuddyMessage (context) {
  let message = {};
  var form = $(context).parent();
  message.text = $('.buddy_message_text', form).val();
  message.to = $('.buddy_message_to', form).val();
  message.from = $('.buddy_message_from', form).val();

  if (message.text.trim() === "") {
    return;
  }

  // TODO: have console display more info about event
  $('.console').val(JSON.stringify(message, true, 2));

  // empty text area input
  $('.buddy_message_text', form).val('');
  $('.emoji-wysiwyg-editor').html("");
  buddypond.sendMessage(message.to, message.text, function(err, data){
    console.log('buddypond.sendMessage', err, data)
  });
}

desktop.buddylistProfileState = {
  "updates": {
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


desktop.updateBuddyList = function updateBuddyList () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function(){
      desktop.updateBuddyList();
    }, 10);
    return;
  } else {
    $('.buddy_list_not_connected').hide();
    // TODO: move this to buddy pond scope
    $('.buddy_pond_not_connected').hide();
    $('.buddyListHolder').show();
    $('.me').html(buddypond.me);
    //ex: let buddyProfile = { "Dave": { "newMessages": true } };
    buddypond.getBuddyProfile(desktop.buddylistProfileState, function(err, data){
      if (err || typeof data !== 'object') {
        desktop.log(err);
        // TODO: show disconnect error in UX
        setTimeout(function(){
          desktop.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER); // TODO: expotential backoff algo
        return;
      }
      desktop.buddyListData = data;
      desktop.buddylistProfileState = { updates: {}};
      // updates Profile settings form

      let currentEmail = $('.buddy_email').val();
      if (!currentEmail) {
        $('.buddy_email').val(desktop.buddyListData.email);
      }

      //
      // process notifications for buddy
      //
      let buddylist = data.buddylist;
      Object.keys(buddylist).forEach(function(b){
        let profile = buddylist[b];
        if (profile && profile.newMessages === true) {
          let buddyName = b.replace('buddies/', '');
          desktop.openWindow('buddy_message', buddyName)
        }
      });
      //
      // end notifications processing
      //

      //
      // process incomingcall for buddy
      //
      Object.keys(buddylist).forEach(function(b){
        let profile = buddylist[b];
        if (profile && profile.isCalling === true) {
          let buddyName = b.replace('buddies/', '');
          desktop.buddylistProfileState.updates[b] = desktop.buddylistProfileState.updates[b] || {};
          desktop.buddylistProfileState.updates[b].isCalling = false;
          // TODO: add isOnCall flag? another icon?
          //.      needs separate event?
          desktop.videochat.startCall(false, buddyName, function(err, re){
            // console.log('call has started', err, re)
          });
        }
      });
      //
      // end incomingcall processing
      //

      let str = JSON.stringify(data);
      // TODO: use key count for garbage collection and trim if size grows
      if (desktop.buddyListDataCache[str]) {
        setTimeout(function(){
          desktop.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }
      desktop.buddyListDataCache = {};

      $('.totalConnectedCount').html(data.system.totalIsConnected);

      let buddies = Object.keys(data.buddylist);
      if (buddies.length > 0) {
        $('.you_have_no_buddies').hide();
      }
      // a buddy request counts as a buddy in UX ( for now )
      if (Object.keys(data.buddyrequests).length > 0) {
        $('.you_have_no_buddies').hide();
      }
      $('.buddylist').html('');
      $('.loading').remove();
      if (buddies) {
        if (buddies.length === 0) {
          $('.buddylist').html('No buddies yet.');
        } else {
          desktop.buddyListDataCache = {};
          desktop.buddyListDataCache[str] = true;
          buddies = buddies.sort(function(a, b){
            let profileA = data.buddylist[a];
            let profileB = data.buddylist[b];
            if (!profileB.isConnected) {
              return -1;
            }

            if (!profileA.isConnected) {
              return 1;
            }
          });
          buddies.forEach(function(buddyKey){
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
            if (desktop.videochat.loaded && profile && profile.isCalling) {
              openCallWindow(buddy, true);
            }
            */
            $('.buddylist').append('<li>' + newMessages + isConnected + isCalling + '<a class="messageBuddy rainbowLink" href="#">' + buddy + '</a></li>')
          })
          $('.apiResult').val(JSON.stringify(data, true, 2))
          // render buddy list
          $('.messageBuddy').on('click', function(){
            let position = {};
            position.my = position.my || "left top";
            position.at = position.at || 'left+33 top+33';
            let context = $(this).html();
            let windowKey = desktop.openWindow('buddy_message', context, position);
            let windowId = '#' + windowKey;
            $('.buddy_message_text', windowId).focus();
            $('.buddy_message_to', windowId).val(context)
            $('.buddy_message_from', windowId).val(buddypond.me);
          });
        }
      }

      if (data.buddyrequests) {
        // desktop.buddyListDataCache = {}
        // desktop.buddyListDataCache[str] = true;
        $('.pendingIncomingBuddyRequests').html('');
        $('.pendingOutgoingBuddyRequests').html('');
        $('.loading').remove();

        for (let buddy in data.buddyrequests) {
          let buddyrequest = data.buddyrequests[buddy];
          buddyrequest = JSON.parse(buddyrequest);
          // TODO: top list is buddies, button list is requests ( with buttons )
          if (buddyrequest.to === buddypond.me) {
            $('.pendingIncomingBuddyRequests').append('<li>' + buddyrequest.from + ' - <a href="#" class="approveBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Approve</a> / <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Remove</a> </li>')
          } else {
            $('.pendingOutgoingBuddyRequests').append('<li>' + buddyrequest.to + ' - <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.to +'">Remove</a></li>')
          }
        }

        $('.apiResult').val(JSON.stringify(data, true, 2))

        if ($('.pendingIncomingBuddyRequests li').length == 0) {
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
        $('.denyBuddyRequest').on('click', function(){
          $(this).parent().hide();
          buddypond.denyBuddy($(this).attr('data-buddyname'), function(err, data){
            $('.apiResult').val(JSON.stringify(data, true, 2))
          });
          return false;
        });

        $('.approveBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function(){
          $(this).parent().hide();
          let buddyName = $(this).attr('data-buddyname');
          buddypond.approveBuddy(buddyName, function(err, data){
            $('.apiResult').val(JSON.stringify(data, true, 2))
          });
          return false;
        });
      }

      setTimeout(function(){
        desktop.updateBuddyList();
      }, desktop.DEFAULT_AJAX_TIMER);

    });

  }

}

desktop.buddylist.updateMessages = function updateBuddylistMessages (data, cb) {

    // buddypond.pondGetMessages(subscribedBuddies.toString(), function(err, data){

    // console.log('desktop.buddylist.updateMessages', data);
    //desktop.buddyMessageCache[str] = true;
    let html = {};
    // TODO: this should apply per conversation, not global for all users
    data.messages.forEach(function(message){
      // route message based on incoming type / format
      // default message.type is undefined and defaults to "text" type

      if (message.type === 'pond') {
        return;
      }

      let buddyKey = message.from;
      if (buddyKey === buddypond.me) {
        buddyKey = message.to;
      }

      //
      // New messages are coming in from server, we'll need to render them
      //
      // Get all the open buddy_message windows
      let openBuddyWindows = desktop.openWindows['buddy_message'];
      // Find the specific window which is open for this buddy
      let windowId = '#' + openBuddyWindows[buddyKey];
      // console.log('rendering messages to buddy window', windowId)
      // console.log('writing new message to ', windowId, message.from, message.to)

      // accumulate all the message html so we can perform a single document write,
      // instead of a document write per message
      html[windowId] = html[windowId] || '';

      // TODO: filter message.text for html using jquery
      // filter message.text for forbidden words
      forbiddenNotes.decoded.forEach(function(fnote){
        message.text = message.text.replace(new RegExp("\\b"+fnote+"\\b"), forbiddenNotes.randowFunWord())
      });

      let str = '';
      if (message.from === buddypond.me) {
        str += '<span class="datetime message">' + message.ctime + ' </span>' + message.from + ': <span class="message"></span><br/>';
      } else {
        str += '<span class="datetime message">' + message.ctime + ' </span><spacn class="purple">' + message.from + ':</span><span class="message purple"></span><br/>';
      }
      $('.chat_messages', windowId).append(str);
      $('.message', windowId).last().text(message.text)
      desktop.processedMessages.push(message.uuid);
      desktop.buddyMessageCache[buddypond.me + '/' + buddyKey] = desktop.buddyMessageCache[buddypond.me + '/' + buddyKey] || [];
      desktop.buddyMessageCache[buddypond.me + '/' + buddyKey].push(message.uuid);
    });

    //
    // All messages have been processed and HTML has been accumulated
    // Iterate through the generated HTML and write to the correct windows
    //
    for (let key in html) {
      // $('.chat_messages', key).html('');
      $('.no_chat_messages', key).hide();
      // scrolls to bottom of messages on new messages
      let el = $('.chat_messages', key)
      $(el).scrollTop($(el)[0].scrollHeight);
    }
    cb(null, true);
}

