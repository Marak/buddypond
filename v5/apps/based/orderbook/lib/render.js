export default async function render(parent, options = {}) {

    $(parent).html(this.html);

    $('#order-market').val(options.context);

    let selector = $('#market-pairs', parent);
    // get all the markets by getting all the coins and pairing them with BUX

    let coins = await this.bp.apps.coin.resource.all();

    console.log('coins', coins);

    // order coins by symbol
    coins = coins.sort((a, b) => {
        if (a.symbol < b.symbol) {
            return -1;
        }
        if (a.symbol > b.symbol) {
            return 1;
        }
        return 0;
    });

    // for each market, add an options to the selector
    coins.forEach(coin => {

        if (coin.status !== 'listed') {
            return;
        }

        let option = $('<option></option>');

        // if the symbol is BUX, skip it as we can't pair it was USD
        if (coin.symbol === 'BUX') return;

        option.html(coin.symbol + '/BUX');
        option.val(coin.symbol + '/BUX');
        selector.append(option);
    });
    if (options.context && options.context !== 'default') {
        // assume this is the market pair
        $('#market-pairs', parent).val(options.context);
    }
    this.orderbook.listOrdersPerMarket(parent, options.context);
    this.orderbook.listMarketMakersPerMarket(parent, options.context);

    if (this.bp.me === 'Randolph') {
        // initial seed coins, will only work the first time
        // additional calls will fail due to unique constraint on symbol
        try {
            await this.createInitialOrders.call(this);

        } catch (err) {
            console.error(err);
            $('.order-error').text(err.message);
        }

    }

}