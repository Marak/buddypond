export default function applyData(el, data) {
    const $el = $(el);
    console.log("applyData", el, data)
    $el.find('.image-image').attr('src', data.url);
  
    $el.find('.remixGif').attr({
      'data-output': data.type,
      'data-context': data.to,
      'title': 'Remix in GIF Studio'
    });
  
    $el.find('.remixPaint').attr({
      'data-output': data.type,
      'data-context': data.to,
      'title': 'Remix in Paint'
    });
  }
  