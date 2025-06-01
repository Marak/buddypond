export default async function render(parent) {
    $(parent).html(this.html);

    if (this.bp.me !== 'Marak') {
        $('#portfolio-admin', parent).remove();
        $('#portfolio-admin-button', parent).remove();
    }

    if (!this.bp.me || this.bp.me === 'Guest') {
        $('.loggedOut', this.portfolioWindow.content).flexShow();
        $('.loggedIn', this.portfolioWindow.content).flexHide();
        return;
    }

    $('.loggedOut', this.portfolioWindow.content).flexHide();
    $('.loggedIn', this.portfolioWindow.content).flexShow();

    $('.loading-portfolio', this.portfolioWindow.content).show();
    $('.loading-transactions', this.portfolioWindow.content).show();

    // Fetch all coins and assets
    const [allCoins, assetData] = await Promise.all([
        this.coinResource.list(),
        this.resource.search(this.bp.me, { owner: this.bp.me })
    ]);

    const coins = Object.fromEntries(allCoins.results.map(c => [c.symbol, c]));

    this.portfolioData = {
        coins,
        assets: Object.fromEntries(assetData.results.map(asset => [asset.symbol, asset])),
        initialInvestment: 0 // Placeholder, fetch if needed
    };

    renderPortfolioTable.call(this, parent);
    renderCoinSelector.call(this, parent);
    updatePortfolioSummary.call(this, parent);

    await renderTransactions.call(this, 1, 8);

    $('.prev-page', this.portfolioWindow.content).on('click', () => {
        const currentPage = $('.pagination-controls').data('current-page');
        if (currentPage > 1) renderTransactions.call(this, currentPage - 1);
    });

    $('.next-page', this.portfolioWindow.content).on('click', () => {
        const currentPage = $('.pagination-controls').data('current-page');
        renderTransactions.call(this, currentPage + 1);
    });

    $('.loading-portfolio', this.portfolioWindow.content).hide();
    $('.loading-transactions', this.portfolioWindow.content).hide();

    $('#coin-send-name', parent).trigger('change');
}

// Renders the entire coin table from this.portfolioData
function renderPortfolioTable(parent) {
    const table = $('.portfolio-entries', parent);
    table.empty();

    const { assets, coins } = this.portfolioData;
    for (const symbol in assets) {
        const asset = assets[symbol];
        table.append(renderCoinRow(asset, coins[symbol]));
    }
}

// Renders a single <tr> for a coin
function renderCoinRow(asset, coinInfo = {}) {
    const assetValue = (asset.price || 0) * asset.amount;

    const formatted = {
        value: formatCurrency(assetValue),
        price: formatCurrency(asset.price),
        amount: asset.amount.toLocaleString('en-US'),
        available: asset.available.toLocaleString('en-US'),
        cost: asset.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    };

    return $(`
        <tr data-symbol="${asset.symbol}">
            <td>${asset.symbol}</td>
            <td>${formatted.amount}</td>
            <td>${formatted.available}</td>
            <td>${formatted.price}</td>
            <td>${formatted.value}</td>
            <td>${formatted.cost}</td>
        </tr>
    `);
}

// Updates or inserts a single coin row and refreshes summary
export function updateCoinRow(symbol, newAsset) {
    console.log('Updating coin row for symbol:', symbol, 'with asset:', newAsset);
    this.portfolioData.assets[symbol] = newAsset;
    const coinInfo = this.portfolioData.coins[symbol];
    const row = renderCoinRow(newAsset, coinInfo);

    const existingRow = $(`.portfolio-entries tr[data-symbol="${symbol}"]`);
    if (existingRow.length) {
        existingRow.replaceWith(row);
    } else {
        $('.portfolio-entries').append(row);
    }

    updatePortfolioSummary.call(this, this.portfolioWindow.content);
}

// Renders the dropdown for coin sending
function renderCoinSelector(parent) {
    const selector = $('#coin-send-name', parent);
    selector.empty();

    const { coins, assets } = this.portfolioData;
    for (const symbol in assets) {
        console.log('Rendering coin selector for symbol:', coins, symbol);
        if (!coins[symbol]) continue; // Skip if coin data is missing
        const coin = coins[symbol];
        const selected = (symbol === this.context) ? 'selected' : '';
        selector.append(`<option value="${symbol}" ${selected}>${symbol} - ${coin.name}</option>`);
    }
}

// Updates total value and profit/loss
function updatePortfolioSummary(parent) {
    const { assets, initialInvestment } = this.portfolioData;
    let totalValue = 0;

    for (const symbol in assets) {
        const asset = assets[symbol];
        totalValue += (asset.price || 0) * asset.amount;
    }

    const profitLoss = totalValue - initialInvestment;
    $('.total-value', parent).html(totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    $('.profit-loss', parent).html(profitLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
}

// Format currency value
function formatCurrency(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0.00';
    return '$' + num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
    }).replace(/\.?0+$/, '');
}

// Fetch and render paginated transactions
async function renderTransactions(page = 1, limit = 8) {
    try {
        $('.loading-transactions').show();
        $('.transaction-entries').empty();

        const { results, pagination } = await this.transaction.search(this.bp.me, {
            sender: this.bp.me,
            receiver: this.bp.me
        }, { page, limit });

        results.forEach(tx => {
            const row = $(`
                <tr>
                    <td>${tx.sender}</td>
                    <td>${tx.receiver}</td>
                    <td>${tx.symbol}</td>
                    <td>${tx.amount}</td>
                    <td>${formatCurrency(tx.value)}</td>
                    <td>${DateFormat.format.date(tx.timestamp, 'E MMMM dd, hh:mm:ss a')}</td>
                </tr>
            `);
            $('.transaction-entries').append(row);
        });

        $('.page-info').text(`Page ${pagination.page} of ${pagination.totalPages}`);
        $('.prev-page').prop('disabled', pagination.page <= 1);
        $('.next-page').prop('disabled', pagination.page >= pagination.totalPages);
        $('.pagination-controls').data('current-page', pagination.page);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        $('.coin-error').text('Failed to load transactions');
    } finally {
        $('.loading-transactions').hide();
    }
}
