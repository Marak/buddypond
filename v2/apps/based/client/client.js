import api from './lib/api.js';
import SSEManager from './lib/SSEManager.js';
export default class Client {
    constructor(bp) {
        this.bp = bp;
        // this.sse = null;
        this.sseManager = new SSEManager(this);

        this.ws = null;
        this.api = api;
        let bpHost = 'http://192.168.200.59:5174';
        this.connectionSources = {};  // Tracks WebSocket connection requests by source
        this.disconnectTimer = null;
        this.disconnectDelay = 300000;  // 5 minutes
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

        this.worker.onmessage = function(event) {
            // Handle messages from the worker here
            console.log('Message from worker:', event.data);
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
            console.log(`WebSocket connection requested by ${source}.`);
            this.connectionSources[source] = true;
            if (Object.keys(this.connectionSources).length === 1) {
                this.worker.postMessage({ type: 'connectWebSocket' });  // Tell worker to connect WebSocket
            }
            clearTimeout(this.disconnectTimer);
        }
    }

    releaseWebsocketConnection(source) {
        if (this.connectionSources[source]) {
            console.log(`WebSocket connection released by ${source}.`);
            delete this.connectionSources[source];
            if (Object.keys(this.connectionSources).length === 0) {
                this.disconnectTimer = setTimeout(() => {
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
        console.log('handleWorkerMessage', event)
        const { type, data } = event;
        switch (type) {
            case 'wsMessage':
                console.log('WebSocket message received from worker:', data);
                this.bp.emit(event.data.event, event.data);
                break;
            case 'sseUpdate':
                console.log('SSE update from worker:', type, data);
                this.bp.emit(data.event, data);

                break;
            case 'wsConnected':
                console.log('WebSocket connection established in worker.');
                this.onWebSocketConnected();
                break;
            case 'wsClosed':
                console.log('WebSocket connection closed in worker.');
                break;
            case 'wsError':
                console.error('WebSocket error in worker:', data);
                break;
            default:
                console.log('Unhandled message type from worker:', type);
        }
    }

    handleWorkerError(event) {
        console.error('Error in worker:', event.message);
    }

    sendMessage(message) {
        console.log('sendMessage', message, this.connectionSources)
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

}