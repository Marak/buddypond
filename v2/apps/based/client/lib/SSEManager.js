export default class SSEManager {
    constructor(client) {
        this.client = client;
        this.sse = null;
        this.sseConnected = false;
    }

    connectSSE() {
        const bpHost = 'http://192.168.200.59';
        const eventSourceUrl = bpHost + '/profile?qtokenid=' + this.client.qtokenid;
        const restUrl = bpHost + '/api/v3/buddies?eventSource=true&qtokenid=' + this.client.qtokenid;
    
        console.log('eventSourceUrl', eventSourceUrl);
        console.log('restUrl', restUrl);
    
        // Fetch the initial state before starting the SSE connection
        fetch(restUrl)
            .then(response => response.text())
            .then(data => {
                console.log('Initial State:', data);
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
            console.log('SSE Message:', event.data);
        };
    
        this.sse.onerror = (event) => {
            if (this.sse.readyState === EventSource.CLOSED) {
                console.error('SSE connection was closed. Attempting to reconnect...');
                this.reconnectSSE();
            }
        };
    
        this.sseConnected = true;
        console.log("Connected to SSE");
    }
    
    reconnectSSE() {
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
            console.log("Reconnecting SSE...");
            if (!this.sse || this.sse.readyState === EventSource.CLOSED) {
                this.connectSSE();
            }
        }, 5000);
    }
    
}
