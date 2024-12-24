import Window from "./Window";


export default class WindowsManager {

    constructor(options = {}) {

        this.windows = [];
    }


    createWindow(options) {
        const window = new Window(options, this);
        this.addWindow(window);
        return window;
    }

    addWindow(window) {
        this.windows.push(window);
    }

    removeWindow(window) {
        this.windows = this.windows.filter(w => w !== window);
    }

    closeAllWindows() {
        this.windows.forEach(window => window.close());
        this.windows = [];
    }

    // Additional future methods for advanced window management can be added here
}