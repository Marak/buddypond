export default async function updateCoinList(coinWindow) {
    let coins = await this.resource.list(); // TODO: .search()
    console.log('All Coins:', coins);

    // Update user-owned coins
    updateUserCoins.call(this, coinWindow, coins);

    // Update all minted coins
    updateAllCoins.call(this, coinWindow, coins);

    // update the coin <select> values
    let coinSelector = $('#coin-send-name');
    console.log("coinSelector", this.context, coinSelector)
    coinSelector.html(''); // Clear existing entries
    coins.forEach(coin => {
        console.log('appending coin', coin);
        if (coin.symbol === this.context) {
            coinSelector.append(`<option value="${coin.symbol}" selected>${coin.name}</option>`);
            return;
        }
        coinSelector.append(`<option value="${coin.symbol}">${coin.name}</option>`);
    });

}

function updateUserCoins(coinWindow, coins) {

    let myCoins = coins.filter(coin => coin.owner === this.bp.me);
    if (myCoins.length === 0) {
        $('.user-coin-table', coinWindow.content).hide();
        $('.no-coins', coinWindow.content).show();
        return;
    }
    $('.user-coin-table', coinWindow.content).show();
    $('.no-coins', coinWindow.content).hide();
    let userCoinList = $('.user-coin-list', coinWindow.content);
    userCoinList.html(''); // Clear existing entries

    myCoins.forEach(coin => {
            let row = createCoinRow.call(this, coin, false, true, coinWindow);
            userCoinList.append(row); // Use jQuery .append()
        
    });
}

function updateAllCoins(coinWindow, coins) {
    let allCoinList = $('.all-coin-list', coinWindow.content);
    allCoinList.html(''); // Clear existing entries
    coins.forEach(coin => {
        if (coin.status !== 'listed') {
            return;
        }
        let row = createCoinRow.call(this, coin, true, false, coinWindow);
        allCoinList.append(row); // Use jQuery .append()
    });
}

// Utility function to create a row and handle clicks
function createCoinRow(coin, includeOwner = false, includeAdmin = false, coinWindow) {
    const formattedSupply = coin.supply.toLocaleString('en-US');
    let listVerb = coin.status === 'listed' ? 'Delist' : 'List';
    let row = $(`
        <tr>
            <td>${coin.symbol}</td>
            <td>${coin.name}</td>
            <td>${formattedSupply}</td>
            ${includeOwner ? `<td>${coin.owner}</td>` : ''}
            ${includeAdmin ? `<td>
                <button class="listDelistCoin" title="${listVerb} your coin on the BuddyCoin Market">${listVerb} Coin</button>
                <button class="removeCoin">Destroy</button>
            </td>` : ''}
        </tr>
    `);

    if (coin.status === 'listed') {
        // disable the removeCoin button
        row.find('.removeCoin').prop('disabled', true);
        row.find('.removeCoin').addClass('disabled');
    }

    row.on('click', async (ev) => {

        // check if target has class .listDelistCoin
        if ($(ev.target).hasClass('listDelistCoin')) {
            /*
            let confirmList = prompt(`Are you sure you want to list this coin? Type "${coin.symbol}" to confirm.`);
            if (confirmList !== coin.symbol) {
                return;
            }
            */

            // toggle the status based on the current value
            // if value === "List Coin", set status to "private"
            // if value === "Delist Coin", set status to "listed"

            if (coin.status === 'listed') {
                let updatedResponse = await this.resource.update(coin.id, { status: 'private' });
                console.log("set private updatedResponse", updatedResponse);
                // update the coin list
                updateCoinList.call(this, coinWindow);
                return false;
            }

            if (coin.status === 'private') {
                let updatedResponse = await this.resource.update(coin.id, { status: 'listed' });
                console.log("set listed updatedResponse", updatedResponse);
                // update the coin list
                updateCoinList.call(this, coinWindow);
                return false;
            }

            return false;

        }

        // check if target has class .removeCoin
        if ($(ev.target).hasClass('removeCoin')) {
            /*
            let confirmDelete = prompt(`Are you sure you want to delete this coin? Type "${coin.symbol}" to confirm.`);
            if (confirmDelete !== coin.symbol) {
                return;
            }
            */
            await this.resource.remove(coin.uuid);
            // update the coin list
            updateCoinList.call(this, coinWindow);
            return false;
        }

        if (coin.symbol === 'BUX') {
            return this.bp.open('buddybux', { context: 'buy' });
        }

        if (coin.status !== 'listed') {
            // do not open orderbook for unlisted coins
            return;
        }

        
        this.bp.open('orderbook', { context: coin.symbol + '/BUX' });
    });

    return row;
}
