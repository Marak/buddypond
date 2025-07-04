export default class AudioVisual {
    constructor(bp, options = {}) {
        this.bp = bp;

        if (options.windowManager) {
            this.windowManager = options.windowManager;
        } else {
            this.windowManager = this.bp.apps.ui.windowManager
        }

        return this;
    }

    async open() {
        
        let avWindow = this.windowManager.createWindow({
            id: 'audio-visual',
            title: 'Audio Visualizer',
            x: 50,
            y: 100,
            width: 650,
            height: 500,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            iframeContent: '/v5/apps/based/audio-visual/vendor/index.html',
            icon: '/desktop/assets/images/icons/icon_visuals_64.png',
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            canBeBackground: true,
        });

        return avWindow;

    }
}