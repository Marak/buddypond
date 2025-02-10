/* Help.js - Marak Squires 2025 - BuddyPond */
import render from './lib/render.js';

export default class Help {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {

        console.log('help is: under construction');

        this.html = await this.bp.load('/v5/apps/based/help/help.html');
        return 'loaded help window';
    }
    
    async open () {
        if (!this.helpWindow) {
            this.helpWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'help',
                title: 'Help',
                icon: 'desktop/assets/images/icons/icon_console_64.png',
                x: 250,
                y: 75,
                width: 400,
                height: 300,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                // content: '<h1>Message of the Day</h1><p>Under construction</p>',
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.helpWindow = null
                }
            });
        }
        let html = await this.render();
        this.helpWindow.setContent(html);
    }
}

Help.prototype.render = render;