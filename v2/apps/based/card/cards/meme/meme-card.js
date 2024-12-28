export default function applyData(el, data) {
    const $el = $(el);
    $el.find('.meme-title').text(data.title);
    $el.find('.meme-details').html(`Levenshtein: ${data.levenshtein} Jaro Winkler: ${data.winkler}`);
    $el.find('.meme-image').attr('src', `/memes/${data.filename}`);
  
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
  