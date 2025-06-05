import scrollToBottom from "./scrollToBottom.js";

// TODO: add logic for "reply-message" action
//       reply-message action should open a small "replying to" box above the closest .aim-message-sender element
//       The "Replying to {BuddyName}" box should contain the message text and a small "cancel" button at the right / end of the box
//       We can assume that data-from will be the same as the sender of the message we are replying to

export default function bindMessageContextMenu() {



  bindProfilePictureClick.call(this);

  // Single event delegation for context menu, hover menu, and edit hint actions
  document.addEventListener('click', (event) => {
    const target = event.target;
    let action = target.getAttribute('data-action');

    // Handle context menu item click
    if (target.classList.contains('aim-context-menu-item') && action) {
      handleContextMenuItemClick.call(this, action, target);
      return;
    }

    // Handle hover menu item click

    // TODO: there must be a better way to do this
    // Remark: The issue is that we wish to cover the click action for the parent item and all its potential children
    let isHoverMenuAction = $(target).hasClass('aim-hover-menu-item') || $(target).parents().hasClass('aim-hover-menu-item');
    action = target.getAttribute('data-action') || target.parentNode.getAttribute('data-action');

    if (isHoverMenuAction && action) {
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
      // get the closest reply box
      const replyBox = target.closest('.aim-reply-box');
      cancelReply.call(this, replyBox);
      return;
    }

    // Close existing context menu and reset hover menu
    closeMenus.call(this);
  });
}

// Handle context menu or hover menu item click
function handleContextMenuItemClick(action, target) {
  performAction.call(this, action, target);
  if (action !== 'more-options') {
    closeMenus.call(this);
  }
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
    cancelEdit.call(this, messageContent, messageData.text);
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
  // console.log('closestTarget', closestTarget);
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
      event.preventDefault();
      const closestMessage = target.closest('.aim-chat-message');
      console.log('closestMessage', closestMessage);
      if (closestMessage) {
        this.createMessageContextMenu(target, closestMessage);
      }

      break;
    case 'quote-message':
      console.log('Quote message clicked');
      break;
    case 'say-message':
      console.log('Say message clicked');
      console.log('sayMessage', messageData);
      this.bp.emit('say::message', messageData);
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
    case 'cast-spell':
      this.bp.open('spellbook', { context: messageData.from, output: 'buddy'});
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

  this.bp.ignoreUIControlKeys = true;
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
      cancelEdit.call(this, messageContent, originalText);
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
  const handleBlur = (ev) => {
    // ensure the target was not ".aim-edit-hint-action"
    console.log('handleBlur', ev.relatedTarget, ev.target.classList);
    if (ev.relatedTarget && !ev.relatedTarget.classList.contains('aim-edit-hint-action')) {
      cancelEdit.call(this, messageContent, originalText);
      cleanupListeners();
    }
  };

  // Cleanup function for event listeners
  const cleanupListeners = () => {
    messageContent.removeEventListener('keydown', handleKeydown);
    messageContent.removeEventListener('blur', handleBlur);
    this.bp.ignoreUIControlKeys = false;
  };

  // Attach event listeners
  messageContent.addEventListener('keydown', handleKeydown);
  messageContent.addEventListener('blur', handleBlur);

  console.log('Editing message', messageData);
}

// Cancel editing and restore original text
function cancelEdit(messageContent, originalText, restoreText = true) {
  const editableContainer = messageContent.closest('.aim-editable-container');
  if (editableContainer) {
    // Move messageContent back to its original parent
    editableContainer.parentNode.insertBefore(messageContent, editableContainer);
    editableContainer.remove();
  }

  messageContent.setAttribute('contenteditable', 'false');
  messageContent.removeAttribute('data-editing');
  if (restoreText) {
    messageContent.innerText = originalText;
  }
  messageContent.blur();

  const messageElement = messageContent.closest('.aim-chat-message');
  if (messageElement) {
    messageElement.removeAttribute('data-original-text');
  }

  console.log('Edit cancelled');
  this.bp.ignoreUIControlKeys = false;
}

// Save edited message
async function saveEdit(messageContent, messageData) {
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

  await buddypond.editInstantMessage({
    from: messageData.from,
    chatId: messageData.chatId,
    uuid: messageData.uuid,
    text: newMessageText,
  });

  // close the edit hint
  cancelEdit.call(this, messageContent, null, false);
}

// Reply to a message
function replyMessage(messageData, originalMessage) {
  // Close any existing reply box
  if (this.activeReplyBox) {
    this.activeReplyBox.remove();
    this.activeReplyBox = null;
  }


  this.bp.ignoreUIControlKeys = true;
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
  const messageTextInput = replyBox.closest('.chatWindow').querySelector('textarea[name="message_text"]');
  // set the value of the input to the messageData.uuid
  // set the focus to the replyInput
  if (replyInput) {
    replyInput.value = messageData.uuid;
  } else {
    console.error('No reply input found');
  }
  if (messageTextInput) {
    messageTextInput.focus();
  } else {
    console.error('No message text input found');
  }

  // Find the closest chatWindow and scroll to bottom
  const chatWindow = originalMessage.closest('.chatWindow');
  if (chatWindow) {
    scrollToBottom(chatWindow);
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      //cancelEdit(messageContent, originalText);
      cancelReply.call(this, replyBox);
      cleanupListeners();
      event.preventDefault();
      event.stopPropagation();
    } else if (event.key === 'Enter') {
      // saveEdit.call(this, messageContent, messageData);
      cleanupListeners();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Cleanup function for event listeners
  const cleanupListeners = () => {
    messageTextInput.removeEventListener('keydown', handleKeydown);
    // messageTextInput.removeEventListener('blur', handleBlur);
    this.bp.ignoreUIControlKeys = false;
  };

  messageTextInput.addEventListener('keydown', handleKeydown);

  console.log('Reply mode activated', messageData);

}

// Cancel reply mode
function cancelReply(replyBox) {
  console.log('Cancel reply', replyBox);
  console.log('aimReplyBox', replyBox);
  if (replyBox) {

    // clear out the .aim-replyto input value
    const replyInput = replyBox.closest('.chatWindow').querySelector('input[name="message_replyto"]');
    if (replyInput) {
      replyInput.value = '';
    } else {
      console.error('No reply input found');
    }

    replyBox.remove();
    this.activeReplyBox = null;
    this.bp.ignoreUIControlKeys = false;
    this.bp.replyData = null;
  }

  console.log('Reply cancelled');
}

function bindProfilePictureClick() {

  document.addEventListener('click', (event) => {
    let target = event.target;
    // if target is svg and parent has class aim-profile-picture
    // console.log(' bindProfilePictureClick target', target, target.tagName);
    if ($(target).parents().hasClass('aim-profile-picture')) {
      //if (target.classList.contains('.aim-avatar')) {
      const buddyname = target.closest('.aim-chat-message').getAttribute('data-from');
      console.log('Profile picture clicked', buddyname);

      if (buddyname === this.bp.me) {
        // opens profile edit page
        this.bp.open('profile', { context: 'edit' });
      } else {
        // opens profile page
        // this.bp.emit('profile::view', buddyname);
        this.bp.open('user-profile', { context: buddyname });

      }

    }
  });

}