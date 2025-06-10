/* Buddy Pond - WindowManager.js - Marak Squires 2023 */
import TaskBar from './TaskBar.js';
import Window from "./Window.js";

export default class WindowManager {
    constructor(ui, options = {}) {
        this.storage = options.storage || localStorage; // Use localStorage by default
        this.storageKey = options.storageKey || 'windowsState'; // Key for storing data
        this.windows = [];
        this._windows = [];
        this.options = options;

        this.bp = ui.bp;

        this.useKeyboardControls = true;

        if (typeof options.useKeyboardControls === "boolean") {
            this.useKeyboardControls = options.useKeyboardControls;
        }

        if (typeof options.hideTaskBar === "boolean") {
            this.hideTaskBar = options.hideTaskBar;
        }

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

                if (!this.state) {
                    // save current window positions
                    this.lastPositionsBeforeArranged = this.windows.map(w => {
                        return {
                            x: w.x,
                            y: w.y,
                            height: w.height,
                            width: w.width
                        }
                    });
                    // console.log('lastPositionsBeforeArranged', this.lastPositionsBeforeArranged);
                    this.state = 'maximized';
                }


                if (this.state === 'minimized') {
                    this.minimizeAllWindows();
                    this.arrangeHorizontalStacked();
                    this.state = 'stacked-horizontal';

                } else if (this.state === 'stacked-vertical') {
                    // stack-vertical has been removed ( for now )
                    // it wasn't looking good as a default and was rarely used
                    /*
                    // restore all windows to their previous positions
                    this.windows.forEach((w, i) => {
                        w.move(this.lastPositionsBeforeArranged[i].x, this.lastPositionsBeforeArranged[i].y);
                        w.setSize(this.lastPositionsBeforeArranged[i].width + 'px', this.lastPositionsBeforeArranged[i].height + 'px');
                    });
                    this.state = 'maximized';
                    */

                } else if (this.state === 'stacked-horizontal') {
                    // this.arrangeVerticalStacked();
                    // this.state = 'stacked-vertical';
                    // restore all windows to their previous positions
                    this.windows.forEach((w, i) => {
                        w.move(this.lastPositionsBeforeArranged[i].x, this.lastPositionsBeforeArranged[i].y);
                        w.setSize(this.lastPositionsBeforeArranged[i].width + 'px', this.lastPositionsBeforeArranged[i].height + 'px');
                    });
                    this.state = 'maximized';

                } else {
                    this.minimizeAllWindows(true);
                    this.windows.forEach((w, i) => {
                        w.move(this.lastPositionsBeforeArranged[i].x, this.lastPositionsBeforeArranged[i].y);
                        w.setSize(this.lastPositionsBeforeArranged[i].width + 'px', this.lastPositionsBeforeArranged[i].height + 'px');
                    });

                    this.state = 'minimized';

                }

                // close all windows
                // this.minimizeAllWindows();
                // this.windowsClosed = true;

                // hide all legacy BP windows
                $('.window').hide();
                $('.window').removeClass('window_stack');

            }
        });

        if (this.options.hideTaskBar) {
            this.taskBar.taskBarElement.style.display = 'none';
        }

        if (this.useKeyboardControls) {
            window.addEventListener("keydown", (e) => {
                // alert(this.bp.editingMode);
                if (e.key === "Escape" && !this.bp.ignoreUIControlKeys) {
                    // alert("Escape key pressed");
                    // find the window with the highest depth and close it

                    // first check to see if there is a dialog open, close that first
                    const dialog = document.querySelector('.dialog');
                    if (dialog) {
                        dialog.remove();
                        return;
                    }

                    const window = this.windows[0]; // no sort needed, windows are already sorted by depth
                    if (window) {
                        window.close();
                    }
                }
            });
        }

    }

    createWindow(options) {

        // check to see if there is previous window data in this._windows
        // check by id, if found, hydrate the window
        // This is a temporary solution until full app hydration is back online
        // This solution will allow for position and size to be saved and restored
        options = { ...options, ...this.options.window };
        // console.log('createWindow', options);
        let previousWindowData = this._windows.find(w => w.id === options.id);
        if (previousWindowData) {
            // just merge the previous window data with the new options
            options = { ...previousWindowData, ...options };
        }

        // check to see if window already exists with id
        const existingWindow = this.getWindow(options.id);
        let window;

        if (existingWindow) {
            window = existingWindow;
            this.focusWindow(window); // Focus the newly created window
            return window;
        }
        options.bp = this.bp;
        window = new Window(options, this);

        window.container.addEventListener("mousedown", () => {
            this.focusWindow(window);
        });
        this.addWindow(window);
        this.focusWindow(window); // Focus the newly created window

        this.taskBar.addItem({
            id: window.id,
            title: window.title,
            icon: window.icon,
            onClick: () => {
                // toggle window minimize / restore state
                if (this.isMobile()) {
                    // this.minimizeAllWindows(true);
                    this.arrangeVerticalStacked();
                    // we could minimize all other windows here
                    // minimizeAllWindows();
                }
                if (window.isMinimized) {
                    window.restore();
                    window.focus();
                } else {
                    window.minimize();
                }
            }
        });

        return window;
    }

    isMobile() {
        return window.innerWidth < 1000;
    }

    addWindow(window) {
        this.windows.push(window);
        this.saveWindowsState(); // Save state when a window is added
        this.updateFocus();
    }

    removeWindow(window) {
        // console.log("Removing window", window);
        this.windows = this.windows.filter(w => w.id !== window);
        //console.log("Remaining windows", this.windows);
        this.saveWindowsState(); // Save state when a window is removed
        this.updateFocus();
    }

    focusWindow(window) {
        // window can be the window instance or the window id
        if (typeof window === 'string') {
            window = this.getWindow(window);
        }

        // console.log("Focusing window", window);

        // TODO: this isn't working consistenly?  there seems to be an issue with index
        // console.log("Focusing window", window.id);
        const index = this.windows.indexOf(window);
        if (index !== -1) {
            this.windows.splice(index, 1);
            this.windows.unshift(window);
            // console.log('Focusing window', window.id, 'at index', index);
            this.updateFocus();
            window.focus(false);
            this.saveWindowsState(); // Save state when focus changes
        }
        // iterate through all windows and set isFocused to false
        // set this window isFocused to true
        this.windows.forEach(w => {
            if (w.id !== window) {
                w.isFocused = false;

            } else {
                window.isFocused = true;

            }
        });
    }

    updateFocus() {
        // console.log("Updating focus");
        this.windows.forEach((window, index) => {
            // console.log("Setting depth for window", window.id, "to", 1000 - index);
            // console.log("setting depth for window", window.id, "to", 1000 - index);
            window.setDepth(1000 - index); // Higher index, higher depth
        });
    }

    closeAllWindows() {
        this.windows.forEach(window => window.close());
        this.windows = [];
        this.storage.removeItem(this.storageKey); // Clear storage when all windows are closed
    }

    minimizeAllWindows(force = false) {
        if (!this.windowsHiding) {
            this.windowsHiding = true;
        } else {
            this.windowsHiding = false;
        }
        this.windows.forEach(window => {

            if (!this.windowsHiding || force) {
                window.minimize(force);
            } else {
                window.restore();
            }
        });
    }

    getWindow(id) {
        // console.log('searching for', id, 'in', this.windows)
        return this.windows.find(w => w.id === id);
    }

    findWindows({ app, type }) {
        if (!app) {
            console.warn("No app provided to findWindows");
            return [];
        }

        // Normalize app and type to arrays for unified matching
        const apps = Array.isArray(app) ? app : [app];
        const types = type ? (Array.isArray(type) ? type : [type]) : null;

        return this.windows.filter(w => {
            const appMatch = apps.includes(w.app);
            const typeMatch = types ? types.includes(w.type) : true;
            return appMatch && typeMatch;
        });
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

    arrangeVerticalStacked() {
        let containerHeight = document.body.clientHeight - 100; // Adjust for container and offset
        let windowWidth = document.body.clientWidth - 10; // Adjust for container and offset
        const defaultWindowHeight = containerHeight * 0.8; // Default height for non-minimized windows
        const minimizedHeight = 120; // Height for minimized windows
        const gap = 10; // Optional gap between windows for better spacing
        let totalY = 0; // Initialize Y position

        // console.log('window count', this.windows.length, 'defaultWindowHeight', defaultWindowHeight, 'windowWidth', windowWidth);
        // console.log(this.windows);

        this.windows.reverse().forEach((window, index) => {
            // Determine the height for the current window
            let currentWindowHeight = window.isMinimized ? minimizedHeight : defaultWindowHeight;

            // console.log("index", index, window.title, 'isMinimized', window.isMinimized, 'currentWindowHeight', currentWindowHeight, 'windowWidth', windowWidth);

            // Set window size and position
            window.setSize(windowWidth + 'px', currentWindowHeight + 'px'); // Set size
            window.move(0, totalY); // Move to calculated Y position

            // Increment totalY for the next window
            totalY += currentWindowHeight + gap; // Add current window's height and gap

            // console.log("totalY", totalY, "currentWindowHeight", currentWindowHeight, "windowWidth", windowWidth);
        });

        // Position the shortCutsContainer below the last window
        // console.log('setting shortCutsContainer top to', totalY);
        if (this.bp.apps.desktop && this.bp.apps.desktop.shortCutsContainer) {
            this.bp.apps.desktop.shortCutsContainer.style.position = 'absolute';
            this.bp.apps.desktop.shortCutsContainer.style.left = '0px';
            this.bp.apps.desktop.shortCutsContainer.style.top = totalY + 'px';
        }
    }

    arrangeHorizontalStacked() {
        const containerWidth = document.body.clientWidth; // Adjust to your specific container if not the body
        const numWindows = this.windows.length;
        let windowWidth = containerWidth / numWindows;
        windowWidth -= 10; // Adjust to your desired offset
        this.windows.forEach((window, index) => {
            let xPos = windowWidth * index;
            xPos += 5;
            xPos += 10 * index; // Adjust to your desired offset
            window.setSize(windowWidth + 'px', 'calc(100% - 80px)'); // Assuming you have a resize method
            window.move(xPos, 30); // Assuming you have a move method
        });

    }

    arrangeCascadeFromTopLeft() {
        const offset = 20; // Adjust to your desired offset
        this.windows.forEach((window, index) => {
            const xPos = offset * index;
            const yPos = offset * index;
            window.move(xPos, yPos); // Assuming you have a move method
        });
    }

    // Remark: This should probably be mostly in settings app or a separate app
    // Restore windows from serialized state
    restoreWindows(serializedWindows, inflate = false) {
        const windowsData = JSON.parse(serializedWindows);
        // console.log("Restoring windows", windowsData);
        // alert("Restoring windows from storage, this will be removed in the future, please use the settings app to manage windows");
        this._windows = windowsData;

        if (!inflate) {
            // for now, probably better suited elsewhere
            return;
        }
        windowsData.forEach(data => {
            // check to see if window already exists with id
            const existingWindow = this.getWindow(data.id);
            if (existingWindow) {
                console.log("WARNING: Window with id", data.id, "already exists, hydrating instead of creating new window");
                existingWindow.hydrate(data);
                return;
            }
            data.parent = document.querySelector(data.parent);
            // console.log("hydrating window", data);
            // this.openWindow(data.app, data);
            //const window = this.createWindow(data);
            //window.hydrate(data);
        });
    }
}