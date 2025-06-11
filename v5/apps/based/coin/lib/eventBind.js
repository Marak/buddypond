
export default function eventBind(coinWindow) {
    console.log('this.coinWindow.content', coinWindow.content);

    this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', coinWindow.content);

    this.tabs.onTab(async (tabId) => {
        $('.coin-error').text('');

        console.log('tabId', tabId);
        if (tabId === '#coin-leaderboard') {

            await fetchLeaderboard.call(this);

        }

    });

     $('#coin-leaderboard-symbol', coinWindow.content).change(async () => {
        // fetch the top coins for the selected symbol
        $('.loading-leaderboard', coinWindow.content).show();
        await fetchLeaderboard.call(this);
    });



    async function fetchLeaderboard() {
        // fetch the /top coins from portfolio
        // console.log('Fetching top coins', this.portfolio);
        let symbol = $('#coin-leaderboard-symbol', coinWindow.content).val();
        let res = await this.portfolio.apiRequest('POST', `portfolio/top`, { symbol: symbol });
        // console.log('top coins', res);
        let leadersList = $('.leaderboard-list', coinWindow.content);
        // iterate over the results and append them to the leadersList table body
        leadersList.empty();
        res.results.forEach((coin, i) => {
            // console.log('coin', coin, i);
            let value = coin.total_amount * coin.price;
            // format value as dollars with 2 decimal places
            //value = `$${value.toFixed(2)}`;
            // use currency formatting for value with commas
            value = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            // format amount as number with commas
            coin.total_amount = coin.total_amount.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            leadersList.append(`
                    <tr>
                        <td>${i + 1}</td>
                        <td>${coin.owner}</td>
                        <td>${coin.symbol}</td>
                        <td>${coin.total_amount}</td>
                        <td>${value}</td>
                    </tr>
                `);
        });
        $('.loading-leaderboard', coinWindow.content).hide();
    }


    $('.mint-coin', coinWindow.content).click(async () => {
        // Retrieve values from the form
        let coinName = document.querySelector('#coin-name').value.trim();
        let coinSymbol = document.querySelector('#coin-symbol').value.trim();
        let coinSupply = parseInt(document.querySelector('#coin-supply').value, 10);
        let coinPrice = parseFloat(document.querySelector('#coin-price').value);
        if (!coinName || !coinSymbol || isNaN(coinSupply) || coinSupply <= 0) {
            alert('Please enter valid coin details.');
            return;
        }

        this.coin.mintCoin(coinWindow.content, {
            name: coinName,
            owner: this.bp.me,
            symbol: coinSymbol,
            supply: coinSupply,
            price: coinPrice
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
            $('#coin-send-name', coinWindow.content).append(`<option value="${asset.symbol}">${asset.symbol}</option>`);
            if (asset.symbol === currentCoin) {
                coinBalance.text(asset.amount);
                // select the current coin
                $('#coin-send-name', coinWindow.content).val(asset.symbol);
            }
        });


    });

    $('#coin-send-name', coinWindow.content).change();

}