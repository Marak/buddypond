const prices = {};
prices['BUDDYBUX'] = 1.00;
prices['MEGABYTES'] = 0.50;

export default async function render(parent) {
    $(parent).html(this.html);

    async function addOrUpdate({ symbol, amount, price, cost }) {

        // first check is user already owns this asset
        const found = await this.resource.search(this.bp.me, { symbol });
        console.log('found', found);
        if (found && found.length > 0) {
            let existing = found[0];
            let currentAmount = existing.amount;
            let currentCost = existing.cost;
            let newAmount = currentAmount + amount;
            let newCost = currentCost + cost;
            let newPrice = newCost / newAmount;
            await this.resource.update(this.bp.me, existing.id, {
                amount: newAmount,
                price: newPrice,
                cost: newCost
            });
            console.log(`Updated ${symbol} amount from ${currentAmount} to ${newAmount}`);

        } else {
            await this.resource.create(this.bp.me, {
                symbol,
                owner: this.bp.me,
                amount,
                price,
                cost
            });
            console.log(`Added ${amount} of ${symbol} to portfolio`);

        }


    }


    // create a new test portfolio

    await addOrUpdate.call(this, {
        symbol: 'BUDDYBUX',
        amount: 1000,
        price: prices['BUDDYBUX'],
        cost: 1000 * prices['BUDDYBUX']
    });

    await addOrUpdate.call(this, {
        symbol: 'MEGABYTES',
        amount: 10,
        price: prices['MEGABYTES'],
        cost: '0' // everyone gets 10 for free
    });





    // get the portfolio's assets
    const assets = await this.resource.list(this.bp.me);
    console.log('assetsassetsassets', assets);

    // render the results to the table
    const table = $('.portfolio-entries', parent);
    console.log('tabletabletable', table);
    table.html('');

    let totalValue = 0;
    let initialInvestment = 0; // Assume this is known or fetched from somewhere

    assets.forEach(asset => {
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
