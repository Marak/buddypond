export default function eventBind(parent) {

    this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', parent);

    this.tabs.onTab((tabId) => {
        $('.coin-error').text('');
    });

    if (!this.bp.qtoken) {
        let html = $('#portfolio-help', parent).html();
        $('.loggedOutMessage', parent).append(html);
    }

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
        let coinBalance = $('#current-balance', parent);

        console.log('currentCoin', currentCoin);
        console.log('coinBalance', coinBalance);

        const result = await this.resource.search(this.bp.me, {
            owner: this.bp.me,
            symbol: currentCoin
        });

        console.log('current result', result);
        let asset = result.results[0];

        if (!asset) {
            console.error(this.bp.me + ' No asset found for current coin ' + currentCoin);
            coinBalance.html('0');
            return;
        }

        console.log('asset', asset);
        let amount = asset.amount;

        // update coinBalance
        coinBalance.html(`${amount.toLocaleString('en-US')}`);
    });

    $('.portfolio-help', parent).on('click', () => {
        // hide all tabs
        // this.tabs.hideAllTabs();
        // show the help div
        this.tabs.navigateToTab('#portfolio-help');
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


            try {
                // delete portfolio for coin holding
                let url = `portfolio/${buddyname}/${symbol}`;
                console.log("admin url", url, this.resource.apiRequest);
                let res = await this.resource.apiRequest('DELETE', url);
                console.log('res', res)

            } catch (err) {
                console.log(err)
            }

            try {
                let resetTransactionsUrl = `transactions/reset/${buddyname}`;
                console.log("resetTransactionsUrl url", resetTransactionsUrl, this.resource.apiRequest);
                let resetTransactionsRes = await this.resource.apiRequest('GET', resetTransactionsUrl);
                console.log('resetTransactionsRes', resetTransactionsRes)

            } catch (err) {
                console.log(err);
            }

            // $('.coin-error').html(res)
        }

    });

}