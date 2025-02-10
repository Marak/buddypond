export default async function placeOrder (parent, order) {
    console.log('placeOrder', order)

    let marketPair = $('#market-pairs').val();

    let result = await this.resource.create(marketPair, {
        owner: this.me,
        side: 'buy',
        pair: marketPair,
        side: $('#order-side').val(),
        price: 100,
        amount: $('#order-amount').val(),
    });

    await this.listOrdersPerMarket(parent, marketPair);

    return result;

}