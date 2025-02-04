export default function applyData(el, data) {
    const $el = $(el);
    $el.find('.card-url-url').text(data.url);
    $el.find('.card-url-url').attr('href', data.url);
    /* shows as 
        {"generation":1,"min":1,"max":20,"value":7,"userSeeds":[],"systemSeed":8069203912237819}
    */

    $el.find('.card-roll-info').html(JSON.stringify(data.roll));
    // opens in new tab
    // TODO: open in youtube app
    $el.find('.card-url-url').attr('target', '_blank');
  }