/*

  Buddy Pond Desktop Client

*/

let desktop = {};

desktop.buddyListDataCache = {};
desktop.buddyMessageCache = {};

desktop.windowIndex = {};

desktop.openChats = {};

desktop.MAX_CONSOLE_OUTPUT = 5;
desktop.log = function logDesktop () {
  let consoleItems = $('.console li').length;
  if (consoleItems > desktop.MAX_CONSOLE_OUTPUT) {
    $('.console li').get(0).remove();
    // $('.console').html(consoleContent);
  }
  let output = '';
  arguments[0] = '<span class="purple">' + arguments[0] + '</span>';
  for (let arg in arguments) {
    let str = arguments[arg];
    if (typeof str === 'object') {
      str = JSON.stringify(str, true, 2)
    }
    
    output += (str + ', '); 
  }
  let now = new Date();
  let dateString = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  $('.console').append('<li>' + dateString + ': ' + output + '</li>');
}

desktop.load = function loadDesktop() {

  $('.sendBuddyMessage').on('click', function(){
    desktop.sendBuddyMessage(this)
  });

  $('.sendBuddyRequest').on('click', function(){
    var buddyName = $('.buddy_request_name').val();
    $('.buddy_request_name').val('');
    desktop.log('buddypond.addBuddy ->', buddyName)
    buddypond.addBuddy(buddyName, function(err, data){
      desktop.log('buddypond.addBuddy <-', data)
      console.log("buddypond.addBuddy returns", err, data);
      console.log(err, data)
    });
  });

  $('.buddy_message_text').bind("enterKey",function(e){
    desktop.sendBuddyMessage(this)
  });

  $('.buddy_message_text').keyup(function(e){
      if (e.shiftKey==1) {
        return false;
      }
      if(e.keyCode == 13)
      {
          $(this).trigger("enterKey");
      }
  });
  $('.buddyListHolder').hide();
  $('#logout_desktop_icon').hide();
}

desktop.refresh = function refreshDesktop () {

  desktop.updateBuddyList();
  desktop.updateMessages();
}

desktop.openWindow = function openWindow (windowType, context) {
  
  desktop.openChats[context] = true;
  
  if (desktop.windowIndex[context]) {
    let window_id = Object.keys(desktop.windowIndex).indexOf(context);
    console.log('reopen window id', window_id)
    // TODO: check to see if window is min, if so, open it from dock
    // $('#window_buddy_message_' + window_id).show();
    let chat_window_id = Object.keys(desktop.windowIndex).indexOf(context);
    console.log('chat_window_id', chat_window_id)

    desktop.renderDockElement('buddy_message_' + chat_window_id, context);
    JQD.util.window_flat();
    $('#window_buddy_message_' + window_id).show().addClass('window_stack');
  } else {
    var windowKey = '#window_buddy_message_' + Object.keys(desktop.windowIndex).length;
    console.log('showing window', windowKey)
    $('.window-context-title', windowKey).html(context);

    //JDQX.openWindow($(windowKey));
    $(windowKey).show();
    $(windowKey).css('width', 600)
    $(windowKey).css('height', 440)

    desktop.windowIndex[context] = windowType;

    let chat_window_id = Object.keys(desktop.windowIndex).indexOf(context);
    console.log('chat_window_id', chat_window_id)

    desktop.renderDockElement('buddy_message_' + chat_window_id, context);

    $('.buddy_message_to', windowKey).val(context)

    // TODO: buddypond.me
    $('.buddy_message_from', windowKey).val(buddypond.me);

    let rightPadding = chat_window_id * 10;
    let topPadding = chat_window_id * 10;
    // TODO: dynamic position, pick a spot
    $(windowKey).position({
      my: "left top",
      at: 'right+' + rightPadding + ' top+' + topPadding,
      of: "#window_buddylist"
    });

  }

}

desktop.sendBuddyMessage = function sendBuddyMessage (context) {
  let message = {};
  var form = $(context).parent();
  message.text = $('.buddy_message_text', form).val();
  message.to = $('.buddy_message_to', form).val();
  message.from = $('.buddy_message_from', form).val();
  if (message.text.trim() === "") {
    return;
  }

  console.log('send the buddy message', message);
  // TODO: have console display more info about event
  $('.console').val(JSON.stringify(message, true, 2));

  // empty text area input
  $('.buddy_message_text', form).val('');
  buddypond.sendMessage(message.to, message.text, function(err, data){
    console.log("buddypond.sendMessage returns", err, data);
    console.log(err, data)
  });
}

