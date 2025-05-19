// Function to create a WebSocket client for a given chatId
// Assume "this" scope is bound to the `client` object
// Currently used for chat rooms, not buddylist
export default function createWebSocketClient(chatId) {
  // Check if a chatConnection already exists for this chatId
  let chatConnection = this.messagesWsClients.get(chatId);
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 999999; // Set to a high number for unlimited attempts
  const maxBackoffDelay = 10000; // 10 seconds

  console.log('chatConnection', chatConnection);
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
        buddyname: buddypond.me,
        qtokenid: buddypond.qtokenid,
      })
    );
  }

  // Named function for message event
  function handleMessage(event) {
    try {
      const parseData = JSON.parse(event.data);

      switch (parseData.action) {
        case 'message':
          console.log('WebSocket message received:', parseData);
          bp.emit('buddy::messages', { result: { messages: [parseData.message] } });
          break;

        case 'getHistory':
          console.log('getHistory message received:', parseData);
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