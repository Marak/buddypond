export default class WebworkerFetchWithProgress {
    constructor(workerScript = 'workerFetchWithProgress.js') {
        this.worker = new Worker(workerScript);
        this.requests = {};

        this.worker.onmessage = (event) => {
            const { type, id, progress, data, error } = event.data;
            const request = this.requests[id];
            if (!request) return; // onProgress never happens since request is not defined until fetch is called?
            switch (type) {
                case 'progress':
                    if (request.onProgress) {
                        request.onProgress(progress); // Call progress callback
                    }
                    break;
                case 'completed':
                    if (request.resolve) {
                        request.resolve(event.data); // Resolve the promise
                    }
                    delete this.requests[id]; // Clean up
                    break;
                case 'error':
                    if (request.reject) {
                        request.reject(error); // Reject the promise
                    }
                    delete this.requests[id]; // Clean up
                    break;
            }
        };
    }

    fetch(url, options = {}, onProgress) {
        const id = Math.random().toString(36).substr(2, 9); // Generate unique ID
        this.requests[id] = { onProgress, id };
        return new Promise((resolve, reject) => {
            this.requests[id].resolve = resolve;
            this.requests[id].reject = reject;
            this.worker.postMessage({ url, options, id }); // Start the fetch process
        });
    }
}