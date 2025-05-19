// import handleWorkerMessage from './lib/handleWorkerMessage.js';
import createWebSocketClient from './lib/ws/createWebSocketClient.js';
// TODO: move client code to specific app ( in this case buddylist/messages )
// TODO: client app is being deprecated in favor of each app having its own client
export default class Client {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.config = options.config || this.bp.config || {
            host: "",
            api: "",
        };
        
        this.api = buddypond;
        this.api.endpoint = `${this.config.api}/api/v6`;
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
    }

    connect() {
        // moved to buddylist.client.connect()
    }

    sendMessage(message) {
        this.bp.log('sendMessage', message);
        message.me = this.api.me;
    }

    disconnect() {

        // iterate through all buddypond.messagesWsClients Map and closeConnection() all of them
        this.bp.log('Disconnecting all WebSocket clients');
        this.messagesWsClients.forEach(client => {
            client.closeConnection();
        });

    }

    logout() {

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

// Client.prototype.handleWorkerMessage = handleWorkerMessage;
Client.prototype.createWebSocketClient = createWebSocketClient;