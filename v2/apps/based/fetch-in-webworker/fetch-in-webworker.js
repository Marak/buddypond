import WebworkerFetchWithProgress from "./WebWorkerFetchWithProgress.js";

export default class FetchInWebWorker {
    constructor(bp) {
        this.bp = bp;

        return this;

    }

    async init() {
    }

    async fetchWithProgress(url, options = {}, onProgress) {
        const fetcher = new WebworkerFetchWithProgress();
        return fetcher.fetch(url, options, onProgress);
    }
}