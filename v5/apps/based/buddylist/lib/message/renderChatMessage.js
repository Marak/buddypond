// import forbiddenNotes from '../forbiddenNotes.js';
import checkForLinksInMessage from './checkForLinksInMessage.js';

export default async function renderChatMessage(message, _chatWindow) {
    // console.log('renderChatMessage', message, _chatWindow);
    let context = 'default';

    // profanity filter ( removed, is now server side )
    /*
    if (message.text && message.text.length > 0) {
      message.text = forbiddenNotes.filter(message.text);
    }
    */

    // TODO: needs to check for links inside the message, not just entire links
    checkForLinksInMessage(message);

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

    // Stores all active users across all chat windows
    this.data.activeUsers = this.data.activeUsers || [];

    // Stores all buddies that are currently active in the context of the chat window
    this.data.activeUsersInContext = this.data.activeUsersInContext || {};
    this.data.activeUsersInContext[context] = this.data.activeUsersInContext[context] || [];

    this.data.activePonds = this.data.activePonds || [];
    if (message.type === 'pond') {
        // If message.to is not in the activePonds, add it
        if (message.to && !this.data.activePonds.includes(message.to)) {
            this.data.activePonds.push(message.to);
            this.bp.emit('pond::activePondAdded', message.to);
        }
    }

    if (message.type === 'buddy') {
        // If message.to is not in the activeUsers, add it
        if (message.to && !this.data.activeUsers.includes(message.to)) {
            this.data.activeUsers.push(message.to);
            this.bp.emit('buddy::activeUserAdded', message.to);
        }
        // If message.to is not in the activeUsersInContext, add it
        if (message.to && !this.data.activeUsersInContext[context].includes(message.to)) {
            this.data.activeUsersInContext[context].push(message.to);
        }
    }

    // If message.from is not in the activeUsers, add it
    if (message.from && !this.data.activeUsers.includes(message.from)) {
        this.data.activeUsers.push(message.from);
        this.bp.emit('buddy::activeUserAdded', message.from);
    }


    // If message.from is not in the activeUsersInContext, add it
    if (message.from && !this.data.activeUsersInContext[context].includes(message.from)) {
        this.data.activeUsersInContext[context].push(message.from);
    }

    // Remark: Removing and editing messages do not currently require a windowId since they currently
    // do not have a from / to property
    // We may want to change this in the future to allow for more granular control directly in the chatWindow instance
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

    let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowId);

    if (_chatWindow) {
        chatWindow = _chatWindow;
    }

    if (!chatWindow || !chatWindow.content) {
        console.log('chat window not ready, trying again soon', windowId, message);
        console.log(message);
        return;
    }

    // Check if message already exists in the DOM
    if (document.querySelector(`.chatMessage[data-uuid="${message.uuid}"]`)) {
        return; // Message is already rendered
    }

    // check to see if this command is less than 10 seconds old
    // TODO: split local and remote commands
    // TODO: should probably go through card codepath
    // this means we create the bs-card on the client
    // we should only run local commands on the client
    let now = new Date().getTime();
    let messageTime = new Date(message.ctime).getTime();
    // needs to determine if this command should be run locally or remotely
    // for now, only run locally
    // check to see  if message.from is bp.me


    // console.log('checking this.data.processedMessages[context]', this.data.processedMessages[context]);
    // Check if message has been processed to avoid duplication
    for (let i = 0; i < this.data.processedMessages[context].length; i++) {
        if (this.data.processedMessages[context][i].uuid === message.uuid) {
            // console.log('Message already processed, skipping rendering', message);
            // if the message has already been processed by UUID, then it's a duplicate and we should not render it
            return chatWindow;
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

    // Manage size of processedMessages to prevent memory leaks
    if (this.data.processedMessages[context].length > 5000) {
        this.data.processedMessages[context].shift();
    }

    // Add the processed message UUID to prevent reprocessing
    this.data.processedMessages[context].push(message);

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
    if (this.bp.isMobile()) {
        messageTime = DateFormat.format.date(messageTime, 'hh:mm:ss a');

    } else {
        messageTime = DateFormat.format.date(messageTime, 'E MMMM dd, hh:mm:ss a');
    }

    // Format message time
    messageTime = messageTime.toString();

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
            const _card = await cardManager.loadCard(cardData.type, cardData, chatWindow);
            container = document.createElement('div');
            container.classList.add('cardContainer');
            let d = await _card.render(container);
        }

    }

    let bp = this.bp;

    this.createChatMessageElement(message, messageTime, chatWindow, container);

    // console.log('parseChatMessage result', result);


    // emit the freshly processed message for any post processing events ( such as playing a sound )
    if (message.type === 'pond') {
        this.bp.emit('pond::message::processed', message);
    } else {
        this.bp.emit('buddy::message::processed', message);
    }

    return chatWindow;

}

// TODO: add via addMessageProcessor() on `marked` and `pond` apps

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