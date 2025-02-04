import tape from "tape";
import Orderbook from "../lib/Orderbook.js";

let orderbook = new Orderbook({ asset: "BTC", currency: "USD" });

tape("Should create a new Orderbook instance", (t) => {
    t.ok(orderbook, "Orderbook instance created");
    t.deepEqual(orderbook.getOrders(), { buy: [], sell: [] }, "Orderbook starts empty");
    t.end();
});

tape("Should execute a trade when matching buy and sell orders exist", (t) => {
    let buyId = orderbook.buy(1, 51000);
    let sellId = orderbook.sell(1, 51000);
    let orders = orderbook.getOrders();

    t.equal(orders.buy.length, 0, "Buy order removed after execution");
    t.equal(orders.sell.length, 0, "Sell order removed after execution");
    t.end();
});

tape("Should partially fill an order", (t) => {
    orderbook.sell(2, 51000);
    orderbook.buy(1, 51000);
    let orders = orderbook.getOrders();

    t.equal(orders.sell.length, 1, "Sell order partially remains");
    t.equal(orders.sell[0].amount, 1, "Remaining sell order has correct amount");
    t.end();
});
/*
tape("Market buy should take lowest sell order", (t) => {
    orderbook.sell(1, 50500);
    orderbook.sell(1, 50700);
    orderbook.buy(1, 50700);
    let orders = orderbook.getOrders();
    console.log('orderbook', orderbook)
    console.log('orders', orders.sell);
    t.equal(orders.sell.length, 1, "One sell order remains");
    t.equal(orders.sell[0].price, 50700, "Lowest sell order was taken first");
    t.end();
});
*/