const fetchWorker = new Worker('workerFetch.js');

export default async function WebworkerFetch(url, options) {
    return new Promise((resolve, reject) => {
        const id = Math.random().toString(36).substr(2, 9); // Unique ID for the request
        fetchWorker.postMessage({ url: url, options: options, id: id });

        const handleMessage = (event) => {
            if (event.data.id === id) {
                fetchWorker.removeEventListener('message', handleMessage);
                if (event.data.success) {
                    const responseData = event.data.data;

                    // Create a response-like object
                    const response = {
                        ok: true,
                        status: 200,
                        text: async () => typeof responseData === 'string' ? responseData : new TextDecoder().decode(responseData),
                        json: async () => responseData,
                        blob: async () => new Blob([responseData]),
                        arrayBuffer: async () => responseData,
                    };

                    resolve(response);
                } else {
                    reject(new Error(event.data.error));
                }
            }
        };

        fetchWorker.addEventListener('message', handleMessage);
    });
}
