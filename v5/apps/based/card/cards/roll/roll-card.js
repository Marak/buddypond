export default function applyData(el, data) {
    const $el = $(el);
    const roll = data || {};
    console.log('Roll card data', roll);
    /* Example data: 
        {"generation":1,"min":1,"max":20,"value":7,"userSeeds":[],"systemSeed":8069203912237819}
    */

    // Populate display field
    $el.find('.card-roll-value').text(roll.value || 'N/A');

    // Populate form inputs
    $el.find('.card-roll-input-gen').val(roll.generation || '');
    $el.find('.card-roll-input-min').val(roll.min || '');
    $el.find('.card-roll-input-max').val(roll.max || '');
    $el.find('.card-roll-input-value').val(roll.value || '');
    $el.find('.card-roll-input-user-seeds').val(JSON.stringify(roll.userSeeds || []));
    $el.find('.card-roll-input-system-seed').val(roll.systemSeed || '');

    // Handle form submission to open Ramblor app
    $el.find('.card-roll-verify-form').on('submit', (e) => {
        e.preventDefault();
        const rollData = {
            generation: parseInt($el.find('.card-roll-input-gen').val(), 10),
            min: parseInt($el.find('.card-roll-input-min').val(), 10),
            max: parseInt($el.find('.card-roll-input-max').val(), 10),
            value: parseInt($el.find('.card-roll-input-value').val(), 10),
            userSeeds: JSON.parse($el.find('.card-roll-input-user-seeds').val() || '[]'),
            systemSeed: parseInt($el.find('.card-roll-input-system-seed').val(), 10)
        };
        this.bp.open('ramblor', { roll: rollData }); // Open Ramblor with roll data
    });
}