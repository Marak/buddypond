// TODO: move this code to a controller with provider pattern
// TODO: for now the provider will be hard-coded to D1 on Cloudflare
// TODO: move this code to the server-side

import mintCoin from './mintCoin.js';
import sendCoin from './sendCoin.js';
export default class Coin {
    constructor(config = {}) {
        this.name = config.name || 'Good Buddy Points';
        this.symbol = config.symbol || 'GBP';
        this.owner = config.owner || 'Randolph';
        this.supply = config.supply || Infinity;
        this.resource = config.resource;
        this.me = config.me;
        this.stubBalances = {
            'Bob': {
                'GBP': 0
            }
        };
        
        this.apiClientStub = {
            'balanceOf': (coin, owner) => {
                console.log('API Call: balanceOf', coin, owner, this.stubBalances[owner][coin]);
                console.log('stubBalances', this.stubBalances);
                return this.stubBalances[owner][coin];
            },
            'mint': (coin, amount, options = {}) => {
                if (!this.stubBalances[options.owner]) {
                    this.stubBalances[options.owner] = {};
                }
                console.log('check to see if the minted amount is greater than the supply', this.supply, amount);
                // check to see if the minted amount is greater than the supply
                if (this.supply < amount) {
                    throw new Error("Cannot mint more than the supply.");
                }

                this.stubBalances[options.owner][coin] = (this.stubBalances[options.owner][coin] || 0) + amount;
                console.log('API Call: mint', coin, amount, options);
            },
            'burn': (coin, amount, from, options = {}) => {
                if (this.stubBalances[from][coin] < amount) {
                    throw new Error("Not enough balance to burn.");
                }
                this.stubBalances[from][coin] -= amount;
                console.log('API Call: burn', coin, amount, from, options);
            },
            'send': (coin, amount, to, from, options = {}) => {
                console.log('apiClientStub.send', coin, amount, to, options, this.stubBalances[from][coin]);
                if (this.stubBalances[from][coin] < amount) {
                    throw new Error("Not enough balance.");
                }
                this.stubBalances[from][coin] -= amount;
                this.stubBalances[to] = this.stubBalances[to] || {};
                this.stubBalances[to][coin] = (this.stubBalances[to][coin] || 0) + amount;
                console.log('API Call: send', coin, amount, to, options);
            },
            'receive': (coin, amount, from, options = {}) => {
                this.stubBalances[from] = this.stubBalances[from] || {};
                this.stubBalances[from][coin] = (this.stubBalances[from][coin] || 0) + amount;
                console.log('API Call: receive', coin, amount, from, options);
            },
            'setSupply': (coin, supply, ownerId) => {
                console.log('API Call: setSupply', coin, supply, ownerId);
            },
            'getSupply': (coin) => {
                console.log('API Call: getSupply', coin, this.supply);
                return this.supply;
            }
        };
    }

    getSupply() {
        return this.apiClientStub.getSupply(this.symbol);
    }

    setSupply(supply, ownerId) {
        if (ownerId !== this.owner) {
            throw new Error("Only the owner can set the supply.");
        }
        this.supply = supply;
        this.apiClientStub.setSupply(this.symbol, supply, ownerId);
    }

    send(amount, to, from) {
        return this.apiClientStub.send(this.symbol, amount, to, from, { owner: this.owner });
    }

    receive(amount, to, from) {
        return this.apiClientStub.receive(this.symbol, amount, to, from, { owner: this.owner });
    }

    mint(amount) {
        return this.apiClientStub.mint(this.symbol, amount, { owner: this.owner });
    }

    burn(amount, from) {
        return this.apiClientStub.burn(this.symbol, amount, from, { owner: this.owner });
    }

    balanceOf(owner) {
        return this.apiClientStub.balanceOf(this.symbol, owner);
    }

}

Coin.prototype.mintCoin = mintCoin;
Coin.prototype.sendCoin = sendCoin;