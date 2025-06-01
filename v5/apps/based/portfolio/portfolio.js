// stores assets / stocks that were purchased from portfolio
// assets can be backed by BP, or the real world
// portfolio can be used to track any assets, so its a portolio tracker
// we will default to showing only buddypond based assets
// TODO: add UI with piecharts
// TODO: pull data from PORTFOLIO_DO, etc TABLE_PORTFOLIO, etc

/* Portfolio.js - Marak Squires 2025 - BuddyPond */

import Resource from '../resource/lib/Resource.js';
import PortfolioClass from './lib/Portfolio.js';
import TransactionClass from './lib/Transaction.js';
import render from './lib/render.js';
import eventBind from './lib/eventBind.js';
import { updateCoinRow } from './lib/render.js';

export default class Portfolio {

    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/portfolio/portfolio.html');
        this.css = await this.bp.load('/v5/apps/based/portfolio/portfolio.css');

        this.resource = new Resource("portfolio", {
            provider: 'rest',
            apiEndpoint: buddypond.portfolioEndpoint || '/',
            schema: {
                symbol: { type: "string" },
                owner: { type: "string" },
                amount: { type: "number" },
                price: { type: "number" },
                cost: { type: "number" }
            },
            bp: this.bp
        });

        this.coinResource = new Resource("coin", {
            provider: 'rest',
            apiEndpoint: buddypond.coinEndpoint || '/',
            schema: {
                name: { type: "string", required: true },
                symbol: { type: "string", unique: true, required: true },
                owner: { type: "string", required: true },
                supply : { type: "number", required: true },
            },
            bp: this.bp
        });

        this.transactionResource = new Resource("transactions", {
            provider: 'rest',
            apiEndpoint: this.bp.config.portfolioEndpoint || '/',
            schema: {
                id: { type: "string", key: true }, // Unique transaction ID
                sender: { type: "string" },
                receiver: { type: "string" },
                symbol: { type: "string" },
                amount: { type: "number" },
                price: { type: "number" },
                value: { type: "number" },
                timestamp: { type: "string" } // ISO timestamp
            },
            bp: this.bp
        });


        this.portfolio = new PortfolioClass({ resource: this.resource, me: this.bp.me });
        this.transaction = new TransactionClass({ resource: this.transactionResource, me: this.bp.me });

    }

    async close () {

        // clear the refresh timer
        this.portfolioWindow = null;

    }

    async open(options = {}) {
        if (!this.portfolioWindow) {
            this.portfolioWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'portfolio',
                title: 'Portfolio',
                icon: 'desktop/assets/images/icons/icon_portfolio_64.png',
                x: 250,
                y: 75,
                width: 800,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                className: 'portfolio-window-content',
                parent: $('#desktop')[0],
                // content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.close();
                }
            });
            // create a refresh timer
            this.portfolioWindow.refreshTimer = setInterval(() => {
                // this.render(this.portfolioWindow.content);
            }, 2000); // every 5 seconds
        }
        this.render(this.portfolioWindow.content);

        if (options.type === 'buddy') {
            $('#coin-send-to').val(options.output);
        }

        this.eventBind(this.portfolioWindow.content);

        console.log('focus the portfolioWindow');

        // focus the window
        this.portfolioWindow.focus();
   
        // if portfolio window is open and user logged out, this event will re-render the portfolio
        // with the latest data / show the user portfolio
        this.bp.on('auth::qtoken', 'render-portfolio', async(data) => {
            // re-render the portfolio
            await this.render(this.portfolioWindow.content);
            await this.eventBind(this.portfolioWindow.content);
            $('.loggedOut', this.portfolioWindow.content).flexHide();
            $('.loggedIn', this.portfolioWindow.content).flexShow();
        });

        if (options.context && options.context !== 'default') {
            this.tabs.showTab(options.context);
        }

    }

}

Portfolio.prototype.render = render;
Portfolio.prototype.eventBind = eventBind;
Portfolio.prototype.updateCoinRow = updateCoinRow;