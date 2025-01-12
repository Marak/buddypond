export default function applyData(el, data) {
    const $el = $(el);
    console.log("jjjj", data)
    $el.find('.image-image').attr('src', data.url);
  
    $el.find('.remixGif').data('output', data.message.type);
    $el.find('.remixGif').data('context', data.message.to);

    $el.find('.remixPaint').data('output', data.message.type);
    $el.find('.remixPaint').data('context', data.message.to);

    
  }