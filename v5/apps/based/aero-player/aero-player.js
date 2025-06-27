export default class AeroPlayer {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {
        return 'loaded AeroPlayer';
    }

    async open() {
        let win = this.bp.window(this.window());
        win.maximize();
        return win;
    }

    window() {

        let iframeUrl = 'https://aero.buddypond.com/';

        return {
            id: 'aero-player',
            title: 'Aero Music Player',
            icon: 'desktop/assets/images/icons/icon_aero-player_64.png',
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