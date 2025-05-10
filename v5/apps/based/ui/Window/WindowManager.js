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

                // TODO: we could toggle through states here
                // including: arrangeVerticalStacked()

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

                    // restore all windows to their previous positions
                    this.windows.forEach((w, i) => {
                        w.move(this.lastPositionsBeforeArranged[i].x, this.lastPositionsBeforeArranged[i].y);
                        w.setSize(this.lastPositionsBeforeArranged[i].width + 'px', this.lastPositionsBeforeArranged[i].height + 'px');
                    });
                    this.state = 'maximized';

                } else if (this.state === 'stacked-horizontal') {
                    this.arrangeVerticalStacked();
                    this.state = 'stacked-vertical';
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

                // hide all legacy BP windows ( TODO remove this )
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
                if (e.key === "Escape" && !this.bp.editingMode) {
                    // alert("Escape key pressed");
                    // find the window with the highest depth and close it
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
        const existingWindow = this.findWindow(options.id);
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
                    this.minimizeAllWindows(true);
                    // we could minimize all other windows here
                    // minimizeAllWindows();
                    // hide all legacy BP windows ( TODO remove this )
                    $('.window').hide();
                    $('.window').removeClass('window_stack');
                }

                window.minimize();


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
            window = this.findWindow(window);
        }
        // console.log("Focusing window", window.id);
        const index = this.windows.indexOf(window);
        if (index !== -1) {
            this.windows.splice(index, 1);
            this.windows.unshift(window);
            this.updateFocus();
            window.focus(false);
            this.saveWindowsState(); // Save state when focus changes
        }
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
        // TODO: remove JQDX reference ( legacy windows might triger this )
        JQDX.hideLoadingProgressIndicator(); // for now
        if (this._openWindow) {
            this._openWindow(name, config);
        }
    }

    arrangeVerticalStacked() {
        let containerHeight = document.body.clientHeight; // Adjust to your specific container if not the body
        containerHeight -= 100;
        const numWindows = this.windows.length;
        let windowHeight = containerHeight / numWindows;
        windowHeight -= 10; // Adjust to your desired offset


        this.windows.forEach((window, index) => {
            let yPos = windowHeight * index;
            yPos += 30;
            yPos += 10 * index; // Adjust to your desired offset
            window.setSize('100%', windowHeight + 'px'); // Assuming you have a resize method
            window.move(0, yPos); // Assuming you have a move method
        });
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
            // console.log("hydrating window", data);
            this.openWindow(data.app, data);
            //const window = this.createWindow(data);
            //window.hydrate(data);
        });
    }
}
