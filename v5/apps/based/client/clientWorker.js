let ws;  // WebSocket connection
let messageQueue = [];  // Queue to hold messages until the WebSocket is open

let bp = {
    log: console.log,
    error: console.error,
};

// Override the default log function to do nothing
bp.log = function noop() { };

self.addEventListener('message', function(event) {
    const { type, data, qtokenid } = event.data;
    switch (type) {
        case 'connectWebSocket':
            // Initialize WebSocket connection
            connectWebSocket(qtokenid, data);
            break;
        case 'updateSSE':
            handleSSEUpdate(JSON.parse(data));
            break;
        case 'sendMessage':
            if (ws && ws.readyState === WebSocket.OPEN) {
                //bp.log('Socket OPEN, sending message:', data);
                ws.send(JSON.stringify(data));
            } else {
                // Queue the message until the socket is open
                messageQueue.push(data);
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

function connectWebSocket(qtoken, data) {
    let url = data.wsHost + '?qtokenid=' + qtoken.qtokenid + '&me=' + qtoken.me;
    
    ws = new WebSocket(url);
    ws.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        bp.log('clientWorker ws sending wsMessage:', parsedData);
        postMessage({ type: 'wsMessage', data: parsedData });
    };
    ws.onopen = () => {
        bp.log('WebSocket connected in worker.');
        postMessage({ type: 'wsConnected' });
        // Send all queued messages
        while (messageQueue.length > 0) {
            const messageData = messageQueue.shift();
            ws.send(JSON.stringify(messageData));
            bp.log('Sending queued message:', messageData);
        }
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
    bp.log("SSE Update:", data);
    postMessage({ type: 'sseUpdate', data });
}
