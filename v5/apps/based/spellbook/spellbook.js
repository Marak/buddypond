// import _alert from './spells/_alert';

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
          this.castSpell();
          return false;
        });
    
        $('.ponderSpellbook', spellbookWindow.content).on('click', () => {
          this.castSpell();
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

Spellbook.prototype.castSpell = async function castSpell() {
    let spellName = $('.omegaSpellTome').val();
    let buddyName = $('#castSpellBuddyName').val();
    console.log(spellName, buddyName);
    if (spellName.length > 0 && buddyName.length > 0) {
        // if Buddy fails role check, reflect the spell back onto them
        await buddypond.castSpell(buddyName, spellName);

        /*
        $( '.castSpellForm' ).effect('shake', { direction: 'down', distance: 10, times: 33 }, 300, function () {
          buddypond.castSpell(buddyName, spellName, function (err, data) {
            if (err) {
              alert(err.message);
            }
            if (data.success === false) {
              if (data.message === 'qtokenid is required') {
                alert(`You didn't even try to login!\n\n${spellName} has fizzled.`);
                //desktop.app.spellbook[spellName]();
              } else {
                if (buddyName === buddypond.me) {
                  alert('You targeted yourself? Well played.');
                }
                if (desktop.app.spellbook && desktop.app.spellbook[spellName]) {
                  alert(`${data.message}\n\nReflecting ${spellName} back to Desktop Client`);
                  desktop.app.spellbook[spellName]();
                } else {
                  alert(spellName + ' is forbidden knowledge');
                  $('#window_spellbook').hide();
                }
              }
            } else {
              // success
            }
          });
        });
              */

    }
}