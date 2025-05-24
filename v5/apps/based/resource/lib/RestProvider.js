export default class RestProvider {
    constructor(resourceName, options = {}) {
        console.log('RestProvider', resourceName, options);
        this.resourceName = resourceName;
        this.apiEndpoint = options.apiEndpoint;
    }

    async apiRequest(method, path, body = null, urlparams = {}) {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) options.body = JSON.stringify(body);

        if (this.bp.qtokenid) {
            options.headers["Authorization"] = `Bearer ${this.bp.qtokenid}`; // ✅ Use Authorization header
        }

        options.headers['X-Me'] = this.bp.me; // Add X-Me header

        let url = `${this.apiEndpoint}/${path}`;
        // append urlparams to url
        if (urlparams) {
            const params = new URLSearchParams(urlparams);
            url += `?${params.toString()}`;
        }
        console.log('apiRequest', method, url, options);

        const response = await fetch(url, options);
        if (!response.ok) {
            console.log('API request failed:', response);
            // try to get json from json
            try {
                let json = await response.json();
                console.log('API request failed:', json);
                throw new Error(`${json.error}`);
                return json;
            } catch (err) {
                console.log('eeeee', err);
                throw new Error(err);
            }
            throw new Error(`API request failed: ${json.error}`);
        }
        return response.json();
    }

    async create(id, data) {
        console.log('calling create', `${this.resourceName}`, data);
        return this.apiRequest('POST', `${this.resourceName}`, data);
    }

    async get(owner, id) {
        return this.apiRequest('GET', `${this.resourceName}/${owner}/${id}`);
    }

    async update(id, data) {
        console.log(`calling update ${this.resourceName}/${id}`, data);
        return this.apiRequest('PUT', `${this.resourceName}/${id}`, data);
    }

    async remove(id) {
        return this.apiRequest('DELETE', `${this.resourceName}/${id}`);
    }

    async list() {
        console.log('calling list', `${this.resourceName}`);
        return this.apiRequest('GET', `${this.resourceName}`);
    }

    async all() {
        return this.apiRequest('GET', this.resourceName);
    }

    async search(owner, query, urlparams = {}) {
        return this.apiRequest('POST', `${this.resourceName}/search`, query, urlparams);
    }

}
