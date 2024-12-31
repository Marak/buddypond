self.addEventListener('message', async (event) => {
    const url = event.data.url;
    const options = event.data.options;

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        if (!response.body || !response.body.getReader) {
            console.warn('Safari does not support ReadableStream; consider a fallback.');
            // Consider posting a message back to handle fallback logic
        }

        const contentLength = response.headers.get('Content-Length');
        const totalSize = contentLength ? parseInt(contentLength, 10) : undefined;

        let loaded = 0;
        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            chunks.push(value);
            loaded += value.length;
            if (totalSize) {
                // console.log("postProgress", loaded / totalSize);
                self.postMessage({ type: 'progress', progress: loaded / totalSize, id: event.data.id });
            }
        }

        const combinedChunks = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0), 0);
        let offset = 0;
        for (const chunk of chunks) {
            combinedChunks.set(chunk, offset);
            offset += chunk.length;
        }

        // Assume a function to detect MIME type (you need to define this)
        const mimeType = getMimeTypeFromUrl(url); 
        const blob = new Blob([combinedChunks], { type: mimeType });

        self.postMessage({
            type: 'completed',
            blobResponse: blob,
            arrayBufferResponse: combinedChunks.buffer,
            bodyContent: combinedChunks,
            id: event.data.id
        }, [combinedChunks.buffer]);
    } catch (error) {
        self.postMessage({ type: 'error', error: error.message, id: event.data.id });
    }
});



// Helper function to determine MIME type based on file extension
function getMimeTypeFromUrl(url) {
    //const extension = url.split('.').pop().toLowerCase();
    const extension = url.split(/[#?]/)[0].split('.').pop().trim().toLowerCase();
    const mimeTypes = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        ogg: 'audio/ogg',
        flac: 'audio/flac',
        aac: 'audio/aac',
        m4a: 'audio/mp4',
        webm: 'audio/webm'
    };

    return mimeTypes[extension] || 'application/octet-stream'; // Default to a generic binary MIME type
}