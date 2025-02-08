const prices = {};
prices['BUX'] = 1.00;
prices['MEGA'] = 0.50;
prices['GBP'] = 0.25;

export default async function render(parent) {
    $(parent).html(this.html);

    // create a new test portfolio

    async function createInitialCoins () {
        await this.resource.create(this.bp.me, {
            name: 'BuddyBux',
            symbol: 'BUX',
            amount: 1000,
            supply: Infinity,
            price: prices['BUX'],
            cost: 1000 * prices['BUX'],
            owner: 'Marak'
        });
        await this.resource.create(this.bp.me, {
            name: 'Megabytes',
            symbol: 'MEGA',
            supply: Infinity,
            price: prices['MEGA'],
            cost: '0', // everyone gets 10 for free
            owner: 'Marak'
        });
        await this.resource.create(this.bp.me, {
            name: 'Good Buddy Points',
            symbol: 'GBP',
            supply: Infinity,
            price: prices['GBP'],
            cost: '0', // everyone gets 10 for free
            owner: 'Marak'
        });
    }
   
    if (this.bp.me === 'Marak') {
        // TODO:
    }
    try {
        await createInitialCoins.call(this);

    } catch (err) {
        console.error(err);
        $('.coin-error').text(err.message);
    }

}
