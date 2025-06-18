// Function to create a WebSocket client for a given chatId
// Assume "this" scope is bound to the `client` object
// Currently used for chat rooms, not buddylist
export default function createWebSocketClient(chatId) {
  // Check if a chatConnection already exists for this chatId
  let chatConnection = this.messagesWsClients.get(chatId);
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 999999; // Set to a high number for unlimited attempts
  const maxBackoffDelay = 10000; // 10 seconds

  // If a chatConnection exists, reuse its reconnectAttempts
  if (chatConnection) {
    console.log(`Reusing existing chatConnection for chatId: ${chatId}, reconnectAttempts: ${chatConnection.reconnectAttempts}`);
    reconnectAttempts = chatConnection.reconnectAttempts;
  } else {
    console.log(`Creating new WebSocket client for chatId: ${chatId}`);
  }

  const wsClient = new WebSocket(
    `${buddypond.messagesWsEndpoint}?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}&chatId=${chatId}`
  );

  // Create or update chatConnection object
  chatConnection = {
    wsClient,
    reconnectAttempts,
    maxReconnectAttempts,
    maxBackoffDelay
  };
  this.messagesWsClients.set(chatId, chatConnection);

  let isIntentionallyClosed = false; // Flag to track intentional closure

  // Named function for open event
  function handleOpen() {
    console.log('WebSocket connection opened to', chatId);
    // Reset reconnect attempts on successful connection
    reconnectAttempts = 0;
    chatConnection.reconnectAttempts = 0; // Sync with chatConnection
    chatConnection.wsClient.send(
      JSON.stringify({
        action: 'getHistory',
        chatId: chatId,
        profilePicture: this.bp.apps.buddylist.data.profileState.profilePicture,
        buddyname: buddypond.me,
        qtokenid: buddypond.qtokenid,
      })
    );

    chatConnection.wsClient.send(
      JSON.stringify({
        action: 'getConnectedUsers',
        chatId: chatId,
        buddyname: buddypond.me,
        qtokenid: buddypond.qtokenid,
      })
    );

    // Remark: attempt to set .aim-room-active class on the .aim-room-list-item-name, which is a child
    // of the .aim-room-list-item with data-pond of chatId
    // TODO: Move this code elsewhere, not in the client
    // we may want to bp.emit('pond::connected') event instead
    const chatWindow = this.bp.apps.ui.windowManager.getWindow('pond_message_main');
    if (chatWindow) {
      const roomListItem = chatWindow.content.querySelector(`.aim-room-item[data-pond="${chatId}"]`);
      if (roomListItem) {
        const roomNameElement = roomListItem.querySelector('.aim-room-list-item-name');
        if (roomNameElement) {
          roomNameElement.classList.add('aim-room-active');
        }
      }
    }


  }

  // Named function for message event
  async function handleMessage(event) {
    try {
      const parseData = JSON.parse(event.data);

      switch (parseData.action) {
        case 'message':
          // console.log('WebSocket message received:', parseData);
          bp.emit('buddy::messages', { result: { messages: [parseData.message] } });
          break;
        case 'connectedUsers':
          // console.log('Connected users message received:', parseData);
          bp.emit('pond::connectedUsers', parseData);
          break;
        case 'typing' :
          // console.log('Typing message received:', parseData);
          bp.emit('buddy::isTyping', parseData.message);
          break;
        case 'rate-limit':
          console.log('Rate limit exceeded:', parseData);
          bp.emit('buddy::messages', { result: { messages: [parseData.message], retryAfter: parseData.retryAfter, severity: parseData.severity } });
          console.error(parseData.severity, parseData.message.text);
          if (parseData.severity == 3) {
            alert('Please chill out.');
          }

          if (parseData.severity == 4) {

            try {
              let spellModule = await this.bp.importModule(`/v5/apps/based/spellbook/spells/forbiddenRickRoll/forbiddenRickRoll.js`, {}, false);
              spellModule.default.call(this);
            }
            catch (error) {
              console.log('Error importing spell module:', error);
            }

          }


          if (parseData.severity >= 5) {


            /*
            try {
              let spellModule = await this.bp.importModule(`/v5/apps/based/spellbook/spells/hamster-dance/hamster-dance.js`, {}, false);
              spellModule.default.call(this);
            }
            catch (error) {
              console.log('Error importing spell module:', error);
            }
            */

            try {
              let spellModule = await this.bp.importModule(`/v5/apps/based/spellbook/spells/vortex/vortex.js`, {}, false);
              spellModule.default.call(this);
            }
            catch (error) {
              console.log('Error importing spell module:', error);
            }


            // logout
            // this.bp.logout();
          }
          break;

        case 'getHistory':
          // console.log('getHistory message received:', parseData);
          bp.emit('buddy::messages', { result: { messages: parseData.messages } });
          break;

        case 'removeInstantMessage':
          console.log('removeInstantMessage message received:', parseData);
          bp.emit('buddy::messages', { result: { messages: [parseData.message] } });
          break;

        case 'editInstantMessage':
          console.log('editInstantMessage message received:', parseData);
          bp.emit('buddy::messages', { result: { messages: [parseData.message] } });
          break;

        default:
          console.warn('Unknown action received:', parseData);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Named function for close event
  function handleClose(event) {
    console.log('WebSocket connection closed to', chatId, 'Code:', event.code, 'Reason:', event.reason);
    console.log('reconnectAttempts:', chatConnection.reconnectAttempts);
    console.log('isIntentionallyClosed:', isIntentionallyClosed);

    // Only remove from Map if intentionally closed or max reconnect attempts reached
    if (isIntentionallyClosed || chatConnection.reconnectAttempts >= chatConnection.maxReconnectAttempts) {
      console.log(`Removing chatConnection for ${chatId} from messagesWsClients`);
      this.messagesWsClients.delete(chatId);
      console.log('Current WebSocket clients:', this.messagesWsClients);
    }

    // Reconnect only if the closure was not intentional and max attempts not reached
    if (!isIntentionallyClosed && chatConnection.reconnectAttempts < chatConnection.maxReconnectAttempts) {
      const delay = Math.min(
        200 * Math.pow(2, chatConnection.reconnectAttempts) * (1 + 0.1 * Math.random()), // Exponential backoff with jitter
        chatConnection.maxBackoffDelay
      );
      console.log(`Scheduling reconnect attempt ${chatConnection.reconnectAttempts + 1} for ${chatId} in ${delay}ms`);
      setTimeout(() => {
        reconnectAttempts++;
        chatConnection.reconnectAttempts++; // Sync with chatConnection
        createWebSocketClient.call(this, chatId); // Attempt to reconnect
      }, delay);
    } else if (chatConnection.reconnectAttempts >= chatConnection.maxReconnectAttempts) {
      console.error(`Max reconnect attempts (${chatConnection.maxReconnectAttempts}) reached for ${chatId}. Giving up.`);
    }
  }

  // Named function for error event
  function handleError(event) {
    console.error('WebSocket error for', chatId, event);
    // Close the WebSocket to trigger the close handler
    chatConnection.wsClient.close(1000, 'Error occurred');
  }

  // Add event listeners with named functions
  wsClient.addEventListener('open', handleOpen.bind(this));
  wsClient.addEventListener('message', handleMessage.bind(this));
  wsClient.addEventListener('close', handleClose.bind(this));
  wsClient.addEventListener('error', handleError.bind(this));

  // Method to intentionally close the WebSocket
  wsClient.closeConnection = function () {
    isIntentionallyClosed = true;
    console.log(`Intentionally closing WebSocket for ${chatId}`);
    chatConnection.wsClient.close(1000, 'Normal closure');
    // Remove event listeners to prevent memory leaks
    chatConnection.wsClient.removeEventListener('open', handleOpen);
    chatConnection.wsClient.removeEventListener('message', handleMessage);
    chatConnection.wsClient.removeEventListener('close', handleClose);
    chatConnection.wsClient.removeEventListener('error', handleError);
  };

  return wsClient;
}