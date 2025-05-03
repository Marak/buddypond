export default async function render(coinWindow) {

    // console.log('coinWindow', coinWindow, 'this', this.html);
    $(coinWindow.content).html(this.html);

    await this.updateCoinList(coinWindow);

    /*
    if (this.bp.me === 'Marak') {
        // initial seed coins, will only work the first time
        // additional calls will fail due to unique constraint on symbol
        try {
            await this.createInitialCoins.call(this);
        } catch (err) {
            console.error(err);
            $('.coin-error').text(err.message);
        }
    }
    */

    // attempt to pre-select the #coin-name drop down value based on symbol
    let coinSelector = $('#coin-send-name', coinWindow.content);
    coinSelector.val(this.context);

}
