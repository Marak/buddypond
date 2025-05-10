import scrollToBottom from "./scrollToBottom.js";

// TODO: add logic for "reply-message" action
//       reply-message action should open a small "replying to" box above the closest .aim-message-sender element
//       The "Replying to {BuddyName}" box should contain the message text and a small "cancel" button at the right / end of the box
//       We can assume that data-from will be the same as the sender of the message we are replying to

export default function bindMessageContextMenu() {
  // Single event delegation for context menu, hover menu, and edit hint actions
  document.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.getAttribute('data-action');

    // Handle context menu item click
    if (target.classList.contains('aim-context-menu-item') && action) {
      handleContextMenuItemClick.call(this, action, target);
      return;
    }

    // Handle hover menu item click
    if (target.classList.contains('aim-hover-menu-item') && action) {
      handleContextMenuItemClick.call(this, action, target);
      return;
    }

    // Handle edit hint action click (escape/enter)
    if (target.classList.contains('aim-edit-hint-action') && action) {
      handleEditHintAction.call(this, action, target);
      return;
    }

        // Handle reply cancel button click
        if (target.classList.contains('aim-reply-cancel') && action === 'cancel-reply') {
          cancelReply.call(this, target);
          return;
        }
    

    // Handle more-options click (exact match)
    if (action === 'more-options' && target.tagName === 'BUTTON') {
      event.preventDefault();
      const closestMessage = target.closest('.aim-chat-message');
      if (closestMessage) {
        this.createMessageContextMenu(target, closestMessage);
      }
      return;
    }

    // Close existing context menu and reset hover menu
    closeMenus.call(this);
  });
}

// Handle context menu or hover menu item click
function handleContextMenuItemClick(action, target) {
  console.log(`Context menu action: ${action}`);
  performAction.call(this, action, target);
  closeMenus.call(this);
}

// Handle edit hint action (escape/enter)
function handleEditHintAction(action, target) {
  const messageContent = target.closest('.aim-editable-container')?.querySelector('.aim-message-content');
  if (!messageContent) {
    console.error('No message content found for edit hint action');
    return;
  }

  const messageUUID = messageContent.closest('.aim-chat-message')?.getAttribute('data-uuid');
  const originalMessage = document.querySelector(`.aim-chat-message[data-uuid="${messageUUID}"]`);
  if (!originalMessage) {
    console.error('No original message found');
    return;
  }

  const messageData = {
    uuid: messageUUID,
    chatId: originalMessage.getAttribute('data-chat-id'),
    text: originalMessage.getAttribute('data-original-text') || messageContent.innerText
  };

  if (action === 'cancel-edit') {
    cancelEdit(messageContent, messageData.text);
  } else if (action === 'save-edit') {
    saveEdit.call(this, messageContent, messageData);
  }
}

// Close active context and hover menus
function closeMenus() {
  if (this.activeMessageContextMenu) {
    this.activeMessageContextMenu.remove();
    this.activeMessageContextMenu = null;
  }
  if (this.activeMessageHoverMenu) {
    this.activeMessageHoverMenu = null; // Rely on CSS for hiding hover menu
  }
  if (this.activeReplyBox) {
    return;
    this.activeReplyBox.remove();
    this.activeReplyBox = null;
    this.bp.replyMode = false;
  }
}

// Perform the specified action
function performAction(action, target) {
  const closestTarget = target.closest('.aim-context-menu') || target.closest('.aim-chat-message');
  if (!closestTarget) {
    console.error('No closest target found');
    return;
  }

  const messageUUID = closestTarget.getAttribute('data-uuid');
  const messageChatId = closestTarget.getAttribute('data-chat-id');
  const messageFrom = closestTarget.getAttribute('data-from');
  const messageData = {
    uuid: messageUUID,
    chatId: messageChatId,
    from: messageFrom,
  };

  const originalMessage = document.querySelector(`.aim-chat-message[data-uuid="${messageUUID}"]`);
  if (!originalMessage) {
    console.error('No original message found');
    return;
  }

  messageData.text = originalMessage.querySelector('.aim-message-content').innerText;

  if (!messageData.uuid || !messageData.chatId) {
    console.error('No message data found');
    return;
  }

  switch (action) {
    case 'add-reaction':
      console.log('Add reaction clicked');
      break;
    case 'edit-message':
      editMessage.call(this, messageData);
      break;
    case 'reply-message':
      replyMessage.call(this, messageData, originalMessage);
      break;
    case 'more-options':
      console.log('More options clicked');
      break;
    case 'quote-message':
      console.log('Quote message clicked');
      break;
    case 'say-message':
      console.log('Say message clicked');
      break;
    case 'report-message':
      console.log('Report message clicked');
      break;
    case 'copy-message':
      console.log('Copy message clicked');
      break;
    case 'delete-message':
      deleteMessage.call(this, messageData);
      break;
    default:
      console.error(`Unknown action: ${action}`);
  }
}

// Delete a message
function deleteMessage(messageData) {
  console.log('Deleting message', messageData);
  buddypond.removeInstantMessage(messageData);
}

