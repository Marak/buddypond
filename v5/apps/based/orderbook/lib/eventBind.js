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
            pair: $('#market-pairs').val(),
            side: $('#order-side').val(),
            price: $('#order-price').val(),
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
            $('.orderbook-order-status', parent).text('');
            $('.orderbook-error', parent).text(err.message);
        }

    });

}