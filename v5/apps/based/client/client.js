import SSEManager from './lib/SSEManager.js';
import handleWorkerMessage from './lib/handleWorkerMessage.js';

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
            if (this.subscriptions.size > 0) {
                buddypond.keepAlive();
                this.bp.log('Keepalive ping sent');
            }
        }, 30000); // 30 seconds interval
    }

    stopKeepaliveTimer() {
        if (this.keepaliveInterval) {
            clearInterval(this.keepaliveInterval);
            this.keepaliveInterval = null;
        }
    }

    addSubscription(type, context) {
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
    }

    removeSubscription(type, context) {
        const key = `${type}/${context}`;
        if (this.subscriptions.has(key)) {
            this.subscriptions.get(key).disconnectSSE();
            this.subscriptions.delete(key);
            console.log(`Unsubscribed from ${key}`);

            if (this.subscriptions.size === 0) {
                this.stopKeepaliveTimer();
            }
        } else {
            console.log(`Not subscribed to ${key}`);
        }
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

        this.stopKeepaliveTimer();
    }

    logout() {
        this.disconnect();
        this.qtokenid = null;
        this.api.qtokenid = null;
        this.api.me = 'Guest';
        this.me = 'Guest';
        this.bp.me = 'Guest';
        this.bp.emit('auth::logout');
        this.api.logout();
    }
}

Client.prototype.handleWorkerMessage = handleWorkerMessage;
