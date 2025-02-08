const memoryStore = {}; // In-memory database

export default class MemoryProvider {
    constructor(resourceName) {
        this.resourceName = resourceName;
        memoryStore[this.resourceName] = {}; // Change from array to object
        this.memoryStore = memoryStore;
    }

    create(owner, data, schema) {
        // Check for required fields
        Object.keys(schema).forEach((key) => {
            if (schema[key].required && (data[key] === undefined || data[key] === null)) {
                throw new Error(`${key} is required`);
            }

            if (schema[key].unique) {
                const entries = Object.values(memoryStore[this.resourceName]);
                if (entries.some(entry => entry[key] === data[key])) {
                    throw new Error(`${key} must be unique`);
                }
            }

            if (schema[key].type && typeof data[key] !== schema[key].type) {
                throw new Error(`${key} must be of type ${schema[key].type} value is ${data[key]}`);
            }

        });

        const newId = generateUniqueId();
        const newEntry = { id: newId, owner };

        Object.keys(schema).forEach((key) => {
            newEntry[key] = data[key] || null;
        });

        memoryStore[this.resourceName][newId] = newEntry;
        return newEntry;
    }

    get(owner, id) {
        const entry = memoryStore[this.resourceName][id];
        return entry && entry.owner === owner ? entry : null;
    }

    update(owner, id, data, schema) {
        const entry = memoryStore[this.resourceName][id];
        if (!entry || entry.owner !== owner) {
            throw new Error(`${this.resourceName} not found or unauthorized`);
        }

        // Check for required fields
        Object.keys(schema).forEach((key) => {
            if (schema[key].required && (data[key] === undefined || data[key] === null)) {
                throw new Error(`${key} is required`);
            }
            /*
            if (schema[key].unique && data[key] !== undefined) {
                const entries = Object.values(memoryStore[this.resourceName]);
                if (entries.some(e => e.id !== id && e[key] === data[key])) {
                    throw new Error(`${key} must be unique`);
                }
            }
                */
        });

        Object.keys(schema).forEach((key) => {
            if (data[key] !== undefined) {
                entry[key] = data[key];
            }
        });

        return entry;
    }

    remove(owner, id) {
        const entry = memoryStore[this.resourceName][id];
        if (!entry || entry.owner !== owner) {
            throw new Error(`${this.resourceName} not found or unauthorized`);
        }

        delete memoryStore[this.resourceName][id];
        return { success: true };
    }

    search(owner, query) {
        // example query: { name: 'John', age: 30 }
        return Object.values(memoryStore[this.resourceName]).filter(item => item.owner === owner && Object.keys(query).every(key => item[key] === query[key]));
    }

    list(owner) {
        return Object.values(memoryStore[this.resourceName]).filter(item => item.owner === owner);
    }

    all() {
        return Object.values(memoryStore[this.resourceName]);
    }
}

// 🚀 Helper Function: Generate a Unique ID
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 10);
}
