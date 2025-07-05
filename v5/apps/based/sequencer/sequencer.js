export default class Sequencer {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {
        return 'loaded Sequencer';
    }

    async open() {
        let win = this.bp.window(this.window());
        win.maximize();
        return win;
    }

    window() {

        let playProxy = 'http://192.168.200.59:7002';
        // playProxy = 'https://sequencer.buddypond.com';
        let iframeUrl = playProxy + '/';

        return {
            id: 'sequencer',
            title: 'Sequencer',
            icon: 'desktop/assets/images/icons/icon_doodle-jump-extra_64.png',
            x: 250,
            y: 75,
            width: 600, // Increased width for two-column layout
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            // iframeContent: 'https://plays.org/game/doodle-jump-extra/',
            iframeContent: iframeUrl,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onclose: () => {
                // this.bp.apps.ui.windowManager.destroyWindow('motd');
            }
        }
    }
}