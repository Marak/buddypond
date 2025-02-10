export default async function render () {

    // get the available balance from portfolio
    await this.bp.load('portfolio');

    // get the portfolio's assets
    const buddyBuxResults = await this.bp.apps.portfolio.resource.search(this.bp.me, {
        symbol: 'BUX',
        owner: this.bp.me
    });
    console.log('buddyBuxResultsbuddyBuxResults', buddyBuxResults.results);

    let buddyBux = buddyBuxResults.results[0];

    console.group('BuddyBux', buddyBux);

    let formattedAmount = buddyBux.amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    $('#slot-machine').html(formattedAmount);



    return this.html;
}