export default function eventBind(parent) {

    this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', parent);

    this.tabs.onTab((tabId) => {
        $('.coin-error').text('');
    });

    $('.send-coin', parent).click(async () => {
        // alert('send-coin clicked');
        let sendTo = $('#coin-send-to').val();
        let symbol = $('#coin-send-name').val();
        let amount = $('#coin-send-amount').val();
        console.log(`${sendTo} ${symbol} ${amount}`);
        this.portfolio.transfer(parent, {
            from: bp.me,
            to: sendTo,
            symbol: symbol,
            amount: amount
        });
    });


    $('#coin-send-name', parent).change(async () => {
        // fetch users balance and display it
        let currentCoin = $('#coin-send-name').val();
        let coinBalance = $('#coin-balance', parent);

        console.log('currentCoin', currentCoin);

        const result = await this.resource.search(this.bp.me, {
            owner: this.bp.me,
            symbol: currentCoin
        });

        console.log('current result', result);
        let asset = result.results[0];
        console.log('asset', asset);
        let amount = asset.amount;

        // update coinBalance
        coinBalance.html(`Your Balance: ${amount.toLocaleString('en-US')}`);
    });

    $('.user-portfolio', parent).on('click', async () => {
        // this.tabs.navigateToTab('#user-portfolio');
        // re-render the portfolio
        await this.render(parent);
        await this.eventBind(parent);
        $('#user-portfolio').show();
        // this.tabs.navigateToTab('#user-portfolio');
    });

    $('.trade-assets', parent).on('click', () => {
        this.bp.open('orderbook');
    });

    $('.mint-coins', parent).on('click', () => {
        this.bp.open('coin', { type: "coin-mint" });
    });

    $('.send-coins', parent).on('click', () => {
        this.tabs.navigateToTab('#portfolio-transfer');
        // this.bp.open('coin', {  type: "coin-send" });
    });

    $('.admin', parent).on('click', () => {
        this.tabs.navigateToTab('#portfolio-admin');
        // this.bp.open('coin', {  type: "coin-send" });
    });

    $('.user-transactions', parent).on('click', () => {
        this.tabs.navigateToTab('#user-transactions');
        // re-render the transactions
    });

    $('#portfolio-admin-button-submit', parent).on('click', async () => {
        let buddyname = $('#portfolio-admin-user').val();
        let symbol = $('#portfolio-admin-coin').val();
        if (buddyname && symbol) {

            // delete portfolio for coin holding
            let url = `portfolio/${buddyname}/${symbol}`;
            console.log("admin url", url, this.resource.apiRequest);
            let res = await this.resource.apiRequest('DELETE', url);
            $('.coin-error').html(res)
            console.log('res', res)
        }

    });

}