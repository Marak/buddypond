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
