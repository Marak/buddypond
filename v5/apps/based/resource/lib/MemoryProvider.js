const memoryStore = {}; // In-memory database

export default class MemoryProvider {
    constructor(resourceName) {
        this.resourceName = resourceName;
        memoryStore[this.resourceName] = {}; // Change from array to object
    }

    create(owner, data, schema) {
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

    list(owner) {
        return Object.values(memoryStore[this.resourceName]).filter(item => item.owner === owner);
    }
}



// 🚀 Helper Function: Generate a Unique ID
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 10);
}
