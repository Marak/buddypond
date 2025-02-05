export default class IndexedDbProvider {
    constructor(resourceName) {
        this.resourceName = resourceName;
        this.dbName = "BuddyPondResourceDB";
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                let db = event.target.result;
                if (!db.objectStoreNames.contains(this.resourceName)) {
                    db.createObjectStore(this.resourceName, { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(`IndexedDB Error: ${event.target.errorCode}`);
            };
        });
    }

    async _withStore(mode, callback) {
        if (!this.db) {
            await this.init();
        }
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.resourceName, mode);
            const store = tx.objectStore(this.resourceName);
            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async create(owner, data, schema) {
        const newId = generateUniqueId();
        const newEntry = { id: newId, owner };

        Object.keys(schema).forEach((key) => {
            newEntry[key] = data[key] || null;
        });

        await this._withStore("readwrite", (store) => store.add(newEntry));
        return newEntry;
    }

    async get(owner, id) {
        const entry = await this._withStore("readonly", (store) => store.get(id));
        return entry && entry.owner === owner ? entry : null;
    }

    async update(owner, id, data, schema) {
        const entry = await this.get(owner, id);
        if (!entry) {
            throw new Error(`${this.resourceName} not found or unauthorized`);
        }

        Object.keys(schema).forEach((key) => {
            if (data[key] !== undefined) {
                entry[key] = data[key];
            }
        });

        await this._withStore("readwrite", (store) => store.put(entry));
        return entry;
    }

    async remove(owner, id) {
        const entry = await this.get(owner, id);
        if (!entry) {
            throw new Error(`${this.resourceName} not found or unauthorized`);
        }

        await this._withStore("readwrite", (store) => store.delete(id));
        return { success: true };
    }

    async list(owner) {
        return new Promise((resolve, reject) => {
            this._withStore("readonly", (store) => {
                const request = store.getAll();
                request.onsuccess = () => {
                    resolve(request.result.filter(item => item.owner === owner));
                };
                request.onerror = () => reject(request.error);
            });
        });
    }

    async all() {
        return new Promise((resolve, reject) => {
            this._withStore("readonly", (store) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }
}

// 🚀 Helper Function: Generate a Unique ID
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 10);
}
