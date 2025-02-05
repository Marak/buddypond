import MemoryProvider from './MemoryProvider.js';
import RestProvider from './RestProvider.js';

const schemaRegistry = {};

export default class Resource {
    constructor(name, options) {
        this.name = name;
        this.schema = options.schema || {};
        this.providerType = options.provider || 'memory';

        if (!this.schema || Object.keys(this.schema).length === 0) {
            throw new Error(`Schema definition is required for resource: ${name}`);
        }
        console.log('sending options to provider', options);
        schemaRegistry[this.name] = this.schema; // Register the resource schema
        this.provider = this.providerType === 'rest' ? new RestProvider(this.name, options) : new MemoryProvider(this.name);
        this.provider.bp = options.bp;
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
}
