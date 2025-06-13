export default class HotPondsWebSocketClient {
  constructor({ pondId, endpoint, bp }) {
    this.pondId = pondId;
    this.endpoint = buddypond.pondsWsEndpoint;
    this.bp = bp;

    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.maxBackoffDelay = 10000; // 10 seconds
    this.isIntentionallyClosed = false;
  }

  async connect() {
    const url = `${this.endpoint}?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}`;
    console.log(`🔌 Connecting to HotPonds...`);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);

      const onOpen = () => {
        console.log('✅ WebSocket connected to HotPond');
        this.reconnectAttempts = 0;
        this.ws = ws;

        this.bp?.emit('hotpond::connected', { pondId: this.pondId });
        resolve(this);
      };

      const onMessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (err) {
          console.error('❌ Failed to parse message:', event.data);
          this.bp?.emit('hotpond::error', { error: 'Invalid JSON', raw: event.data });
          return;
        }

        // 🔧 Add support for custom actions later
        console.log('📬 Message received from HotPond:', data);

        let action = data.action;

        switch (action) {
            case 'activePonds':
                // console.log('Active ponds:', data.ponds);
                this.bp?.emit('hotpond::activePonds', data.ponds);
                break;
        }

        // this.bp?.emit('hotpond::message', { pondId: this.pondId, message: data });
      };

      const onClose = (event) => {
        console.warn(`⚠️ WebSocket closed [${event.code}]: ${event.reason}`);

        this.bp?.emit('hotpond::disconnected', {
          pondId: this.pondId,
          code: event.code,
          reason: event.reason,
        });

        if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(
            200 * Math.pow(2, this.reconnectAttempts) * (1 + 0.1 * Math.random()),
            this.maxBackoffDelay
          );
          console.log(`⏳ Reconnecting in ${Math.floor(delay)}ms...`);
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect().catch(() => {});
            this.bp?.emit('hotpond::reconnecting', { attempt: this.reconnectAttempts });
          }, delay);
        } else {
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('❌ Max reconnect attempts reached. Giving up.');
            this.bp?.emit('hotpond::reconnect_failed', { pondId: this.pondId });
          }
        }
      };

      const onError = (event) => {
        console.error('❌ WebSocket error:', event);
        this.bp?.emit('hotpond::error', { error: 'WebSocket error', event });
        ws.close(1000, 'Error occurred');
        reject(new Error('WebSocket connection failed'));
      };

      // Attach handlers
      ws.addEventListener('open', onOpen);
      ws.addEventListener('message', onMessage);
      ws.addEventListener('close', onClose);
      ws.addEventListener('error', onError);

      // Store methods for teardown
      this._teardown = () => {
        ws.removeEventListener('open', onOpen);
        ws.removeEventListener('message', onMessage);
        ws.removeEventListener('close', onClose);
        ws.removeEventListener('error', onError);
      };
    });
  }

  disconnect() {
    if (this.ws) {
      this.isIntentionallyClosed = true;
      this._teardown?.();
      this.ws.close(1000, 'Normal closure');
      this.bp?.emit('hotpond::closed', { pondId: this.pondId });
      this.ws = null;
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(msg);
    } else {
      console.warn('⚠️ Tried to send message but WebSocket is not open');
    }
  }

  listActivePonds() {

    // sends a listActivePonds action message to the server
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ action: 'listActivePonds' });
    } else {
      console.warn('⚠️ Tried to list active ponds but WebSocket is not open');
    }
  }

  clearAllPonds() {
    // sends a clearAllPonds action message to the server
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ action: 'clearAllPonds' });
    } else {
      console.warn('⚠️ Tried to clear all ponds but WebSocket is not open');
    }
  }

}
