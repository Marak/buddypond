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

    if (data.expiry) {
        // Initialize countdown
        const countDownEl = $el.find('.card-spell-duration .countdown-date');
        // set data-ctime to the data.ctime
        countDownEl.data('ctime', data.message.ctime);
        // console.log('Setting countdown for spell card', data.expiry, countDownEl);
        this.bp.apps.desktop.countdownManager.startCountdown(countDownEl, data.expiry, function onExpire($el) {
            $el.parent().text('Curse has Expired.');
        });
    }
    // console.log('Spell card countdown expired', $el);

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
