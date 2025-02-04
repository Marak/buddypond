/* BuddyBux.js - Marak Squires 2025 - BuddyPond */
export default class BuddyBux {

    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/buddybux/buddybux.html');
        this.css = await this.bp.load('/v5/apps/based/buddybux/buddybux.css');
    }

    async open () {
        if (!this.buddybuxWindow) {
            this.buddybuxWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'buddybux',
                title: 'BuddyBux',
                icon: 'desktop/assets/images/icons/icon_console_64.png',
                x: 250,
                y: 75,
                width: 800,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                   this.buddybuxWindow = null;
                }
            });


            const pricePerBux = 0.01; // 1 BuddyBux = $0.01
            const discountTiers = [
                { threshold: 1000, price: 0.009 }, // 10% off
                { threshold: 2000, price: 0.0075 }, // 25% off
                { threshold: 5000, price: 0.005 }  // 50% off
            ];
    
            function calculatePrice(amount) {
                let finalPrice = amount * pricePerBux;
                for (let tier of discountTiers) {
                    if (amount >= tier.threshold) {
                        finalPrice = amount * tier.price;
                    }
                }
                return finalPrice.toFixed(2);
            }
    
            document.getElementById("buddybux-amount").addEventListener("input", function () {
                let amount = parseInt(this.value) || 1;
                amount = Math.min(Math.max(amount, 1), 5000);
                this.value = amount;
                document.getElementById("total-price").innerText = `$${calculatePrice(amount)}`;
            });
    
            document.getElementById("stripe-checkout").addEventListener("click", function () {
                alert("Redirecting to Stripe Checkout...");
                // Stripe checkout logic here
            });
    
            document.getElementById("crypto-checkout").addEventListener("click", function () {
                alert("Connecting to MetaMask...");
                // Ethereum transaction logic here
            });

        }
    }  
    
}