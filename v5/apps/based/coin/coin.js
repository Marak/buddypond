/* Coin.js - Marak Squires 2025 - BuddyPond */
import Resource from '../resource/lib/Resource.js';
import bindUIEvents from './lib/bindUIEvents.js';
import updateCoinList from './lib/updateCoinList.js';
export default class Coin {

    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/coin/coin.html');
        this.css = await this.bp.load('/v5/apps/based/coin/coin.css');

        this.coinWindows = [];
        // create a new resource to manage coin operations to provider ( restful server in this case )
        this.resource = new Resource("coin", {
            provider: 'indexeddb',
            apiEndpoint: this.bp.config.api,
            schema: {
                name: { type: "string" },
                symbol: { type: "string" },
                owner: { type: "string" },
                supply : { type: "number" },
            },
            bp: this.bp
        });

    }

    async open (options = {}) {
        let context = options.context || '';

        let coinWindowId = 'coin' + context;

        if (!this.coinWindows[coinWindowId]) {
            let coinWindow = this.coinWindows[coinWindowId] = this.bp.apps.ui.windowManager.createWindow({
                id: coinWindowId,
                title: 'Coin',
                icon: 'desktop/assets/images/icons/icon_console_64.png',
                x: 250,
                y: 75,
                width: 800,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                type: 'coin',
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
                    this.coinWindows[coinWindowId] = null;
                }
            });
            this.bindUIEvents(coinWindow);
            this.updateCoinList(coinWindow);
        }
    }  
    
}

Coin.prototype.bindUIEvents = bindUIEvents;
Coin.prototype.updateCoinList = updateCoinList;