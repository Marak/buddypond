import renderGeoFlag from './renderGeoFlag.js';
import parseMarkdownWithoutPTags from './parseMarkdownWithoutPTags.js';

let useMarkdown = true;
let allowHTML = true;

// TODO: prefix all class names with 'aim-' to avoid conflicts
// TODO: css styles will be in a separate file
// TODO: make messages look and feel more like the Discord chat
// TODO: add personal profile picture as leftmost element
// TODO: move geoflag to under the personal profile picture
// TODO: add space for badges in the same area as the geoflag
// TODO: move name and timestamp to top of the message
// TODO: create mouse-over on the message that shows hover menu on top right of the message
//       mouse over tooltip should have: Add Reaction, Edit Message, Reply Message, and a "..." option for creating a context menu ( do not implement context menu here / yet )

export default function createChatMessageElement(message, messageTime, chatWindow, container) {
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

    // render as markdown ( if enabled )
    if (useMarkdown) {
        message.text = parseMarkdownWithoutPTags(message.text);
        // console.log('message.text', message.text)
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
        // TODO: add back
        // scrollToBottom();
    });

    insertChatMessage(chatWindow, message, chatMessage);

}

function insertChatMessage(chatWindow, message, chatMessage) {

    // Find all messages in chat ordered by data-id
    const aimMessages = chatWindow.content.querySelector('.aim-messages');
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
    // TODO: should return the chatMessage element instead of appending it
    if (!inserted) {
        aimMessages.appendChild(chatMessage);
    }
}