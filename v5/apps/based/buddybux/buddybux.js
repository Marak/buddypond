/* BuddyBux.js - Marak Squires 2025 - BuddyPond */
import Resource from '../resource/lib/Resource.js';

export default class BuddyBux {

    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/buddybux/buddybux.html');
        this.css = await this.bp.load('/v5/apps/based/buddybux/buddybux.css');

        let provider = 'indexeddb';
        provider = 'memory';
        this.resource = new Resource("coin", {
            provider: provider,
            apiEndpoint: this.bp.config.api,
            schema: {
                name: { type: "string" },
                symbol: { type: "string" },
                owner: { type: "string" },
                supply: { type: "number" },
            },
            bp: this.bp
        });

        this.portfolioResource = new Resource("portfolio", {
            provider: provider,
            apiEndpoint: this.bp.config.api,
            schema: {
                owner: { type: "string" },
                symbol : { type: "string" },
                amount: { type: "number" },
                ctime: { type: "number" },
                utime: { type: "number" }
            },
            bp: this.bp
        });

        if (provider !== 'rest') {
            // Mint the new coin
            this.resource.create("Marak", { // is that right?
                name: 'BuddyBux',
                symbol: 'BUDDYBUX',
                owner: this.bp.me,
                supply: Infinity
            });
        }



    }

    async checkoutComplete (amount) {
        // TODO: update or create
        this.portfolioResource.create(this.bp.me, 'BUDDYBUX', {
            symbol: 'BUDDYBUX',
            amount: amount,
            owner: this.bp.me,
            ctime: Date.now(),
            utime: Date.now()
        });


    }

    async checkBalance () {

    }

    async open() {
        if (!this.buddybuxWindow) {
            this.buddybuxWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'buddybux',
                title: 'BuddyBux',
                icon: 'desktop/assets/images/icons/icon_console_64.png',
                x: 250,
                y: 75,
                width: 400,
                height: 450,
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

            document.getElementById("stripe-checkout").addEventListener("click", () => {
                //alert("Redirecting to Stripe Checkout...");
                // this.bp.open('stripe');
                // Stripe checkout logic here
                // assume checkout was successful ( for now )

                let amount = document.getElementById("buddybux-amount").value;
                this.checkoutComplete(amount);
           
                //this.resource.updateOrCreate...
            });

            document.getElementById("crypto-checkout").addEventListener("click", function () {
                alert("Connecting to MetaMask...");
                // Ethereum transaction logic here
            });

            this.tabs = new this.bp.apps.ui.Tabs('.buddybux-tabs', this.buddybuxWindow.content);

            this.tabs.onTab((tabId) => {
                alert(`Switched to tab: ${tabId}`);

            });

            // Update total price
            $('#buddybux-amount').on('input', function () {
                const amount = $(this).val();
                $('#total-price').text(`$${(amount * 0.01).toFixed(2)}`);
            });

            // Send BuddyBux
            $('#send-buddybux').on('click', function () {
                const recipient = $('#recipient').val();
                const amount = $('#send-amount').val();

                if (recipient && amount > 0) {
                    const confirmation = prompt(`Type the buddy name '${recipient}' to confirm:`);

                    if (confirmation === recipient) {
                        alert(`Successfully sent ${amount} BuddyBux to ${recipient}!`);
                    } else {
                        alert('Confirmation failed. Please try again.');
                    }
                } else {
                    alert('Please fill out all fields correctly.');
                }
            });

            function animateBalance(el) {

                const balance = Math.floor(Math.random() * 1000); // Example random balance
                const digits = String(balance).padStart(3, '0').split('');

                $('.digit').each(function (index) {
                    $(this).addClass('spin');
                    setTimeout(() => {
                        $(this).removeClass('spin');
                        $(this).text(digits[index]);
                    }, 500 * (index + 1));
                });


            }

            // Check Balance with slot machine animation
            $('#check-balance').on('click', async function () {

                let portfolio = await this.portfolioResource.get(this.bp.me);
                console.log(`Portfolio for ${this.bp.me}:`, portfolio);

                animateBalance(this);

            });
            // TODO: ontab active perform the animation
            animateBalance(this);

        }
    }

}