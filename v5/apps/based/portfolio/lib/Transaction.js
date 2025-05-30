export default class Transaction {
    constructor(config = {}) {
        this.resource = config.resource;
        this.me = config.me || 'Guest';
    }

    async get() {
        let result = await this.resource.list(this.me);
        console.log('Portfoliorrrr', result);
        return result;
    }

    async search (buddyname, query = {}, urlparams = {}) {
        console.log('transactions search', buddyname, query, urlparams);
        let result = await this.resource.search(buddyname, query, urlparams);
        console.log('search result', result);
        return result;
    }

}