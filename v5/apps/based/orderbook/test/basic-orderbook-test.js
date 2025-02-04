import tape from "tape";
import Orderbook from "../lib/Orderbook.js";

let orderbook = new Orderbook({ asset: "BTC", currency: "USD" });

tape("Should create a new Orderbook instance", (t) => {
    t.ok(orderbook, "Orderbook instance created");
    t.deepEqual(orderbook.getOrders(), { buy: [], sell: [] }, "Orderbook starts empty");
    t.end();
});

// Test buy order
tape("Should place a buy order", (t) => {
    let orderId = orderbook.buy(1, 50000);
    let orders = orderbook.getOrders();
    t.equal(orders.buy.length, 1, "One buy order exists");
    t.equal(orders.buy[0].id, orderId, "Buy order ID matches");
    t.equal(orders.buy[0].amount, 1, "Buy order amount is correct");
    t.equal(orders.buy[0].price, 50000, "Buy order price is correct");
    t.end();
});

// Test sell order
tape("Should place a sell order", (t) => {
    let orderId = orderbook.sell(2, 51000);
    let orders = orderbook.getOrders();
    t.equal(orders.sell.length, 1, "One sell order exists");
    t.equal(orders.sell[0].id, orderId, "Sell order ID matches");
    t.equal(orders.sell[0].amount, 2, "Sell order amount is correct");
    t.equal(orders.sell[0].price, 51000, "Sell order price is correct");
    t.end();
});

// Test order sorting
tape("Buy orders should be sorted by highest price", (t) => {
    orderbook.buy(1, 50500);
    let orders = orderbook.getOrders();
    t.equal(orders.buy[0].price, 50500, "Highest price buy order is first");
    t.end();
});

tape("Sell orders should be sorted by lowest price", (t) => {
    orderbook.sell(1, 50900);
    let orders = orderbook.getOrders();
    t.equal(orders.sell[0].price, 50900, "Lowest price sell order is first");
    t.end();
});

// Test cancel order
tape("Should cancel an order", (t) => {
    let orderId = orderbook.buy(1, 49500);
    orderbook.cancel(orderId);
    let orders = orderbook.getOrders();
    t.equal(orders.buy.some(order => order.id === orderId), false, "Order is removed");
    t.end();
});
