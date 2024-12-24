// import { decode } from "/node_modules/@msgpack/msgpack";
importScripts('http://192.168.200.59:5174/vendor/msgpack.min.js');

self.addEventListener('error', event => {
    console.error(`Unhandled error in worker: ${event.message}`, event);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection in worker', event.reason);
});

self.addEventListener('message', function(event) {
    const { type, data } = event.data;
    switch (type) {
        case 'init':
            self.buddyList = {};  // Initialize buddy list
            break;
        case 'updateSSE':
            const parsedData = JSON.parse(data);  // Parse SSE data in the worker
            // TODO: Decode the data using MessagePack
            // console.log(MessagePack.decode)
            handleSSEUpdate(parsedData);
            break;
        case 'wsMessage':
            handleWSMessage(data);  // Process WebSocket messages
            break;
        default:
            console.log('Unknown message type');
    }
});

function handleSSEUpdate(data) {
    console.log("handleSSEUpdate update", data);
    if (data.event) {
        postMessage({ type: 'emit', event: data.event, data });
    }
}

function handleWSMessage(data) {
    // Now using msgpack to decode the data
    const parsedData = decode(new Uint8Array(data));
    // TODO: Decode the data using MessagePack
    // console.log(MessagePack.decode)
    console.log("WebSocket Message Received:", parsedData);
}