import renderGeoFlag from './renderGeoFlag.js';
import parseMarkdownWithoutPTags from './parseMarkdownWithoutPTags.js';

// Configuration
const config = {
  useMarkdown: true,
  allowHTML: true,
};

// New function to create hover menu
// TODO: remove buttons, just use icons
// TODO: update bindMessageContextMenu() method to bind to the icons instead of buttons
function createHoverMenu(message) {
  const hoverMenu = document.createElement('div');
  hoverMenu.className = 
  'aim-hover-menu';

  const menuItems = [];

  if (message.from === this.bp.me || this.bp.me === 'Marak') { // TODO: admin rbac
    menuItems.push({ text: 'Edit Message', action: 'edit-message',  icon: 'fa-duotone fa-regular fa-pencil' });
  }

  menuItems.push({ text: 'Reply Message', action: 'reply-message', icon: 'fa-duotone fa-regular fa-reply' });
  menuItems.push({ text: '...', action: 'more-options', icon: 'fa-solid fa-regular fa-ellipsis' });


  menuItems.forEach(item => {
    const button = document.createElement('button');
    button.setAttribute('data-action', item.action);
    button.className = 'aim-hover-menu-item';

    if (item.icon) {
      const icon = document.createElement('i');
      icon.className = item.icon;
      button.appendChild(icon);
      button.appendChild(document.createTextNode(' ')); // Add space between icon and text
    } else {
      button.appendChild(document.createTextNode(item.text));
    }
    // set title hint with item.text  
    button.setAttribute('title', item.text);
    hoverMenu.appendChild(button);
  });

  return hoverMenu;
}

