export default async function mintCoin (parent, coin) {
    console.log('mintCoin', coin)
       // Mint the new coin
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

   
}