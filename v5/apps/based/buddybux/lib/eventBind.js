export default function eventBind () {
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

    this.tabs = new this.bp.apps.ui.Tabs('#buddybux-tabs', this.buddybuxWindow.content);

    this.tabs.onTab((tabId) => {
        console.log(`Switched to tab: ${tabId}`);

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
    $('#check-balance').on('click', async (ev) => {

        let portfolio = await this.portfolioResource.get(this.bp.me);
        console.log(`Portfolio for ${this.bp.me}:`, portfolio);

        animateBalance(ev.target);

    });
    // TODO: ontab active perform the animation
    animateBalance(this);

}