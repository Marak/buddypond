export default class Maps {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Maps');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        // await this.bp.load('/v5/apps/based/_example/_example.css');

        // fetches html from the fragment and returns it as a string
        // let html = await this.bp.load('/v5/apps/based/_example/_example.html');

        // await imports the module and returns it
        // let module = await this.bp.load('/v5/apps/based/_example/_example.js');

        return 'loaded Maps';
    }

    async open(options = {}) {
        if (!this.mapsWindow) {
            this.mapsWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'maps',
                title: 'Maps',
                x: 50,
                y: 100,
                width: 600,
                height: 300,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                iframeContent: '/v5/apps/based/maps/vendor/index.html',
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.mapsWindow = null;
                }
            });

        }

        this.bp.apps.ui.windowManager.focusWindow(this.mapsWindow);

    }
}