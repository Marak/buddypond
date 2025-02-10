// Creates initial orders for the orderbook from Randolph
// Randolph will always:
// - Sell MEGA for BUX
// - Buy GBP for BUX (slightly discounted rate)
// - Sell BUX for GBP (discounted rate)

export default async function createInitialOrders() {
    console.log('Initializing Randolph’s automated orders...');

    const orders = [
        {
            description: 'sell MEGA for BUX',
            searchParams: { owner: 'Randolph', pair: 'MEGA/BUX', side: 'sell', status: 'open' },
            createParams: { owner: 'Randolph', pair: 'MEGA/BUX', side: 'sell', price: 100, amount: 1000000 }
        },
        {
            description: 'buy GBP for BUX',
            searchParams: { owner: 'Randolph', pair: 'GBP/BUX', side: 'buy', status: 'open' },
            createParams: { owner: 'Randolph', pair: 'GBP/BUX', side: 'buy', price: 100, amount: 1000 }
        },
        {
            description: 'sell GBP for BUX',
            searchParams: { owner: 'Randolph', pair: 'GBP/BUX', side: 'sell', status: 'open' },
            createParams: { owner: 'Randolph', pair: 'GBP/BUX', side: 'sell', price: 100, amount: 1000 }
        }
    ];

    for (const order of orders) {
        try {
            console.log(`Searching for Randolph’s ${order.description} order...`);
            const existingOrder = await this.resource.search(this.bp.me, order.searchParams);

            console.log(`${order.description} search result:`, existingOrder);

            if (existingOrder.results?.length === 0) {
                console.log(`Randolph has no ${order.description} orders. Placing new order...`);
                let newMarketMakingOrder = await this.resource.create(this.bp.me, order.createParams);
                console.log(`New ${order.description} order created:`, newMarketMakingOrder);
            }
        } catch (err) {
            console.error(`Error processing ${order.description}:`, err);
            $('.order-error').text(err.message);
        }
    }
}
