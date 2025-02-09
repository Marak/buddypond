import placeOrder from "./placeOrder.js";
import listOrdersPerMarket from "./listOrdersPerMarket.js";
import cancelOrder from "./cancelOrder.js";

export default class Orderbook {
    constructor(config = {}) {
        this.asset = config.asset || 'GBP';
        this.currency = config.currency || 'BuddyBux';
        this.orders = { buy: [], sell: [] };
        this.orderIdCounter = 1;
        this.resource = config.resource;
        this.me = config.me || 'Guest';
    }

    /*
    placeOrder(type, amount, price, options = {}) {
        console.log('placeOrder', type, amount, price, options);
        const order = {
            id: this.orderIdCounter++,
            type,
            amount,
            price,
            timestamp: Date.now(),
            ...options
        };

        let oppositeType = type === 'buy' ? 'sell' : 'buy';
        let orderBookSide = this.orders[type];
        let oppositeBookSide = this.orders[oppositeType];

        // Match orders if possible
        this.matchOrders(order, oppositeBookSide);

        // If not fully matched, add to order book
        if (order.amount > 0) {
            orderBookSide.push(order);
            this.sortOrders(type);
        }

        // console.log('Order placed:', order);
        return order.id;
    }
        */

    buy(amount, price = null, options = {}) {
        return this.placeOrder('buy', amount, price, options);
    }

    sell(amount, price = null, options = {}) {
        return this.placeOrder('sell', amount, price, options);
    }

    matchOrders(order, oppositeBookSide) {
        for (let i = 0; i < oppositeBookSide.length; i++) {
            let matchedOrder = oppositeBookSide[i];
            if ((order.type === 'buy' && (order.price === null || order.price >= matchedOrder.price)) ||
                (order.type === 'sell' && (order.price === null || order.price <= matchedOrder.price))) {
                let tradeAmount = Math.min(order.amount, matchedOrder.amount);
                order.amount -= tradeAmount;
                matchedOrder.amount -= tradeAmount;
                console.log(`Trade executed: ${tradeAmount} ${this.asset} at ${matchedOrder.price} ${this.currency}`);
                console.log('matchedOrder', matchedOrder);
                if (matchedOrder.amount === 0) {
                    console.log('removing matchedOrder', matchedOrder);
                    oppositeBookSide.splice(i, 1);
                    i--;
                }

                if (order.amount === 0) break;
            }
        }
    }

    sortOrders(type) {
        if (type === 'buy') {
            this.orders.buy.sort((a, b) => b.price - a.price); // Highest buy price first
        } else {
            this.orders.sell.sort((a, b) => a.price - b.price); // Lowest sell price first
        }
    }

    cancel(orderId) {
        this.orders.buy = this.orders.buy.filter(order => order.id !== orderId);
        this.orders.sell = this.orders.sell.filter(order => order.id !== orderId);
        console.log(`Order ${orderId} canceled.`);
    }

    getOrders() {
        console.log('Current Orders:', this.orders);
        return this.orders;
    }
}


Orderbook.prototype.placeOrder = placeOrder;
Orderbook.prototype.listOrdersPerMarket = listOrdersPerMarket;
Orderbook.prototype.cancelOrder = cancelOrder;