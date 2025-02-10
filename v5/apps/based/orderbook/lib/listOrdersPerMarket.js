export default async function listOrdersPerMarket(parent, marketPair) {

    if (marketPair === 'default') {
        marketPair = 'GBP/BUX';
    }

    console.log(`listOrdersPerMarket(${marketPair})`);
    // update the orderbook list
    let searchResult = await this.resource.search(this.bp.me, {
        pair: marketPair,
        status: 'open'
    });
    let orders = searchResult.results;
    if (orders.length === 0) {
        $('.orderbook-table', parent).hide();
        $('.orderbook-my-open-orders', parent).hide();
        $('.no-orders', parent).show();
        return;
    }
    $('.orderbook-table', parent).show();
    // $('.orderbook-my-open-orders', parent).show();
    $('.no-orders', parent).hide();
    console.log('got back orders', orders);
    let html = '';
    let table = $('.orderbook-entries', parent);
    let openOrdersTable = $('.orderbook-openorder-entries', parent);

    // clear the table
    table.empty();
    openOrdersTable.empty();

    orders.forEach(order => {
        let includeAdmin = false;
        let formattedAmount =  order.amount.toLocaleString('en-US');
        // format as USD
        let formattedPrice = order.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        if (order.owner === this.me) {
            includeAdmin = true;
        }


        let row = $(`
     <tr>
         <td>${order.pair}</td>
         <td>${order.side}</td>
         <td>${formattedAmount}</td>
         <td>${formattedPrice}</td>
        ${includeAdmin ? `<td><button class="cancelOrder">Cancel</button></td>` : ''}
     </tr>
 `);

        row.on('click', async (ev) => {

            // check if target has class .removeCoin
            if ($(ev.target).hasClass('cancelOrder')) {
                /*
                let confirmDelete = prompt(`Are you sure you want to delete this coin? Type "${coin.symbol}" to confirm.`);
                if (confirmDelete !== coin.symbol) {
                    return;
                }
                */
                this.cancelOrder(parent, order);
                return false;
            }
        });

        table.append(row);

        if (order.owner === this.me) {
            openOrdersTable.append(row.clone());
        }


    });

    // check length of openOrdersTable, if empty hide it
    if (openOrdersTable.children().length === 0) {
        $('.orderbook-my-open-orders', parent).hide();
    } else {
        $('.orderbook-my-open-orders', parent).show();
    }


}