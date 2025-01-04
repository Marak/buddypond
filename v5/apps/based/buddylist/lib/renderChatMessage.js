let scrollTimeout;

export default async function renderChatMessage(message, _chatWindow) {

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

  // TODO: scope on processedMessages needs to be keyed by type in addition to context
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

  if (message.removed) {
    // find the chatMessage by uuid
    let removedMessageEl = $(`.chatMessage[data-uuid="${message.removed}"]`); // could be document as well?
    if (removedMessageEl.length > 0) {
      // remove the removed message
      removedMessageEl.remove();
    }
    return;
  }

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
    // here it is, migrate to say app
    // desktop.app.tts.processMessage(message);
  }

  if (this.bp.apps.say && message.text && message.text.startsWith('/say')) {
    // this is a /say message
    this.bp.apps.say.processMessages(message);
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

  let bp = this.bp;
  function renderMessage(message, messageTime, chatWindow, container) {
    // Create elements
    let chatMessage = document.createElement('div');
    chatMessage.className = 'chatMessage';

    // Prepare the date-time display
    let dateTimeSpan = document.createElement('span');
    dateTimeSpan.className = 'datetime';
    dateTimeSpan.textContent = messageTime;

    // Determine message sender and apply styles
    let senderText;
    if (message.from === 'anonymous') {
      // Include a tripcode for anonymous messages; use a default if none provided
      let tripcode = message.tripcode || 'tr1pc0d3';
      senderText = `${message.from} (${tripcode}): `;
    } else {
      // For non-anonymous users, just use the username followed by a colon
      senderText = `${message.from}: `;
    }

    let messageSender = document.createElement('span');
    messageSender.setAttribute('data-from', message.from);
    messageSender.setAttribute('data-to', message.to);
    messageSender.setAttribute('data-type', message.type);
    let messageClass = message.from === bp.me ? '' : 'purple';
    messageSender.className = messageClass;
    messageSender.classList.add('buddy-message-sender');
    messageSender.textContent = senderText;

    // Prepare geoFlag (assuming renderGeoFlag is a function returning an element)
    let geoFlag = renderGeoFlag(message);

    // Combine elements for the sender
    messageSender.prepend(geoFlag);  // Prepend geoFlag to the sender span

    // Prepare the message content span
    let messageContent = document.createElement('span');
    messageContent.className = `message ${messageClass}`;
    messageContent.textContent = message.text; // Assuming 'message.text' contains the message text

    // Combine all parts into the chatMessage
    chatMessage.appendChild(dateTimeSpan);
    chatMessage.appendChild(messageSender);
    chatMessage.appendChild(messageContent);
    chatMessage.appendChild(document.createElement('br'));

    const aimMessages = chatWindow.content.querySelector('.aim-messages');

    if (container) {
      chatMessage.appendChild(container);
    } else {
      chatMessage.setAttribute('data-uuid', message.uuid);
    }

    // Since images may be lazy loaded we won't know their height until they load
    // After each image loads attempt to scroll to the bottom
    // Without this code, the scroll to bottom functionality will not scroll all the way down
    $(chatMessage).find('img').on('load', function () {
      // Scroll again after each image loads
      scrollToBottom();
    });

    aimMessages.appendChild(chatMessage);

  }

  renderMessage(message, messageTime, chatWindow, container);

  // Example usage: renderMessage(messageObject, '12:00 PM', chatWindowObject);


  // console.log('content', chatWindow.content)
  // chatWindow.content.innerHTML = 'FFFFF';

  // Scroll to the last message
  function scrollToBottom() {
    const lastElement = $('.message', chatWindow.content).last()[0];
    if (lastElement) {
      clearInterval(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        // console.log('scrolling to bottom', lastElement);
        lastElement.scrollIntoView({ behavior: 'instant' });
      }, 1);
    }
  }

  // Initially try to scroll to the bottom
  scrollToBottom();



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
  if (message.location === 'outer space') {
    // Set Antarctica to the default flag when the location is 'outer space'
    message.location = 'AQ';
  }

  if (!message.location || message.location === 'outer space') {
    return document.createElement('span');  // Return an empty span if no flag should be displayed
  }

  // Create an image element for the flag
  let img = document.createElement('img');
  img.className = 'geoFlag';
  img.src = `desktop/assets/geo-flags/flags/4x3/${message.location}.svg`;
  return img;
}
