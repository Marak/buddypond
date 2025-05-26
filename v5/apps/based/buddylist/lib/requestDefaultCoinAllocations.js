
// Remark: Server will only allocate if there is no pre-existing portion of coins
// Remark: Server maintains a mutex lock to ensure only one request per user at a time ( spamming prevention )
export default async function requestDefaultCoinAllocations() {

  let qtokenid = buddypond.qtokenid;
  let me = this.bp.me;

  // TODO: set a five second alarm here so messages aren't immediately sent on login
  console.log(`requestDefaultCoinAllocations ${me} ${qtokenid}`);

  let res;
  try {
    let faucetUrl = `${buddypond.randolphEndpoint}/randolph/faucet`;
    console.log('faucetUrl', faucetUrl);
    res = await fetch(faucetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${qtokenid}`,
        'x-me': me
      }
    });
    console.log('requestDefaultCoinAllocations', res.status, res.statusText);
    let json = await res.json();
    console.log('requestDefaultCoinAllocations', json);
  } catch (err) {
    throw err;
  }

}