export default async function listOrdersPerMarket (parent, marketPair) {

    // update the orderbook list
    let orders = await this.resource.list(marketPair);
    console.log('got back orders', orders);
    let html = '';
    let table = $('.orderbook-entries', parent);

    // clear the table
    table.empty();

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


    });



}