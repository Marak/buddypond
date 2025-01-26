export default class Solitaire {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Solitaire');

        return 'loaded Solitaire';
    }

    async open(options = {}) {
        if (!this.solitaireWindow) {
            this.solitaireWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'solitaire',
                title: 'Solitaire',
                x: 50,
                y: 100,
                width: 660,
                height: 460,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                iframeContent: '/v5/apps/based/solitaire/vendor/solitaire.html',
                icon: '/desktop/assets/images/icons/icon_solitaire_64.png',
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.solitaireWindow = null;
                }
            });

        }

        this.bp.apps.ui.windowManager.focusWindow(this.solitaireWindow);

    }
}