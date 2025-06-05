import MemoryProvider from './MemoryProvider.js';
import RestProvider from './RestProvider.js';
import IndexedDBProvider from './IndexedDbProvider.js';

const schemaRegistry = {};

export default class Resource {
    constructor(name, options) {
        this.name = name;
        this.schema = options.schema || {};
        this.providerType = options.provider || 'memory';

        if (Object.keys(this.schema).length === 0) {
            throw new Error(`Schema definition is required for resource: ${name}`);
        }
        
        // console.log('Initializing provider with options:', options);
        schemaRegistry[this.name] = this.schema; // Register the resource schema

        this.provider = this._createProvider(this.providerType, options);
        this.provider.bp = options.bp;
    }

    _createProvider(providerType, options) {
        switch (providerType) {
            case 'rest':
                return new RestProvider(this.name, options);
            case 'indexeddb':
                return new IndexedDBProvider(this.name, options);
            case 'memory':
            default:
                return new MemoryProvider(this.name);
        }
    }

    create(owner, data) {
        return this.provider.create(owner, data, this.schema);
    }

    get(owner, id) {
        return this.provider.get(owner, id);
    }

    update(owner, id, data) {
        return this.provider.update(owner, id, data, this.schema);
    }

    remove(owner, id) {
        return this.provider.remove(owner, id);
    }

    list(owner) {
        return this.provider.list(owner);
    }

    search(owner, query, urlparams) {
        return this.provider.search(owner, query, urlparams);
    }
    
    all() {
        return this.provider.all();
    }

    

    async apiRequest(method, path, body = null) {
        return this.provider.apiRequest(method, path, body);
    }

}
