export default async function submitFormHandler(e, content, spell) {
  let $content = $(content);
    e.preventDefault();
    // console.log('Submitting spell form...', content, spell);
    const spellType = $('#spellType', $content).val();
    //const spellName = $('#spellName', $content).val();
    let spellName = spell.name;
    let targetType = $('#spellTargetType', $content).val();
    // console.log(`Submitting spell form for type: ${spellType}, name: ${spellName} and target type: ${targetType}`);
    const spellDuration = $('#spellDuration', $content).val();
    const _spellData = this.data[spellType].find((s) => s.name === spellName);
    let target = null;
    const config = {};

    if (targetType === 'buddy') {
      target = this.isUsingInput ? $('#spellTargetInput', $content).val() : $('#spellTargetName', $content).val();
    }

    if (targetType === 'pond') {
      target = $('#spellTargetPond', $content).val();
    }

    if (targetType === 'self') {
      target = this.bp.me; // Use current user
    }

    /*
    if (targetType === 'buddy') {
      target = isUsingInput ? $('#spellTargetInput', $content).val() : $('#spellTargetName', $content).val();
    } else if (targetType === 'pond' && spellType === 'spell') {
      target = $('#spellTargetPond', $content).val();
    } else if (targetType === 'self') {
      target = this.bp.me; // Use current user
    }
    */

    // Collect config values
    $('#spellConfig input', $content).each(function () {
      const name = $(this).attr('name').match(/spellConfig\[(.*)\]/)[1];
      config[name] = $(this).val();
    });

    config.duration = spellDuration;

    // let totalCost = calculateCost(_spellData, config);
    // console.log(`Casting ${spellName} on ${target} with a total cost of ${totalCost} buddy points.`);

    if (spellName && target) {
      try {
        if (targetType === 'self') {
          targetType = 'buddy'; // self is a special case, but we want to treat it as a buddy for casting
        }
        let result = await this.castSpell(targetType, target, spellName, { type: spellType, config });
        if (result && result.error) {
          // display error message
          $('.spell-message', $content).addClass('error');
          $('.spell-message', $content).text(result.error).show();
        } else {
          // display success message
          $('.spell-message', $content).removeClass('error');
          $('.spell-message', $content).text('Spell cast successfully!').show();
        }
        // this.applyCooldown(spellType, spellName, targetType, target);
        console.log('Spell cast result:', result);
      } catch (error) {
        throw new Error(`Error casting spell: ${error.message}`);
      }

    } else {
      alert('Please select a spell and a valid target.');
    }
}