desktop.updateBuddyList = function updateBuddyList () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function(){
      desktop.updateBuddyList();
    }, 10);
  } else {

    // update buddylist html
    buddypond.getBuddyList(function(err, data){
      let str = JSON.stringify(data);
      desktop.log('buddypond.getBuddyList', str);
      // TODO: use key count for garbage collection and trim if size grows
      if (desktop.buddyListDataCache[str]) {
        setTimeout(function(){
          desktop.updateBuddyList();
        }, 3000);
        return;
      }
      $('.buddy_list_not_connected').hide();
      $('.buddyListHolder').show();
      
      if (data.buddylist.length > 0) {
        $('.you_have_no_buddies').hide();
      }
      $('.buddylist').html('');
      if (data.buddylist) {
        desktop.buddyListDataCache[str] = true;
        data.buddylist.forEach(function(buddy){
          $('.buddylist').append('<li><a class="messageBuddy" href="#">' + buddy + '</a></li>')
        })
        $('.apiResult').val(JSON.stringify(data, true, 2))
        // render buddy list
        $('.messageBuddy').on('click', function(){
          let context = $(this).html();
          desktop.openWindow('chat', context)
        });
      }

      if (data.buddyrequests) {

        // desktop.buddyListDataCache[str] = true;
        $('.pendingIncomingBuddyRequests').html('');
        $('.pendingOutgoingBuddyRequests').html('');

        for (let buddy in data.buddyrequests) {
          let buddyrequest = data.buddyrequests[buddy];
          // console.log('buddyrequest', buddy, buddyrequest)
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
          buddypond.denyBuddy($(this).attr('data-buddyname'), function(err, data){
            $('.apiResult').val(JSON.stringify(data, true, 2))
          });
          return false;
        });

        $('.approveBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function(){
          buddypond.approveBuddy($(this).attr('data-buddyname'), function(err, data){
            $('.apiResult').val(JSON.stringify(data, true, 2))
          });
          return false;
        });
      }

      setTimeout(function(){
        desktop.updateBuddyList();
      }, 3000);

    });

  }
  
}

desktop.updateMessages = function updateMessages () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function(){
      desktop.updateMessages();
    }, 10);
  } else {
    var subscribedBuddies = Object.keys(desktop.openChats)
    if (subscribedBuddies.length === 0) {
      setTimeout(function(){
        desktop.updateMessages();
      }, 10);
      return;
    }
    // console.log('subscribedBuddies', subscribedBuddies.toString())
    buddypond.getMessages(subscribedBuddies.toString(), function(err, data){
      // console.log("buddypond.getMessages returns");
      let str = JSON.stringify(data);
      // TODO: use key count for garbage collection and trim if size grows
      if (desktop.buddyMessageCache[str]) {
        setTimeout(function(){
          desktop.updateMessages();
        }, 3000);
        return;
      }
      //console.log('Rendering Messages List');
      //console.log(data)
      // $('.buddylist').html('');
      desktop.updateMessages[str] = true;
      let html = {};
      
      if (data.messages.length === 0) {
        
      } else {
        $('.no_chat_messages').hide();
      }

      data.messages.forEach(function(message){
        var keys = Object.keys(desktop.openChats);
        // get context window index
        let buddyKey = message.from;
        if (buddyKey === buddypond.me) {
          buddyKey = message.to;
        }
        let index = keys.indexOf(buddyKey);
        var windowKey = '#window_buddy_message_' + index;
        //console.log('writting message to ', windowKey, message)
        html[windowKey] = html[windowKey] || '';
        
        if (message.from === buddypond.me) {
          html[windowKey] += '<span class="datetime">' + message.ctime + ' </span><span>' + message.from + ': ' + message.text + '</span><br/>';
        } else {
          html[windowKey] += '<span class="datetime">' + message.ctime + ' </span><span class="purple">' + message.from + ': ' + message.text + '</span><br/>';
        }
        
      });

      for (let key in html) {
        $('.chat_messages', key).html('');
        $('.chat_messages', key).append(html[key]);
        // scrolls to bottom of messages on new messages
        let el = $('.chat_messages', key)
        $(el).scrollTop($(el)[0].scrollHeight);
      }

      setTimeout(function(){
        desktop.updateMessages();
      }, 3000);
      
    });

  }
}

desktop.removeDockElement = function (windowType, context) {
  var dockElement = '#icon_dock_' + windowType;
  $(dockElement).hide();
  return;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}


desktop.renderDockElement = function (windowType, context) {
  var dockElement = '#icon_dock_' + windowType;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}

