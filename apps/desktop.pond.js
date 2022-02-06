desktop.pond = {};

desktop.pond.load = function loadPond () {

  desktop.log('Loading: app.pond')

  let clone = $('#window_pond_message_0').html();
  let dockItemClone = $('#icon_dock_pond_message_0').html();

  for (let i = 1; i<11; i++) {
    let pondChatStr = '<div id="window_pond_message_' + i +'" class="abs window pond_message" data-window-index="' + i + '">' + clone.replace('icon_dock_pond_message_0', 'icon_dock_pond_message_' + i) + '</div>'
    $('#desktop').append(pondChatStr);
    let dockStr = dockItemClone.replace('window_pond_message_0', 'window_pond_message_' + i)
    dockStr = '<li id="icon_dock_pond_message_' + i +'">' + dockStr + '</li>'
    $('#desktop').append(pondChatStr);
    $('#dock').append(dockStr);
  }

  // $('.pondMessagesHolder').hide();

  $('#window_pond').css('width', 300);
  $('#window_pond').css('height', 340);

  $('.pondNameList').hide();
  $('.pondMessagesHolder').hide();
  

  /*
  $('.messagePond').on('click', function(){
    let context = $(this).html();
    desktop.openWindow('pond_message', context);
  });
  */

  $('.sendPondMessage').on('click', function(){
    desktop.pond.sendMessage(this);
    return false;
  })

  $('.pond_message_text').bind("enterKey",function(e){
    desktop.pond.sendMessage(this);
    return false;
  });

  $('.pond_message_text').keyup(function(e){
      if (e.shiftKey==1) {
        return false;
      }
      if (e.keyCode == 13) {
        $(this).trigger("enterKey");
        return false;
      }
  });

  $('.joinPond').on('click', function(){
    desktop.openWindow('pond_message', $('.customPondName').val())
  });

};

let pondOpened = false;

desktop.pond.openWindow = function () {
  // when pond app loads, open default pond for all buddies
  let rightPadding = 10;
  let topPadding = 10;
  let windowKey = desktop.openWindow('pond_message', 'Lily', {
    of: "#window_pond"
  });
  $('.pond_message_to').val('Lily');

  $('.window-context-title', windowKey).html('Lily Pond');
  pondOpened = true;
  // TODO: doc element title
  // $('.dock_title', dockElement).html(context);
  // $('.pondNameList').show();
}

desktop.pond.sendMessage = function sendPondMessage (context) {
  let message = {};
  var form = $(context).parent();
  message.text = $('.pond_message_text', form).val();
  message.to = $('.pond_message_to', form).val();
  message.from = $('.pond_message_from', form).val();
  if (message.text.trim() === "") {
    return;
  }

  // TODO: have console display more info about event
  $('.console').val(JSON.stringify(message, true, 2));

  // empty text area input
  $('.pond_message_text', form).val('');
  // $('.emoji-wysiwyg-editor').html("");
  buddypond.pondSendMessage(message.to, message.text, function(err, data){
    console.log('buddypond.pondSendMessage', err, data)
  });
}

// Remark: Temporary fix for current UX of Lily Pond loading
let defaultPondOpened = false;

desktop.pond.updateMessages = function updatePondMessages (data, cb) {
  console.log('desktop.pond.updateMessages', data)
  $('.buddy_pond_not_connected').hide();

  $('.pondNameList').show();
  $('.pondMessagesHolder').show();

  if (!defaultPondOpened && pondOpened) {
    defaultPondOpened = true;
    desktop.openWindow('pond_message', 'Lily')
  }

  let str = JSON.stringify(data);
  // TODO: use key count for garbage collection and trim if size grows
  if (desktop.buddyMessageCache[str]) {
    cb(new Error('Will not re-render for cached data'))
    return;
  }
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

    if (message.type !== 'pond') {
      return;
    }

    // TODO: invert control and only process message.type = 'text'
    //       move message.type = 'videoChat' to desktop.videochat.js controller
    var keys = Object.keys(desktop.openWindows['pond_message']);
    // get context window index

    let pondKey = message.to;
    let index = keys.indexOf(pondKey);
    var windowKey = '#window_pond_message_' + index;

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
  cb(null, true);
}