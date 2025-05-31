export default function applyData(el, data, cardClass, parentWindow) {
    const $el = $(el);
    console.log('ddddd', data)
    // add onload event to image
    $el.find('.card-error-message').html(data.message || 'An error occurred');

  }