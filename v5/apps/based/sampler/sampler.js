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

        return 'loaded Example';
    }

    async open(options = {}) {

        if (!this.samplerHolder) {

            // TODO: better options for rendering apps with windows
            if (this.options.window && this.bp.apps.ui && this.bp.apps.ui.windowManager) {
                let samplerWindow = this.bp.apps.ui.windowManager.createWindow({
                    id: 'sampler',
                    title: 'Sampler',
                    x: 50,
                    y: 100,
                    width: 1000,
                    height: 460,
                    minWidth: 600,
                    minHeight: 500,
                    className: 'sampler-window',
                    parent: $('#desktop')[0],
                    icon: '/desktop/assets/images/icons/icon_midifighter_64.png',
                    resizable: true,
                    minimizable: true,
                    maximizable: true,
                    closable: true,
                    focusable: true,
                    maximized: false,
                    minimized: false,
                    onClose: () => {
                        this.samplerHolder = null;
                    }
                });
                this.samplerHolder = samplerWindow.content;
            } else {
                this.samplerHolder = document.createElement('div');
                this.samplerHolder.className = 'sampler-window';
                document.body.appendChild(samplerHolder);
            }

            let samplerPadComponent = new SamplerPadComponent(new AudioContext(), {
                audioContext: new AudioContext(),
            }, {
                fetch: window.fetch.bind(window), // TODO: use the fetch from the bp
                defaultSounds: [
                    'dj-horn.mp3',
                    'dang-son.mp3',
                    `helicopter-helicopter.mp3`,
                    `yooo.mp3`,
                    'celebrate.mp3',
                    'flawless-victory.wav',
                ]
            });
            this.samplerHolder.appendChild(samplerPadComponent.container);
            samplerPadComponent.adjustVolume(0.5);
            samplerPadComponent.showPianoRoll.click();

        }

    }
}