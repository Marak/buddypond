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
        $('.coin-send-message').html(`Sent ${userTransaction.amount} ${userTransaction.symbol} to ${userTransaction.to}!`);
        return res;
    } catch (err) {
        // display error in UI
        console.error('Error sending coin:', err);
        $('.coin-error').text(err.message);
    }

    $('.coin-send-message').text('Sent coin to buddy!');


}