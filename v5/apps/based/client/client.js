import api from './lib/api.js';
import SSEManager from './lib/SSEManager.js';
export default class Client {
    constructor(bp, options = {}) {
        this.bp = bp;
        // this.sse = null;
        this.config = options.config || {
            host: "",
            wsHost: "",
            api: "",
        };
        this.sseManager = new SSEManager(this);
        this.ws = null;
        this.api = api;
        this.api.endpoint = this.config.api + '/api/v3';
        //this.config.api = 'https://api.buddypond.com';
        this.connectionSources = {};  // Tracks WebSocket connection requests by source
        this.disconnectTimer = null;
        this.disconnectDelay = 10000;  // 10 seconds
        this.sseConnected = false;
        this.queuedMessages = [];
    }
    async init() {

        let config = {
            onmessage: (event) => {
                this.handleWorkerMessage(event);
            },
            onerror: (event) => {
                console.error("Worker Error:", event);
            },
        };

        // onmessage and onerror are bound inside createWorker
        this.worker = await this.bp.createWorker('/apps/based/client/clientWorker.js', config);

        this.worker.onmessage = (event) => {
            // Handle messages from the worker here
            this.bp.log('Message from worker:', event.data);
            if (config.onmessage) {
                config.onmessage(event.data);
            }
        };
        this.worker.onerror = function(event) {
            console.error('Worker error:', event);
            if (config.onerror) {
                config.onerror(event);
            }
        };

        this.bp.on('auth::qtoken', 'connect-to-sse', (qtoken) => {
            this.qtokenid = qtoken.qtokenid;
            this.api.qtokenid = this.qtokenid;
            this.api.me = qtoken.me;
            this.me = qtoken.me;
            this.bp.me = this.me;
            this.connect();
        });

        this.bp.on('client::requestWebsocketConnection', 'request-websocket-connection', (source) => {
            //console.log("request-websocket-connection", source);
            this.requestWebsocketConnection(source);
        });

        return this;
    }

    connect() {
        if (!this.sseConnected) {
            this.sseManager.connectSSE();
        }
    }

    requestWebsocketConnection(source) {
        if (!this.connectionSources[source]) {
            //console.log(`WebSocket connection requested by ${source}.`);
            this.connectionSources[source] = true;
            if (Object.keys(this.connectionSources).length === 1) {
                this.worker.postMessage({ type: 'connectWebSocket', data: this.config, qtokenid: {
                    qtokenid: this.api.qtokenid,
                    me: this.api.me
                } });  // Tell worker to connect WebSocket
            }
            //console.log('clearing disconnect timer', this.disconnectTimer)
            clearTimeout(this.disconnectTimer);
        } else {
            //console.log(`WebSocket connection already requested by ${source}.`);
            clearTimeout(this.disconnectTimer);
        }
    }

    releaseWebsocketConnection(source) {
        if (this.connectionSources[source]) {
            //console.log(`WebSocket connection releaseWebsocketConnection requested ${source}.`);
            delete this.connectionSources[source];
            if (Object.keys(this.connectionSources).length === 0) {
                this.disconnectTimer = setTimeout(() => {
                    console.log('calling disconnectWebSocket')
                    this.worker.postMessage({ type: 'disconnectWebSocket' });  // Tell worker to disconnect WebSocket
                }, this.disconnectDelay);
            }
        }
    }

    onWebSocketConnected() {
        this.wsConnected = true;
        this.bp.emit('client::websocketConnected', this.ws);
        // Send any queued messages
        this.queuedMessages.forEach(message => {
            this.sendMessage(message);
        });
        this.queuedMessages = [];
    }

    handleWorkerMessage(event) {
        this.bp.log('handleWorkerMessage', event)
        const { type, data } = event;
        switch (type) {
            case 'wsMessage':
                this.bp.log('WebSocket message received from worker:', data);
                this.bp.emit(event.data.event, event.data);
                break;
            case 'sseUpdate':
                this.bp.log('SSE update from worker:', type, data);
                this.bp.emit(data.event, data);

                break;
            case 'wsConnected':
                this.bp.log('WebSocket connection established in worker.');
                this.onWebSocketConnected();
                break;
            case 'wsClosed':
                this.bp.log('WebSocket connection closed in worker.');
                break;
            case 'wsError':
                console.error('WebSocket error in worker:', data);
                break;
            default:
                this.bp.log('Unhandled message type from worker:', type);
        }
    }

    handleWorkerError(event) {
        console.error('Error in worker:', event.message);
    }

    sendMessage(message) {
        this.bp.log('sendMessage', message, this.connectionSources)
        message.me = this.api.me;
        if (Object.keys(this.connectionSources).length > 0) {  // Check if there are active sources
            this.worker.postMessage({ type: 'sendMessage', data: message });
        } else {
            this.queuedMessages.push(message);
        }
    }

    flushMessageQueue() {
        while (this.queuedMessages.length > 0) {
            let message = this.queuedMessages.shift();
            this.sendMessage(message);
        }
    }

    disconnectWebSocket() {
        this.worker.postMessage({ type: 'disconnectWebSocket' });
    }

    disconnect () {
        // immediately disconnects all connections
        this.worker.postMessage({ type: 'disconnectWebSocket' });
        this.sseManager.disconnectSSE();
    }

    logout () {
        this.disconnect();
        // clear the qtoken from the client and local storage
        this.qtokenid = null;
        this.api.qtokenid = null;
        this.api.me = null;
        this.me = null;
        this.bp.me = 'Guest';
        this.bp.emit('auth::logout');
        this.api.logout();
    }

}