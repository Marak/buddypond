/* Help.js - Marak Squires 2025 - BuddyPond */
import render from './lib/render.js';
import eventBind from './lib/eventBind.js';

export default class Help {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.icon = 'desktop/assets/images/icons/icon_help_64.png';
        return this;
    }

    async help () {
        return `This is the help file for help you can't help but help
        Choose any other app from the dropdown select to get more information about that app.
        `;
    }

    async init() {

        console.log('help is: under construction');

        this.html = await this.bp.load('/v5/apps/based/help/help.html');
        await this.bp.load('/v5/apps/based/help/help.css');
        return 'loaded help window';
    }
    
    async open (options = {}) {
        if (!this.helpWindow) {
            this.helpWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'help',
                title: 'Help',
                icon: this.icon,
                x: 250,
                y: 75,
                width: 400,
                height: 400,
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

        if (options.context === 'default') {
            options.context = 'help';
        }

        await this.render(this.helpWindow);
        this.eventBind(this.helpWindow);
    }
}

Help.prototype.render = render;
Help.prototype.eventBind = eventBind;