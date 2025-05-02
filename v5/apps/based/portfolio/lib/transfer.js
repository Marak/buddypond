export default async function transfer(parent, userTransaction) {
    console.log('transfer asset', userTransaction)
    // alert('sendCoin')
    // Send the coin to a buddy

    try {
        let res = await this.resource.apiRequest('POST', `portfolio/${userTransaction.from}/${userTransaction.symbol}/transfer`, userTransaction);
        console.log('transfering coins', userTransaction, res)
        $('.coin-error').text('');

        // trigger change event on the coin name dropdown to update the balance
        $('#coin-send-name').trigger('change');
        $('.coin-send-message').html(`Sent ${userTransaction.amount} ${userTransaction.symbol} to ${userTransaction.to}!`);
        // $('.coin-send-message').text('Sent coin to buddy!');
        return res;
    } catch (err) {
        // display error in UI
        console.error('Error sending coin:', err);
        $('.coin-error').text(err.message);
    }

}