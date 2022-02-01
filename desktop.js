/*

  Buddy Pond Desktop Client

*/

let desktop = {};

desktop.buddyListDataCache = {};
desktop.buddyMessageCache = {};

desktop.windowIndex = {};

desktop.openChats = {};

desktop.load = function loadDesktop() {
  $('.sendBuddyMessage').on('click', function(){
    let message = {};
    var form = $(this).parent();
    console.log('fff', form)
    message.text = $('.buddy_message_text', form).val();
    message.to = $('.buddy_message_to', form).val();
    message.from = $('.buddy_message_from', form).val();
    // empty text area input
    $('.buddy_message_text', form).val('');
    console.log('send the buddy message', message);
    buddypond.sendMessage(message.to, message.text, function(err, data){
      console.log("buddypond.sendMessage returns", err, data);
      console.log(err, data)
    });
  });
  $('.sendBuddyRequest').on('click', function(){
    var buddyName = $('.buddy_request_name').val();
    $('.buddy_request_name').val('');
    console.log('send the buddy request', buddyName);
    buddypond.addBuddy(buddyName, function(err, data){
      console.log("buddypond.addBuddy returns", err, data);
      console.log(err, data)
    });
  });
  
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
    JQD.util.window_flat();
    $('#window_buddy_message_' + window_id).show().addClass('window_stack');
  } else {
    var windowKey = '#window_buddy_message_' + Object.keys(desktop.windowIndex).length;
    console.log('showing window', windowKey)
    $('.window-context-title', windowKey).html(context);

    //JDQX.openWindow($(windowKey));
    $(windowKey).show();
    
    desktop.windowIndex[context] = windowType;

    let chat_window_id = Object.keys(desktop.windowIndex).indexOf(context);
    console.log('chat_window_id', chat_window_id)

    desktop.renderDockElement('buddy_message_' + chat_window_id, context);

    $('.buddy_message_to', windowKey).val(context)

    // TODO: buddypond.me
    $('.buddy_message_from', windowKey).val(buddypond.me);

    // TODO: dynamic position, pick a spot
    $(windowKey).position({
      my: "left top",
      at: "right top",
      of: "#window_buddylist"
    });

  }

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

      // TODO: use key count for garbage collection and trim if size grows
      if (desktop.buddyListDataCache[str]) {
        setTimeout(function(){
          desktop.updateBuddyList();
        }, 3000);
        return;
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
        data.buddyrequests.forEach(function(buddy){
          $('.pendingBuddyRequests').append('<li><a class="buddyRequest" href="#">' + buddy + '</a></li>')
        })
        $('.apiResult').val(JSON.stringify(data, true, 2))
        // render buddy list
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
        html[windowKey] += '<span class="datetime">' + message.ctime + ' </span><span>' + message.from + ': ' + message.text + '</span><br/>';
      });

      for (let key in html) {
        $('.chat_messages', key).html('');
        $('.chat_messages', key).append(html[key]);
      }
      setTimeout(function(){
        desktop.updateMessages();
      }, 3000);
      
    });

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

