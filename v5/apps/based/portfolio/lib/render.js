const prices = {};
prices['BUX'] = 1.00;
prices['MEGA'] = 0.01;
prices['GBP'] = 0.001;

export default async function render(parent) {
    $(parent).html(this.html);
    /*
    try {
        await this.resource.create(this.bp.me, {
            symbol: 'BUX',
            amount: 1000,
            price: prices['BUX'],
            cost: 1000 * prices['BUX']
        });
    
    }
    catch (err) {}
    */
    /*

    // create a new test portfolio
    console.log('creating new test porte', this.bp.me);
    await addOrUpdate.call(this, {
        symbol: 'BUX',
        amount: 1000,
        price: prices['BUX'],
        cost: 1000 * prices['BUX']
    });

    await addOrUpdate.call(this, {
        symbol: 'MEGABYTES',
        amount: 10,
        price: prices['MEGABYTES'],
        cost: '0' // everyone gets 10 for free
    });
    */





    // get the portfolio's assets
    const assets = await this.resource.search(this.bp.me, {
        owner: this.bp.me
    });
    console.log('assetsassetsassets', assets);
    let results = assets.results;

    // render the results to the table
    const table = $('.portfolio-entries', parent);
    console.log('tabletabletable', table);
    table.html('');

    let totalValue = 0;
    let initialInvestment = 0; // Assume this is known or fetched from somewhere

    results.forEach(asset => {
        let assetPrice = (prices[asset.symbol] || 0) * asset.amount;
        totalValue += assetPrice;

        // Format as USD currency
        const formattedPriceValue = assetPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        table.append(`
            <tr>
                <td>${asset.symbol}</td>
                <td>${asset.amount}</td>
                <td>${formattedPriceValue}</td>
                <td>${asset.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            </tr>
        `);
    });

    // Calculate profit/loss
    const profitLoss = totalValue - initialInvestment;

    // Update UI with accumulated values
    $('.total-value', parent).html(totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    $('.profit-loss', parent).html(profitLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
}
