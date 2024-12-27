export default class SSEManager {
    constructor(client) {
        this.client = client;
        this.log = client.bp.log;
        this.sse = null;
        this.sseConnected = false;
    }

    connectSSE() {
        this.hardDisconnect = false;

        const eventSourceUrl = this.client.config.host + '/profile?qtokenid=' + this.client.qtokenid;
        const restUrl = this.client.config.host + '/api/v3/buddies?eventSource=true&qtokenid=' + this.client.qtokenid;
    
        this.log('eventSourceUrl', eventSourceUrl);
        this.log('restUrl', restUrl);
    
        // Fetch the initial state before starting the SSE connection
        fetch(restUrl)
            .then(response => response.text())
            .then(data => {
                this.log('Initial State:', data);
                this.client.worker.postMessage({ type: 'updateSSE', data: data });
                this.initiateSSE(eventSourceUrl);
            })
            .catch(error => {
                console.error('Error fetching initial state:', error);
            });
    }
    
    initiateSSE(url) {
        this.sse = new EventSource(url);
        this.sse.onmessage = (event) => {
            this.log('SSE Message:', event.data);
            this.client.worker.postMessage({ type: 'updateSSE', data: event.data });
        };
    
        this.sse.onerror = (event) => {
            if (this.sse.readyState === EventSource.CLOSED) {
                console.error('SSE connection was closed. Attempting to reconnect...');
                this.reconnectSSE();
            }
        };
    
        this.sseConnected = true;
        this.log("Connected to SSE");
    }
    
    reconnectSSE() {
        if (this.hardDisconnect) {
            this.log("SSE connection was manually closed. Not attempting to reconnect.");
            return;
        }
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
            this.log("Reconnecting SSE...");
            if (!this.sse || this.sse.readyState === EventSource.CLOSED) {
                this.connectSSE();
            }
        }, 5000);
    }

    disconnectSSE () {
        this.hardDisconnect = true;
        if (this.sse) {
            this.sse.close();
            this.sseConnected = false;
        }
    }
    
}
