export default async function eventBind(parent) {

    $('.place-order', parent).on('click', async (e) => {
        // this.placeOrder(); ???
        // how to share on resource? we need to keep placeOrder as headless as possible
        // since resource might be diff here and server...
        // TODO: this.placeOrder();
        // create the order
        this.resource.create(this.bp.me, {
            owner: this.bp.me,
            type: 'order',
            side: $('#order-size').val(),
            price: 100,
            amount: $('#order-amount').val(),
        });

        // update the orderbook list
        let orders = await this.resource.list(this.bp.me);
        console.log('got back orders', orders);
        let html = '';
        let table = $('.orderbook-entries', parent);
        orders.forEach(order => {
            table.append(`
            <tr>
                <td>${order.symbol}</td>
                <td>${order.amount}</td>
                <td>${order.pair}</td>
            </tr>
        `);
        });


    });

}