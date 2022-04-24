desktop.app.messages = {};
desktop.app.messages.icon = 'folder';

desktop.app.messages.load = function (params, cb) {
  cb();
};

// rendering incoming message object as chat html
desktop.app.messages.renderChatMessage = function renderChatMessage (message, windowId){

  message.text = forbiddenNotes.filter(message.text);

  desktop.app.tts.processMessage(message);

  message.ctime = new Date(message.ctime).toString();
  message.ctime = DateFormat.format.date(message.ctime, 'E MMMM dd, hh:mm:ss a');

  let str = '';
  let geoFlag = '';
  if (message.location) {
    if (message.location !== 'outer space') {
      geoFlag = `<img class="geoFlag" src="desktop/assets/geo-flags/flags/4x3/${message.location}.svg"/>`;
    }
  }
  if (message.from === buddypond.me) {
    if (message.from === 'anonymous') {
      let tripcode = message.tripcode || 'tr1pc0d3';
      str += `<span class="datetime">${message.ctime}</span> ${geoFlag}${message.from} (${tripcode}): <span class="message"></span><br/>`;
    } else {
      str += `<span class="datetime">${message.ctime}</span> ${geoFlag}${message.from}: <span class="message"></span><br/>`;
    }
  } else {
    if (message.from === 'anonymous') {
      let tripcode = message.tripcode || 'tr1pc0d3';
      str += `<span class="datetime">${message.ctime}</span> <span class="purple">${geoFlag}${message.from} (${tripcode}): </span><span class="message purple"></span><br/>`;
    } else {
      str += `<span class="datetime">${message.ctime}</span> <span class="purple">${geoFlag}${message.from}: </span><span class="message purple"></span><br/>`;
    }
    let now = new Date().getTime();
    if (message.type === 'pond') {
      if (now - desktop.app.pond.lastNotified > 30000) {
        desktop.app.notifications.notifyBuddy(`${message.to} 🐸 ${message.from}: ${message.text}`);
        desktop.app.pond.lastNotified = now;
      }
    } else {
      if (now - desktop.app.buddylist.lastNotified > 3333) {
        desktop.app.notifications.notifyBuddy(`🐸 ${message.from}: ${message.text}`);
        desktop.app.buddylist.lastNotified = now;
      }
    }
  }

  $('.chat_messages', windowId).append(`<div class="chatMessage">${str}</div>`);
  $('.message', windowId).last().text(message.text);

  let currentlyDisplayedMessages = $('.chatMessage', windowId);
  if (currentlyDisplayedMessages.length > 99) {
    currentlyDisplayedMessages.first().remove();
  }

  // take the clean text that was just rendered for the last message and check for special embed links
  // TODO: smart links for memes
  // TODO: smart links for snaps links
  // TODO: smart links for audio links
  desktop.smartlinks.replaceYoutubeLinks($('.message', windowId).last());

  // TODO: replace with budscript.parse, etc
  let first = message.text.substr(0, 1);
  if (first === '\\') {
    let command = message.text.split(' ');
    command[0] = command[0].substr(1, command[0].length - 1);
    message.text = message.text.replace('\\', '/'); // for now
    desktop.commands.chat.buddyscript(message, windowId, command[0]);
    desktop.messages._processedCards.push(message.uuid);
  }

  // replace cards
  if (message.card) {
    if (message.card.type === 'points') {
      $('.chat_messages', windowId).append(desktop.ui.cards.renderGbpCard(message));
      desktop.messages._processedCards.push(message.uuid);
      return;
    }
    
    if (message.card && message.card.type === 'snaps') {
      desktop.app.messages.cards.snap(message, windowId);
      // don't reply the large media cards ( asks server to ignores them on further getMessages calls)
      desktop.messages._processedCards.push(message.uuid);
      desktop.messages._processed.push(message.uuid);
      return;
    }

    if (message.card && message.card.type === 'meme') {
      desktop.app.messages.cards.meme(message, windowId);
      desktop.messages._processed.push(message.uuid);
      return;
    }

    if (message.card && message.card.type === 'audio') {
      desktop.app.messages.cards.audio(message, windowId);
      //desktop.messages._processed.push(message.uuid);
      //return;
    }

  }
}


// renders various cards sent from buddypond server as html
desktop.app.messages.cards = {};

desktop.app.messages.cards.audio = function renderAudioCard (message, windowId) {
  message.card.soundURL = desktop.filesEndpoint + '/' + message.card.soundURL;
  $('.message', windowId).last().append(`
    <strong><a href="#openSound" class="openSound" data-soundurl="${message.card.soundURL}">Play <img class="playSoundIcon" src="desktop/assets/images/icons/icon_soundrecorder_64.png"/></a></strong>
  `);
}

desktop.app.messages.cards.meme = function renderMemeCard (message, windowId) {
  message.card.filename = buddypond.memePath + 'memes/' + message.card.filename;
  $('.chat_messages', windowId).append(`
    <div class="message memeCard">
      <strong>${message.card.title}</strong><br/><em>Levenshtein: ${message.card.levenshtein} Jaro Winkler: ${message.card.winkler}</em>
      <br/>
      <img class="remixGif" title="Remix in GIF Studio" data-output="pond" data-context="${message.to}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
      <img class="remixPaint" title="Remix in Paint" data-output="pond" data-context="${message.to}" src="desktop/assets/images/icons/icon_paint_64.png"/>
      <img class="card-meme image" src="${message.card.filename}"/>
    </div>
    <br/>
  `);
};

desktop.app.messages.cards.snap = function renderSnapCard (message, windowId) {
  message.card.snapURL = desktop.filesEndpoint + '/' + message.card.snapURL;
  let context = message.from;
  if (message.from === buddypond.me) {
    context = message.to;
  }
  let arr = message.card.snapURL.split('.');
  let ext = arr[arr.length -1];
  if (ext === 'gif') {
    $('.chat_messages', windowId).append(`
     <div class="message">
      <img class="remixGif" title="Remix in GIF Studio" data-output="buddy" data-context="${context}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
      <img class="remixPaint" title="Remix in Paint" data-output="buddy" data-context="${context}" src="desktop/assets/images/icons/icon_paint_64.png"/>
      <img id="${message.uuid}" class="snapsImage image" src="${message.card.snapURL}"/>
    </div>
    <br/>
    `);
  } else {
    $('.chat_messages', windowId).append(`
     <div class="message">
      <img class="remixGif" title="Remix in GIF Studio" data-output="buddy" data-context="${context}" src="desktop/assets/images/icons/icon_gifstudio_64.png"/>
      <img class="remixPaint" title="Remix this Paint" data-output="buddy" data-context="${context}" src="desktop/assets/images/icons/icon_paint_64.png"/>
      <img id="${message.uuid}" class="paintsImage image" src="${message.card.snapURL}"/>
     </div>
     <br/>
    `);
  }
}
desktop.app.messages.cards.points = function renderPointsCard () {}
