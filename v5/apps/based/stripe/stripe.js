// import Stripe from 'stripe';

// Assuming you are using Stripe.js, not the NPM package directly in a client-side file
const testKey = 'pk_test_51QZ5PDGHoMV8ArsVFfwyeXad8bjroyqlXk5FRknbzny0dlW2VlZzOPFEbuuLAfJKADctxK6rj7ARV8oRANWRkjNS00mNRDgfdt';

// leaked? oops, regen? might be test env anyway
const liveKey = 'pk_live_51QZ5PDGHoMV8ArsVWCUAseF6dAqUyabaC45CNJ6UoqLAbVNJp1kAC7AWUhE8HfeiJyBrF6gc139BNvV38muOhEzo00emukO4jA';

export default class StripeClass {
    constructor(bp) {
        // this.isLive = isLive;
        this.bp = bp;
        this.handleFetchResult = this.handleFetchResult.bind(this);
    }

    handleFetchResult(result) {
        if (!result.ok) {
            return result.json().then(json => {
                if (json.error && json.error.message) {
                    throw new Error(result.url + ' ' + result.status + ' ' + json.error.message);
                }
            }).catch(err => {
                this.showErrorMessage(err);
                throw err;
            });
        }
        return result.json();
    }

    showErrorMessage(message) {
        console.log('Error:', message);
        const errorEl = document.getElementById("error-message");
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = "block";
        }
    }

    createCheckoutSession(priceId) {
        // TODO: replace with cf worker
        return fetch("http://192.168.200.59/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ priceId })
        }).then(this.handleFetchResult);
    }

    setupPlanButton(parent, buttonId, priceId) {
        let button = document.createElement("button");
        button.id = buttonId;
        button.textContent = "Subscribe";
        console.log('button', button)
        // document.body.appendChild(button);
        parent.appendChild(button);
        console.log(buttonId, priceId);
        button.addEventListener("click", evt => {
            this.createCheckoutSession(priceId).then(data => {
                console.log('tttt', this.stripe)
                this.stripe.redirectToCheckout({ sessionId: data.sessionId }).catch(err => {
                    console.error("Redirect to checkout failed: ", err);
                });
            }).catch(err => {
                console.error("Failed to create session: ", err);
            });
        });
    }

    async init() {
        // Setup Stripe.js

        await this.bp.importModule('https://js.stripe.com/v3/', {}, false);

        this.stripe = Stripe(this.isLive ? liveKey : testKey);

        let json = {
            publishableKey: testKey, // Choose based on environment
            developerPrice: 'price_1QZ61XGHoMV8ArsVVW1b6WB0', // Replace with actual price ID
            businessPrice: 'price_456', // Replace with actual price ID
            enterprisePrice: 'price_789' // Replace with actual price ID
        };

        let parent = $('#buddybux').get(0);
        this.setupPlanButton(parent, "developer-plan-btn", json.developerPrice);
        this.setupPlanButton(parent, "business-plan-btn", json.businessPrice);
        this.setupPlanButton(parent, "enterprise-plan-btn", json.enterprisePrice);

    }
}
