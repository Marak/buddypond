export default class BasketBall_FRVR {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {
        return 'loaded BasketBall_FRVR';
    }

    async open () {
        let win = this.bp.window(this.window());
        win.maximize();
        return win;
    }

    window () {
        return {
            id: 'frvr-basketball',
            title: 'BasketBall FRVR',
            icon: 'desktop/assets/images/icons/icon_basketball-frvr_64.png',
            x: 250,
            y: 75,
            width: 600, // Increased width for two-column layout
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            iframeContent: 'https://basketball.frvr.com/',
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