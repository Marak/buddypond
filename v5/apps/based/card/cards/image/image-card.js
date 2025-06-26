export default function applyData(el, data, cardClass, parentWindow) {
    const $el = $(el);

    // replace the URL in the message text since the image card will handle it as embed
    // this allows a message with an image URL to be sent without the URL showing up in the chat
    data.message.text = data.message.text.replace(data.url, '');

    // add onload event to image
    $el.find('.image-image').on('load', function () {
        // remove loading class
        // $el.removeClass('loading');
        // remove loading spinner
        // $el.find('.loading-spinner').remove();
        if (cardClass.bp && cardClass.bp.apps && cardClass.bp.apps.buddylist) {
            cardClass.bp.apps.buddylist.scrollToBottom(parentWindow.content);
        }
    });
    $el.find('.image-image').attr('src', data.url);
  
    // $el.find('.remixGif').data('output', data.message.type);
    // $el.find('.remixGif').data('context', data.message.to);

    // TODO: replace this with data.message.chatId in the future
    if (data.message.type === 'pond') {
        $el.find('.remixPaint').data('output', data.message.type);
        $el.find('.remixPaint').data('context', data.message.to);
    } else {
        $el.find('.remixPaint').data('output', data.message.type);
        // Remark: Temporary solution to get context for legacy paint app
        // In the future we can simply user the chatId to get the correct target context
        if (data.message.from === this.bp.me) {
            $el.find('.remixPaint').data('context', data.message.to);
        } else {
            $el.find('.remixPaint').data('context', data.message.from);
        }
    }

  }