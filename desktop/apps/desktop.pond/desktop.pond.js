desktop.app.pond = {};
desktop.app.pond.label = "Pond";

desktop.app.pond.load = function loadPond (params, next) {

  desktop.load.remoteAssets([
    'pond' // this loads the sibling desktop.app.pond.html file into <div id="window_pond"></div>
  ], function (err) {

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
      // these ids are used later when desktop.ui.openWindow('buddy_message') is called
      desktop.ui.windowPool['pond_message'].push(window_id)
    }

    $('#window_pond').css('width', 300);
    $('#window_pond').css('height', 340);
    $('#window_pond').css('left', 33);
    $('#window_pond').css('top', 66);

    $('.pondNameList').hide();
    $('.pondMessagesHolder').hide();

    $('.sendPondMessage').on('click', function(){
      desktop.app.pond.sendMessage(this);
      return false;
    });

    // cancel form submit for joining a pond by name
    $('.joinPondForm').on('submit', function(){
      $('.joinPond').trigger('click');
      return false;
    });

    $('.pond_message_text').bind("enterKey",function(e){
      desktop.app.pond.sendMessage(this);
      return false;
    });

    $('.pond_message_text').keyup(function(e){
        if (e.shiftKey==1) {
          // TODO: multi-line chat box
          return false;
        }
        if (e.keyCode == 13) {
          desktop.app.pond.sendMessage(this)
          return false;
        }
    });

    $('.joinPond').on('click', function(){
      if ($('.customPondName').val().length === 0) {
        $('.customPondName').addClass('error');
      } else {
        $('.customPondName').removeClass('error');
        desktop.ui.openWindow('pond_message', $('.customPondName').val())
        desktop.app.pond.openWindow($('.customPondName').val())
      }
    });

    $('.pond_emoji_picker').on('click', function (e) {
      //??? who wrote this selector, rewrite to make more readable please!
      e.target.parentNode?.querySelector('.pond_message_text').focus();
    });

    $('.pond_message_text').on('focus', function (e) {
      $('.activeTextArea').removeClass('activeTextArea');
      e.target.classList.add('activeTextArea')
    });
    $('.insertSnap').on('click', function (e) {
      var form = $(this).parent();
      let context = $('.pond_message_to', form).val();
      JQDX.showWindow('mirror', { type:'pond', context: context});
    });

    $('.insertPaint').on('click', function(){
      let form = $(this).parent();
      let to;
      if (form.hasClass('pond_send_message_form')) {
        to = $('.pond_message_to', form).val();
        desktop.set('paint_active_type', 'pond');
        desktop.set('paint_active_context', to);
      } else {
        to = $('.buddy_message_to', form).val();
        desktop.set('paint_active_type', 'buddy');
        desktop.set('paint_active_context', to);
      }
      JQDX.openWindow('paint');
    });

    $('.insertSound').on('click', function(){
      let form = $(this).parent();
      let to;
      if (form.hasClass('pond_send_message_form')) {
        to = $('.pond_message_to', form).val();
      } else {
        to = $('.buddy_message_to', form).val();
      }
      JQDX.openWindow('soundrecorder', { type: 'pond', context: to });
    });

    next();
  });

};

let pondOpened = false;

desktop.app.pond.openWindow = function (context) {

  if(!context) {
    context = "Lily";
  } 

  // when pond app loads, open default pond for all buddies
  let rightPadding = 10;
  let topPadding = 10;
  
  if (!buddypond.qtokenid) {
    // return;
  }

  let windowKey = desktop.ui.openWindow('pond_message', context);
  let windowId = '#' + windowKey;

  $('.window-context-title', windowId).html(context + ' Pond');
  $('.pond_message_text', windowId).focus();
  $('.pond_message_to', windowId).val(context)
  $('.pond_message_from', windowId).val(buddypond.me);
  pondOpened = true;

  desktop.ui.positionWindow(windowId, 'left')
  $(windowId).css('height', 440);
  return windowId;

  // TODO: doc element title
  // $('.dock_title', dockElement).html(context);
  // $('.pondNameList').show();
}

