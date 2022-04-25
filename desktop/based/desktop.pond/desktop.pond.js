desktop.app.pond = {};
desktop.app.pond.label = 'Ponds';

desktop.app.pond.subscribedPonds = [];

desktop.app.pond.load = function loadPond (params, next) {

  desktop.load.remoteAssets([
    'pond' // this loads the sibling desktop.app.pond.html file into <div id="window_pond"></div>
  ], function (err) {

    $('#window_pond').css('width', '44vw');
    $('#window_pond').css('height', '75vh');
    $('#window_pond').css('top', '9vh');
    $('#window_pond').css('left', '21vw');

    //
    // "#window_pond" event handlers
    // used for joining Ponds, clicking on pond names, general pond settings, etc
    //
    $('.openPond').on('click', function () {
      let chan = $(this).attr('href');
      chan = chan.substr(1, chan.length - 1);
      desktop.ui.openWindow('pond', { context: chan });
    });

    // cancel form submit for joining a pond by name
    $('.joinPondForm').on('submit', function () {
      $('.joinPond').trigger('click');
      return false;
    });

    $('.joinPond').on('click', function () {
      if ($('.customPondName').val().length === 0) {
        $('.customPondName').addClass('error');
      } else {
        $('.customPondName').removeClass('error');
        let pondName = $('.customPondName').val();
        desktop.ui.openWindow('pond', { context: pondName });
      }
    });

    //
    // "#window_pond_*" event handlers
    // used for handling dynamic pond windows with a context
    //
    let d = $(document);

    // cancel all form submits ( or entire page will redirect )
    d.on('submit', '.pond_send_message_form', function () {
      return false;
    });

    d.on('mousedown', '.sendPondMessage', function (ev) {
      desktop.app.pond.sendMessage(this);
      return false;
    });

    d.keypress(function (ev) {
      if (ev.which === 13) {
        if ($(ev.target).hasClass('pond_message_text')) {
          desktop.app.pond.sendMessage($(ev.target));
          return false;
        }
      }
    });

    /* TODO: bring back holding shift key to make multiline, doesnt work now anyway due to trim() elsewhere
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
    */

    d.on('mousedown', '.pond_emoji_picker', function (ev) {
      let holder = $(ev.target).parent().parent().parent();
      let textarea = $('.pond_message_text', holder);
      $('.activeTextArea').removeClass('activeTextArea');
      $(textarea).addClass('activeTextArea');
      $('.pond_message_text', holder).focus();
    });

    d.on('mousedown', '.insertSnap', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let context = $('.pond_message_to', form).val();
      desktop.ui.openWindow('mirror', { type: 'pond', context: context });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('mousedown', '.insertPaint', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let context, output;
      output = 'pond';
      context = $('.pond_message_to', form).val();
      JQDX.openWindow('paint', { 
        output: output,
        context: context
      });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('mousedown', '.insertGif', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let context, output;
      output = 'pond';
      context = $('.pond_message_to', form).val();
      JQDX.openWindow('gifstudio', { 
        output: output,
        context: context
      });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('mousedown', '.insertSound', function (ev) {
      let form = $(ev.target).parent().parent().parent();
      let to;
      to = $('.pond_message_to', form).val() ||  $('.buddy_message_to', form).val();
      JQDX.openWindow('soundrecorder', { type: 'pond', context: to });
      // required to not re-trigger window_stack on pond window itself ( with click )
      ev.preventDefault();
      ev.stopPropagation();
    });

    d.on('click', '.purple:not(.message)', function () {
      const parent = $(this).parents('.window.pond_message');
      const textBox = parent.find('textarea[name="pond_message_text"]');
      parent.find('textarea[name="pond_message_text"]').val(
        `${textBox.val()}@${$(this).text().split(':')[0]}`
      );
    });

    next();
  });

};

desktop.app.pond.renderChatWindow = function (context) {

  let clone = $('#window_pond_message_0').html();
  let dockItemClone = $('#icon_dock_pond_message_0').html();

  let _clone = clone.replace('icon_dock_pond_message_0', 'icon_dock_pond_message_' + context);
  _clone = _clone.replace('pond_message_text_0', 'pond_message_text_' + context);
  _clone = _clone.replace('pond_emoji_picker_0', 'pond_emoji_picker');

  let window_id = 'window_pond_message_' + context;

  let pondChatWindowHTML = `
    <div id="${window_id}" class="abs window pond_message"  data-app="pond" data-type="pond_message" data-context="${context}">${_clone} </div>
  `;

  $('#desktop').append(pondChatWindowHTML);
  let dockStr = dockItemClone.replace('window_pond_message_0', 'window_pond_message_' + context);
  dockStr = '<li id="icon_dock_pond_message_' + context +'">' + dockStr + '</li>';
  $('#dock').append(dockStr);
  desktop.ui.renderDockElement('pond_message_' + context, context);

};

desktop.app.pond.openWindow = function (params) {

  params = params || {};
  
  if (params.context) {

    let windowId = '#window_pond_message_' + params.context;

    if (desktop.app.pond.subscribedPonds.indexOf(params.context) === -1) {
      desktop.app.pond.subscribedPonds.push(params.context);
      buddypond.pondSendMessage(params.context, 'has joined the Pond', function (err, data) {});
    }

    // check to see if window already exists, if so do not re-render
    // Remark: In the future, we shouldn't have to make this check as it will be expected window is always removed
    if ($(windowId).length === 0) {
      desktop.app.pond.renderChatWindow(params.context);
    
      $('.window-context-title', windowId).html('#' + params.context);
      if (desktop.ui.view === 'Mobile') {
        $('.pond_message_text', windowId).focus();
      }
      $('.pond_message_to', windowId).val(params.context);
      $('.pond_message_from', windowId).val(buddypond.me);

      $(windowId).css('left', '30vw');
      if (params.context === 'Paint') {
        $('.pond_message_text', windowId).hide();
        $('.pond_emoji_picker', windowId).hide();
        $('.insertSound', windowId).hide();
        $('.insertSnap', windowId).hide();
      } else if (params.context === 'Memes' || params.context === 'Say') {
        // TODO: make #Say a comics chat room with audio
        // $('.pond_message_text', windowId).attr('placeholder', 'Anything you type here will get converted into a Meme by Mnemosyne');
        $('.pond_emoji_picker', windowId).hide();
        $('.insertSound', windowId).hide();
        $('.insertGif', windowId).hide();
        $('.insertPaint', windowId).hide();
        $('.insertSnap', windowId).hide();
      } else {
        $('.pond_message_text', windowId).show();
        $('.pond_emoji_picker', windowId).show();
        $('.insertSound', windowId).show();
        $('.insertSnap', windowId).show();
      }

      $(windowId).css('width', '44vw');
      $(windowId).css('height', '75vh');
      $(windowId).css('top', '9vh');
      $(windowId).css('left', '30vw');
      // flatten other windows, show that window as active top stack
      JQDX.window_flat();
      $(windowId).addClass('window_stack').show();
    }
    return;
  }

};

desktop.app.pond.closeWindow = function (params) {
  // if instance window, we'll want to remove it from DOM
  // this is so we don't get many shadow windows with render HTML hidden in DOM not being used

  // Remark: This is currently commented out due to message cache invalidation
  //         We will need to invalidate the message cache for this pond_message context,
  //         so then when / if it is re-opened it will re-load messages
  //$('#window_pond_message_' + params.context).remove();
  if (params.context) {
    let index = desktop.app.pond.subscribedPonds.indexOf(params.context);
    desktop.app.pond.subscribedPonds.splice(index, 1);
    buddypond.pondSendMessage(params.context, 'has left the Pond', function (err, data) {});
  }
};

desktop.app.pond.sendMessage = function sendPondMessage (context) {
  let message = {};
  // console.log('desktop.app.pond.sendMessage context', context);
  let form = $(context).parent();
  message.text = $('.pond_message_text', form).val();
  message.to = $('.pond_message_to', form).val();
  message.from = $('.pond_message_from', form).val();
  message.type = 'pond';

  if (message.text.trim() === '') {
    return;
  }

  // empty text area input
  $('.pond_message_text', form).val('');

  const processed = desktop.commands.preProcessMessage(message, '#window_pond_message_' + message.to);

  if (processed) {
    return;
  }

  buddypond.pondSendMessage(message.to, message.text, function (err, data) {
    //console.log('buddypond.pondSendMessage', err, data)
    // Remark: This will check for local user text commands such as /quit
    //         These are done *after* the message is sent to the server to ensure,
    //         that the message is sent before buddy logs out
    desktop.commands.postProcessMessage(message);
  });
};

desktop.app.pond.lastNotified = 0;

// TODO: replace with event emitter
desktop.app.pond.processMessages = function processMessagesPond (data, cb) {

  let html = {};

  data.messages.forEach(function (message) {

    if (message.type !== 'pond') {
      return;
    }

    let windowId = '#window_pond_message_' + message.to;
    // TODO: replace html var
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
          let el = $('.pond_message_main', key);
          $(el).scrollTop(999999);
        }, 1111);
      }
    } catch (err) {
      console.log('Waring: Was unable to scrollTop on pond messages', err);
    }
  }

  cb(null, true);
};