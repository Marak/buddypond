/* Admin.js - Marak Squires 2025 - BuddyPond */
import render from './lib/render.js';
import eventBind from './lib/eventBind.js';
import client from './lib/client.js';

export default class Admin {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.icon = 'desktop/assets/images/icons/icon_admin_64.png';
        return this;
    }

    async init() {

        console.log('admin is: under construction');

        this.html = await this.bp.load('/v5/apps/based/admin/admin.html');
        await this.bp.load('/v5/apps/based/admin/admin.css');
        return 'loaded admin window';
    }
    
    async open (options = {}) {
        if (!this.adminWindow) {
            this.adminWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'admin',
                title: 'Admin',
                icon: this.icon,
                x: 250,
                y: 75,
                width: 800,
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
                    this.adminWindow = null
                }
            });
            this.adminWindow.loggedIn = true;
        }

        if (options.context === 'default') {
            options.context = 'admin';
        }

        await this.render(this.adminWindow);
        this.eventBind(this.adminWindow);
        return this.adminWindow;
    }

 resetAllPondCounts() {
        // reset all ponds to 0 connections
        let url = buddypond.messagesApiEndpoint + '/reset-hotpond-counts';
        console.log('Resetting all pond counts at:', url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.bp.qtokenid}`, // Use Authorization header
                'x-me': this.bp.me
            }
        }).then(response => {
            if (response.ok) {
                console.log('All pond counts reset successfully');
            } else {
                throw new Error('Failed to reset pond counts');
            }
        }).catch(error => {
            console.error('Error resetting pond counts:', error);
        });
    }


}

Admin.prototype.render = render;
Admin.prototype.eventBind = eventBind;
Admin.prototype.client = client;