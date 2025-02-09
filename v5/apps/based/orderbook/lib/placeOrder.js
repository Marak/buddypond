export default async function placeOrder (parent, order) {
    console.log('placeOrder', order)

    let marketPair = $('#market-pairs').val();

    try {
        await this.resource.create(marketPair, {
            owner: this.me,
            side: 'buy',
            pair: marketPair,
            side: $('#order-side').val(),
            price: 100,
            amount: $('#order-amount').val(),
        });

    } catch (err) {
        console.error('Error placing order:', err);
        $('.orderbook-error', parent).text(err.message);
    }

    await this.listOrdersPerMarket(parent, marketPair);

    return {
        status: 'success',
        data: {
            orderId: '123456'
        }
    }
}