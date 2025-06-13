// Remark: We are migrating away from having client application, and instead moved each client to their own application's folder
// This will be the client for messages, buddylist websocket is handled by apps/buddylist/lib/wsclient.js
// TODO: Move this to /messages/client.js
import createWebSocketClient from './lib/ws/createWebSocketClient.js';

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
        let chatConnection = this.messagesWsClients.get(chatId);
        if (!chatConnection || !chatConnection.wsClient) {
            console.log('buddypond.messagesWs not connected, unable to send message to', chatId, message);
            return;
        }
        // Send the message via ws connection
        chatConnection.wsClient.send(JSON.stringify(message));
    }
    
    getConnectedUsers(chatId) {
        alert('getConnectedUsers called for ' + chatId);
        // sends a getConnectedUsers webscket message to the server
        this.bp.log('getConnectedUsers called');
        if (this.messagesWsClients.has(chatId)) {
            let chatConnection = this.messagesWsClients.get(chatId);
            if (chatConnection && chatConnection.wsClient) {
                this.bp.log('buddypond.messagesWsClients has', chatId, 'sending getConnectedUsers message');
                chatConnection.wsClient.send(JSON.stringify({ action: 'getConnectedUsers' }));
            } else {
                this.bp.log('No WebSocket client found for', chatId);
            }
        }
        else {
            this.bp.log('No WebSocket client found for', chatId, 'unable to send getConnectedUsers message');
        }

    }

    addSubscription(type, context) {
        let chatId = type + '/' + context;
      
        if (type === 'buddy') {
            // If the context is a buddy, create a unique chatId for the tuple
            let buddyNames = [buddypond.me, context].sort();
            chatId = type + '/' + buddyNames.join('/');
        }
        console.log(`subscribeMessages subscribing to ${chatId}`);

        // Check if an entry exists in the map
        if (!this.messagesWsClients.has(chatId)) {
            this.createWebSocketClient(chatId);
        }
    }

    removeSubscription(type, context) {
        let chatId = type + '/' + context;
      
        if (type === 'buddy') {
            // If the context is a buddy, create a unique chatId for the tuple
            let buddyNames = [buddypond.me, context].sort();
            chatId = type + '/' + buddyNames.join('/');
        }
      
        console.log(`unsubscribeMessages unsubscribing from ${chatId}`);

        // Check if an entry exists in the map
        if (this.messagesWsClients.has(chatId)) {
            console.log(`buddypond.messagesWsClients has ${chatId}, closing connection`);
            let chatConnection = this.messagesWsClients.get(chatId);
            console.log('closing chatConnection', chatConnection);
      
            console.log('Before close, readyState:', chatConnection.wsClient.readyState);
            chatConnection.wsClient.closeConnection();
        }
    }

    connect() {
        // Moved to buddylist.client.connect()
    }

    sendMessage(message) {
        this.bp.log('sendMessage', message);
        message.me = this.api.me;
    }

    disconnect() {
        // Iterate through all buddypond.messagesWsClients Map and closeConnection() all of them
        this.bp.log('Disconnecting all WebSocket clients');
        this.messagesWsClients.forEach(chatConnection => {
            chatConnection.wsClient.closeConnection();
        });
    }

    logout() {
        this.disconnect();
        this.qtokenid = null;
        this.api.qtokenid = null;

        this.api.me = 'Guest';
        this.me = 'Guest';
        this.bp.me = 'Guest';
        this.bp.qtokenid = null;

        localStorage.removeItem('qtokenid');
        localStorage.removeItem('me');

        // Once we have performed the logout, emit the event
        this.bp.emit('auth::logout');
    }
}

Client.prototype.createWebSocketClient = createWebSocketClient;