export default function applyData(el, data) {

    // Helper to show content
    const showContent = ($el, metadata) => {
        console.log('showContent Website metadata:', metadata);
        $el.find('.card-website-loading').hide();
        const $content = $el.find('.card-website-content');
        $content.find('.card-website-link').attr('href', url);
        $content.find('.card-website-title').text(metadata.title || new URL(url).hostname);
        $content.find('.card-website-description').text(metadata.description || '');
        const $image = $content.find('.card-website-image');
        if (metadata.image) {
            $image.attr('src', metadata.image).show();
        } else {
            $image.hide();
        }
        $content.removeClass('card-website-hidden');
    };


    // Initialize cache
    buddypond.websiteCardCache = buddypond.websiteCardCache || {};
    const $el = $(el);
    const { url } = data || {};
    console.log('Website card data', { url });

    if (!url || !/^https?:\/\//i.test(url)) {
        showError($el, 'Invalid URL');
        return;
    }

    // Check cache
    if (buddypond.websiteCardCache[url]) {
        console.log('Using cached metadata for:', url);
        showContent($el, buddypond.websiteCardCache[url]);
        return;
    }

    // Show loading state
    $el.find('.card-website-loading').show();
    $el.find('.card-website-content, .card-website-error').addClass('card-website-hidden');

    // Check if URL is same-origin
    const isSameOrigin = url.startsWith(window.location.origin);

    // Helper to parse HTML for metadata
    const parseMetadata = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const getMeta = (property) => doc.querySelector(`meta[property="${property}"]`)?.content || '';
        const getMetaName = (name) => doc.querySelector(`meta[name="${name}"]`)?.content || '';
        return {
            title: getMeta('og:title') || doc.title || '',
            description: getMeta('og:description') || getMetaName('description') || '',
            image: getMeta('og:image') || getMetaName('twitter:image') || getMetaName('image') || ''
        };
    };

    // Helper to show error
    const showError = ($el, message) => {
        $el.find('.card-website-loading').hide();
        const $error = $el.find('.card-website-error');
        $error.find('.card-website-error-message').text(message);
        $error.removeClass('card-website-hidden');
    };

    // Try browser fetch for same-origin URLs
    if (isSameOrigin) {
        fetch(url, { method: 'GET' })
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.text();
            })
            .then(html => {
                // console.log('Fetched HTML:', html);
                const metadata = parseMetadata(html);
                // console.log('Parsed metadata:', metadata);
                // Cache metadata
                buddypond.websiteCardCache[url] = metadata;
                showContent($el, metadata);
            })
            .catch(() => {
                // Fall back to proxy for same-origin failures
                fetchProxy($el, url, parseMetadata, showContent, showError);
            });
    } else {
        // Use proxy for cross-origin URLs
        fetchProxy($el, url, parseMetadata, showContent, showError);
    }
}

// Helper to show fallback link
const showFallback = ($el, url) => {
    console.log('Showing fallback link for:', url);
    $el.find('.card-website-loading').hide();
    const $fallback = $el.find('.card-website-fallback');
    $fallback.find('.card-website-fallback-link')
        .attr('href', url)
        .text(new URL(url));
    $fallback.removeClass('card-website-hidden');
};

function fetchProxy($el, url, parseMetadata, showContent, showError) {
    console.log('Fetching via proxy:', url);
    let proxyUrl = `${buddypond.buddyProxy}/api/fetch-metadata?url=${encodeURIComponent(url)}`;
    console.log('Proxy URL:', proxyUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds

    fetch(proxyUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${buddypond.qtokenid}`,
            'x-me': buddypond.me
        },
        signal: controller.signal
    })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Proxy error');
            return response.json();
        })
        .then(metadata => {
            buddypond.websiteCardCache[url] = metadata;
            showContent($el, metadata);
        })
        .catch(err => {
            if (err.name === 'AbortError') {
                console.warn('Fetch aborted due to timeout');
            } else {
                console.error('Fetch error:', err);
            }
            showFallback($el, url);
        });
}
