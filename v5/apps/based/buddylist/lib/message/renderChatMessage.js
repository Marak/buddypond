// TODO: we need to formalize this file by separating concerns and making separate functions
// best to start small with a first sweep of organizing code into functions with proper scope
// and removing any potential dead code ( while being very careful to not remove anythign that is needed )

import forbiddenNotes from '../forbiddenNotes.js';
import renderGeoFlag from './renderGeoFlag.js';
import isValidUrl from './isValidUrl.js';
import isValidYoutubeLink from './isValidYoutubeLink.js';
import isValidGithubLink from './isValidGithubLink.js';

let scrollTimeout;

// TODO: make useMarkdown a user setting
let useMarkdown = true;
// TODO: make allowHTML a user setting
let allowHTML = true;

export default async function renderChatMessage(message, _chatWindow) {
  // console.log('renderChatMessage', message, _chatWindow);
  let context = 'default';

  // console.log('current state', this.bp.apps.buddylist.data.profileState)

  // profanity filter
  if (message.text && message.text.length > 0) {
    message.text = forbiddenNotes.filter(message.text);
  }

  // TODO: check if there is a .roll and if so, show a small link to expand the roll
  // TODO: add back meme bot


  if (isValidUrl(message.text)) {
    let contentUrl = message.text;
    // This is a URL, process it as such
    message.card = {
      url: message.text,
      type: 'url',
    };
    message.text = 'I sent a link:';
    // check to see if file extention is supportedImageTypes, if so it's data.card.type = 'image'
    if (contentUrl) {
      let ext = contentUrl.split('.').pop();
      if (buddypond.supportedImageTypesExt.includes(ext)) {
        message.card.type = 'image';
        message.text = 'I sent an image:';
      }
      if (buddypond.supportedAudioTypesExt.includes(ext)) {
        message.card.type = 'audio';
        message.text = 'I sent audio:';
      }
      if (buddypond.supportedVideoTypes.includes(ext)) {
        //data.card.type = 'video'; // soon TODO
      }
    }

    // TODO: move all this app specific code *outside* of the buddylist / renderMessage
    // use the system.addMessageProcessor() API instead
    if (isValidYoutubeLink(contentUrl)) {
      message.card.type = 'youtube';
      message.card.thumbnail = `https://img.youtube.com/vi/${contentUrl.split('v=')[1]}/0.jpg`;
      message.card.videoId = contentUrl.split('v=')[1];
      message.text = 'I sent a youtube link:';
    }

    if (isValidGithubLink(contentUrl)) {
      message.card.type = 'github';
      message.text = 'I sent a github link:';

      // TODO: Extract owner, repo, and filename from the URL
      const githubRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/;
      const match = contentUrl.match(githubRegex);
      if (match) {
        message.card.owner = match[1]; // "Marak"
        message.card.repo = match[2]; // "buddypond"
        message.card.filename = match[4]; // "v5/apps/based/client/lib/api.js"
      } else {
        console.error("Invalid GitHub URL format.");
      }


    }

    // TODO: we know is URL now, we can check to see if its a youtube link
    // or another type of link
    // and render that using the card system


    // message.text = 'I sent a link outside of BuddyPond:';
    // TODO: detect type based on URL extension, use supportedTypes array
    // img, media, video, audio, etc
    // use smartlinks if youtube open youtube player, etc audio player
  }

  // if there is a #pondname in the message, add a pond card type
  let pondNames = findAllHashPondNames(message.text);
  if (pondNames.length > 0) {
    message.card = {
      type: 'pond',
      pondNames: pondNames
    }
  }


  // Determine the window ID based on the message context
  let windowId = `buddy_message_-${message.to}`;


  if (message.type === 'buddy') {

    if (message.to === this.bp.me) {
      windowId = `buddy_message_-${message.from}`;
      context = message.from;
    } else {
      windowId = `buddy_message_-${message.to}`;
      context = message.to;
    }

  }

  if (message.type === 'pond') {
    context = message.to;
    windowId = `pond_message_-${message.to}`;
  }
  // console.log('windowIdwindowId', windowId)
  // TODO: scope on processedMessages needs to be keyed by type in addition to context
  this.data.processedMessages[context] = this.data.processedMessages[context] || [];
  //alert(windowId)
  let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowId);
  if (_chatWindow) {
    chatWindow = _chatWindow;
  }

  // Check if message already exists in the DOM
  if (document.querySelector(`.chatMessage[data-uuid="${message.uuid}"]`)) {
    return; // Message is already rendered
  }

  // Check if message has been processed to avoid duplication
  for (let i = 0; i < this.data.processedMessages[context].length; i++) {
    if (this.data.processedMessages[context][i].uuid === message.uuid) {
      return;
      // we have a special case here we wish to re-render the client message
      // this indicates the server filtered parts of the message and it should be removed and re-rendered
      if (this.data.processedMessages[context][i].from === this.bp.me && this.data.processedMessages[context][i].text !== message.text) {
        // find the chatMessage by uuid
        let filteredMessageEl = $(`.chatMessage[data-uuid="${message.uuid}"]`, chatWindow.content);
        if (filteredMessageEl.length > 0) {
          // remove the filtered message
          filteredMessageEl.remove();
          //this.bp.emit('buddy::message::gotfiltered', message);
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
  // TODO: Migrate TTS app to v5 API

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
  /* TODO: keep this code, just keep it commented out for now
  if (message.roll) {
    // message represents a random roll from Ramblor
    // show special cards with stats
    message.card = {
      type: 'roll',
      roll: message.roll,
      text: message.text,
      from: message.from,
      to: message.to,
      uuid: message.uuid,
      id: message.id,
      ctime: message.ctime,
      message: message,
    };
  }
  */


  // Check to see if message is type card

  let container;
  if (message.card && this.bp && this.bp.apps && this.bp.apps.card) {
    //console.log('message is', message);
    //console.log('message is card', message.card);

    let cardData = message.card;
    // console.log("USING CARD", cardData, message);
    // make sure card has props
    if (Object.keys(cardData).length > 0) {

      // create a clone of message
      let cloned = Object.assign({}, message);
      delete cloned.card;
      cardData.message = message; // TODO probably should clone for CardManager, etc
      // default JSON rendering will now fail by default due to nested messages cards with arbitrary props ( no .data scope either ), .context might be good...
      let cardManager = this.bp.apps.card.cardManager;

      const _card = await cardManager.loadCard(cardData.type, cardData);
      container = document.createElement('div');
      container.classList.add('cardContainer');
      _card.render(container);
    }

  }

  let bp = this.bp;

  // TODO: move this to separate file first
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
    // TODO: remove from messageSender, use parent element
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


    // render as markdown ( if enabled )
    // TODO: should probably be a markdown registered as messagesProcessor with SystemsManager
    if (useMarkdown) {
      message.text = parseMarkdownWithoutPTags(message.text);
      console.log('message.text', message.text)
    }

    // Prepare the message content span
    let messageContent = document.createElement('span');
    messageContent.className = `message ${messageClass}`;

    if (allowHTML) {
      $(messageContent).html(message.text);
      //messageContent.textContent = message.text; // Assuming 'message.text' contains the message text

    }

    // Combine all parts into the chatMessage
    chatMessage.appendChild(dateTimeSpan);
    chatMessage.appendChild(messageSender);
    chatMessage.appendChild(messageContent);
    chatMessage.appendChild(document.createElement('br'));

    const aimMessages = chatWindow.content.querySelector('.aim-messages');

    if (container) {
      chatMessage.appendChild(container);
    } else {

    }
    chatMessage.setAttribute('data-id', message.id);
    chatMessage.setAttribute('data-from', message.from);
    chatMessage.setAttribute('data-to', message.to);
    chatMessage.setAttribute('data-type', message.type);
    chatMessage.setAttribute('data-uuid', message.uuid);

    // Since images may be lazy loaded we won't know their height until they load
    // After each image loads attempt to scroll to the bottom
    // Without this code, the scroll to bottom functionality will not scroll all the way down
    $(chatMessage).find('img').on('load', function () {
      // Scroll again after each image loads
      scrollToBottom();
    });

    // Find all messages in chat ordered by data-id
    let allMessages = Array.from(aimMessages.querySelectorAll('.chatMessage'));
    let inserted = false;

    // Iterate over existing messages to find the correct insertion point
    for (let existingMessage of allMessages) {
      let existingId = parseInt(existingMessage.getAttribute('data-id'), 10);
      if (message.id < existingId) {
        aimMessages.insertBefore(chatMessage, existingMessage); // Insert before the first larger ID
        inserted = true;
        break;
      }
    }

    // If no larger ID was found, append it to the end
    if (!inserted) {
      aimMessages.appendChild(chatMessage);
    }

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

// TODO: add via addMessageProcessor() on `marked` and `pond` apps

// Function to remove outer <p> tags
function parseMarkdownWithoutPTags(markdown) {
  let html = marked.parse(markdown);
  return html.replace(/^<p>(.*?)<\/p>\s*$/s, '$1');
  // Explanation:
  // ^<p>       → Matches the opening <p> at the start
  // (.*?)      → Captures the content inside (non-greedy)
  // <\/p>\s*$  → Matches the closing </p> with optional trailing whitespace
  // $1         → Returns only the captured content
}


function findAllHashPondNames(text) {
  // Given a string such as "The #test room is good also is #music"
  // return an array of all the pond names without the '#' symbol
  // TODO: may need a safe regex helper for bp
  let hashPondNameRegex = /#([a-zA-Z0-9_-]+)/g;
  let matches = [];
  let match;
  // Using regex.exec to capture groups in a global search
  while ((match = hashPondNameRegex.exec(text)) !== null) {
    matches.push(match[1]); // match[1] contains the pond name without '#'
  }
  return matches;
}