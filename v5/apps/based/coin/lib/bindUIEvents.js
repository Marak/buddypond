
export default function bindUIEvents(coinWindow) {
    console.log('this.coinWindow.content', coinWindow.content);
    
    $('.mint-coin', coinWindow.content).click(async () => {
        // Retrieve values from the form
        let coinName = document.querySelector('#coin-name').value.trim();
        let coinSymbol = document.querySelector('#coin-symbol').value.trim();
        let coinSupply = parseInt(document.querySelector('#coin-supply').value, 10);

        if (!coinName || !coinSymbol || isNaN(coinSupply) || coinSupply <= 0) {
            alert('Please enter valid coin details.');
            return;
        }

        let assignToPortfolio = false;
        // Mint the new coin
        try {
            this.resource.create(this.bp.me, {
                name: coinName,
                symbol: coinSymbol,
                owner: this.bp.me,
                supply: coinSupply
            });
            assignToPortfolio = true;
        } catch (err) {
            // display error in UI
            console.error('Error minting coin:', err);
            $('.coin-error').text(err.message);
        }

        if (assignToPortfolio) {
            await this.bp.load("portfolio");
            this.bp.apps.portfolio.resource.create(this.bp.me, {
                symbol: coinSymbol,
                owner: this.bp.me,
                amount: coinSupply,
                price: '0',
                cost: '0'
            });
            this.updateCoinList(coinWindow);
        }

        // Assign the entire supply to the owner portfolio

        // Update the coin list
    });
}
