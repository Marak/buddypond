export default async function detectKey (audioBuffer) {
    return new Promise((resolve, reject) => {
        const keyFinderWorker = new Worker('/v5/apps/based/audio-stripe/vendor/keyFinderProgressiveWorker.js');
        const channelData = extractAudioBuffer(audioBuffer);

        // Initialize the worker
        keyFinderWorker.postMessage({
            funcName: 'initialize',
            data: [audioBuffer.sampleRate, audioBuffer.numberOfChannels],
        });

        // Send audio data in segments to the worker
        channelData.forEach((segment) => {
            keyFinderWorker.postMessage({
                funcName: 'feedAudioData',
                data: [segment],
            });
        });

        // Signal the worker to perform final detection
        keyFinderWorker.postMessage({ funcName: 'finalDetection' });

        // Listen for worker messages
        keyFinderWorker.onmessage = (event) => {
            console.log('keyFinderWorker event', event);

            if (event.data && event.data.data instanceof Uint8Array) {
                // Decode the result
                const decoder = new TextDecoder(); // Decodes Uint8Array into a string
                const detectedKey = decoder.decode(event.data.data);
                console.log('Detected Key:', detectedKey);
                resolve(detectedKey); // Resolve the promise with the detected key
                keyFinderWorker.terminate(); // Clean up the worker
            } else if (event.data.type === 'error') {
                console.error('Error detecting key:', event.data.error);
                reject(new Error(event.data.error)); // Reject the promise on error
                keyFinderWorker.terminate(); // Clean up the worker
            } else {
                console.warn('Unexpected message from keyFinderWorker:', event.data);
            }
        };

        // Handle worker errors
        keyFinderWorker.onerror = (error) => {
            console.error('Worker encountered an error:', error);
            reject(error); // Reject the promise on error
            keyFinderWorker.terminate(); // Clean up the worker
        };
    });
};



 // Extract channel data from AudioBuffer
 function extractAudioBuffer(audioBuffer) {
    const channelData = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channelData.push(audioBuffer.getChannelData(i));
    }
    return channelData;
}



