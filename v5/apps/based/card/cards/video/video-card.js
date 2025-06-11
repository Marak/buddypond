export default function applyData(el, data) {
    const $el = $(el);
    const { url } = data || {};
    // console.log('Video card data', { url });

    // replace the URL in the message text since the video card will handle it as embed
    // this allows a message with a video URL to be sent without the URL showing up in the chat
    data.message.text = data.message.text.replace(url, '');

    // Show loading state
    $el.find('.card-video-loading').show();
    $el.find('.card-video-content, .card-video-error').addClass('card-video-hidden');

    // Supported video MIME types
    const validMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/x-matroska'];

    // Check URL with HEAD request
    fetch(url, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const contentType = response.headers.get('content-type')?.toLowerCase();
            if (!validMimeTypes.some(type => contentType.includes(type))) {
                throw new Error('Unsupported video format');
            }
            return url;
        })
        .then(videoUrl => {
            // Set video source
            const $video = $el.find('.card-video-player');
            $video.attr('src', videoUrl);
            // Show video
            $el.find('.card-video-loading').hide();
            $el.find('.card-video-content').removeClass('card-video-hidden');
        })
        .catch(error => {
            console.error('Video card error:', error.message);
            showError($el, error.message.includes('Unsupported') ? 'Unsupported video format' : 'Unable to load video');
        });

    // Helper to show error
    function showError($el, message) {
        $el.find('.card-video-loading').hide();
        const $error = $el.find('.card-video-error');
        $error.find('.card-video-error-message').text(message);
        $error.removeClass('card-video-hidden');
    }
}