export default class HexEditor {
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
        
        let exampleWindow = this.windowManager.createWindow({
            id: 'hex-editor',
            title: 'Hex Editor',
            x: 50,
            y: 100,
            width: 650,
            height: 500,
            minWidth: 200,
            minHeight: 200,
            icon: '/desktop/assets/images/icons/icon_hex-editor_64.png',
            parent: $('#desktop')[0],
            iframeContent: 'https://hexed.it/',
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });


        return 'loaded Example';
    }
}