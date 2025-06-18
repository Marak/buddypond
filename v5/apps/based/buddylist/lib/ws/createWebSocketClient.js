// Remark: createWebSocketClient is a prototype method of Client, as Client.createWebSocketClient()
export default function createWebSocketClient() {
  // Track reconnect state

  console.log(`Creating WebSocket client for buddylist`);
  return new Promise((resolve, reject) => {
    const wsClient = new WebSocket(
      `${buddypond.buddylistWsEndpoint}?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}`
    );

    // Handle open event
    const handleOpen = () => {
      console.log('WebSocket connection opened to buddylist');
      this.reconnectAttempts = 0; // Reset reconnect attempts

      this.wsClient = wsClient; // Store the WebSocket instance

      wsClient.send(
        JSON.stringify({
          action: 'getProfile',
          buddyname: buddypond.me,
          qtokenid: buddypond.qtokenid,
        })
      );
      // Emit connected event
      bp.emit('buddylist-websocket::connected');

      /*
      this.updateStatusInterval = setInterval(() => {
        let status = 'online'; // Default status
        try {
          status = bp.apps.buddylist.data.profileState.status;
        } catch (error) {
          console.log('Error retrieving profile state status for updateStatusInterval:', error);
        }
        // console.log('Sending status update to buddylist:', status);
        this.bp.emit('profile::status', status);
      }, 1000 * 60 * 5); // Refresh status every 5 minutes
      */  
      /*
      this.pingInterval = setInterval(() => {
        if (wsClient.readyState === WebSocket.OPEN) {
          wsClient.send(JSON.stringify({ action: 'ping' }));
        }
      }, 10000);
      */
      resolve(wsClient); // Resolve with the WebSocket instance
    };

    // Handle message event
    // TODO: move to a separate function
    const handleMessage = (event) => {
      try {
        const parseData = JSON.parse(event.data);
        // console.log('Got back from server:', parseData);
        switch (parseData.action) {
          case 'buddy_added':
            // console.log('buddy_added WebSocket message received:', parseData);
            bp.emit('profile::buddy::in', {
              name: parseData.buddyname,
              profile: parseData.profile || { ctime: new Date().getTime(), dtime: 0 },
            });
            break;

          case 'getRemoteProfiles':
            // console.log('getRemoteProfiles message received:', parseData);
            if (parseData.profile && parseData.profile.buddylist) {
              bp.emit('profile::fullBuddyList', parseData.profile);
            } else {
              console.error('getProfile message received but no buddylist:', parseData);
            }

            break;
          case 'getProfile':
            // console.log('getProfile message received:', parseData);

            if (parseData.profile && parseData.profile.buddylist) {
              bp.emit('profile::fullBuddyList', parseData.profile);
            } else {
              console.error('getProfile message received but no buddylist:', parseData);
            }
            // TODO: after getting profile, create a new call that wil fetch all buddies DO's to get
            // most updated state ( a reverse of setStatus() call )
            // this will ensure we always get the most recent updates for all buddies in case our DO
            // wasn't updated or missed an update or setStatus() truncation limit for users not recently active
            // send a message now to getRemoteProfiles
            console.log('Requesting remote profile backfill for all buddies');
            // After getting the initial profile ( single DO state, quick load ),
            // we can request remote profiles for all buddies
            // This will fetch all buddies DO's and get their most recent state
            // This is useful for getting the most recent updates for all buddies in case our DO
            // wasn't updated or missed an update or setStatus() truncation limit for users not recently active
            wsClient.send(
              JSON.stringify({
                action: 'getRemoteProfiles',
                buddyname: buddypond.me,
                qtokenid: buddypond.qtokenid,
              })
            );
            break;
          case 'ping':
            // console.log('pong message received:', parseData);
            break;
          case 'buddy_removed':
            // alert('buddy_removed WebSocket message received:', parseData);
            console.log('buddy_removed WebSocket message received:', parseData);
            this.bp.emit('profile::buddy::out', { name: parseData.buddyname });
            break;
          case 'rewards:response':
            // console.log('rewards:response message received:', parseData);
            if (parseData.success) {
              bp.emit('buddylist-websocket::reward', {
                success: true,
                message: parseData.message,
                reward: parseData.reward,
              });

            } else {
              bp.emit('buddylist-websocket::reward', {
                success: false,
                message: parseData.message,
              });
            }
            break;
          case 'getCoinBalance':
            // console.log('getCoinBalance message received:', parseData);
            if (parseData.success) {
              bp.emit('buddylist-websocket::coinBalance', parseData);
            } else {
              bp.emit('buddylist-websocket::coinBalance', parseData);
            }
            break;
          default:
            console.log('Last message:', event.data);
            console.warn('Unknown action received:', parseData);
            break;
        }
      } catch (error) {
        console.log('Last message:', event.data);
        console.error('Error parsing WebSocket message:', error);
        bp.emit('buddylist-websocket::error', { error: 'Message parsing failed' });
      }
    };

    // Handle close event
    const handleClose = (event) => {
      console.log('WebSocket connection closed to', 'buddylist', 'Code:', event.code, 'Reason:', event.reason);

      // clearInterval(this.pingInterval);
      clearInterval(this.updateStatusInterval);

      bp.emit('buddylist-websocket::disconnected', { code: event.code, reason: event.reason });

      // Reconnect only if not intentionally closed
      if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(
          200 * Math.pow(2, this.reconnectAttempts) * (1 + 0.1 * Math.random()), // Exponential backoff with jitter
          this.maxBackoffDelay
        );
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts + 1} for buddylist in ${delay}ms`);
        setTimeout(async () => {
          this.reconnectAttempts++;
          bp.emit('buddylist-websocket::reconnecting', { attempt: this.reconnectAttempts });
          try {
            const newWsClient = await this.createWebSocketClient(); // Attempt to reconnect
            // Update event listeners to the new WebSocket instance
            Object.assign(wsClient, newWsClient);
            this.wsClient = newWsClient;
          } catch (error) {
            console.error('Reconnect failed:', error);
          }
        }, delay);
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(`Max reconnect attempts (${this.maxReconnectAttempts}) reached for buddylist. Giving up.`);
        bp.emit('buddylist-websocket::reconnect_failed');
      }
    };

    // Handle error event
    const handleError = (event) => {
      console.error('WebSocket error buddylist', event);
      bp.emit('buddylist-websocket::error', { error: 'WebSocket error' });
      // Reject the promise if connection hasn't opened yet
      if (wsClient.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket connection failed'));
      }
      // Close to trigger reconnect logic in handleClose
      wsClient.close(1000, 'Error occurred');
    };

    // Add event listeners
    wsClient.addEventListener('open', handleOpen.bind(this));
    wsClient.addEventListener('message', handleMessage.bind(this));
    wsClient.addEventListener('close', handleClose.bind(this));
    wsClient.addEventListener('error', handleError.bind(this));

    // Method to intentionally close the WebSocket
    wsClient.closeConnection = () => {
      this.isIntentionallyClosed = true;
      console.log(`Intentionally closing WebSocket for buddylist`);
      wsClient.close(1000, 'Normal closure');
      // Remove event listeners to prevent memory leaks
      wsClient.removeEventListener('open', handleOpen);
      wsClient.removeEventListener('message', handleMessage);
      wsClient.removeEventListener('close', handleClose);
      wsClient.removeEventListener('error', handleError);
      bp.emit('buddylist-websocket::closed');
    };
  });
}