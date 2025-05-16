// Context menu creation
export default function createMessageContextMenu(target, closestMessage) {

  // Remove existing context menu if any
  if (this.activeMessageContextMenu) {
    this.activeMessageContextMenu.remove();
    this.activeMessageContextMenu = null;
  }

  if (this.activeMessageHoverMenu) {
    // set display: none on the hover menu
    // TODO: needs to swap classes instead of setting styles
    // this.activeMessageHoverMenu.style.display = 'none';
    this.activeMessageHoverMenu = null;
  }

  // TODO: the closest .aim-hover-menu to target should have it's hover CSS logic removed
  // aim-hover-menu:hover sets display: flex, without its display: none
  // we need this bypassed while the context menu is open
  const hoverMenu = target.closest('.aim-hover-menu');
  /*
  console.log('hoverMenu', hoverMenu);
  if (hoverMenu) {
    // hoverMenu.style.display = 'flex';
  }
  */

  const contextMenu = document.createElement('div');
  contextMenu.className = 'aim-context-menu';

  const messageFrom = closestMessage.getAttribute('data-from');


  const menuItems = [
    { text: 'Reply', action: 'reply-message' },
    // { text: 'Quote', action: 'quote-message' },
    { text: 'Say Message', action: 'say-message' },
    // { text: 'Report Message', action: 'report-message' },
    // { text: 'Copy Message', action: 'copy-message' },
  ];

  if (messageFrom === this.bp.me) {
    menuItems.push(
      { text: 'Edit Message', action: 'edit-message' },
      { text: 'Delete Message', action: 'delete-message' }
    );
  }

  menuItems.push({
    text: 'Cast Spell',
    action: 'cast-spell',
  });

  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'aim-context-menu-item';
    menuItem.textContent = item.text;
    menuItem.setAttribute('data-action', item.action);
    contextMenu.appendChild(menuItem);
  });

  // Position the context menu
  document.body.appendChild(contextMenu);
  const rect = target.getBoundingClientRect();
  contextMenu.style.left = `${rect.left - 150}px`;
  contextMenu.style.top = `${rect.bottom + window.scrollY - 20}px`;

  // set data-attr to the closest message data-chat-id and data-uuid
  const chatId = closestMessage.getAttribute('data-chat-id');
  const uuid = closestMessage.getAttribute('data-uuid');
  contextMenu.setAttribute('data-chat-id', chatId);
  contextMenu.setAttribute('data-uuid', uuid);
  contextMenu.setAttribute('data-from', messageFrom);

  this.activeMessageContextMenu = contextMenu;
  this.activeMessageHoverMenu = hoverMenu;
  return contextMenu;
}
