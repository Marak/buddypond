import SamplerPadComponent from './SamplerPadComponent.js';

export default class Sampler {
    constructor(bp, options = {}) {
        this.bp = bp;

        if (typeof options.window !== 'boolean') {
            options.window = true;
        }
        this.options = options;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');

        await this.bp.load('/v5/apps/based/sampler/sampler.css');

        let samplerHolder;

        // TODO: better options for rendering apps with windows
        if (this.options.window && this.bp.apps.ui && this.bp.apps.ui.windowManager) {
            let samplerWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'sampler-0',
                title: 'Sampler',
                x: 50,
                y: 100,
                width: 1000,
                height: 330,
                minWidth: 600,
                minHeight: 500,
                className: 'sampler-window',
                parent: $('#desktop')[0],
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false
            });
            samplerHolder = samplerWindow.content;
        } else {
            samplerHolder = document.createElement('div');
            samplerHolder.className = 'sampler-window';
            document.body.appendChild(samplerHolder);
        }

        let samplerPadComponent = new SamplerPadComponent(new AudioContext(), {
            audioContext: new AudioContext(),
        }, {
            fetch: window.fetch.bind(window), // TODO: use the fetch from the bp
            defaultSounds: [
                '/v5/apps/based/sampler/packs/default/dj-horn.mp3',
                '/v5/apps/based/sampler/packs/default/dang-son.mp3',
                `/v5/apps/based/sampler/packs/default/helicopter-helicopter.mp3`,
                `/v5/apps/based/sampler/packs/default/yooo.mp3`,
                '/v5/apps/based/sampler/packs/default/celebrate.mp3'
    
            ]
        });
        samplerHolder.appendChild(samplerPadComponent.container);
        samplerPadComponent.adjustVolume(0.5);
    


        return 'loaded Example';
    }
}