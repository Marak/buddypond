export default function applyData(el, data) {
    const $el = $(el);
    $el.find('.card-url-url').text(data.url);
    $el.find('.card-url-url').attr('href', data.url);

    $el.find('.card-youtube-thumbnail img').attr('src', data.thumbnail);

    $el.find('.card-youtube-card').click(() => {
      this.bp.open('youtube', {
        context: data.context
      })
    });
    $.getJSON(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${data.context}&format=json`, function(data) {
      $el.find('.card-youtube-title').text(data.title);
      $el.find('.card-youtube-author').text(data.author_name);
      // description
      $el.find('.card-youtube-description').text(data.description);
    })
    $el.find('.card-url-url').attr('target', '_blank');
}