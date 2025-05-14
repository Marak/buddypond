import _alert from '../../../spellbook/spells/_alert.js';
import rickroll from '../../../spellbook/spells/rickroll.js';
import forbiddenRickRoll from '../../../spellbook/spells/forbiddenRickRoll.js';
import zalgo from '../../../spellbook/spells/zalgo.js';

export default function applyData(el, data) {
    const $el = $(el);
    $el.find('.card-spell-name').text(data.spell);
    $el.find('.card-spell-target').text(data.target);

    const now = new Date();

    const messageDate = new Date(data.message.ctime);
    const timeDiff = (now.getTime() - messageDate.getTime()) / 1000;

    let message = data.message;

    // Remark: Since spells have side-effects ( not all cards have side-effects )
    // we need to check if the message has already been processed
    // It's important we don't double-cast / double-process a spell
    // TODO: move card cache to common code
    let processedCards = bp.get('processedCards') || [];

    // check if message.uuid is already in processedCards, if so, return
    if (processedCards.includes(message.uuid)) {
      // console.log('Spell card already processed, skipping:', message.uuid);
      return;
    }

    // push message.uuid to processedCards
    processedCards.push(message.uuid);

    // truncate processedCards to 1000 items
    if (processedCards.length > 1000) {
      processedCards = processedCards.slice(-1000);
    }

    // store processedCards in local storage
    bp.set('processedCards', processedCards);

    // Remark: Always process spells, even if they are older than 10 seconds
    // Remark: Could cause some issue if several spells are cast in a row while user is offline
    /*
    if (timeDiff > 100) { // 10 seconds
        // console.log('Message is too old to be processed for TTS.');
        return;
    }
    */

    if (data.target === this.bp.me) {
        // console.log('spell-card - data', data)
        if (data.spell === 'alert') {
            _alert(data.text);
        }
        if (data.spell === 'rickroll') {
            rickroll(data.url);
        }
        if (data.spell === 'forbiddenRickRoll') {
            forbiddenRickRoll();
        }
        if (data.spell === 'zalgo') {
            zalgo(Number(data.text));
        }
        if (data.spell === 'logout') {
            this.bp.logout();
            alert('You have been remotely logged out by ' + data.message.from);
        }
    }

    // $el.find('.card-url-url').attr('href', data.url);

    // opens in new tab
    // TODO: open in youtube app
    // $el.find('.card-url-url').attr('target', '_blank');
}