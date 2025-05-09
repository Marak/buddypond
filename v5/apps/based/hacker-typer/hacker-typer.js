export default class HackerTyper {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from HackerTyper');
        return 'loaded Piano';
    }

    async open(options = {}) {
        if (!this.hackerTyperWindow) {
            this.hackerTyperWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'hacker-typer',
                title: 'Hacker Typer',
                x: 50,
                y: 50,
                width: 800,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                icon: '/desktop/assets/images/icons/icon_hacker-typer_64.png',
                iframeContent: '/v5/apps/based/hacker-typer/vendor/index.html',
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.hackerTyperWindow = null;
                }
            });

        }

        this.bp.apps.ui.windowManager.focusWindow(this.hackerTyperWindow);

    }
}