/* coins.js - Marak Squires 2025 - BuddyPond */
export default class Coin {
    constructor(bp, settings = {}) {
        this.bp = bp;
        this.apiEndPoint = 'https://a.buddypond.com/api/v6/coins';
        this.apiEndPoint = 'https://192.168.200.59/api/v6/coins';
    }

    init() {

    }

    open () {
        // TODO: leave this stub here for now
        console.log('Stub for opening UI window');
    }

}