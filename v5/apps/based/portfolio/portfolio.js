// stores assets / stocks that were purchased from portfolio
// assets can be backed by BP, or the real world
// portfolio can be used to track any assets, so its a portolio tracker
// we will default to showing only buddypond based assets
// TODO: add UI with piecharts
// TODO: pull data from PORTFOLIO_DO, etc TABLE_PORTFOLIO, etc

/* Portfolio.js - Marak Squires 2025 - BuddyPond */

import Resource from '../resource/lib/Resource.js';
import PortfolioClass from './lib/Portfolio.js';
import render from './lib/render.js';
import eventBind from './lib/eventBind.js';

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
            apiEndpoint: 'http://localhost:9002' || this.bp.config.api,
            schema: {
                symbol: { type: "string" },
                owner: { type: "string" },
                amount: { type: "number" },
                price: { type: "number" },
                cost: { type: "number" }
            },
            bp: this.bp
        });

        this.portfolio = new PortfolioClass({ resource: this.resource, me: this.bp.me });

    }

    async open() {
        if (!this.portfolioWindow) {
            this.portfolioWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'portfolio',
                title: 'Portfolio',
                icon: 'desktop/assets/images/icons/icon_console_64.png',
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
                    this.portfolioWindow = null;
                }
            });
        }
        this.render(this.portfolioWindow.content);
        this.eventBind(this.portfolioWindow.content);

        console.log('focus the portfolioWindow');

        // focus the window
        this.portfolioWindow.focus();

    }

}

Portfolio.prototype.render = render;
Portfolio.prototype.eventBind = eventBind;