export default async function castSpell(buddyName, spellName) {
    console.log(spellName, buddyName);
    if (spellName.length > 0 && buddyName.length > 0) {
        // if Buddy fails role check, reflect the spell back onto them
        await this.client.apiRequest(`/spellbook/cast-spell/${buddyName}/${spellName}`, 'POST', {
          duration: 1,
          otherProp: 'value'
        })
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