desktop.app.pond.sendMessage = function sendPondMessage (context) {
  let message = {};
  // console.log('desktop.app.pond.sendMessage context', context);
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

desktop.app.pond.lastNotified = 0;

desktop.app.pond.processMessages = function processMessagesPond (data, cb) {

  $('.pondNameList').show();
  $('.pondMessagesHolder').show();

  if (!defaultPondOpened && pondOpened) {
    defaultPondOpened = true;
    desktop.ui.openWindow('pond_message', 'Lily');
  }

  // TODO: can we remove this?
  let str = JSON.stringify(data);
  // TODO: use key count for garbage collection and trim if size grows
  if (desktop.cache.buddyMessageCache[str]) {
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
    var keys = Object.keys(desktop.ui.openWindows['pond_message']);
    let pondKey = message.to;
    let index = keys.indexOf(pondKey);
    var windowKey = '#window_pond_message_' + index;
    */
    let openPondWindows = desktop.ui.openWindows['pond_message'];
    let windowId = '#' + openPondWindows[message.to]

    message.text = forbiddenNotes.filter(message.text);

    desktop.app.tts.processMessage(message);

    html[windowId] = html[windowId] || '';

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
      str += '<span class="datetime">' + message.ctime + ' </span><span class="purple">' + geoFlag + message.from + ':</span><span class="message purple"></span><br/>';
      if (document.visibilityState === 'hidden') {
        let now = new Date().getTime();
        if (now - desktop.app.pond.lastNotified > 30000) {
          desktop.app.notifications.notifyBuddy(`${message.to} 🐸 ${message.from}: ${message.text}`);
          desktop.app.pond.lastNotified = now;
        }
      }
    }

    $('.chat_messages', windowId).append(`<div class="chatMessage">${str}</div>`);
    $('.message', windowId).last().text(message.text)

    let currentlyDisplayedMessages = $('.chatMessage', windowId);
    if (currentlyDisplayedMessages.length > 33) {
      currentlyDisplayedMessages.first().remove();
    }

    // take the clean text that was just rendered for the last message and check for special embed links
    // TODO: smart links for memes
    // TODO: smart links for snaps links
    // TODO: smart links for audio links
    desktop.smartlinks.replaceYoutubeLinks($('.message', windowId).last());

    // replace cards
    if (message.card) {
      if (message.card.type === 'snaps') {
        message.card.snapURL = window.origin + '/' + message.card.snapURL;
        let arr = message.card.snapURL.split('.');
        let ext = arr[arr.length -1];
        if (ext === 'gif') {
          $('.chat_messages', windowId).append(`
           <span class="message">
            <img class="remixPaint" title="Remix this Paint" data-type="pond" data-context="${message.to}" src="desktop/assets/images/icons/icon_remix_64.png"/>
            <img id="${message.uuid}" class="snapsImage image" src="${message.card.snapURL}"/>
           </span>
           <br/>
          `);
        } else {
          $('.chat_messages', windowId).append(`
           <span class="message">
            <img class="remixPaint" title="Remix this Paint" data-type="pond" data-context="${message.to}" src="desktop/assets/images/icons/icon_remix_64.png"/>
            <img id="${message.uuid}" class="paintsImage image" src="${message.card.snapURL}"/>
           </span>
           <br/>
          `);
        }
        // don't reply the large media cards ( asks server to ignores them on further getMessages calls)
        desktop.messages._processedCards.push(message.uuid);
      }

      if (message.card && message.card.type === 'meme') {
        message.card.filename = window.origin + '/memes/' + message.card.filename;
        $('.chat_messages', windowId).append(`
         <span class="message">
          <img class="remixMeme" title="Remix this Meme" data-type="pond" data-context="${message.to}" src="desktop/assets/images/icons/icon_remix_64.png"/>
          <strong>${message.card.title}</strong><br/><em>Levenshtein: ${message.card.levenshtein} Jaro Winkler: ${message.card.winkler}</em><br/><img class="card-meme image" src="${message.card.filename}"/>
         </span>
         <br/>
        `);
        desktop.messages._processed.push(message.uuid);
        return;
      }

      if (message.card && message.card.type === 'audio') {
        message.card.soundURL = window.origin + '/' + message.card.soundURL;
        $('.message', windowId).last().append(`
          <strong><a href="#openSound" class="openSound" data-soundurl="${message.card.soundURL}">Play <img class="playSoundIcon" src="desktop/assets/images/icons/icon_soundrecorder_64.png"/></a></strong>
        `);
        desktop.messages._processed.push(message.uuid);
        return;
      }

    }
    desktop.messages._processed.push(message.uuid);
  });

  for (let key in html) {
    $('.no_chat_messages', key).hide();
    try {
      if (data.messages.length > 0) {
        //      let el = $('.chat_messages', '.pond_message_main')
        setTimeout(function(){
          let el = $('.window_content', key);
          $(el).scrollTop(999999);
        }, 1111)
      }
    } catch (err) {
      console.log('Waring: Was unable to scrollTop on pond messages', err);
    }
  }

  cb(null, true);
}
