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
    return 'loaded rewards';
  }

  async requestReward() {
    if (this.bp.apps.buddylist.client) {
      // console.log('requesting rewards');
      // TODO: make bp.apps.buddylist.client.wsClient.send into a method
      // add a mutex to avoid spamming the request
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
  // Format number with commas
  const formattedValue = value.toLocaleString('en-US');
  const digits = formattedValue.split('');

  // Clear and rebuild digits
  $el.empty();

  digits.forEach((d, index) => {
    // Handle comma separately
    if (d === ',') {
      $el.append('<span class="odometer-comma">,</span>');
      return;
    }

    const digitContainer = $('<div class="odometer-digit"></div>');
    const inner = $('<div class="odometer-digit-inner"></div>');

    for (let i = 0; i <= 9; i++) {
      inner.append(`<span>${i}</span>`);
    }

    digitContainer.append(inner);
    $el.append(digitContainer);

    // Delay added to force DOM layout flush, staggered for each digit
    setTimeout(() => {
      inner.css({
        'transition': 'transform 0.5s ease-in-out', // Smooth transition
        'transform': `translateY(-${d * 1}em)`
      });
    }, 50 + index * 100); // Base delay + staggered delay per digit
  });
}