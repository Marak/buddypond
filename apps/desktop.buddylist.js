desktop.buddylist = {};

desktop.buddylist.load = function desktopLoadBuddyList () {

  desktop.log('Loading: app.buddylist')

  // clone window_buddy_message_0 ten times
  // clone icon_dock_buddy_message_0 ten times 
  // this creates 10 windows available for chatting with buddies
  let clone = $('#window_buddy_message_0').html();
  let dockItemClone = $('#icon_dock_buddy_message_0').html();

  for (let i = 1; i<11; i++) {
    let window_id = 'window_buddy_message_' + i;
    let buddyChatStr = '<div id="' + window_id + '" class="abs window buddy_message" data-window-index="' + i + '" data-window-type="buddy_message">' + clone.replace('icon_dock_buddy_message_0', 'icon_dock_buddy_message_' + i) + '</div>'
    $('#desktop').append(buddyChatStr);
    let dockStr = dockItemClone.replace('window_buddy_message_0', 'window_buddy_message_' + i)
    dockStr = '<li id="icon_dock_buddy_message_' + i +'">' + dockStr + '</li>'
    $('#desktop').append(buddyChatStr);
    $('#dock').append(dockStr);
    // register these new elements into the windowPool
    // these ids are used later when desktop.openWindow('buddy_message') is called
    desktop.windowPool['buddy_message'].push(window_id)
  }

  $('.sendMessageForm').on('submit', function(){
    return false;
  })

  $('.sendBuddyMessage').on('click', function(){
    desktop.buddylist.sendMessage(this);
    return false;
  });

  $('.sendBuddyRequest').on('click', function(){
    var buddyName = $('.buddy_request_name').val();
    $('.buddy_request_name').val('');
    desktop.log('buddypond.addBuddy ->', buddyName)
    buddypond.addBuddy(buddyName, function(err, data){
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

  var tag = document.createElement('script');
  tag.src = "assets/js/emojipicker.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  tag.onload = function() {
    new EmojiPicker({
        trigger: [
            {
                selector: '.emojiPicker',
                insertInto: '.buddy_message_text'
            }
        ],
        closeButton: true,
        //specialButtons: green
    });
  }
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
    buddypond.getBuddyList(function(err, data){
      if (err) {
        desktop.log(err);
        setTimeout(function(){
          desktop.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER); // TODO: expotential backoff algo
        return;
      }
      let str = JSON.stringify(data);
      // TODO: use key count for garbage collection and trim if size grows
      if (desktop.buddyListDataCache[str]) {
        setTimeout(function(){
          desktop.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }
      desktop.buddyListDataCache = {};

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
          $('.buddylist').html('No buddies yet');
        } else {
          desktop.buddyListDataCache[str] = true;
          buddies.forEach(function(buddyKey){
            let buddy = buddyKey.replace('buddies/', '');
            let profile = JSON.parse(data.buddylist[buddyKey]);
            if (profile.isCalling) {
              showCallWindow(buddy, true);
            }
            console.log('ppp', profile);
            $('.buddylist').append('<li><a class="messageBuddy" href="#">' + buddy + '</a></li>')
          })
          $('.apiResult').val(JSON.stringify(data, true, 2))
          // render buddy list
          $('.messageBuddy').on('click', function(){
            let context = $(this).html();
            let position = {};
            position.my = position.my || "left top";
            position.at = position.at || 'left+33 top+33';
            let windowId = desktop.openWindow('buddy_message', context, position);
            let windowKey = '#' + windowId;
            $('.buddy_message_to', windowKey).val(context)
            $('.buddy_message_from', windowKey).val(buddypond.me);
          });
        }
      }

      if (data.buddyrequests) {

        // desktop.buddyListDataCache[str] = true;
        $('.pendingIncomingBuddyRequests').html('');
        $('.pendingOutgoingBuddyRequests').html('');
        $('.loading').remove();

        for (let buddy in data.buddyrequests) {
          let buddyrequest = data.buddyrequests[buddy];
          buddyrequest = JSON.parse(buddyrequest);
          // TODO: top list is buddies, button list is requests ( with buttons )
          if (buddyrequest.to === buddypond.me) {
            $('.pendingIncomingBuddyRequests').append('<li>' + buddyrequest.from + ' - <a href="#" class="approveBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Approve</a> / <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Deny</a> </li>')
          } else {
            $('.pendingOutgoingBuddyRequests').append('<li>' + buddyrequest.to + '</li>')
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
        $('.denyBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function(){
          $(this).parent().hide();
          buddypond.denyBuddy($(this).attr('data-buddyname'), function(err, data){
            $('.apiResult').val(JSON.stringify(data, true, 2))
          });
          return false;
        });

        $('.approveBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function(){
          $(this).parent().hide();
          buddypond.approveBuddy($(this).attr('data-buddyname'), function(err, data){
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

    let str = JSON.stringify(data);
    // TODO: use key count for garbage collection and trim if size grows
    if (desktop.buddyMessageCache[str]) {
      //cb(new Error('Will not re-render for cached data'))
      //return;
    }
    console.log('desktop.buddylist.updateMessages', data);
    //desktop.buddyMessageCache[str] = true;
    let html = {};
    // TODO: this should apply per conversation, not global for all users
    if (data.messages.length === 0) {
      $('.chat_messages').hide();
    } else {
      $('.no_chat_messages').hide();
      $('.chat_messages').show();
    }

    data.messages.forEach(function(message){
      // route message based on incoming type / format
      // default message.type is undefined and defaults to "text" type

      // TODO: move to desktop.videochat.updateMessages()
      // TODO: invert control and only process message.type = 'text'
      //       move message.type = 'videoChat' to desktop.videochat.js controller
      if (message.type === 'videocall' && message.from !== buddypond.me) {
        // TODO: popup video modal with accept / decline
        // alert('Incoming call. Accept or Decline.')

        if (!desktop.videochat.CALL_IN_PROGRESS) {
          showCallWindow();
          desktop.videochat.CALL_IN_PROGRESS = true;
        } else {
          // do nothing for now
          // in the future, we can detect if this is from another user and show call waiting
          // in the future, we can also prevent video start for users already on call
        }
        
        if (message.text === 'end') {
          
        }

        if (message.text === 'decline') {
          closeCallWindow();
        }

        return;
      }

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
      let windowId = '#' + openBuddyWindows[buddyKey]
      console.log('rendering messages to buddy window', windowId)

      // accumulate all the message html so we can perform a single document write,
      // instead of a document write per message
      html[windowId] = html[windowId] || '';
      if (message.from === buddypond.me) {
        html[windowId] += '<span class="datetime">' + message.ctime + ' </span><span>' + message.from + ': ' + message.text + '</span><br/>';
      } else {
        html[windowId] += '<span class="datetime">' + message.ctime + ' </span><span class="purple">' + message.from + ': ' + message.text + '</span><br/>';
      }
    });

    //
    // All messages have been processed and HTML has been accumulated
    // Iterate through the generated HTML and write to the correct windows
    //
    for (let key in html) {
      $('.chat_messages', key).html('');
      $('.chat_messages', key).append(html[key]);
      // scrolls to bottom of messages on new messages
      let el = $('.chat_messages', key)
      $(el).scrollTop($(el)[0].scrollHeight);
    }
    cb(null, true);
}