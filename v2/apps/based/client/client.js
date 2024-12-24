import api from './lib/api.js';

export default class Client {
    constructor(bp) {
        this.bp = bp;
        this.sse = null;
        this.ws = null;
        this.api = api;
        let bpHost = 'http://192.168.200.59:5174';
        this.connectionSources = {};  // Tracks WebSocket connection requests by source
        this.disconnectTimer = null;
        this.disconnectDelay = 300000;  // 5 minutes
        this.sseConnected = false;
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

        this.worker.postMessage({ type: 'init' });  // Initialize the worker


        this.bp.on('auth::qtoken', 'connect-to-sse', (qtoken) => {
            this.qtokenid = qtoken.qtokenid;
            this.me = qtoken.me;
            this.bp.me = this.me;
            this.connect();
        });

        return this;
    }

    connect() {
        if (!this.sseConnected) {
            this.connectSSE();
        }
    }

    connectSSE() {
        const bpHost = 'http://192.168.200.59';
        let eventSourceUrl = bpHost + '/profile?qtokenid=' + this.qtokenid;
        let restUrl = bpHost + '/api/v3/buddies?eventSource=true&qtokenid=' + this.qtokenid;
        console.log('eventSourceUrl', eventSourceUrl);
        console.log('restUrl', restUrl);
        // Fetch the initial state before starting the SSE connection
        fetch(restUrl)
            .then(response => response.text())
            .then(data => {
                // Use the same event handler that SSE will use
                console.log('Initial State:', data);
                this.worker.postMessage({ type: 'updateSSE', data: data });
            })
            .catch(error => {
                console.error('Error fetching initial state:', error);
            });
    
        // Now establish the SSE connection
        this.sse = new EventSource(eventSourceUrl);
        this.sse.onmessage = (event) => {
            // Handle SSE messages with the same handler
            console.log('SSE Message:', event.data);
            //this.worker.postMessage({ type: 'updateSSE', data: event.data });
        };
        this.sseConnected = true;
        console.log("Connected to SSE");
    }
    

    requestWebsocketConnection(source) {
        if (!this.connectionSources[source]) {
            console.log(`WebSocket connection requested by ${source}.`);
            this.connectionSources[source] = true;

            if (Object.keys(this.connectionSources).length === 1) {
                this.connectWebSocket();  // Connect if it's the first request
            }
            clearTimeout(this.disconnectTimer); // Cancel any planned disconnection
        }
    }

    releaseWebsocketConnection(source) {
        if (this.connectionSources[source]) {
            console.log(`WebSocket connection released by ${source}.`);
            delete this.connectionSources[source];

            if (Object.keys(this.connectionSources).length === 0) {
                // Start a timer to disconnect if no new requests are made
                this.disconnectTimer = setTimeout(() => {
                    this.disconnectWebSocket();
                }, this.disconnectDelay);
            }
        }
    }

    connectWebSocket() {
        this.ws = new WebSocket('ws://localhost/chat');
        this.ws.onmessage = (event) => {
            this.worker.postMessage({ type: 'wsMessage', data: event.data });
        };
        this.ws.onclose = this.handleWSClose.bind(this);
        this.ws.onerror = this.handleWSError.bind(this);
        console.log("WebSocket connected.");
    }

    disconnectWebSocket() {
        if (this.ws) {
            console.log("Disconnecting WebSocket due to inactivity.");
            this.ws.close();
            this.ws = null;
        }
    }

    handleWorkerMessage(event) {
        console.log("Worker Message Received:", event.data);
        const { type, event: workerEvent, data } = event.data;
        this.bp.emit(workerEvent, event.data);
        console.log('Event emitted:', workerEvent);
    }

    handleWSClose(event) {
        console.log("WebSocket Closed:", event);
        this.ws = null;
        this.connectionSources = {};  // Reset the sources upon disconnection
    }

    handleWSError(event) {
        console.error("WebSocket Error:", event);
    }

    sendMessage(message) {
        if (this.ws) {
            this.ws.send(JSON.stringify(message));
        }
    }
}