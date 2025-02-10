export default async function checkoutComplete (amount) {
    // TODO: update or create
    alert('checkoutComplete ' + amount);
    this.portfolioResource.create(this.bp.me, 'BUX', {
        symbol: 'BUX',
        amount: amount,
        owner: this.bp.me,
        ctime: Date.now(),
        utime: Date.now()
    });
}
