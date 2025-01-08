export default function applyData(el, data) {
    let soundUrl = data.url;

    // Assuming data has properties like `title` and `soundURL`
    $(el).find('.card-title').text(data.title);
    $(el).find('.audio-player').attr('src', soundUrl);
}