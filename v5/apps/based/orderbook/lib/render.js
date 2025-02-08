export default async function render(parent) {
    $(parent).html(this.html);
    let selector = $('#market-pairs', parent);
    // get all the markets by getting all the coins and pairing them with BUDDYBUX

    let coins = await this.bp.apps.coin.resource.all();

    console.log('coins', coins);


    // for each market, add an options to the selector
    coins.forEach(coin => {
        let option = $('<option></option>');

        // if the symbol is BUDDYBUX, skip it as we can't pair it was USD
        if (coin.symbol === 'BUX') return;

        option.html(coin.symbol + '/BUX');
        option.val(coin.symbol + '/BUX');
        selector.append(option);
    });
}