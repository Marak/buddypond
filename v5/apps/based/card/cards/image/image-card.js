export default function applyData(el, data, cardClass, parentWindow) {
    const $el = $(el);
    // add onload event to image
    $el.find('.image-image').on('load', function () {
        // remove loading class
        // $el.removeClass('loading');
        // remove loading spinner
        // $el.find('.loading-spinner').remove();
        $('.aim-chat-area', parentWindow.content).scrollTop(99999999)
    });
    $el.find('.image-image').attr('src', data.url);
  
    $el.find('.remixGif').data('output', data.message.type);
    $el.find('.remixGif').data('context', data.message.to);

    $el.find('.remixPaint').data('output', data.message.type);
    $el.find('.remixPaint').data('context', data.message.to);

  }