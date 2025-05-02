
export default function eventBind(coinWindow) {
    console.log('this.coinWindow.content', coinWindow.content);
    
    this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', coinWindow.content);

    this.tabs.onTab((tabId) => {
        $('.coin-error').text('');
    });

    $('.mint-coin', coinWindow.content).click(async () => {
        // Retrieve values from the form
        let coinName = document.querySelector('#coin-name').value.trim();
        let coinSymbol = document.querySelector('#coin-symbol').value.trim();
        let coinSupply = parseInt(document.querySelector('#coin-supply').value, 10);

        if (!coinName || !coinSymbol || isNaN(coinSupply) || coinSupply <= 0) {
            alert('Please enter valid coin details.');
            return;
        }

        this.coin.mintCoin(coinWindow.content, {
            name: coinName,
            owner: this.bp.me,
            symbol: coinSymbol,
            supply: coinSupply
        })
     
    });

    $('.send-coin', coinWindow.content).click(async () => {
        // alert('send-coin clicked');
        let sendTo = $('#coin-send-to').val();
        let symbol = $('#coin-send-name').val();
        let amount = $('#coin-send-amount').val();

        this.portfolio.transfer(coinWindow.content, {
            from: this.bp.me,
            to: sendTo,
            symbol: symbol,
            amount: amount
        });
    });

    $('#coin-send-name', coinWindow.content).change(async () => {
        // fetch users balance and display it
        let currentCoin = $('#coin-send-name').val();
        let coinBalance = $('#coin-balance', coinWindow.content);

        await this.bp.load('portfolio'); // will get cached / be cached

        // get the portfolio's assets
        const assets = await this.bp.apps.portfolio.resource.search(this.bp.me, {
            owner: this.bp.me
        });
        console.log('assetsassetsassets', currentCoin, assets.results);
        let coinBalances = assets.results;

        // update the $('.coin-names') select element
        // first clear all options
        $('#coin-send-name', coinWindow.content).empty();
        coinBalances.forEach(asset => {
            console.log(`asset.symbol: ${asset.symbol} === currentCoin: ${currentCoin}`, asset);
            $('.coin-names', coinWindow.content).append(`<option value="${asset.symbol}">${asset.symbol}</option>`);
            if (asset.symbol === currentCoin) {
                coinBalance.text(asset.amount);
                // select the current coin
                $('#coin-send-name', coinWindow.content).val(asset.symbol);
            }
        });

       
    });

    $('#coin-send-name', coinWindow.content).change();

}