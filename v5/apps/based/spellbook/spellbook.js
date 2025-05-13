import client from './lib/client.js';
import castSpell from './lib/castSpell.js';

export default class Spellbook {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {

        console.log('motd is: under construction');

        this.html = await this.bp.load('/v5/apps/based/spellbook/spellbook.html');

        return 'loaded Spellbook';
    }

    async open() {

        let spellbookWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'spellbook',
            title: 'Spellbook',
            icon: 'desktop/assets/images/icons/icon_console_64.png',
            x: 250,
            y: 75,
            width: 650,
            height: 420,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            content: this.html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onclose: () => {
                // this.bp.apps.ui.windowManager.destroyWindow('motd');
            }
        });

        console.log(spellbookWindow)
        // load omegaSpellTome drop down
        this.spells.forEach(function (spell) {
            $('.omegaSpellTome').append(`<option value="${spell}">${spell}</option>`);
        });

        $('.castSpellForm', spellbookWindow.content).on('submit', () => {
          let buddyName = $('#castSpellBuddyName', spellbookWindow.content).val();
          let spellName = $('.omegaSpellTome', spellbookWindow.content).val();
          this.castSpell(buddyName, spellName);
          return false;
        });
    
        $('.ponderSpellbook', spellbookWindow.content).on('click', () => {
          let buddyName = $('#castSpellBuddyName', spellbookWindow.content).val();
          let spellName = $('.omegaSpellTome', spellbookWindow.content).val();
          // alert(`You ponder the spell ${spellName} for ${buddyName}`);
          this.castSpell(buddyName, spellName);
        });

    }

}

Spellbook.prototype.spells = [
    'zalgo',
    'babel.js',
    'riddikulus',
    'ebublio',
    'episkey',
    'rickroll',
    'forbiddenRickRoll',
    'passwordisusername',
    'alert',
    'logout',
    'banhammer'
];

Spellbook.prototype.castSpell = castSpell;

Spellbook.prototype.client = client;