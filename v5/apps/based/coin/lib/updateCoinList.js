export default async function updateCoinList(coinWindow) {
    console.log('updateCoinList');
    let coins = await this.resource.all();
    console.log('All Coins:', coins);

    // Update user-owned coins
    updateUserCoins.call(this, coinWindow, coins);

    // Update all minted coins
    updateAllCoins.call(this, coinWindow, coins);
}

function updateUserCoins(coinWindow, coins) {
    let userCoinList = $('.user-coin-list', coinWindow.content);
    userCoinList.html(''); // Clear existing entries

    coins.forEach(coin => {
        if (coin.owner === this.bp.me) {
            let row = createCoinRow.call(this, coin);
            userCoinList.append(row); // Use jQuery .append()
        }
    });
}

function updateAllCoins(coinWindow, coins) {
    let allCoinList = $('.all-coin-list', coinWindow.content);
    allCoinList.html(''); // Clear existing entries

    coins.forEach(coin => {
        let row = createCoinRow.call(this, coin, true);
        allCoinList.append(row); // Use jQuery .append()
    });
}

// Utility function to create a row and handle clicks
function createCoinRow(coin, includeOwner = false) {
    let row = $(`
        <tr>
            <td>${coin.name}</td>
            <td>${coin.symbol}</td>
            <td>${coin.supply}</td>
            ${includeOwner ? `<td>${coin.owner}</td>` : ''}
        </tr>
    `);

    row.on('click', () => {

        if (coin.symbol === 'BUX') {
            return this.bp.open('buddybux', { context: 'buy' });
        }

        this.bp.open('orderbook', { context: coin.symbol + '/BUX' });
    });

    return row;
}
