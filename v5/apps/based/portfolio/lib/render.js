export default async function render(parent) {

    $(parent).html(this.html);

    if (this.bp.me !== 'Marak') {
        $('#portfolio-admin', parent).remove();
        $('#portfolio-admin-button', parent).remove();
    }

    if (this.bp.me && this.bp.me !== 'Guest') {
        $('.loggedOut', this.portfolioWindow.content).flexHide();
        $('.loggedIn', this.portfolioWindow.content).flexShow();
    } else {
        $('.loggedOut', this.portfolioWindow.content).flexShow();
        $('.loggedIn', this.portfolioWindow.content).flexHide();
        return;
    }

    let allCoins = await this.coinResource.list();
    console.log('allCoins', allCoins)

    let coins = {};
    allCoins.results.forEach(function(coin){
        coins[coin.symbol] = coin;
    });

    console.log("coinscoinscoins", coins)
    $('.loading-portfolio', this.portfolioWindow.content).show();
    $('.loading-transactions', this.portfolioWindow.content).show();

    // get the portfolio's assets
    const assets = await this.resource.search(this.bp.me, {
        owner: this.bp.me
    });
    console.log('assetsassetsassets', assets);
    let results = assets.results;

    // get recent transactions
    const sentTransactions = await this.transaction.search(this.bp.me, {
        sender: this.bp.me
    });
    console.log('sentTransactions', sentTransactions);
    const receivedTransactions = await this.transaction.search(this.bp.me, {
        receiver: this.bp.me
    });
    console.log('receivedTransactions', receivedTransactions);

    const transactions = sentTransactions.concat(receivedTransactions);
    console.log('transactions', transactions);
    
    transactions.forEach(transaction => {
        // append each transaction to the table
        let transactionRow = $(`
            <tr>
                <td>${transaction.sender}</td>
                <td>${transaction.receiver}</td>
                <td>${transaction.symbol}</td>
                <td>${transaction.amount}</td>
                <td>${formatCurrency(transaction.value)}</td>
                <td>${DateFormat.format.date(transaction.timestamp, 'E MMMM dd, hh:mm:ss a')}</td>
            </tr>
        `);
        console.log('transactionRow', transactionRow);
        /*
        transactionRow.click(() => {
            this.bp.open('coin', { context: transaction.symbol, type: 'coin-send' });
        });
        */
        $('.transaction-entries', parent).append(transactionRow);
    });


    let coinSelector = $('#coin-send-name');
    console.log("coinSelector", this.context, coinSelector)
    coinSelector.html(''); // Clear existing entries
    console.log('iterating results', results)
    results.forEach(coin => {
        try {
            console.log('appending coin', coin);
            if (coin.symbol === this.context) {
                coinSelector.append(`<option value="${coin.symbol}" selected>${coin.symbol} - ${coins[coin.symbol].name}</option>`);
                return;
            }
            coinSelector.append(`<option value="${coin.symbol}">${coin.symbol} - ${coins[coin.symbol].name}</option>`);
    
        } catch (err) {
            console.log(`Could not append coin row`, coin);
        }
    });

    // render the results to the table
    const table = $('.portfolio-entries', parent);
    console.log('tabletabletable', table);
    table.html('');

    $('.loading-portfolio', this.portfolioWindow.content).hide();
    $('.loading-transactions', this.portfolioWindow.content).hide();

    let totalValue = 0;
    let initialInvestment = 0; // Assume this is known or fetched from somewhere
    console.log('coin results', results)
    results.forEach(asset => {
        let assetValue = (asset.price || 0) * asset.amount;
        totalValue += assetValue;

        // Format as USD currency
        const formattedPriceValue = formatCurrency(assetValue);
        const formattedPrice = formatCurrency(asset.price);
        const formattedAmount = asset.amount.toLocaleString('en-US');
        const formattedAvailable = asset.available.toLocaleString('en-US');

        let row = $(`
            <tr>
                <td>${asset.symbol}</td>
                <td>${formattedAmount}</td>
                <td>${formattedAvailable}</td>
                <td>${formattedPrice}</td>
                <td>${formattedPriceValue}</td>
                <td>${asset.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            </tr>
        `);

        /*
        row.click(() => {
            this.bp.open('coin', { context: asset.symbol, type: 'coin-send' });
        });
        */

        table.append(row);

    });

    // Calculate profit/loss
    const profitLoss = totalValue - initialInvestment;

    // Update UI with accumulated values
    $('.total-value', parent).html(totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    $('.profit-loss', parent).html(profitLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));

    // trigger change event for coin-send-name
    $('#coin-send-name', parent).trigger('change');

}



   // Helper function to format currency with dynamic precision
   function formatCurrency(value) {
    // Convert to number, handle non-numeric inputs
    const num = parseFloat(value);
    if (isNaN(num)) return '$0.00';

    // Use toLocaleString for clean formatting, up to 8 decimals, removing trailing zeros
    return (
      '$' +
      num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }).replace(/\.?0+$/, '')
    );
  }