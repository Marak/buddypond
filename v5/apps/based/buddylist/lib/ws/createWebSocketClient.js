// TODO: refactor to be buddylist ws client
export default function createWebSocketClient(chatId) {
  // Track reconnect state

  console.log(`Creating WebSocket client for chatId: ${chatId}`);
  // alert('ws ' + buddypond.qtokenid)
  const wsClient = new WebSocket(
    `${buddypond.buddylistWsEndpoint}?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}`
  );
  // this.messagesWsClients.set(chatId, wsClient);

  // Named function for open event
  function handleOpen() {
    console.log('WebSocket connection opened to', chatId);
    this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    wsClient.send(
      JSON.stringify({
        action: 'getProfile',
        buddyname: buddypond.me,
        qtokenid: buddypond.qtokenid,
      })
    );
    // set status to online
    
  }

  // Named function for message event
  function handleMessage(event) {
    try {
      // console.log('Got back from server:', event.data);
      const parseData = JSON.parse(event.data);
      console.log('Got back from server:', parseData);
      switch (parseData.action) {
        case 'buddy_added':
          console.log('buddy_added WebSocket message received:', parseData);
          //bp.emit('buddy::messages', { result: { messages: [parseData.message] } });
            bp.emit('profile::buddy::in', {
              name: parseData.buddyname,
              profile: parseData.profile || { ctime: new Date().getTime(), dtime: 0 }
            });
          break;

        case 'getProfile':
          console.log('getProfile message received:', parseData);
          // bp.emit('buddy::messages', { result: { messages: parseData.messages } });
          bp.emit('profile::fullBuddyList', parseData.profile.buddylist);
           break;

        default:
          console.log('Last message:', event.data);
          console.warn('Unknown action received:', parseData);
          break;
      }
    } catch (error) {
      console.log('Last message:', event.data);
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Named function for close event
  function handleClose(event) {
    console.log('WebSocket connection closed to', chatId, 'Code:', event.code, 'Reason:', event.reason);
    // this.messagesWsClients.delete(chatId);
    console.log('this.reconnectAttempts:', this.reconnectAttempts);
    console.log('isIntentionallyClosed:', this.isIntentionallyClosed);
    // Reconnect only if the closure was not intentional
    if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(
        200 * Math.pow(2, this.reconnectAttempts) * (1 + 0.1 * Math.random()), // Exponential backoff with jitter
        this.maxBackoffDelay
      );
      console.log(`Scheduling reconnect attempt ${this.reconnectAttempts + 1} for ${chatId} in ${delay}ms`);
      setTimeout(() => {
        this.reconnectAttempts++;
        this.createWebSocketClient(); // Attempt to reconnect
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnect attempts (${this.maxReconnectAttempts}) reached for ${chatId}. Giving up.`);
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
    this.isIntentionallyClosed = true;
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