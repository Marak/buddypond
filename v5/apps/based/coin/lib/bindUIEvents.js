
export default function bindUIEvents(coinWindow) {
    console.log('this.coinWindow.content', coinWindow.content);
    
    $('.mint-coin', coinWindow.content).click(() => {
        // Retrieve values from the form
        let coinName = document.querySelector('#coin-name').value.trim();
        let coinSymbol = document.querySelector('#coin-symbol').value.trim();
        let coinSupply = parseInt(document.querySelector('#coin-supply').value, 10);

        if (!coinName || !coinSymbol || isNaN(coinSupply) || coinSupply <= 0) {
            alert('Please enter valid coin details.');
            return;
        }

        // Mint the new coin
        this.resource.create(this.bp.me, {
            name: coinName,
            symbol: coinSymbol,
            owner: this.bp.me,
            supply: coinSupply
        });

        // Update the coin list
        this.updateCoinList(coinWindow);
    });
}
