
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
  

  /* May need to add this back?
  if (this.data.processedMessages[context].includes(message.uuid)) {
    return;
  }
  */

  // Manage size of processedMessages to prevent memory leaks
  if (this.data.processedMessages[context].length > 5000) {
    this.data.processedMessages[context].shift();
  }

  if (message.isTyping) {
    // emit buddy::isTyping
    console.log('buddy::isTyping', message);
    this.bp.emit('buddy::isTyping', message);
    return;
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


  // TODO: allow buddylist to register message processors
  // Is most likely best handled using SystemsManager from ECS code
  // this way all app can register an update method
  // we can give each app an onMessage method and have the ECS S delegate the message to the app
  // bp.apps.buddylist.addMessageProcessor('buddyscript', function (message) {});
  // bp.apps.buddylist.addMessageProcessor('card', function (message) {});
  // etc
  // this way we don't have to pollute the buddylist with all the message processing logic
  // Legacy BP API
  // TODO: Migrate TTS app to v5 API
  if (desktop && desktop.app && desktop.app.tts && desktop.app.tts.processMessage) {
    desktop.app.tts.processMessage(message);
  }

  // Format message time
  let messageTime = new Date(message.ctime).toString();

  // check if mobile, is so shorten the time
  // legacy API
  if (this.bp.apps.ui.isMobile()) {
    messageTime = DateFormat.format.date(messageTime, 'hh:mm:ss a');

  } else {
    messageTime = DateFormat.format.date(messageTime, 'E MMMM dd, hh:mm:ss a');

  }
  
  //console.log('message', message)
  // Check to see if message is type card

  let container;
  if (message.card && this.bp && this.bp.apps && this.bp.apps.card) {
    //console.log('message is', message);
    //console.log('message is card', message.card);

    let cardData = message.card;
    cardData.message = message;
    let cardManager = this.bp.apps.card.cardManager;

    const _card = await cardManager.loadCard(cardData.type, cardData);
    container = document.createElement('div');
    container.classList.add('cardContainer');
    _card.render(container);


  }

  // Prepare message HTML
  let geoFlag = renderGeoFlag(message);
  let str = `<span class="datetime">${messageTime}</span> `;
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
    $('.message', chatWindow.content).last().text(message.text);

  }

  // console.log('content', chatWindow.content)
  // chatWindow.content.innerHTML = 'FFFFF';

  // Scroll to the last message
  // Remark: this seems to have an issue with images? height not being calculated in time?
  let lastElement = $('.message', chatWindow.content).last()[0];
  if (lastElement) {
    // console.log('scrolling to last message', lastElement);
    setTimeout(function () {
      // still not working all the way? hrmmmm
      lastElement.scrollIntoView({ behavior: 'smooth' });
    }, 400);

  }

  // console.log('parseChatMessage result', result);

  // Add the processed message UUID to prevent reprocessing
  this.data.processedMessages[context].push(message);

  // emit the freshly processed message for any post processing events ( such as playing a sound )
  if (message.type === 'pond') {
    this.bp.emit('pond::message::processed', message);
  } else {
    this.bp.emit('buddy::message::processed', message);
  }

} 


function renderGeoFlag(message) {
  let geoFlag = '';
  if (message.location === 'outer space') {
    // set antarctica to the default flag
    message.location = 'AQ';
  }
  if (message.location) {
    if (message.location !== 'outer space') {
      geoFlag = `<img class="geoFlag" src="desktop/assets/geo-flags/flags/4x3/${message.location}.svg"/>`;
    } else {
      geoFlag = ``;
    }
  }
  return geoFlag;
}
