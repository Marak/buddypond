export default class Rewards {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.rewardInterval = null; // Placeholder for reward interval
        return this;
    }

    async init() {
        //this.html = await this.bp.load('/v5/apps/based/motd/motd.html');
        //await this.bp.load('/v5/apps/based/motd/motd.css');

        // create a 60 second interval to send wsClient message with action 'rewards:request'
        this.rewardInterval = setInterval(() => {

            // this.requestReward();

        }, 5 * 1000); // 60 seconds
        // this.requestReward();
        return 'loaded rewards';
    }

    async requestReward() {

        if (this.bp.apps.buddylist.client) {
            console.log('requesting rewards');
            this.bp.apps.buddylist.client.wsClient.send(JSON.stringify({
                action: 'rewards:request',
                buddyname: this.bp.me,
                qtokenid: this.bp.qtokenid,
            }));
        }


    };

    async open() { }

}

window.rollToNumber = function rollToNumber($el, value) {
  const digits = String(value).split('');

  // Clear and rebuild digits
  $el.empty();

  digits.forEach(d => {
    const digitContainer = $('<div class="odometer-digit"></div>');
    const inner = $('<div class="odometer-digit-inner"></div>');

    for (let i = 0; i <= 9; i++) {
      inner.append(`<span>${i}</span>`);
    }

    digitContainer.append(inner);
    $el.append(digitContainer);

    // Delay added to force DOM layout flush
    setTimeout(() => {
      inner.css('transform', `translateY(-${d * 1}em)`);
    }, 10);
  });
}