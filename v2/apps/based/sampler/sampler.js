import SamplerPadComponent from './SamplerPadComponent.js';

export default class Sampler {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');

        await this.bp.load('/v2/apps/based/sampler/sampler.css');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        //await this.bp.load('/v2/apps/based/_example/_example.css');

        // fetches html from the fragment and returns it as a string
        //let html = await this.bp.load('/v2/apps/based/_example/_example.html');

        // await imports the module and returns it
        //let module = await this.bp.load('/v2/apps/based/_example/_example.js');

        let samplerWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'sampler-0',
            title: 'Sampler',
            x: 50,
            y: 100,
            width: 1000,
            height: 330,
            minWidth: 600,
            minHeight: 500,
            parent: $('#desktop')[0],
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });

        let samplerPadComponent = new SamplerPadComponent(new AudioContext(), {
            audioContext: new AudioContext(),
        }, {
            fetch: window.fetch.bind(window), // TODO: use the fetch from the bp
            defaultSounds: [
                './v2/apps/based/sampler/packs/default/dj-horn.mp3',
                './v2/apps/based/sampler/packs/default/dang-son.mp3',
                `./v2/apps/based/sampler/packs/default/helicopter-helicopter.mp3`,
                `./v2/apps/based/sampler/packs/default/yooo.mp3`,
                './v2/apps/based/sampler/packs/default/celebrate.mp3'
    
            ]
        });
        samplerWindow.content.appendChild(samplerPadComponent.container);
        samplerPadComponent.adjustVolume(0.5);
    


        return 'loaded Example';
    }
}