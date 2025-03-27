import _alert from '../../../spellbook/spells/_alert.js';
import rickroll from '../../../spellbook/spells/rickroll.js';
import forbiddenRickRoll from '../../../spellbook/spells/forbiddenRickRoll.js';
import zalgo from '../../../spellbook/spells/zalgo.js';

export default function applyData(el, data) {
    const $el = $(el);
    $el.find('.card-spell-name').text(data.spell);
    $el.find('.card-spell-target').text(data.target);


    const now = new Date();
    console.log('tttt', this)
    const messageDate = new Date(data.message.ctime);
    const timeDiff = (now.getTime() - messageDate.getTime()) / 1000;

    if (timeDiff > 10) {
        // console.log('Message is too old to be processed for TTS.');
        return;
    }


    if (data.target === this.bp.me) {
        console.log('ddddd', data)
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
    }

    // $el.find('.card-url-url').attr('href', data.url);

    // opens in new tab
    // TODO: open in youtube app
    // $el.find('.card-url-url').attr('target', '_blank');
}