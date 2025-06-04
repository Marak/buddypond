export default class CountdownManager {
    constructor() {
        this.intervalId = null;
        this.expiryCallbacks = new WeakMap(); // store per-element callbacks
    }

    updateCountdowns() {
        const countdownEls = $('.countdown-date').filter(function () {
            return $(this).data('expired') !== true;
        });

        if (countdownEls.length === 0) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                if (bp?.apps?.ui) {
                    bp.apps.ui.countdownTimer = null;
                }
            }
            return;
        }

        countdownEls.each((_, el) => {
            const $el = $(el);

            const expiry = new Date($el.data('expiry')).getTime();
            const now = Date.now();
            const distance = expiry - now;

            if (!$el.data('duration')) {
                const ctime = $el.data('ctime');
                if (ctime) {
                    $el.data('duration', expiry - ctime);
                }
            }
            // console.log('distance for', $el, distance);
            // distance is going negative? on recurse?
            if (distance < 0) {
                $el.data('expired', true);

                const cb = this.expiryCallbacks.get(el);
                if (typeof cb === 'function') {
                    cb($el);
                    this.expiryCallbacks.delete(el); // Cleanup
                }

                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let prefix = '';
            let timeParts = [];

            if (days > 0) {
                prefix = `${days} Day${days > 1 ? 's' : ''} `;
                timeParts.push(hours.toString().padStart(2, '0'));
            } else if (hours > 0) {
                timeParts.push(hours.toString());
            }

            timeParts.push(minutes.toString().padStart(2, '0'));
            timeParts.push(seconds.toString().padStart(2, '0'));

            $el.text(prefix + timeParts.join(':'));
        });
    }

    /**
     * Start a countdown on the given jQuery element
     * @param {jQuery} $el - The element to attach the countdown to
     * @param {string|Date} expiry - Expiry date/time
     * @param {function} [onExpire] - Optional callback when countdown expires
     */
    startCountdown($el, expiry, onExpire) {
        const expiryTime = new Date(expiry).getTime();
        const now = Date.now();
        const duration = expiryTime - now;

        // console.log('Starting countdown for', $el, expiry);

        $el
            .data('expiry', expiryTime)
            .data('ctime', now)
            .data('duration', duration)
            .data('expired', false);

        if (typeof onExpire === 'function') {
            this.expiryCallbacks.set($el[0], onExpire);
        }

        if (!this.intervalId) {
            this.intervalId = setInterval(() => this.updateCountdowns(), 1000);
            if (bp?.apps?.ui) {
                bp.apps.ui.countdownTimer = this.intervalId;
            }
        }

        this.updateCountdowns(); // Immediate update
    }
}
