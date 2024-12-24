importScripts('http://192.168.200.59:5174/vendor/msgpack.min.js');

let ws;  // WebSocket connection

self.addEventListener('message', function(event) {
    const { type, data } = event.data;
    switch (type) {
        case 'connectWebSocket':
            // Initialize WebSocket connection
            connectWebSocket();
            break;
        case 'updateSSE':
            handleSSEUpdate(JSON.parse(data));
            break;
        case 'sendMessage':
            console.log('clientWorker Sending message:', data);
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
            break;
        case 'disconnectWebSocket':
            if (ws) {
                ws.close();
            }
            break;
        default:
            console.log('Unknown message type:', type);
    }
});

function connectWebSocket() {
    ws = new WebSocket('ws://192.168.200.59');
    ws.onmessage = event => {
        // Handle incoming WebSocket messages
        const parsedData = JSON.parse(event.data);
        console.log('clientWorker ws sending wsMessage:', parsedData);
        postMessage({ type: 'wsMessage', data: parsedData });
    };
    ws.onopen = () => {
        console.log('WebSocket connected in worker.');
        postMessage({ type: 'wsConnected' });
    };
    ws.onerror = event => {
        console.error('WebSocket error in worker:', event);
        postMessage({ type: 'wsError', error: event.message });
    };
    ws.onclose = event => {
        console.log('WebSocket closed in worker.');
        postMessage({ type: 'wsClosed' });
    };
}

function handleSSEUpdate(data) {
    // Process SSE update data
    console.log("SSE Update:", data);
    postMessage({ type: 'sseUpdate', data });
}
