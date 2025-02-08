export default async function eventBind(parent) {
    $('#market-pairs').on('change', async (e) => {
        this.bp.open('orderbook', { context: $('#market-pairs').val() });
    });


    $('.place-order', parent).on('click', async (e) => {
        // this.placeOrder(); ???
        // how to share on resource? we need to keep placeOrder as headless as possible
        // since resource might be diff here and server...
        // TODO: this.placeOrder();
        // create the order
        let marketPair = $('#market-pairs').val();
        try {
            this.resource.create(this.bp.me, {
                owner: this.bp.me,
                type: 'order',
                pair: marketPair,
                side: $('#order-side').val(),
                price: 100,
                amount: $('#order-amount').val(),
            });
    
        } catch (err) {
            $('.orderbook-error', parent).text(err.message);

        }

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