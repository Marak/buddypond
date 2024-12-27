self.addEventListener('message', async (event) => {
    try {
        const response = await fetch(event.data.url, event.data.options);
        
        // Log the response to verify its type
        // console.log("Fetch Response object:", response);

        if (response instanceof Response) {
            const contentType = response.headers.get('content-type');
            // console.log("Response content type:", contentType);

            if (contentType.includes('application/json')) {
                // Handle JSON data
                const data = await response.json();
                self.postMessage({ success: true, data: data, id: event.data.id });
            } else if (contentType.includes('text')) {
                // Handle plaintext data
                const text = await response.text();
                self.postMessage({ success: true, data: text, id: event.data.id });
            } else {
                // Handle binary data
                const buffer = await response.arrayBuffer();
                // console.log('ArrayBuffer Response:', buffer);
                self.postMessage({ success: true, data: buffer, id: event.data.id }, [buffer]);
            }
        } else {
            throw new Error("Response does not have an arrayBuffer method or is not a valid Response object.");
        }
    } catch (error) {
        console.error("Error in worker:", error);
        self.postMessage({ success: false, error: error.message, id: event.data.id });
    }
});
