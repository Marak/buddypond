/* Buddy Pond - WindowManager.js - Marak Squires 2023 */
import TaskBar from './TaskBar.js';
import Window from "./Window.js";

export default class WindowManager {
    constructor(options = {}) {
        this.storage = options.storage || localStorage; // Use localStorage by default
        this.storageKey = options.storageKey || 'windowsState'; // Key for storing data
        this.windows = [];
        this._windows = [];

        if (typeof options.openWindow === "function") {
            this._openWindow = options.openWindow;
        } else {
            this._openWindow = function (name, config) {
                const window = this.createWindow(config);
                window.hydrate(config);
            }
        }

        this.taskBar = new TaskBar({
            homeCallback: () => {

                // close all windows
                this.minimizeAllWindows();
                // this.windowsClosed = true;

            }
        });

    }

    createWindow(options) {

        // check to see if there is previous window data in this._windows
        // check by id, if found, hydrate the window
        // This is a temporary solution until full app hydration is back online
        // This solution will allow for position and size to be saved and restored
        let previousWindowData = this._windows.find(w => w.id === options.id);
        if (previousWindowData) {
            // just merge the previous window data with the new options
            options = { ...previousWindowData, ...options };
        }

        const window = new Window(options, this);

        window.container.addEventListener("mousedown", () => {
            this.focusWindow(window);
        });
        this.addWindow(window);
        this.focusWindow(window); // Focus the newly created window


        //this.taskBar.addItem('item1', 'Application 1', () => alert('Clicked Application 1!'));
        //this.taskBar.addItem('item2', 'Application 2', () => alert('Clicked Application 2!'));
        this.taskBar.addItem(window.id, window.title, () => {

            // toggle window minimize / restore state
            window.minimize();

        });
    


        return window;
    }

    addWindow(window) {
        this.windows.push(window);
        this.saveWindowsState(); // Save state when a window is added
        this.updateFocus();
    }

    removeWindow(window) {
        //console.log("Removing window", window);
        this.windows = this.windows.filter(w => w.id !== window);
        //console.log("Remaining windows", this.windows);
        this.saveWindowsState(); // Save state when a window is removed
        this.updateFocus();
    }

    focusWindow(window) {
        // console.log("Focusing window", window.id);
        const index = this.windows.indexOf(window);
        if (index !== -1) {
            this.windows.splice(index, 1);
            this.windows.unshift(window);
        }
        this.updateFocus();
        this.saveWindowsState(); // Save state when focus changes
    }

    updateFocus() {
        this.windows.forEach((window, index) => {
            // console.log("Setting depth for window", window.id, "to", 1000 - index);
            window.setDepth(1000 - index); // Higher index, higher depth
        });
    }

    closeAllWindows() {
        this.windows.forEach(window => window.close());
        this.windows = [];
        this.storage.removeItem(this.storageKey); // Clear storage when all windows are closed
    }

    minimizeAllWindows() {
        if (!this.windowsHiding) {
            this.windowsHiding = true;
        } else {
            this.windowsHiding = false;
        }
        this.windows.forEach(window => {

            if (!this.windowsHiding) {
                window.minimize();
            } else {
                window.restore();
            }
        });
    }

    findWindow(id) {
        // console.log('searching for', id, 'in', this.windows)
        return this.windows.find(w => w.id === id);
    }

    saveWindowsState() {
        const state = JSON.stringify(this.windows.map(window => window.serialize()));
        // console.log("Saving windows state", JSON.parse(state));
        this.storage.setItem(this.storageKey, state);
    }

    // Remark: This should probably be mostly in settings app or a separate app
    loadWindows() {
        const serializedWindows = this.storage.getItem(this.storageKey);
        if (serializedWindows) {
            this.restoreWindows(serializedWindows);
        }
    }

    openWindow(name, config) {
        if (this._openWindow) {
            this._openWindow(name, config);
        }
    }

    // Remark: This should probably be mostly in settings app or a separate app
    // Restore windows from serialized state
    restoreWindows(serializedWindows, inflate = false) {
        const windowsData = JSON.parse(serializedWindows);
        console.log("Restoring windows", windowsData);

        this._windows = windowsData;

        if (!inflate) {
            // for now, probably better suited elsewhere
            return;
        }
        windowsData.forEach(data => {
            // check to see if window already exists with id
            const existingWindow = this.findWindow(data.id);
            if (existingWindow) {
                console.log("WARNING: Window with id", data.id, "already exists, hydrating instead of creating new window");
                existingWindow.hydrate(data);
                return;
            }
            data.parent = document.querySelector(data.parent);
            console.log("hydrating window", data);
            this.openWindow(data.app, data);
            //const window = this.createWindow(data);
            //window.hydrate(data);
        });
    }
}