export default function createChatMessageElement(message, messageTime, chatWindow, container) {
  // Create main message container
  const chatMessage = document.createElement('div');
  chatMessage.className = 'aim-chat-message';
  chatMessage.setAttribute('data-id', message.id);
  chatMessage.setAttribute('data-from', message.from);
  chatMessage.setAttribute('data-to', message.to);
  chatMessage.setAttribute('data-type', message.type);
  chatMessage.setAttribute('data-uuid', message.uuid);
  chatMessage.setAttribute('data-chat-id', message.chatId);

  // Profile picture (SVG)
  const profilePicture = document.createElement('div');
  profilePicture.className = 'aim-profile-picture';

  if (!message.profilePicture) {
    // check if we happen to have a profilePicture in local cache
    // this may happen if Randolph or other admin is sending messages on behalf of a user
    // TODO: better way to do this...
    if (
      this.bp.apps.buddylist.data.profileState &&
      this.bp.apps.buddylist.data.profileState.buddylist &&
      this.bp.apps.buddylist.data.profileState.buddylist[message.from] && 
      this.bp.apps.buddylist.data.profileState.buddylist[message.from].profile_picture) {
      message.profilePicture = this.bp.apps.buddylist.data.profileState.buddylist[message.from].profile_picture;
    }

  }

  if (message.profilePicture) {
    // use url as profile picture src
    const img = document.createElement('img');
    img.src = message.profilePicture;
    img.alt = `${message.from}'s avatar`;
    img.className = 'aim-chat-message-profile-picture-img';
    profilePicture.appendChild(img);
  } else {
    const defaultAvatar = defaultAvatarSvg.call(this, message.from);
    profilePicture.innerHTML = defaultAvatar;
  }

  // console.log('profilePicture', profilePicture);
  profilePicture.alt = `${message.from}'s avatar`;

  // Message content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'aim-content-wrapper';

  // Message header (sender + timestamp)
  const messageHeader = document.createElement('div');
  messageHeader.className = 'aim-message-header';

  const sender = document.createElement('span');
  sender.className = 'aim-sender';
  sender.textContent = message.from === 'anonymous'
    ? `Anonymous (${message.tripcode || 'tr1pc0d3'})`
    : message.from;

  const timestamp = document.createElement('span');
  timestamp.className = 'aim-timestamp';
  timestamp.textContent = messageTime;

  // Message meta (geoflag + badges placeholder)
  const messageMeta = document.createElement('div');
  messageMeta.className = 'aim-message-meta';

  const geoFlag = renderGeoFlag(message);
  const badgesContainer = document.createElement('span');
  badgesContainer.className = 'aim-badges';

  messageMeta.appendChild(geoFlag);
  messageMeta.appendChild(badgesContainer);

  messageHeader.appendChild(sender);
  messageHeader.appendChild(messageMeta);
  messageHeader.appendChild(timestamp);

  // Reply indicator (if message is a reply)
  let replyIndicator = null;
  if (message.replyto) {
    const repliedMessage = chatWindow.content.querySelector(
      `.aim-chat-message[data-uuid="${message.replyto}"]`
    );
    if (repliedMessage) {
      const repliedSender = repliedMessage.querySelector('.aim-sender')?.textContent || 'Unknown';
      const repliedText = repliedMessage.querySelector('.aim-message-content')?.innerText || '';

      replyIndicator = document.createElement('div');
      replyIndicator.className = 'aim-reply-indicator';
      replyIndicator.innerHTML = `
        <span class="aim-reply-sender">${repliedSender}</span>
        <span class="aim-reply-content">${repliedText}</span>
      `;

      // Add click handler to scroll to the replied message
      const replySender = replyIndicator.querySelector('.aim-reply-sender');
      replySender.addEventListener('click', () => {
        repliedMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        repliedMessage.classList.add('aim-highlight');
        setTimeout(() => repliedMessage.classList.remove('aim-highlight'), 2000);
      });
    }
  }

  // Message content
  const messageContent = document.createElement('div');
  messageContent.className = 'aim-message-content';

  const processedText = config.useMarkdown
    ? parseMarkdownWithoutPTags(message.text)
    : message.text;

  if (config.allowHTML) {
    messageContent.innerHTML = processedText;
  } else {
    messageContent.textContent = processedText;
  }

  // Hover menu
  const hoverMenu = createHoverMenu.call(this, message)

  // Assemble message
  contentWrapper.appendChild(messageHeader);
  if (replyIndicator) {
    contentWrapper.appendChild(replyIndicator);
  }
  contentWrapper.appendChild(messageContent);
  contentWrapper.appendChild(hoverMenu);

  chatMessage.appendChild(profilePicture);
  chatMessage.appendChild(contentWrapper);

  if (container) { // card container?
    contentWrapper.appendChild(container);
  }

  // Image load handler
  chatMessage.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
      // Implement scrollToBottom when ready
    });
  });

  insertChatMessage(chatWindow, message, chatMessage);
  return chatMessage;
}

function insertChatMessage(chatWindow, message, chatMessage) {
  const aimMessages = chatWindow.content.querySelector('.aim-messages');
  if (!aimMessages) {
    console.error('aim-messages not found. user most likely not in the chat window');
    return;
  }
  const allMessages = Array.from(aimMessages.querySelectorAll('.aim-chat-message'));
  let inserted = false;

  for (const existingMessage of allMessages) {
    const existingId = parseInt(existingMessage.getAttribute('data-id'), 10);
    if (message.id < existingId) {
      aimMessages.insertBefore(chatMessage, existingMessage);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    aimMessages.appendChild(chatMessage);
  }

  return chatMessage;
}

// Create a simple in-memory cache
// TODO: move to a separate file
const avatarCache = new Map();

function defaultAvatarSvg(username) {
  // Check if avatar is already cached
  if (avatarCache.has(username)) {
    return avatarCache.get(username);
  }

  // Create an identicon avatar using DiceBear
  const avatar = this.bp.vendor.dicebear.createAvatar(this.bp.vendor.dicebearAvatars, {
    seed: username, // Username as seed for consistent avatar
    size: 40, // Avatar size in pixels
    backgroundColor: ["#f0f0f0"], // Optional: Customize background
  });

  // Convert avatar to SVG string
  const svg = avatar.toString();

  // Store in cache
  avatarCache.set(username, svg);

  return svg;
}