export default async function sendCoin(parent, userTransaction) {
    console.log('sendCoin', userTransaction)
    // alert('sendCoin')
    // Send the coin to a buddy

    try {
        let res = await this.resource.apiRequest('POST', 'coin/send', userTransaction);
        console.log('rrrr', res)
        $('.coin-error').text('');

        // trigger change event on the coin name dropdown to update the balance
        $('#coin-send-name').trigger('change');
        return res;
    } catch (err) {
        // display error in UI
        console.error('Error sending coin:', err);
        $('.coin-error').text(err.message);
    }

    $('.coin-send-message').text('Sent coin to buddy!');

    /*
    try {
        let res = await this.resource.create(coin.symbol, {
            name: coin.name,
            symbol: coin.symbol,
            owner: coin.owner,
            supply: coin.supply
        });
        console.log('rrrr', res)
        $('.coin-error').text('');
        return res;
    } catch (err) {
        // display error in UI
        console.error('Error minting coin:', err);
        $('.coin-error').text(err.message);
    }
        */


}