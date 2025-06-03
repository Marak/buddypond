/* Coin.js - Marak Squires 2025 - BuddyPond */
import Resource from '../resource/lib/Resource.js';
import eventBind from './lib/eventBind.js';
import updateCoinList from './lib/updateCoinList.js';
import render from './lib/render.js';
import CoinClass from './lib/Coin.js';
//import PortfolioClass from '../portfolio/lib/Portfolio.js';
import createInitialCoins from './lib/createInitialCoins.js';
import RestProvider from '../resource/lib/RestProvider.js';

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
            provider: 'rest',
            apiEndpoint: this.bp.config.coinEndpoint || '/',
            schema: {
                name: { type: "string", required: true },
                symbol: { type: "string", unique: true, required: true },
                owner: { type: "string", required: true },
                supply : { type: "number", required: true },
            },
            bp: this.bp
        });

        this.coin = new CoinClass({ resource: this.resource, me: this.bp.me });
        // this.portfolio = new PortfolioClass({ resource: this.resource, me: this.bp.me });
        this.portfolio = new RestProvider('portfolio', {
            apiEndpoint: buddypond.portfolioEndpoint || '/',
            bp: this.bp
        });

    }

    async render () {
        return this.html;
    }

    async open (options = {}) {
        let context = options.context;
        if (context === 'default') {
            context = 'GBP';
        }
        let type = options.type || '';
        this.context = context;
        this.type = type;

        let coinWindowId = 'coin-window';/* + context;*/

        if (!this.coinWindows[coinWindowId]) {
            let coinWindow = this.coinWindows[coinWindowId] = this.bp.apps.ui.windowManager.createWindow({
                id: coinWindowId,
                title: 'Buddy Coins',
                icon: 'desktop/assets/images/icons/icon_coin_64.png',
                x: 250,
                y: 75,
                width: 800,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                type: 'coin',
                parent: $('#desktop')[0],
                className: 'coin-window-content',
                // content: this.html,
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
            await this.render(coinWindow);
            this.eventBind(coinWindow);

            if (type) {
                this.tabs.navigateToTab('#coin-' + type);
            }

            if (this.bp.me !== 'Marak') {
                // disables the mint-coin button unless Admin ( for now )
                // only enforced client-side, coming soon
                $('#mint-coin').attr('disabled', 'disabled');
                $('#mint-coin').addClass('disabled');
                $('#mint-coin').attr('title', "You do not have permission to Mint new coins!");
            }
        } else {
            // focus the window
            this.coinWindows[coinWindowId].focus();
        }
    }  
    
}

Coin.prototype.eventBind = eventBind;
Coin.prototype.updateCoinList = updateCoinList;
Coin.prototype.render = render;
Coin.prototype.createInitialCoins = createInitialCoins;
