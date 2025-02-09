
export default function eventBind(coinWindow) {
    console.log('this.coinWindow.content', coinWindow.content);
    
    this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', coinWindow.content);

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
            owner: this.me,
            symbol: coinSymbol,
            supply: coinSupply
        })
     
    });

}