// TODO: we need to formalize this file by separating concerns and making separate functions
// best to start small with a first sweep of organizing code into functions with proper scope
// and removing any potential dead code ( while being very careful to not remove anythign that is needed )

import forbiddenNotes from '../forbiddenNotes.js';
import isValidUrl from './isValidUrl.js';
import isValidYoutubeLink from './isValidYoutubeLink.js';
import isValidGithubLink from './isValidGithubLink.js';
import scrollToBottom from './scrollToBottom.js';

export default async function renderChatMessage(message, _chatWindow) {
  // console.log('renderChatMessage', message, _chatWindow);
  let context = 'default';
  // console.log('renderChatMessage', message);
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
      message.card.context = contentUrl.split('v=')[1];
      message.text = 'I sent a youtube link:';
      message.text = '';
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
  if (message.text && message.text.length > 0) {
    let pondNames = findAllHashPondNames(message.text);
    if (pondNames.length > 0) {
      message.card = {
        type: 'pond',
        pondNames: pondNames
      }
    }
  }

  // check to see if this command is less than 10 seconds old
  let now = new Date().getTime();
  let messageTime = new Date(message.ctime).getTime();
  if (now - messageTime < 10000) {
    // needs to determine if this command should be run locally or remotely
    // for now, only run locally
    // check to see  if message.from is bp.me
    if (message.from === this.bp.me) {
      let bs = this.bp.apps.buddyscript.parseCommand(message.text);
      // console.log('what is this bs', bs);
    }
  }

  // Determine the window ID based on the message context
  let windowId = `buddy_message_-${message.to}`;

  // dynamically create the windowId based on the message details
  if (message.type === 'buddy') {
    if (message.to === this.bp.me) {
      /*
      // we need to check if message.from is not part of the buddy type chatId, could be a bot talking in the buddy chat
      // this differs from pond chats, as its a third party in a two person chat
      // the whole approach here is a bit awkward, but is required if we wish for bots to join buddy chat conversations
      // check if message.from is not part of the chatId
      let participants = message.chatId.split('/');
      // remove the first item from the array
      participants.shift();
      // check if message.from is not inside the participants array
      if (!participants.includes(message.from)) {
        // this means a third party is sending a message in a buddy chat ( a bot most likely )
        // we need to set the windowId to be the non-me participant
        let notMe = participants.find(participant => participant !== this.bp.me);
        // console.log('Setting windowId for non-me participant', notMe);
        windowId = `buddy_message_-${notMe}`;
        context = notMe;
      } else {
        // regular buddy conversation with (2) participants
        windowId = `buddy_message_-${message.from}`;
        context = message.from;
      }
      */
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
  // console.log('chat window id', windowId, message);
  let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowId);

  if (_chatWindow) {
    chatWindow = _chatWindow;
  }

  if (!chatWindow || !chatWindow.content) {
    console.log('chat window not ready, trying again soon');
    console.log(message);
    return;
  }

  // Check if message already exists in the DOM
  if (document.querySelector(`.chatMessage[data-uuid="${message.uuid}"]`)) {
    return; // Message is already rendered
  }

  // console.log('checking this.data.processedMessages[context]', this.data.processedMessages[context]);
  // Check if message has been processed to avoid duplication
  for (let i = 0; i < this.data.processedMessages[context].length; i++) {
    if (this.data.processedMessages[context][i].uuid === message.uuid) {
      // console.log('Message already processed, skipping rendering', message);
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
    console.log("ATTEMPTING TO REMOVE MESSAGE", message);
    // find the chatMessage by uuid
    let removedMessageEl = $(`.aim-chat-message[data-uuid="${message.removed}"]`); // could be document as well?
    if (removedMessageEl.length > 0) {
      // remove the removed message
      removedMessageEl.remove();
    }
    return;
  }

  if (message.edited) {
    console.log("ATTEMPTING TO EDIT MESSAGE", message);
    // find the chatMessage by uuid
    let editedMessageEl = $(`.aim-chat-message[data-uuid="${message.edited}"]`); // could be document as well?

    if (!editedMessageEl.length > 0) {
      console.error('No original message found');
      return;
    }

    // get the aim-message-content and set the text to the new message
    let editedMessageContent = editedMessageEl.find('.aim-message-content');
    if (editedMessageContent.length > 0) {
      // remove the edited message
      editedMessageContent.html(message.text);
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
  
  // check if mobile, is so shorten the time
  // legacy API
  if (this.bp.apps.ui.isMobile()) {
    messageTime = DateFormat.format.date(messageTime, 'hh:mm:ss a');

  } else {
    messageTime = DateFormat.format.date(messageTime, 'E MMMM dd, hh:mm:ss a');
  }

  // Format message time
  messageTime = messageTime.toString();


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
      cardData.message = message; // TODO probably should clone for CardManager, etc
      // default JSON rendering will now fail by default due to nested messages cards with arbitrary props ( no .data scope either ), .context might be good...
      let cardManager = this.bp.apps.card.cardManager;
      // console.log('cardManager.loadCard', cardData);
      const _card = await cardManager.loadCard(cardData.type, cardData);
      container = document.createElement('div');
      container.classList.add('cardContainer');
      let d = await _card.render(container);
    }

  }

  let bp = this.bp;

  

  this.createChatMessageElement(message, messageTime, chatWindow, container);

  // Example usage: renderMessage(messageObject, '12:00 PM', chatWindowObject);


  // console.log('content', chatWindow.content)
  // chatWindow.content.innerHTML = 'FFFFF';

  // Initially try to scroll to the bottom
  scrollToBottom(chatWindow.content);

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




function findAllHashPondNamesOld(text) {
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

function findAllHashPondNames(text) {
  // Decode HTML entities more comprehensively
  const decodedText = decodeEntities(text);
  // Regex: # followed by at least one letter/digit, then optional letters/digits/underscores/hyphens
  // Requires space or start of string before #, supports Unicode
  const hashPondNameRegex = /(^|\s)#([a-zA-Z0-9\p{L}][a-zA-Z0-9\p{L}_-]*)/gu;
  return Array.from(decodedText.matchAll(hashPondNameRegex), m => m[2]);
}

function decodeEntities(text) {
  const entities = {
    '&amp;': '&',
    '&quot;': '"',
    '&lt;': '<',
    '&gt;': '>',
    '&apos;': "'",
    '&nbsp;': ' ',
    // Add more as needed
  };
  return text.replace(/&[a-zA-Z0-9#]+;/g, match => entities[match] || match);
}