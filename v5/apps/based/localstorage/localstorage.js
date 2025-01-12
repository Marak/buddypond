export default class LocalStorageManager {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.prefix = options.prefix || '_buddypond_desktop_';
        this.settings = {};
        this.state = {};
    }

    async init() {

        // Legacy API v4 compatibility
        /*
        desktop.get = (key) => {
            return this.get(key);
        };

        desktop.set = (key, value) => {
            this.set(key, value);
        }
            */

        desktop.removeItem = (key) => {
            this.removeItem(key);
        }

        // Emit event for the final key change
        bp.on('settings', 'update-local-storage-settings', (key, value) => {
            this.set(key, value);
        })

        // TODO: remove this for v5, define bp.set and bp.get with bp.data on bp itself
        //this.bp.get = this.get.bind(this);
        //this.bp.set = this.set.bind(this);
        this.bp.settings = this.settings;
        this.sync();
    }

    set(key, value) {
        if (typeof key === 'object') {
            // Handle object-based batch updates
            Object.entries(key).forEach(([k, val]) => {
                this.updateLocalStorage(k, val);
            });
        } else {
            // Handle single key-value update
            this.updateLocalStorage(key, value);
        }
        this.bp.emit('desktop.settings', this.settings);
    }

    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return JSON.parse(item);
        } catch (err) {
            alert('Error parsing local storage JSON.');
            return null;
        }
    }

    removeItem(key) {
        localStorage.removeItem(this.prefix + key);
        delete this.settings[key];
        this.bp.emit(`desktop.settings.${key}`, undefined);
    }

    sync() {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(this.prefix)) {
                const param = key.slice(this.prefix.length);
                try {
                    this.settings[param] = JSON.parse(localStorage.getItem(key));
                } catch (err) {
                    this.settings[param] = localStorage.getItem(key);
                }
            }
        });
    }

    updateLocalStorage(key, val) {
        const previousValue = this.settings[key];
        this.settings[key] = val;
        localStorage.setItem(this.prefix + key, JSON.stringify(val));
        this.state[key] = val;

        // Emit an event if the property has changed
        if (previousValue !== val) {
            this.bp.emit(`desktop.settings.${key}`, val);
        }
    }

    load(callback) {
        this.sync();
        if (typeof callback === 'function') {
            callback();
        }
    }
}
