// TODO: refactor to be buddylist ws client
export default function createWebSocketClient(chatId) {
  // Track reconnect state

  console.log(`Creating WebSocket client for chatId: ${chatId}`);
  return new Promise((resolve, reject) => {
    const wsClient = new WebSocket(
      `${buddypond.buddylistWsEndpoint}?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}`
    );

    // Handle open event
    const handleOpen = () => {
      console.log('WebSocket connection opened to', chatId);
      this.reconnectAttempts = 0; // Reset reconnect attempts
      wsClient.send(
        JSON.stringify({
          action: 'getProfile',
          buddyname: buddypond.me,
          qtokenid: buddypond.qtokenid,
        })
      );
      // Emit connected event
      bp.emit('buddylist-websocket::connected', { chatId });
      // TODO: remove these UI events here
      // Remark: There seems to be a race condition with new wsClient and show / hide elements
      // This will resolve the issue ( for now )
      $('.loggedIn').flexShow();
      $('.loggedOut').flexHide();

      resolve(wsClient); // Resolve with the WebSocket instance
    };

    // Handle message event
    const handleMessage = (event) => {
      try {
        const parseData = JSON.parse(event.data);
        console.log('Got back from server:', parseData);
        switch (parseData.action) {
          case 'buddy_added':
            console.log('buddy_added WebSocket message received:', parseData);
            bp.emit('profile::buddy::in', {
              name: parseData.buddyname,
              profile: parseData.profile || { ctime: new Date().getTime(), dtime: 0 },
            });
            break;

          case 'getProfile':
            console.log('getProfile message received:', parseData);
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
        bp.emit('buddylist-websocket::error', { chatId, error: 'Message parsing failed' });
      }
    };

    // Handle close event
    const handleClose = (event) => {
      console.log('WebSocket connection closed to', chatId, 'Code:', event.code, 'Reason:', event.reason);
      bp.emit('buddylist-websocket::disconnected', { chatId, code: event.code, reason: event.reason });

      // Reconnect only if not intentionally closed
      if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(
          200 * Math.pow(2, this.reconnectAttempts) * (1 + 0.1 * Math.random()), // Exponential backoff with jitter
          this.maxBackoffDelay
        );
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts + 1} for ${chatId} in ${delay}ms`);
        setTimeout(async () => {
          this.reconnectAttempts++;
          bp.emit('buddylist-websocket::reconnecting', { chatId, attempt: this.reconnectAttempts });
          try {
            const newWsClient = await this.connectWebSocket(); // Attempt to reconnect
            // Update event listeners to the new WebSocket instance
            Object.assign(wsClient, newWsClient);
          } catch (error) {
            console.error('Reconnect failed:', error);
          }
        }, delay);
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(`Max reconnect attempts (${this.maxReconnectAttempts}) reached for ${chatId}. Giving up.`);
        bp.emit('websocket::reconnect_failed', { chatId });
      }
    };

    // Handle error event
    const handleError = (event) => {
      console.error('WebSocket error for', chatId, event);
      bp.emit('buddylist-websocket::error', { chatId, error: 'WebSocket error' });
      // Reject the promise if connection hasn't opened yet
      if (wsClient.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket connection failed'));
      }
      // Close to trigger reconnect logic in handleClose
      wsClient.close(1000, 'Error occurred');
    };

    // Add event listeners
    wsClient.addEventListener('open', handleOpen);
    wsClient.addEventListener('message', handleMessage);
    wsClient.addEventListener('close', handleClose);
    wsClient.addEventListener('error', handleError);

    // Method to intentionally close the WebSocket
    wsClient.closeConnection = () => {
      this.isIntentionallyClosed = true;
      console.log(`Intentionally closing WebSocket for ${chatId}`);
      wsClient.close(1000, 'Normal closure');
      // Remove event listeners to prevent memory leaks
      wsClient.removeEventListener('open', handleOpen);
      wsClient.removeEventListener('message', handleMessage);
      wsClient.removeEventListener('close', handleClose);
      wsClient.removeEventListener('error', handleError);
      bp.emit('buddylist-websocket::closed', { chatId });
    };
  });
}