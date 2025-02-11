/* Orderbook.js - Marak Squires 2025 - BuddyPond */
import render from './lib/render.js';
import eventBind from './lib/eventBind.js';
import Resource from '../resource/lib/Resource.js';
import OrderbookClass from './lib/Orderbook.js';

import createInitialOrders from './lib/createInitialOrders.js';

export default class Orderbook {

    constructor(bp, options = {}) {
        this.bp = bp;
        this.icon = 'desktop/assets/images/icons/icon_orderbook_64.png';

        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/orderbook/orderbook.html');
        this.css = await this.bp.load('/v5/apps/based/orderbook/orderbook.css');

        // load coin so we can get market pair information
        await this.bp.load('coin');

        this.resource = new Resource("orderbook", {
            provider: 'rest',
            apiEndpoint: this.bp.config.orderbookEndpoint || '/',
            schema: {
                // orderbook schema
                owner: { type: "string", required: true },
                pair: { type: "string", required: true, key: true },
                price: { type: "number", required: true },
                amount: { type: "number", required: true },
                side: { type: "string", required: true }, // BUY or SELL
                ctime: { type: "number" },
                utime: { type: "number" } // only utime if removed / or admin update ( for now )
            },
            bp: this.bp
        });

        this.orderbook = new OrderbookClass({ resource: this.resource, me: this.bp.me, bp: this.bp }); // TODO: remove BP reference from inside class

    }

    async open (options = {}) {
        if (!this.orderbookWindow) {
            this.orderbookWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'orderbook',
                title: 'Orderbook',
                icon: this.icon,
                x: 250,
                y: 75,
                width: 800,
                height: 700,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                   this.orderbookWindow = null;
                }
            });
            this.render(this.orderbookWindow.content, options);
            this.eventBind(this.orderbookWindow.content, options);
        } else {
            // we will want to re-render the orderbook window, especially if the `context` market pair has changed
            this.render(this.orderbookWindow.content, options);
            this.eventBind(this.orderbookWindow.content, options);
        }
        if (options.context !== 'default') {
            this.orderbookWindow.setTitle('Orderbook ' + options.context);
        }

    }  
    
}

Orderbook.prototype.render = render;
Orderbook.prototype.eventBind = eventBind;
Orderbook.prototype.createInitialOrders = createInitialOrders;