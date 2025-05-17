export default async function createInitialCoins() {
    try {
        await this.resource.create('BUX', {
            name: 'BuddyBux',
            symbol: 'BUX',
            supply: 10000000,
            status: 'listed',
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
            status: 'listed',
            price: 0.01,
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
            status: 'listed',
            price: 0.001,
            owner: 'Marak'
        });
    } catch (err) {
        console.error(err);
        $('.coin-error').text(err.message);
    }

}