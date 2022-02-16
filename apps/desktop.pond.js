desktop.pond = {};

desktop.pond.load = function loadPond () {

  desktop.log('Loading:', 'App.pond')

  let clone = $('#window_pond_message_0').html();
  let dockItemClone = $('#icon_dock_pond_message_0').html();

  for (let i = 1; i<11; i++) {
    
    let window_id = 'window_pond_message_' + i;
    let pondChatStr = '<div id="' + window_id + '" class="abs window pond_message" data-window-index="' + i + '" data-window-type="pond_message">' + clone.replace('icon_dock_pond_message_0', 'icon_dock_pond_message_' + i) + '</div>'
    //let pondChatStr = '<div id="window_pond_message_' + i +'" class="abs window pond_message" data-window-index="' + i + '">' + clone.replace('icon_dock_pond_message_0', 'icon_dock_pond_message_' + i) + '</div>'
    $('#desktop').append(pondChatStr);
    let dockStr = dockItemClone.replace('window_pond_message_0', 'window_pond_message_' + i)
    dockStr = '<li id="icon_dock_pond_message_' + i +'">' + dockStr + '</li>'
    $('#dock').append(dockStr);
    // register these new elements into the windowPool
    // these ids are used later when desktop.openWindow('buddy_message') is called
    desktop.windowPool['pond_message'].push(window_id)
  }

  // $('.pondMessagesHolder').hide();

  $('#window_pond').css('width', 300);
  $('#window_pond').css('height', 340);
  $('#window_pond').css('left', 33);
  $('#window_pond').css('top', 66);

  $('.pondNameList').hide();
  $('.pondMessagesHolder').hide();

  $('.sendPondMessage').on('click', function(){
    desktop.pond.sendMessage(this);
    return false;
  });

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
    if ($('.customPondName').val().length === 0) {
      $('.customPondName').addClass('error');
    } else {
      $('.customPondName').removeClass('error');
      desktop.openWindow('pond_message', $('.customPondName').val())
      desktop.pond.openWindow($('.customPondName').val())
    }
  });

};

let pondOpened = false;

desktop.pond.openWindow = function (context) {
  
  if(!context) {
    context = "Lily";
  } 

  // when pond app loads, open default pond for all buddies
  let rightPadding = 10;
  let topPadding = 10;
  
  if (!buddypond.qtokenid) {
    // return;
  }
  let windowKey = desktop.openWindow('pond_message', context, {
    of: "#window_pond"
  });
  let windowId = '#' + windowKey;
  $('.window-context-title', windowId).html(context + ' Pond');
  $('.pond_message_text', windowId).focus();
  $('.pond_message_to', windowId).val(context)
  $('.pond_message_from', windowId).val(buddypond.me);
  pondOpened = true;
  // TODO: doc element title
  // $('.dock_title', dockElement).html(context);
  // $('.pondNameList').show();
}

desktop.pond.sendMessage = function sendPondMessage (context) {
  let message = {};
  console.log('desktop.pond.sendMessage context', context);
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
  console.log('sending the message to pond', message)
  buddypond.pondSendMessage(message.to, message.text, function(err, data){
    console.log('buddypond.pondSendMessage', err, data)
  });
}

// Remark: Temporary fix for current UX of Lily Pond loading
let defaultPondOpened = false;

desktop.pond.updateMessages = function updatePondMessages (data, cb) {

  // console.log('desktop.pond.updateMessages', data)
  $('.buddy_pond_not_connected').hide();

  $('.pondNameList').show();
  $('.pondMessagesHolder').show();

  if (!defaultPondOpened && pondOpened) {
    defaultPondOpened = true;
    desktop.openWindow('pond_message', 'Lily');
  }

  let str = JSON.stringify(data);
  // TODO: use key count for garbage collection and trim if size grows
  if (desktop.buddyMessageCache[str]) {
    cb(new Error('Will not re-render for cached data'))
    return;
  }

  let html = {};

  data.messages.forEach(function(message){

    // route message based on incoming type / format
    // default message.type is undefined and defaults to "text" type

    if (message.type !== 'pond') {
      return;
    }

    /*
    var keys = Object.keys(desktop.openWindows['pond_message']);
    let pondKey = message.to;
    let index = keys.indexOf(pondKey);
    var windowKey = '#window_pond_message_' + index;
    */
    let openPondWindows = desktop.openWindows['pond_message'];
    let windowId = '#' + openPondWindows[message.to]

    forbiddenNotes.decoded.forEach(function(fnote){
      message.text = message.text.replace(new RegExp("\\b"+fnote+"\\b"), forbiddenNotes.randowFunWord())
    });

    html[windowId] = html[windowId] || '';

    let str = '';
    if (message.from === buddypond.me) {
      str += '<span class="datetime message">' + message.ctime + ' </span>' + message.from + ': <span class="message"></span><br/>';
    } else {
      str += '<span class="datetime message">' + message.ctime + ' </span><spacn class="purple">' + message.from + ':</span><span class="message purple"></span><br/>';
    }
    $('.chat_messages', windowId).append(str);
    $('.message', windowId).last().text(message.text)
    desktop.processedMessages.push(message.uuid);
  });

  for (let key in html) {
    //$('.chat_messages', key).html('');
    // $('.chat_messages', key).append(html[key]);
    $('.no_chat_messages', key).hide();
    // scrolls to bottom of messages on new messages
    let el = $('.chat_messages', key)
    $(el).scrollTop($(el)[0].scrollHeight);
  }
  cb(null, true);
}