export default class Example {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        await this.bp.load('/v2/apps/based/_example/_example.css');

        // fetches html from the fragment and returns it as a string
        let html = await this.bp.load('/v2/apps/based/_example/_example.html');

        // await imports the module and returns it
        let module = await this.bp.load('/v2/apps/based/_example/_example.js');


        let exampleWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'example',
            title: 'Hello World',
            x: 50,
            y: 100,
            width: 400,
            height: 300,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            content: '<h1>Example Window </h1>',
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });


        return 'loaded Example';
    }
}