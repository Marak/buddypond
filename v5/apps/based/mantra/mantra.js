export default class Example {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Mantra');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        // await this.bp.load('/v5/apps/based/_example/_example.css');

        // fetches html from the fragment and returns it as a string
        // let html = await this.bp.load('/v5/apps/based/_example/_example.html');

        // await imports the module and returns it
        // let module = await this.bp.load('/v5/apps/based/_example/_example.js');

        return 'loaded Mantra';
    }

    async open(options = {}) {
        if (!this.mantraWindow) {
            this.mantraWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'mantra',
                title: 'Mantra',
                x: 50,
                y: 100,
                width: 600,
                height: 300,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                iframeContent: 'https://yantra.gg/mantra/home',
                icon: '/desktop/assets/images/icons/icon_mantra_64.png',
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.mantraWindow = null;
                }
            });

        }

        this.bp.apps.ui.windowManager.focusWindow(this.mantraWindow);
        this.mantraWindow.maximize();

    }
}