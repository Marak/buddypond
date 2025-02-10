export default async function eventBind(parent) {

    this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', parent);

    this.tabs.onTab((tabId) => {
        $('.coin-error').text('');
    });

    $('#market-pairs').on('change', async (e) => {
        this.bp.open('orderbook', { context: $('#market-pairs').val() });
    });

    $('.place-order', parent).on('click', async (e) => {
        let order = {
            owner: this.bp.me,
            type: 'order',
            pair: $('#market-pairs').val(),
            side: $('#order-side').val(),
            price: 100,
            amount: $('#order-amount').val()
        };

        try {
            let result = await this.orderbook.placeOrder(parent, order);
            console.log('placeOrder result', result);
            $('.orderbook-error', parent).text('');
            $('.orderbook-order-status', parent).text('Order placed: ' + JSON.stringify(result));
            // this.tabs.navigateToTab('#orderbook-book');
    
        } catch (err) {
            console.log('Error placing order:', err);
            $('.orderbook-error', parent).text(err.message);

        }

        return;
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