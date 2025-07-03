// presale.js
// Uses global solanaWeb3 from <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>

// Configuration
const PRESALE_ADDRESS = 'YOUR_SMITHII_CONTRACT_ADDRESS'; // Replace after deployment
const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const PRICING_TIERS = [
    { tokens: 200_000_000, pricePerToken: 0.0002 },
    { tokens: 200_000_000, pricePerToken: 0.0003 },
    { tokens: 100_000_000, pricePerToken: 0.0004 },
];
const TOTAL_PRESALE_TOKENS = 500_000_000;

// Supported wallets
const SUPPORTED_WALLETS = [
    { name: 'Phantom', key: 'solana', check: () => window.solana && window.solana.isPhantom },
    { name: 'Enkrypt', key: 'enkrypt', check: () => window.enkrypt && (window.enkrypt.solana || window.enkrypt.providers?.solana) },
    { name: 'Solflare', key: 'solflare', check: () => window.solflare && window.solflare.isSolflare },
    { name: 'Backpack', key: 'backpack', check: () => window.backpack && window.backpack.isBackpack },
    { name: 'Glow', key: 'glow', check: () => window.glow && window.glow.isGlow },
];

// DOM references
const connectWalletBtn = document.getElementById('connect-wallet');
const contractAddressEl = document.getElementById('contract-address');
const solAmountInput = document.getElementById('sol-amount');
const walletStatusEl = document.createElement('p');
walletStatusEl.className = 'text-lg mt-4 text-[#3b4f51]';
document.querySelector('#presale-countdown').after(walletStatusEl);

// Connection
const connection = new solanaWeb3.Connection(RPC_ENDPOINT, 'confirmed');

// Detect wallets
function detectWallets() {
    return SUPPORTED_WALLETS.filter(wallet => {
        const available = wallet.check();
        console.log(`Checking ${wallet.name}: ${available}`);
        return available;
    }).map(wallet => wallet.name);
}

// Normalize public key handling
function getPublicKeyFromProvider(provider, walletName, response) {
    if (walletName === 'Enkrypt' && response?.[0]?.pubkey) {
        return response[0].pubkey.toString();
    }
    return provider.publicKey?.toString() || provider?.accounts?.[0]?.pubkey?.toString();
}

// Connect to wallet
async function connectWallet(walletName) {
    try {
        let provider;
        switch (walletName) {
            case 'Phantom':
                provider = window.solana;
                break;
            case 'Enkrypt':
                provider = window.enkrypt.solana || window.enkrypt.providers?.solana;
                break;
            case 'Solflare':
                provider = window.solflare;
                break;
            case 'Backpack':
                provider = window.backpack;
                break;
            case 'Glow':
                provider = window.glow;
                break;
            default:
                throw new Error('Unsupported wallet');
        }

        if (!provider) throw new Error(`${walletName} provider not found`);

        const response = await provider.connect();
        const publicKey = getPublicKeyFromProvider(provider, walletName, response);
        if (!publicKey) throw new Error('Unable to retrieve public key');

        console.log(`Connected to ${walletName}: ${publicKey}`);
        return { provider, publicKey };
    } catch (err) {
        console.error(`Connection failed for ${walletName}:`, err);
        throw new Error(`Failed to connect ${walletName}. Please ensure the wallet is installed and try again.`);
    }
}

// Calculate tokens based on pricing tiers
async function getTokensForSOL(solAmount) {
    let remainingTokens = TOTAL_PRESALE_TOKENS; // TODO: Dynamically fetch post-launch
    let tokensToReceive = 0;
    let solRemaining = solAmount;

    for (const tier of PRICING_TIERS) {
        if (remainingTokens <= 0) break;
        const tierTokens = Math.min(tier.tokens, remainingTokens);
        const tokensForThisTier = Math.min(tierTokens, solRemaining / tier.pricePerToken);
        tokensToReceive += tokensForThisTier;
        solRemaining -= tokensForThisTier * tier.pricePerToken;
        remainingTokens -= tokensForThisTier;
    }

    return tokensToReceive;
}

// Send transaction
async function sendPresaleTransaction(provider, publicKey, solAmount) {
    try {
        const toPubkey = new solanaWeb3.PublicKey(PRESALE_ADDRESS);
        const lamports = solanaWeb3.LAMPORTS_PER_SOL * solAmount;

        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: new solanaWeb3.PublicKey(publicKey),
                toPubkey,
                lamports,
            })
        );

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new solanaWeb3.PublicKey(publicKey);

        let signature;
        if (provider.signTransaction) {
            const signedTx = await provider.signTransaction(transaction);
            signature = await connection.sendRawTransaction(signedTx.serialize());
        } else if (provider.signAndSendTransaction) {
            signature = await provider.signAndSendTransaction(transaction);
        } else {
            throw new Error('Wallet does not support transaction signing.');
        }

        await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
        const tokens = await getTokensForSOL(solAmount);
        return { signature, tokens };
    } catch (err) {
        console.error('Transaction failed:', err);
        throw new Error('Transaction failed. Please check your wallet balance and try again.');
    }
}

// Main handler
connectWalletBtn.addEventListener('click', async () => {
    const availableWallets = detectWallets();
    if (availableWallets.length === 0) {
        walletStatusEl.textContent = 'No supported wallet detected. Install Phantom, Enkrypt, Solflare, Backpack, or Glow.';
        walletStatusEl.className = 'text-lg mt-4 text-red-600';
        return;
    }

    const walletName = availableWallets[0]; // Replace with selector logic if needed

    try {
        const { provider, publicKey } = await connectWallet(walletName);
        walletStatusEl.textContent = `Connected with ${walletName}: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
        walletStatusEl.className = 'text-lg mt-4 text-[#1c6b74]';

        const solAmount = parseFloat(solAmountInput?.value) || 0.1;
        if (solAmount <= 0 || isNaN(solAmount)) {
            walletStatusEl.textContent = 'Please enter a valid SOL amount.';
            walletStatusEl.className = 'text-lg mt-4 text-red-600';
            return;
        }

        const { signature, tokens } = await sendPresaleTransaction(provider, publicKey, solAmount);
        walletStatusEl.textContent = `✅ Success! Sent ${solAmount} SOL for ~${tokens.toLocaleString()} $BUDDYCOIN. Tx: ${signature.slice(0, 4)}...${signature.slice(-4)}`;
    } catch (err) {
        walletStatusEl.textContent = err.message;
        walletStatusEl.className = 'text-lg mt-4 text-red-600';
    }
});

// Display contract address (or placeholder)
contractAddressEl.textContent =
    PRESALE_ADDRESS === 'YOUR_SMITHII_CONTRACT_ADDRESS'
        ? '[Address revealed July 4, 2025]'
        : PRESALE_ADDRESS;
