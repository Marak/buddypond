// TODO: discoParty
// TODO: pixelate

// Encapsulated countdown manager
const countdownManager = (() => {
    let intervalId = null;

    const updateCountdowns = () => {
        const countdownEls = $('.countdown-date').filter(function() {
            return $(this).data('expired') !== true;
        });

        if (countdownEls.length === 0) {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                bp.apps.ui.countdownTimer = null;
            }
            return;
        }

        countdownEls.each(function() {
            const $el = $(this);

            const expiry = new Date($el.data('expiry')).getTime();
            const now = new Date().getTime();
            const distance = expiry - now;

            // check if data-duration has not been set
            // if so, set it to the formatted duration
            if (!$el.data('duration')) {
                // calculate the duration using diff of data-ctime and expiry
                let totalDuration = expiry - new Date($el.data('ctime')).getTime();
                $el.data('duration', totalDuration);
            }

            if (distance < 0) {
                $el.text('00:00:00').data('expired', true);
                // set the parent element text to "Expired"
                let duration = $el.data('duration');
                let days = Math.floor(duration / (1000 * 60 * 60 * 24));
                let hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((duration % (1000 * 60)) / 1000);
                // TODO: formattedDuration should not show the leading zeroes values if days, hours, or minutes are 0
                // let formattedDuration = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
                // $el.parent().text('Curse has Expired. Lasted for ' + formattedDuration);
                $el.parent().text('Curse has Expired.');
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const remainingDuration = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            $el.text(remainingDuration);

        });
    };

    return {
        startCountdown: ($el, expiry) => {
            $el.data('expiry', expiry).data('expired', false);
            if (!intervalId) {
                intervalId = setInterval(updateCountdowns, 1000);
                bp.apps.ui.countdownTimer = intervalId;
            }
            updateCountdowns(); // Immediate update
        }
    };
})();

export default async function applyData(el, data) {
    const $el = $(el);
    let targetName = data.target;
    if (data.message.from === this.bp.me) {
        targetName = 'myself.';
    }
    $el.find('.card-spell-target').text('I have casted ' + data.spell + ' on ' + targetName);
    $el.find('.card-spell-name').text(data.spell);
    

    if (data.spellType === 'spell') {
        // remove .card-spell-duration
        $el.find('.card-spell-duration').remove();
    }

    // Initialize countdown
    const countDownEl = $el.find('.card-spell-duration .countdown-date');
    // set data-ctime to the data.ctime
    countDownEl.data('ctime', data.message.ctime);

    countdownManager.startCountdown(countDownEl, data.expiry);

    const now = new Date();
    const messageDate = new Date(data.message.ctime);
    const timeDiff = (now.getTime() - messageDate.getTime()) / 1000;
    let message = data.message;

    // Check for processed cards to avoid double-casting
    let processedCards = bp.get('processedCards') || [];
    if (processedCards.includes(message.uuid)) {
        return;
    }

    processedCards.push(message.uuid);
    if (processedCards.length > 1000) {
        processedCards = processedCards.slice(-1000);
    }
    bp.set('processedCards', processedCards);

    // TODO: replace switch case with dictionary lookup
    if (data.target === this.bp.me) {
        // dynamically import the spell
        let spellModule =  await this.bp.importModule(`/v5/apps/based/spellbook/spells/${data.spell}/${data.spell}.js`, {}, false);
        spellModule.default.call(this);
    }
}