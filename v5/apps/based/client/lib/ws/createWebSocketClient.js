// Function to create a WebSocket client for a given chatId
// assume "this" scope is bound to the `client` object
export default function createWebSocketClient(chatId) {
  // Track reconnect state
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 999999; // Set to a high number for unlimited attempts
  const maxBackoffDelay = 10000; // 10 seconds

  console.log(`Creating WebSocket client for chatId: ${chatId}`);
  const wsClient = new WebSocket(
    `${buddypond.messagesWsEndpoint}?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}&chatId=${chatId}`
  );
  this.messagesWsClients.set(chatId, wsClient);

  let isIntentionallyClosed = false; // Flag to track intentional closure

  // Named function for open event
  function handleOpen() {
    console.log('WebSocket connection opened to', chatId);
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    wsClient.send(
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
      // console.log('Got back from server:', event.data);
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
          console.warn('Unknown action received:', parseData.action);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Named function for close event
  function handleClose(event) {
    console.log('WebSocket connection closed to', chatId, 'Code:', event.code, 'Reason:', event.reason);
    this.messagesWsClients.delete(chatId);
    console.log('Current WebSocket clients:', this.messagesWsClients);
    console.log('reconnectAttempts:', reconnectAttempts);
    console.log('isIntentionallyClosed:', isIntentionallyClosed);
    // Reconnect only if the closure was not intentional
    if (!isIntentionallyClosed && reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(
        200 * Math.pow(2, reconnectAttempts) * (1 + 0.1 * Math.random()), // Exponential backoff with jitter
        maxBackoffDelay
      );
      console.log(`Scheduling reconnect attempt ${reconnectAttempts + 1} for ${chatId} in ${delay}ms`);
      setTimeout(() => {
        reconnectAttempts++;
        this.createWebSocketClient(chatId); // Attempt to reconnect
      }, delay);
    } else if (reconnectAttempts >= maxReconnectAttempts) {
      console.error(`Max reconnect attempts (${maxReconnectAttempts}) reached for ${chatId}. Giving up.`);
    }
  }

  // Named function for error event
  function handleError(event) {
    console.error('WebSocket error for', chatId, event);
    // The error event is often followed by a close event, so we rely on the close handler for reconnection
    // Optionally, you can close the WebSocket here to trigger the close handler immediately
    wsClient.close(1000, 'Error occurred');
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
    wsClient.close(1000, 'Normal closure');
    // Remove event listeners to prevent memory leaks
    wsClient.removeEventListener('open', handleOpen);
    wsClient.removeEventListener('message', handleMessage);
    wsClient.removeEventListener('close', handleClose);
    wsClient.removeEventListener('error', handleError);
  };

  return wsClient;
}