desktop.pond = {};
desktop.pond.label = "Pond";

desktop.pond.load = function loadPond (params, next) {

  desktop.loadRemoteAppHtml('pond', function (responseText, textStatus, jqXHR) {

    let clone = $('#window_pond_message_0').html();
    let dockItemClone = $('#icon_dock_pond_message_0').html();

    for (let i = 1; i<11; i++) {

      let _clone = clone.replace('icon_dock_pond_message_0', 'icon_dock_pond_message_' + i)
      _clone = _clone.replace('pond_message_text_0', 'pond_message_text_' + i);
      _clone = _clone.replace('pond_emoji_picker_0', 'pond_emoji_picker');

      let window_id = 'window_pond_message_' + i;
      let pondChatStr = '<div id="' + window_id + '" class="abs window pond_message" data-window-index="' + i + '" data-window-type="pond_message">' + _clone + '</div>'

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

    $('.pond_emoji_picker').on('click', function (e) {
      e.target.parentNode?.querySelector('.pond_message_text').focus();
    });

    $('.pond_message_text').on('focus', function (e) {
      $('.activeTextArea').removeClass('activeTextArea');
      e.target.classList.add('activeTextArea')
    });

    next();
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

  let windowKey = desktop.openWindow('pond_message', context);
  let windowId = '#' + windowKey;
  $(windowId).css('left', 166);
  $(windowId).css('top', 66);

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
  // console.log('desktop.pond.sendMessage context', context);
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
  //console.log('sending the message to pond', message)
  buddypond.pondSendMessage(message.to, message.text, function(err, data){
    //console.log('buddypond.pondSendMessage', err, data)
  });
}

// Remark: Temporary fix for current UX of Lily Pond loading
let defaultPondOpened = false;

desktop.pond.lastNotified = 0;

desktop.pond.processMessages = function processMessagesPond (data, cb) {

  $('.pondNameList').show();
  $('.pondMessagesHolder').show();

  if (!defaultPondOpened && pondOpened) {
    defaultPondOpened = true;
    desktop.openWindow('pond_message', 'Lily');
  }

  // TODO: can we remove this?
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

    message.text = forbiddenNotes.filter(message.text);

    html[windowId] = html[windowId] || '';

    let str = '';
    if (message.from === buddypond.me) {
      str += '<span class="datetime message">' + message.ctime + ' </span>' + message.from + ': <span class="message"></span><br/>';
    } else {
      str += '<span class="datetime message">' + message.ctime + ' </span><span class="purple">' + message.from + ':</span><span class="message purple"></span><br/>';
      if (document.visibilityState === 'hidden') {
        let now = new Date().getTime();
        if (now - desktop.pond.lastNotified > 30000) {
          desktop.notifications.notifyBuddy(`${message.to} 🐸 ${message.from}: ${message.text}`);
          desktop.pond.lastNotified = now;
        }
      }
    }
    $('.chat_messages', windowId).append(str);
    $('.message', windowId).last().text(message.text)
    desktop.processedMessages.push(message.uuid);
  });

  for (let key in html) {
    $('.no_chat_messages', key).hide();
  }

  try {
    if (data.messages.length > 0) {
      let el = $('.chat_messages', '.pond_message_main')
      $(el).scrollTop(9999);
    }
  } catch (err) {
    console.log('Waring: Was unable to scrollTop on pond messages', err);
  }

  cb(null, true);
}