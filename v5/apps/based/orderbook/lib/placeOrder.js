export default async function placeOrder (parent, order) {
    console.log('placeOrder', order)

    let marketPair = $('#market-pairs').val();

    let result = await this.resource.create(marketPair, order);

    await this.listOrdersPerMarket(parent, marketPair);

    return result;

}