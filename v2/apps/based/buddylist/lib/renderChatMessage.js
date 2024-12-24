
export default function renderChatMessage (message, windowId){

    console.log('renderChatMessage', message, windowId)
    message.ctime = new Date(message.ctime).toString();
    message.ctime = DateFormat.format.date(message.ctime, 'E MMMM dd, hh:mm:ss a');
  
    windowId = 'chatWindow-' + message.from.replace(/[^a-zA-Z0-9]/g, '-');


    // get the base html template for the chat window
    let chatWindowTemplate = this.messageTemplateString;
    // create new element from HTML string
    let cloned = document.createElement('div');
    cloned.innerHTML = chatWindowTemplate;
   //  alert('hi')
    //let cloned = chatWindowTemplate.cloneNode(true);
    //console.log("CLONED: ", cloned);

    
    // check to see if the window exists, if not create it with api.ui.createWindow
    let messageWindow = null;
    let found = this.bp.apps.ui.windowManager.windows.find(w => w.id === windowId);
    if (!found) {
      messageWindow = this.bp.apps.ui.windowManager.createWindow({
        parent: this.bp.apps.ui.parent,
        title: message.from,
        id: windowId,
        width: 600,
        height: 500,
        x: 100,
        y: 100
      });
      messageWindow.content.appendChild(cloned);

      messageWindow.open();

      console.log("MADE NEW WINDOW: ", messageWindow);
    } else {
      messageWindow = this.bp.apps.ui.windowManager.windows.find(w => w.id === windowId);
    }

    console.log("MESSAGE WINDOW: ", messageWindow);


    let str = '';
    // TODO: just stub out renderGeoFlag() for placeholder
    let geoFlag = renderGeoFlag(message);
  
    if (message.from === this.bp.me) {
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
        */
    }
  
    /*

      TODO: very basic jQuery $ replacement
      This is a very basic replacement for jQuery $,
      contains the following essentials methods and APIS

      - append
      - last
      - first
      - remove
      - forEach
      - querySelector (very basic) - only supports tag selectors


    */
    console.log('windowId', windowId, message.text);
    $('.chat_messages', '#' + windowId).append(`<div class="chatMessage">${str}</div>`);
    $('.message', '#' + windowId).last().text(message.text);

    
    // get the last .message element with id = windowId
    console.log("WINDOW ID: ", windowId);
    let lastElement = document.querySelector(`#${windowId} .message:last-child`);
    // set the text of the last element
    // lastElement.textContent = message.text;
    //$('.message', windowId).last().text(message.text);
    return;
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
  



  function renderGeoFlag (message) {
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
  