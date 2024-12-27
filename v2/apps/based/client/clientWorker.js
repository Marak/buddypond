// importScripts('./vendor/msgpack.min.js');

let ws;  // WebSocket connection

let bp = {
    log: console.log,
    error: console.error,
};
bp.log = function noop() { };

self.addEventListener('message', function(event) {
    const { type, data } = event.data;
    switch (type) {
        case 'connectWebSocket':
            // Initialize WebSocket connection
            connectWebSocket(JSON.parse(data));
            break;
        case 'updateSSE':
            handleSSEUpdate(JSON.parse(data));
            break;
        case 'sendMessage':
            bp.log('clientWorker Sending message:', data);
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
            bp.log('Unknown message type:', type);
    }
});

function connectWebSocket(data) {
    console.log('Connecting WebSocket in worker:', data.host);
    ws = new WebSocket('ws://' + data.host);
    ws.onmessage = event => {
        // Handle incoming WebSocket messages
        const parsedData = JSON.parse(event.data);
        bp.log('clientWorker ws sending wsMessage:', parsedData);
        postMessage({ type: 'wsMessage', data: parsedData });
    };
    ws.onopen = () => {
        bp.log('WebSocket connected in worker.');
        postMessage({ type: 'wsConnected' });
    };
    ws.onerror = event => {
        console.error('WebSocket error in worker:', event);
        postMessage({ type: 'wsError', error: event.message });
    };
    ws.onclose = event => {
        bp.log('WebSocket closed in worker.');
        postMessage({ type: 'wsClosed' });
    };
}

function handleSSEUpdate(data) {
    // Process SSE update data
    bp.log("SSE Update:", data);
    postMessage({ type: 'sseUpdate', data });
}
