// Dynamically load and return the appropriate Worker class
async function getWorkerClass() {
    if (typeof window === 'undefined') {
        // Node.js environment
        const { Worker } = await import('worker_threads');
        return Worker;
    } else {
        // Browser environment
        return window.Worker;
    }
}

export default getWorkerClass;
