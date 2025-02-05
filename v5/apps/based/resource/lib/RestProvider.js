export default class RestProvider {
    constructor(resourceName, options = {}) {
        console.log('RestProvider', resourceName, options);
        this.resourceName = resourceName;
        this.apiEndpoint = options.apiEndpoint;
    }

    async apiRequest(method, path, body = null) {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) options.body = JSON.stringify(body);

          if (this.bp.qtokenid) {
            options.headers["Authorization"] = `Bearer ${this.bp.qtokenid}`; // ✅ Use Authorization header
          }
        


        const response = await fetch(`${this.apiEndpoint}/${path}`, options);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return response.json();
    }

    async create(owner, data) {
        return this.apiRequest('POST', `${this.resourceName}/${owner}`, data);
    }

    async get(owner, id) {
        return this.apiRequest('GET', `${this.resourceName}/${owner}/${id}`);
    }

    async update(owner, id, data) {
        return this.apiRequest('PUT', `${this.resourceName}/${owner}/${id}`, data);
    }

    async remove(owner, id) {
        return this.apiRequest('DELETE', `${this.resourceName}/${owner}/${id}`);
    }

    async list(owner) {
        return this.apiRequest('GET', `${this.resourceName}/${owner}`);
    }
}
