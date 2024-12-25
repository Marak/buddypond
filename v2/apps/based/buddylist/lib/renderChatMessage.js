export default function renderChatMessage(message) {
  //console.log('buddy list local this.data', this.data);
  //console.log("renderChatMessage", message, message.uuid);
  //console.log('this.data.processedMessages', this.data.processedMessages);

  // Determine the window ID based on the message context
  let windowId = `buddy_message_-${message.to}`;
  if (message.to === this.bp.me) {
    windowId = `buddy_message_-${message.from}`;
  } else if (message.type === 'pond') {
    windowId = `pond_message_-${message.to}`;
  }

  let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowId);

  // Check if message has been processed to avoid duplication
  if (this.data.processedMessages.includes(message.uuid)) {
    return;
  }

  // Manage size of processedMessages to prevent memory leaks
  if (this.data.processedMessages.length > 5000) {
    this.data.processedMessages.shift();
  }

  // Format message time
  message.ctime = new Date(message.ctime).toString();
  message.ctime = DateFormat.format.date(message.ctime, 'E MMMM dd, hh:mm:ss a');

  // Prepare message HTML
  let geoFlag = renderGeoFlag(message);
  let str = `<span class="datetime">${message.ctime}</span> `;
  let messageSender = message.from === 'anonymous' ? `${message.from} (${message.tripcode || 'tr1pc0d3'}): ` : `${message.from}: `;
  let messageClass = message.from === this.bp.me ? '' : 'purple';

  str += `<span class="${messageClass}">${geoFlag}${messageSender}</span><span class="message ${messageClass}"></span><br/>`;

  // Append message to the chat window
  $('.aim-messages', chatWindow.content).append(`<div class="chatMessage">${str}</div>`);
  $('.message', chatWindow.content).last().text(message.text);

  // Scroll to the last message
  let lastElement = $('.message', chatWindow.content).last()[0];
  lastElement.scrollIntoView({ behavior: 'smooth' });

  // Add the processed message UUID to prevent reprocessing
  this.data.processedMessages.push(message.uuid);
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
