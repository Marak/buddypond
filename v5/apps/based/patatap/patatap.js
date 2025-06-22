export default class Patatap {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {
        return 'loaded Patatap';
    }

    async open () {
        return this.bp.window(this.window());


         // TODO: register the chat button
         // this.bp.apps.ui.windowManager.registerChatButton('chalkboard', chatButton);
         /*
         let chatButton = {
            text: 'Patatap',
            image: 'desktop/assets/images/icons/icon_chalkboard_64.png',
            onclick: async (ev) => {
                let context = ev.target.dataset.context;
                let type = ev.target.dataset.type;
                // Open the image search window
                bp.open('image-search', {
                    output: type || 'buddy',
                    context: context,
                    provider: 'giphy'
                });
                return false;
            }
        };
        */
        



    }

    window () {
        return {
            id: 'patatap',
            title: 'Patatap',
            icon: 'desktop/assets/images/icons/icon_console_64.png',
            x: 250,
            y: 75,
            width: 600, // Increased width for two-column layout
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            iframeContent: '/v5/apps/based/patatap/vendor/patatap.html',
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