// Function to create a WebSocket client for a given chatId
export default function createWebSocketClient(chatId) {
    console.log(`Creating WebSocket client for chatId: ${chatId}`);
    const wsClient = new WebSocket(
      `${buddypond.messagesWsEndpoint}?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}&chatId=${chatId}`
    );
    this.messagesWsClients.set(chatId, wsClient);
  
    let isIntentionallyClosed = false; // Flag to track intentional closure
  
    // Handle open event
    wsClient.addEventListener('open', function () {
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
    });
  
    // Handle message event
    wsClient.addEventListener('message', (event) => {
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
    });
  
    // Handle close event
    wsClient.addEventListener('close', (event) => {
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
    });
  
    // Handle error event
    wsClient.addEventListener('error', function (event) {
      console.error('WebSocket error for', chatId, event);
      // The error event is often followed by a close event, so we rely on the close handler for reconnection
      // Optionally, you can close the WebSocket here to trigger the close handler immediately
      wsClient.close(1000, 'Error occurred');
    });
  
    // Method to intentionally close the WebSocket
    wsClient.closeConnection = function () {
      isIntentionallyClosed = true;
      console.log(`Intentionally closing WebSocket for ${chatId}`);
      wsClient.close(1000, 'Normal closure');
    };
  
    return wsClient;
  }