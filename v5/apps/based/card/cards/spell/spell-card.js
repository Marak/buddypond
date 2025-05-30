// TODO: discoParty
// TODO: pixelate
import spellData from '../../../spellbook/lib/spellData.js';
export default async function applyData(el, data) {
    const $el = $(el);
    //console.log('Spell card data', data);
    let allSpells = spellData.spells.concat(spellData.memes).concat(spellData.curses);
    let spell = allSpells.find((spell) => {
        return spell.name === data.spell;
    });

    // console.log('Spell data', spell);

    if (spell && spell.costSymbol) {
        let costSymbols = spell.costSymbol.split(',');
        let str = '';
        costSymbols.forEach((symbol) => {
            let img = `<img src="/v5/apps/based/spellbook/assets/cost-symbols/${symbol.trim()}" class="spell-cost-symbol" />`;
            str += img;
        });
        $el.find('.card-spell-cost').html(str);
    }

    $el.on('click', (e) => {
        // re-apply the spell locally
        e.preventDefault();
        e.stopPropagation();
        if (data.spellType === 'spells' || data.spellType === 'memes') {
            runSpell.call(this, data);
        }
    });

    let targetName = data.target;
    if (data.target === data.castedBy) {
        targetName = 'myself.';
    }

    let spellTypeLabel = 'an Invocation';
    if (data.spellType === 'curses') {
        spellTypeLabel = 'a Curse';
    }
    if (data.spellType === 'memes') {
        spellTypeLabel = 'a Meme';
    }

    $el.find('.card-spell-target').text(`I cast ${spellTypeLabel} on ` + targetName);
    $el.find('.card-spell-name').text(data.spellLabel);


    if (data.spellType !== 'curses') {
        // remove .card-spell-duration
        $el.find('.card-spell-duration').remove();
    }

    // Initialize countdown
    const countDownEl = $el.find('.card-spell-duration .countdown-date');
    // set data-ctime to the data.ctime
    countDownEl.data('ctime', data.message.ctime);

    countdownManager.startCountdown(countDownEl, data.expiry);

    if (data.spellType === 'curses' && data.castedBy === this.bp.me) {
        // console.log('Cursed by me', data);
        // show the cure button
        $el.find('.card-spell-cure').removeClass('hidden');
        $el.find('.cure-spell').on('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            let target = data.target;
            let spell = data.spell;
            // let result = await this.castSpell(target, spellName, { type: spellType, config });

            console.log('Cure spell clicked', target, spell);
            // ensure spellbook is loaded
            await this.bp.load('spellbook');
            let result = await this.bp.apps.spellbook.castSpell(data.targetType, data.target, 'cure', {
                type: 'spells'
            });
        });
    }


    const now = new Date();
    const messageDate = new Date(data.message.ctime);
    const timeDiff = (now.getTime() - messageDate.getTime()) / 1000;
    let message = data.message;

    // Check for processed cards to avoid double-casting
    let processedCards = bp.get('processedCards') || [];
    if (processedCards.includes(message.uuid)) {
        return;
    }

    // In case local storage is fresh, or a new user, we do need to put a time limit on the spell
    if (timeDiff > 10) {
        // Don't re-cast the spell if it's been more than 10 seconds
        return;
    }

    processedCards.push(message.uuid);
    if (processedCards.length > 1000) {
        processedCards = processedCards.slice(-1000);
    }
    bp.set('processedCards', processedCards);

    // apply the spell if me is the target
    // curses do not require client-side processing ( curses are applied server-side )
    // spells and memes are processed client-side and require a dynamic import of the spell
    if (data.targetType === 'buddy' && data.target === this.bp.me && message.type !== 'pond' /*&& data.spellType !== 'curses'*/) {
        try {
            await runSpell.call(this, data);

        } catch (error) {
            console.error('Error running spell:', error);

        }
    }
    if (data.targetType === 'pond' /*&& data.spellType !== 'curses'*/) {
        try {
            await runSpell.call(this, data);

        } catch (error) {
            console.error('Error running spell:', error);
        }
    }

}

async function runSpell(data) {
    // dynamically import the spell
    try {
        let spellModule = await this.bp.importModule(`/v5/apps/based/spellbook/spells/${data.spell}/${data.spell}.js`, {}, false);
        spellModule.default.call(this);
    }
    catch (error) {
        console.log('Error importing spell module:', error);
    }
}


// Encapsulated countdown manager
const countdownManager = (() => {
    let intervalId = null;

    const updateCountdowns = () => {
        const countdownEls = $('.countdown-date').filter(function () {
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

        countdownEls.each(function () {
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
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Build the time string
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

            const remainingDuration = prefix + timeParts.join(':');
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