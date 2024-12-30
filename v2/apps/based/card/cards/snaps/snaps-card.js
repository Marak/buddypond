export default function applyData(el, data) {
    const $el = $(el);
    // let snapURL = `${desktop.filesEndpoint}/${data.snapURL}`;
    let snapURL = `${data.snapURL}`;
    let arr = snapURL.split('.');
    let ext = arr[arr.length - 1];
    console.log('applyData', snapURL, data);
    $el.find('.snap-image').attr('src', snapURL);
    //$el.find('.remixGif, .remixPaint').hide(); // Initially hide all controls
  
    $el.find('.remixGif').show().attr({
      'data-output': data.message.type,
      'data-context': data.message.context || data.message.to,
      'title': 'Remix in GIF Studio'
    });
    
    $el.find('.remixPaint').show().attr({
      'data-output': data.message.type,
      'data-context': data.message.context || data.message.to,
      'title': 'Remix in Paint'
    });
  }
  