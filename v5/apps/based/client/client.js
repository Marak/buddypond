import SSEManager from './lib/SSEManager.js';
import handleWorkerMessage from './lib/handleWorkerMessage.js';
import createWebSocketClient from './lib/ws/createWebSocketClient.js';

export default class Client {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.config = options.config || this.bp.config || {
            host: "",
            api: "",
        };
        
        this.messageSSEManager = new SSEManager(this, {});
        this.buddylistSSEManager = new SSEManager(this, {});
        this.buddySSEManager = new SSEManager(this, {});
        
        this.api = buddypond;
        this.api.endpoint = `${this.config.api}/api/v6`;
        this.sseConnected = false;
        this.queuedMessages = [];

        this.messagesWsClients = new Map();
        
        // Track active subscriptions
        this.subscriptions = new Map();

        // Timer for keepalive
        this.keepaliveInterval = null;
    }

    async init() {
        let config = {
            onmessage: (event) => this.handleWorkerMessage(event),
            onerror: (event) => console.error("Worker Error:", event),
        };

        this.worker = await this.bp.createWorker('/apps/based/client/clientWorker.js', config);
        this.worker.onmessage = (event) => {
            this.bp.log('Message from worker:', event.data);
            config.onmessage(event.data);
        };
        
        this.worker.onerror = (event) => {
            console.error('Worker error:', event);
            config.onerror(event);
        };

        this.bp.on('auth::qtoken', 'connect-to-sse', (qtoken) => {
            this.qtokenid = qtoken.qtokenid;
            this.api.qtokenid = this.qtokenid;
            this.api.me = qtoken.me;
            this.me = qtoken.me;
            this.bp.me = this.me;
            this.bp.qtokenid = this.qtokenid;
            this.connect();

            // immediately let the server know the client is now alive
            // this is required to show online status immediately ( instead of waiting for startKeepaliveTimer)
            setTimeout(function(){
                buddypond.keepAlive();
            }, 1000);

            // Start the keepalive timer after authentication
            // TODO: uncomment this when server is ready
            this.startKeepaliveTimer();
        });

        return this;
    }

    startKeepaliveTimer() {
        if (this.keepaliveInterval) return; // Prevent multiple intervals

        this.keepaliveInterval = setInterval(() => {
            //if (this.subscriptions.size > 0) {
                buddypond.keepAlive();
                this.bp.log('Keepalive ping sent');
            //}
        }, 30000); // 30 seconds interval
    }

    stopKeepaliveTimer() {
        if (this.keepaliveInterval) {
            clearInterval(this.keepaliveInterval);
            this.keepaliveInterval = null;
        }
    }

    sendWsMessage(chatId, message) {

        let wsClient = this.messagesWsClients.get(chatId);
        if (!wsClient) {
          console.log('buddypond.messagesWs not connected, unable to send message to', chatId, message);
          return;
        }
        // send the message via ws connection
        wsClient.send(JSON.stringify(message));

    }

    addSubscription(type, context) {

        let chatId = type + '/' + context;
      
        if (type === 'buddy') {
          // if the context is a buddy, we need to create a unique chatId to represent the tuple
          // it's important that the tuple is consistent across all services, so we sort the buddy names by alphabetical order
          let buddyNames = [buddypond.me, context].sort();
          chatId = type + '/' + buddyNames.join('/');
        }
        console.log(`subscribeMessages subscribing to ${chatId}`);

        // check if an entry exists in the map
        if (!this.messagesWsClients.has(chatId)) {
          this.createWebSocketClient(chatId);
        }

        // this.bp.apps.client.api.subscribeMessages(type, context);
        /* Legacy code for SSE, replaced with WebSocket API in api.js
        // TODO: we could move the api code back here for cleaner code
        if (!this.bp.qtokenid) {
            setTimeout(() => this.addSubscription(type, context), 100);
            return;
        }
        const key = `${type}/${context}`;
        if (!this.subscriptions.has(key)) {
            const sseConnection = new SSEManager(this, {});
            console.log('Making connection to', `${this.config.api}/api/v6/sse/message?type=${type}&context=${context}&qtokenid=${this.bp.qtokenid}&lastMessageId=0`);
            sseConnection.connectSSE(`${this.config.api}/api/v6/sse/message?type=${type}&context=${context}&qtokenid=${this.bp.qtokenid}&lastMessageId=0`);
            this.subscriptions.set(key, sseConnection);
            this.bp.log(`Subscribed to ${key}`);
        } else {
            console.log(`Already subscribed to ${key}`);
        }
        */
    }

    removeSubscription(type, context) {

        let chatId = type + '/' + context;
      
        if (type === 'buddy') {
          // if the context is a buddy, we need to create a unique chatId to represent the tuple
          // it's important that the tuple is consistent across all services, so we sort the buddy names by alphabetical order
          let buddyNames = [buddypond.me, context].sort();
          chatId = type + '/' + buddyNames.join('/');
        }
      
        console.log(`unsubscribeMessages unsubscribing from ${chatId}`);

        // check if an entry exists in the map
        if (this.messagesWsClients.has(chatId)) {
          console.log(`buddypond.messagesWsClients has ${chatId}, closing connection`);
          let wsClient = this.messagesWsClients.get(chatId);
          console.log('closing wsClient', wsClient);
      
          console.log('Before close, readyState:', wsClient.readyState);
          wsClient.closeConnection();
        
        }

        // this.api.unsubscribeMessages(type, context);
        /* Legacy code for SSE, replaced with WebSocket API in api.js
        // TODO: we could move the api code back here for cleaner code

        const key = `${type}/${context}`;
        if (this.subscriptions.has(key)) {
            this.subscriptions.get(key).disconnectSSE();
            this.subscriptions.delete(key);
            console.log(`Unsubscribed from ${key}`);
            console.log('subscriptions', this.subscriptions);
            if (this.subscriptions.size === 0) {
                this.stopKeepaliveTimer();
            }
        } else {
            console.log(`Not subscribed to ${key}`);
        }
        */
    }

    connect() {
        if (!this.sseConnected) {
            this.buddylistSSEManager.connectSSE(`${this.config.api}/api/v6/sse/buddylist?buddyname=${this.bp.me}&qtokenid=${this.bp.qtokenid}&lastMessageId=0`);
            this.sseConnected = true;
        }
    }

    sendMessage(message) {
        this.bp.log('sendMessage', message);
        message.me = this.api.me;
    }

    disconnect() {
        this.buddylistSSEManager.disconnectSSE();
        this.subscriptions.forEach(sse => sse.disconnectSSE());
        this.subscriptions.clear();
        this.sseConnected = false;

        // iterate through all buddypond.messagesWsClients Map and closeConnection() all of them
        this.bp.log('Disconnecting all WebSocket clients');
        this.messagesWsClients.forEach(client => {
            client.closeConnection();
        });

        this.stopKeepaliveTimer();
    }

    logout() {
        // disconnects buddylist SSE and all message web sockets
        this.disconnect();
        this.qtokenid = null;
        this.api.qtokenid = null;

        this.api.me = 'Guest';
        this.me = 'Guest';
        this.bp.me = 'Guest';

        localStorage.removeItem('qtokenid');
        localStorage.removeItem('me');

        // once we have performed the logout, we need to emit the event
        // such that the UI can update
        this.bp.emit('auth::logout');
    }
}

Client.prototype.handleWorkerMessage = handleWorkerMessage;
Client.prototype.createWebSocketClient = createWebSocketClient;