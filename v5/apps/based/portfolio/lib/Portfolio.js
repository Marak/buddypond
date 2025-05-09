import transfer from "./transfer.js";

export default class Portfolio {
    constructor(config = {}) {
        this.resource = config.resource;
        this.me = config.me || 'Guest';
    }

    async get() {
        let result = await this.resource.list(this.me);
        console.log('Portfoliorrrr', result);
        return result;
    }

    async search (query = {}) {
        console.log('portfolio search', this.me, query);
        let result = await this.resource.search(this.me, query);
        console.log('search result', result);
        return result.results;
    }

}

Portfolio.prototype.transfer = transfer;