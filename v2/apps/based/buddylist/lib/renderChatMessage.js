// Remark: Not actually async ( yet ) so cards may render out of order ( for now )
export default async function renderChatMessage(message, _chatWindow) {
  //console.log('buddy list local this.data', this.data);
  // console.log("renderChatMessage", message, message.uuid);
  //console.log('this.data.processedMessages', this.data.processedMessages);

  let context = 'default';

  // Determine the window ID based on the message context
  let windowId = `buddy_message_-${message.to}`;
  if (message.to === this.bp.me) {
    windowId = `buddy_message_-${message.from}`;
    context = message.from;
  } else if (message.type === 'pond') {
    context = message.to;
    windowId = `pond_message_-${message.to}`;
  }

  this.data.processedMessages[context] = this.data.processedMessages[context] || [];
  
  let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowId);

  if (_chatWindow) {
    chatWindow = _chatWindow;
  }
  
  // Check if message has been processed to avoid duplication
  for (let i = 0; i < this.data.processedMessages[context].length; i++) {
    if (this.data.processedMessages[context][i].uuid === message.uuid) {
      // we have a special case here we wish to re-render the client message
      // this indicates the server filtered parts of the message and it should be removed and re-rendered
      if (this.data.processedMessages[context][i].from === this.bp.me && this.data.processedMessages[context][i].text !== message.text) {
        // find the chatMessage by uuid
        let filteredMessageEl = $(`.chatMessage[data-uuid="${message.uuid}"]`, chatWindow.content);
        if (filteredMessageEl.length > 0) {
          // remove the filtered message
          filteredMessageEl.remove();
          this.bp.emit('buddy::message::gotfiltered', message);
        }
      } else {
        // else there is no special filtering case from server
        // and the messaged is a duplicate, return and do not render
        return;
      }
    }
  }
  //if (this.data.processedMessages[context].includes(message.uuid)) {
  //  return;
  //}

  // Manage size of processedMessages to prevent memory leaks
  if (this.data.processedMessages[context].length > 5000) {
    this.data.processedMessages[context].shift();
  }

  // check if this is an Agent message which gets processed first
  if (message.type === 'agent') {

    // Legacy BP API
    if (desktop && desktop.app && desktop.app.spellbook && desktop.app.spellbook[message.text]) {
      desktop.app.spellbook[message.text]();
      return;
    } else {
      console.log('unknown agent message', message);
    }
  }

  // Legacy BP API
  // TODO: Migrate TTS app to v5 API
  if (desktop && desktop.app && desktop.app.tts && desktop.app.tts.processMessage) {
    console.log("TTS MESSAGE processMessage", message);
    desktop.app.tts.processMessage(message);

  }


  // Format message time
  message.ctime = new Date(message.ctime).toString();
  message.ctime = DateFormat.format.date(message.ctime, 'E MMMM dd, hh:mm:ss a');

  //console.log('message', message)
  // Check to see if message is type card

  let container;
  if (message.card && this.bp && this.bp.apps && this.bp.apps.card) {
    console.log('message is', message);
    console.log('message is card', message.card);


    let cardData = message.card;
    let cardManager = this.bp.apps.card.cardManager;

    const _card = await cardManager.loadCard(cardData.type, cardData);
    container = document.createElement('div');
    container.classList.add('cardContainer');
    _card.render(container);


  }

  // Prepare message HTML
  let geoFlag = renderGeoFlag(message);
  let str = `<span class="datetime">${message.ctime}</span> `;
  let messageSender = message.from === 'anonymous' ? `${message.from} (${message.tripcode || 'tr1pc0d3'}): ` : `${message.from}: `;
  let messageClass = message.from === this.bp.me ? '' : 'purple';

  str += `<span class="${messageClass}">${geoFlag}${messageSender}</span><span class="message ${messageClass}"></span><br/>`;

  //console.log('chatWindowchatWindowchatWindow', chatWindow, message)
  //console.log('content', chatWindow.content)
  // Append message to the chat window

  if (container) {
    let chatMessage = document.createElement('div');
    chatMessage.classList.add('chatMessage');
    chatMessage.appendChild(container);
    $('.aim-messages', chatWindow.content).append(chatMessage);
    

  } else {
    $('.aim-messages', chatWindow.content).append(`<div class="chatMessage" data-uuid="${message.uuid}">${str}</div>`);

  }


  $('.message', chatWindow.content).last().text(message.text);
  // console.log('content', chatWindow.content)
  // chatWindow.content.innerHTML = 'FFFFF';

  // Scroll to the last message
  let lastElement = $('.message', chatWindow.content).last()[0];
  if (lastElement) {
    lastElement.scrollIntoView({ behavior: 'smooth' });
  }

  // console.log('parseChatMessage result', result);

  // Add the processed message UUID to prevent reprocessing
  this.data.processedMessages[context].push(message);
}


/* 
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
      

   let currentlyDisplayedMessages = $('.chatMessage', windowId);
   if (currentlyDisplayedMessages.length > 99) {
     currentlyDisplayedMessages.first().remove();
   }
 
 
   // TODO: replace with buddyscript.parse, etc
   // TODO: stub it out if needed
   let first = message.text.substr(0, 1);
   if (first === '\\') {
     let command = message.text.split(' ');
     command[0] = command[0].substr(1, command[0].length - 1);
     message.text = message.text.replace('\\', '/'); // for now
     desktop.commands.chat.buddyscript(message, windowId, command[0]);
     desktop.messages._processedCards.push(message.uuid);
   }
 
   // TODO: replace all this logic with a generic card renderer
   if (message.card) {
     if (message.card.type === 'points') {
       // TODO: switch API to new cards API
       desktop.app.messages.cards.points(message, windowId);
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
    */




function renderGeoFlag(message) {
  let geoFlag = '';
  if (message.location) {
    if (message.location !== 'outer space') {
      geoFlag = `<img class="geoFlag" src="desktop/assets/geo-flags/flags/4x3/${message.location}.svg"/>`;
    } else {
      geoFlag = ``;
    }
  }
  return geoFlag;
}