// Edit a message
function editMessage(messageData) {
  const messageContent = document.querySelector(
    `.aim-chat-message[data-uuid="${messageData.uuid}"] .aim-message-content`
  );
  if (!messageContent) {
    console.error('No message content found');
    return;
  }

  this.bp.editingMode = true;
  const originalText = messageData.text;

  // Wrap message content in an editable container
  const editableContainer = document.createElement('div');
  editableContainer.className = 'aim-editable-container';
  messageContent.parentNode.insertBefore(editableContainer, messageContent);
  editableContainer.appendChild(messageContent);

  // Store original text for restoration
  messageContent.closest('.aim-chat-message').setAttribute('data-original-text', originalText);

  // Make content editable
  messageContent.setAttribute('contenteditable', 'true');
  messageContent.setAttribute('data-editing', 'true');
  messageContent.focus();

  // Add UX hint message
  const editHint = document.createElement('div');
  editHint.className = 'aim-edit-hint';
  editHint.innerHTML = `
    <span class="aim-edit-hint-action" data-action="cancel-edit">escape</span> to cancel • 
    <span class="aim-edit-hint-action" data-action="save-edit">enter</span> to save
  `;
  editableContainer.appendChild(editHint);

  // find the closest chatWindow
  const chatWindow = messageContent.closest('.chatWindow');

  scrollToBottom(chatWindow);

  // Named event handler for keydown
  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      cancelEdit(messageContent, originalText);
      cleanupListeners();
      event.preventDefault();
      event.stopPropagation();
    } else if (event.key === 'Enter') {
      saveEdit.call(this, messageContent, messageData);
      cleanupListeners();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Named event handler for blur
  const handleBlur = () => {
    cancelEdit(messageContent, originalText);
    cleanupListeners();
  };

  // Cleanup function for event listeners
  const cleanupListeners = () => {
    messageContent.removeEventListener('keydown', handleKeydown);
    messageContent.removeEventListener('blur', handleBlur);
    this.bp.editingMode = false;
  };

  // Attach event listeners
  messageContent.addEventListener('keydown', handleKeydown);
  messageContent.addEventListener('blur', handleBlur);

  console.log('Editing message', messageData);
}

// Cancel editing and restore original text
function cancelEdit(messageContent, originalText) {
  const editableContainer = messageContent.closest('.aim-editable-container');
  if (editableContainer) {
    // Move messageContent back to its original parent
    editableContainer.parentNode.insertBefore(messageContent, editableContainer);
    editableContainer.remove();
  }

  messageContent.setAttribute('contenteditable', 'false');
  messageContent.removeAttribute('data-editing');
  messageContent.innerText = originalText;
  messageContent.blur();

  const messageElement = messageContent.closest('.aim-chat-message');
  if (messageElement) {
    messageElement.removeAttribute('data-original-text');
  }

  console.log('Edit cancelled');
}

// Save edited message
function saveEdit(messageContent, messageData) {
  const editableContainer = messageContent.closest('.aim-editable-container');
  if (editableContainer) {
    console.log('Editable container found', editableContainer);
    // Move messageContent back to its original parent
    // throws error:  Failed to execute 'insertBefore' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?
    // is the blur event already removing this?
    //editableContainer.parentNode.insertBefore(messageContent, editableContainer);
    //editableContainer.remove();
  }

  const newMessageText = messageContent.innerText;
  messageContent.setAttribute('contenteditable', 'false');
  messageContent.removeAttribute('data-editing');
  messageContent.blur();

  const messageElement = messageContent.closest('.aim-chat-message');
  if (messageElement) {
    messageElement.removeAttribute('data-original-text');
  }

  console.log('Edit saved', newMessageText);

  buddypond.editInstantMessage({
    chatId: messageData.chatId,
    uuid: messageData.uuid,
    text: newMessageText,
  });

}

// Reply to a message
function replyMessage(messageData, originalMessage) {
  // Close any existing reply box
  if (this.activeReplyBox) {
    this.activeReplyBox.remove();
    this.activeReplyBox = null;
  }

  this.bp.replyMode = true;
  this.bp.replyData = messageData; // Store reply data for message submission

  // Create reply box
  const replyBox = document.createElement('div');
  replyBox.className = 'aim-reply-box';
  replyBox.innerHTML = `
    <span class="aim-reply-header">Replying to ${messageData.from}</span>
    <button class="aim-reply-cancel" data-action="cancel-reply">Cancel</button>
  `;
  //   <span class="aim-reply-text">${messageData.text}</span>


  // Insert reply box above .aim-message-sender
  console.log("originalMessage", originalMessage)
  const messageSender = $(originalMessage).parent().parent().parent().parent().find('.aim-message-sender')[0];
  console.log('REEE messageSender', messageSender);
  if (!messageSender) {
    console.error('No message sender found');
    return;
  }
  messageSender.parentNode.insertBefore(replyBox, messageSender);

  // Store active reply box
  this.activeReplyBox = replyBox;
  // this.activeReplyUUID = messageData.uuid;
  // find the closet input named "message_replyto"
  const replyInput = replyBox.closest('.chatWindow').querySelector('input[name="message_replyto"]');
  // set the value of the input to the messageData.uuid
  if (replyInput) {
    replyInput.value = messageData.uuid;
  } else {
    console.error('No reply input found');
  }

  // Find the closest chatWindow and scroll to bottom
  const chatWindow = originalMessage.closest('.chatWindow');
  if (chatWindow) {
    scrollToBottom(chatWindow);
  }

  console.log('Reply mode activated', messageData);
}

// Cancel reply mode
function cancelReply(target) {
  const replyBox = target.closest('.aim-reply-box');
  if (replyBox) {
    replyBox.remove();
    this.activeReplyBox = null;
    this.bp.replyMode = false;
    this.bp.replyData = null;
  }
  console.log('Reply cancelled');
}