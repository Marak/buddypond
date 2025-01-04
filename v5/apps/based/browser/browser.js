import BrowserWindow from './BrowserWindow.js';

export default class Browser {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');
        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/browser/browser.css');


        let exampleWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'browser-window',
            title: 'Hello World',
            x: 50,
            y: 100,
            width: 400,
            height: 300,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            content: '',
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });


        this.browser = new BrowserWindow(exampleWindow.content, 'https://example.com');


        return 'loaded Example';
    }
}