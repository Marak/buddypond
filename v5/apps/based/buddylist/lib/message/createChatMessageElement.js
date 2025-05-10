import renderGeoFlag from './renderGeoFlag.js';
import parseMarkdownWithoutPTags from './parseMarkdownWithoutPTags.js';

// Configuration
const config = {
  useMarkdown: true,
  allowHTML: true,
};

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
  const defaultAvatar = defaultAvatarSvg.call(this, message.from);
  profilePicture.innerHTML = defaultAvatar;
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
  const hoverMenu = document.createElement('div');
  hoverMenu.className = 'aim-hover-menu';

  const menuItems = [
    { text: 'Add Reaction', action: 'add-reaction' },
    { text: 'Edit Message', action: 'edit-message' },
    { text: 'Reply Message', action: 'reply-message' },
    { text: '...', action: 'more-options' },
  ];

  menuItems.forEach(item => {
    const button = document.createElement('button');
    button.textContent = item.text;
    button.setAttribute('data-action', item.action);
    button.className = 'aim-hover-menu-item';
    hoverMenu.appendChild(button);
  });

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

function defaultAvatarSvg(username) {
  // Create an identicon avatar using DiceBear
  const avatar = this.dicebear.createAvatar(this.dicebearAvatars, {
    seed: username, // Username as seed for consistent avatar
    size: 40, // Avatar size in pixels
    backgroundColor: ["#f0f0f0"], // Optional: Customize background
  });

  // Convert avatar to SVG string
  const svg = avatar.toString();
  return svg;
}