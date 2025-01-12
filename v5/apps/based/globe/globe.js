export default class FluidSimulation {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Globe');

    
        return 'loaded Piano';
    }

    async open(options = {}) {
        if (!this.fluidsWindow) {
            this.fluidsWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'globe',
                title: 'Globe',
                x: 50,
                y: 50,
                width: 550,
                height: 550,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                iframeContent: '/v5/apps/based/globe/vendor/index.html',
                icon: '/desktop/assets/images/icons/icon_globe_64.png',
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.fluidsWindow = null;
                }
            });

        }

        this.bp.apps.ui.windowManager.focusWindow(this.fluidsWindow);

    }
}