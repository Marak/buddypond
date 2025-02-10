export default async function listMarketMakersPerMarket (parent, marketPair) {
    console.log('listMarketMakersPerMarketlistMarketMakersPerMarketlistMarketMakersPerMarket')
    // update the orderbook list
    console.log('listMarketMakersPerMarket', marketPair);

    let markets = marketPair.split('/');
    let selling = markets[0];
    let buying = markets[1];

    await this.bp.load('portfolio');

    // get the portfolio's assets
    const assetHolders = await this.bp.apps.portfolio.resource.search(this.bp.me, {
        symbol: selling
    });
    console.log('assetHoldersassetHoldersassetHolders', assetHolders.results);

    let topHolders = assetHolders.results;


    let html = '';
    let table = $('.marketmakers-entries', parent);

    // clear the table
    table.empty();


    topHolders.forEach(holder => {
        let row = $(`
     <tr>
         <td>${holder.owner}</td>
         <td>${holder.amount}</td>
     </tr>`);
        table.append(row);
        
    });

    /*
    orders.forEach(order => {
        let includeAdmin = false;
        if (order.owner === this.me) {
            includeAdmin = true;
        }


        let row = $(`
     <tr>
         <td>${order.pair}</td>
         <td>${order.side}</td>
         <td>${order.amount}</td>
         <td>${order.price}</td>
        ${includeAdmin ? `<td><button class="cancelOrder">Cancel</button></td>` : ''}
     </tr>
 `);

        row.on('click', async (ev) => {

            // check if target has class .removeCoin
            if ($(ev.target).hasClass('cancelOrder')) {
                let confirmDelete = prompt(`Are you sure you want to delete this coin? Type "${coin.symbol}" to confirm.`);
                if (confirmDelete !== coin.symbol) {
                    return;
                }
               this.cancelOrder(parent, order);
                return false;
            }
        });

        table.append(row);


    });
    */


}