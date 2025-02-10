// creates initial orders for the orderbook from Randolph
// these orders will make the market for MEGA/BUX and GPB/BUX
// Randolph is the owner of the orders
// Randolph will *always* be selling MEGA for BUX
// Randolph will *always* be buying GBP for BUX ( slightly discounted rate )
// Randolph will *always* be selling BUX for GBP ( discounted rate )
export default async function createInitialOrders() {


    // first check to see if Randolph already has his automated orders in place
    // this way we won't duplicate them


    // check for the the sell MEGA for BUX order
    console.log('searching for Randolphs sellMegaForBux order');
    let sellMegaForBux = await this.resource.search(this.bp.me, {
        owner: 'Randolph',
        pair: 'MEGA/BUX',
        side: 'sell',
        status: 'open'
    });

    console.log('sellMegaForBux', sellMegaForBux);

    if (sellMegaForBux.results && sellMegaForBux.results.length === 0) {
        // Randolph has no sell orders for MEGA/BUX
        // place a new open order to sell MEGA for BUX
        console.log('Randolph has no sell orders for MEGA/BUX');
        try {
            await this.resource.create(this.bp.me, {
                owner: 'Randolph',
                // type: 'order',
                pair: 'MEGA/BUX',
                side: 'sell',
                price: 100,
                amount: 1000000
            });
        } catch (err) {
            console.error(err);
            $('.order-error').text(err.message);
        }
    }


    // check the buy GBP for BUX order
    console.log('searching for Randolphs buyGbpForBux order');
    let buyGbpForBux = await this.resource.search(this.bp.me, {
        owner: 'Randolph',
        pair: 'GBP/BUX',
        side: 'buy'
    });

    console.log('buyGbpForBux', buyGbpForBux);

    if (buyGbpForBux.results && buyGbpForBux.results.length === 0) {
        // Randolph has no buy orders for GBP/BUX
        // place a new open order to buy GBP for BUX
        console.log('Randolph has no buy orders for GBP/BUX');
        try {
            await this.resource.create(this.bp.me, {
                owner: 'Randolph',
                // type: 'order',
                pair: 'GBP/BUX',
                side: 'buy',
                price: 100,
                amount: 1000
            });
        } catch (err) {
            console.error(err);
            $('.order-error').text(err.message);
        }
    }

    // check the sell GBP for BUX order
    console.log('searching for Randolphs sellGbpForBux order');

    let sellGbpForBux = await this.resource.search(this.bp.me, {
        owner: 'Randolph',
        pair: 'GBP/BUX',
        side: 'sell'
    });

    console.log('sellGbpForBux', sellGbpForBux);

    if (sellGbpForBux.results && sellGbpForBux.results.length === 0) {
        // Randolph has no sell orders for GBP/BUX
        // place a new open order to sell GBP for BUX
        console.log('Randolph has no sell orders for GBP/BUX');
        try {
            await this.resource.create(this.bp.me, {
                owner: 'Randolph',
                // type: 'order',
                pair: 'GBP/BUX',
                side: 'sell',
                price: 100,
                amount: 1000
            });
        } catch (err) {
            console.error(err);
            $('.order-error').text(err.message);
        }
    }


    return;

    try {
        await this.resource.create('BUX', {
            name: 'BuddyBux',
            symbol: 'BUX',
            supply: 10000000,
            //price: prices['BUX'],
            //cost: 1000 * prices['BUX'],
            owner: 'Marak'
        });
    } catch (err) {
        console.error(err);
        $('.coin-error').text(err.message);
    }

    try {
        await this.resource.create('MEGA', {
            name: 'Megabytes',
            symbol: 'MEGA',
            supply: 1000000000,
            //price: prices['MEGA'],
            //cost: '0', // everyone gets 10 for free
            owner: 'Marak'
        });
    } catch (err) {
        console.error(err);
        $('.coin-error').text(err.message);
    }


    try {
        await this.resource.create('GBP', {
            name: 'Good Buddy Points',
            symbol: 'GBP',
            supply: 10000000000,
            //price: prices['GBP'],
            //cost: '0', // everyone gets 10 for free
            owner: 'Marak'
        });
    } catch (err) {
        console.error(err);
        $('.coin-error').text(err.message);
    }

}