export default async function cancelOrder (parent, order) {
    console.log("cancelOrder", order);
    await this.resource.remove(order.uuid);
    // update the coin list
    this.listOrdersPerMarket.call(this, parent, order.pair);


}