/* BuddyBux.js - Marak Squires 2025 - BuddyPond */
import Resource from '../resource/lib/Resource.js';
import eventBind from './lib/eventBind.js';
import checkoutComplete from './lib/checkoutComplete.js';
import balanceOf from './lib/balanceOf.js';
import render from './lib/render.js';

export default class BuddyBux {

    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/buddybux/buddybux.html');
        this.css = await this.bp.load('/v5/apps/based/buddybux/buddybux.css');

        let provider = 'indexeddb';
        provider = 'memory';
        this.resource = new Resource("coin", {
            provider: provider,
            apiEndpoint: this.bp.config.api,
            schema: {
                name: { type: "string" },
                symbol: { type: "string" },
                owner: { type: "string" },
                supply: { type: "number" },
            },
            bp: this.bp
        });

        // Remark: Probably not best practice to do this, instead better to reference
        // entire portfolio app so we can use the app controller methods instead of resource methods directly
        this.portfolioResource = new Resource("portfolio", {
            provider: provider,
            apiEndpoint: this.bp.config.api,
            schema: {
                owner: { type: "string" },
                symbol : { type: "string" },
                amount: { type: "number" },
                ctime: { type: "number" },
                utime: { type: "number" }
            },
            bp: this.bp
        });

        if (provider !== 'rest') {
            // Mint the new coin
            this.resource.create("Marak", { // is that right?
                name: 'BuddyBux',
                symbol: 'BUX',
                owner: this.bp.me,
                supply: Infinity
            });
        }

    }

    async open() {
        if (!this.buddybuxWindow) {
            this.buddybuxWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'buddybux',
                title: 'BuddyBux',
                icon: 'desktop/assets/images/icons/icon_buddybux_64.png',
                x: 250,
                y: 75,
                width: 400,
                height: 500,
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
                    this.buddybuxWindow = null;
                }
            });

            this.render();
            this.eventBind();

        }
    }

}

BuddyBux.prototype.eventBind = eventBind;
BuddyBux.prototype.checkoutComplete = checkoutComplete;
BuddyBux.prototype.balanceOf = balanceOf;
BuddyBux.prototype.render = render;