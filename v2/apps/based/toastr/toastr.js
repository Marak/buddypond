// Buddy Pond - Toastr.js - Marak Squires 2023
export default class Toastr {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
    }

    async init() {
        this.bp.load('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js');
        this.bp.load('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css');

    }

}