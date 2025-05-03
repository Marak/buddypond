export default class SSEManager {
    constructor(client, options = {}) {
        this.client = client;
        this.log = client.bp.log;
        this.sse = null;
        this.sseConnected = false;
        this.connectionUrl = null;
    }

    connectSSE(eventSourceUrl) {
        this.connectionUrl = eventSourceUrl;
        console.log('connectSSE', eventSourceUrl);
        this.hardDisconnect = false;
        this.initiateSSE(eventSourceUrl);
    }
    
    initiateSSE(url) {
        this.sse = new EventSource(url);
        // console.log('initiateSSE new SSE URL:', url);
        this.sse.onmessage = (event) => {
            // console.log('SSE Message:', event.data);
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
                this.connectSSE(this.connectionUrl);
            }
        }, 5000);
    }

    disconnectSSE () {
        this.hardDisconnect = true;
        if (this.sse) {
            this.sse.close();
            console.log("CLOSED SSE")
            this.sseConnected = false;
        }
    }
    
}
