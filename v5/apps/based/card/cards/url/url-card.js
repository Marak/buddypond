export default function applyData(el, data) {
    const $el = $(el);
    $el.find('.card-url-url').text(data.url);
    $el.find('.card-url-url').attr('href', data.url);
    // opens in new tab
    // TODO: open in youtube app
    $el.find('.card-url-url').attr('target', '_blank');
  }