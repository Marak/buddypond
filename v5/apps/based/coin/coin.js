/* Coin.js - Marak Squires 2025 - BuddyPond */
export default class Coin {

    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/coin/coin.html');
        this.css = await this.bp.load('/v5/apps/based/coin/coin.css');
    }

    async open () {
        if (!this.coinWindow) {
            this.coinWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'coin',
                title: 'Coin',
                icon: 'desktop/assets/images/icons/icon_console_64.png',
                x: 250,
                y: 75,
                width: 800,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                   this.coinWindow = null;
                }
            });
        }
    }  
    
}