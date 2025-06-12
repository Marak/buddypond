/* image-search.js - Marak Squires 2025 - BuddyPond */
export default class ImageSearch {
    constructor(bp, config = {}) {
        this.bp = bp;
        this.context = null;
        this.output = null;
    }

    async init() {

        this.html = await this.bp.load('/v5/apps/based/image-search/image-search.html');
        await this.bp.appendCSS('/v5/apps/based/image-search/image-search.css');
        this.bp.searchImages = async (query, numResults = 6) => {
            return await this.fetchImages(query, numResults);
        };
        this.bp.searchImage = async (query) => {
            let imgs = await this.fetchImages(query, 10);
            return imgs[Math.floor(Math.random() * imgs.length)];
        };
    }

    async open(options = {}) {
        if (options.context) {
            this.context = options.context;
        }
        if (options.output) {
            this.output = options.output;
        }
        // console.log("Opening image search window with options:", options);
        if (!this.imageSearchWindow) {

            this.imageSearchWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'image-search',
                title: 'Search Images',
                icon: 'desktop/assets/images/icons/icon_image-search_64.png',
                x: 250,
                y: 75,
                width: 460,
                height: 500,
                minWidth: 400,
                minHeight: 300,
                parent: $('#desktop')[0],
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.imageSearchWindow = null; // Clear reference on close
                }
            });

            // ✅ Bind search form events
            const $form = $('#image-search-form');
            const $input = $('#image-search-input');
            const $results = $('#image-search-results');

            $form.on('submit', async (e) => {
                e.preventDefault();
                const query = $input.val().trim();
                if (!query) return;
                $results.empty(); // Clear previous results
                console.log("Searching for images with query:", query);

                // Fetch images from the API
                const images = await this.fetchImages(query, 12, $('#image-search-provider').val());

                if (images.error) {
                    $('#image-search-error').html(`<p>${images.error}</p>`);
                    $('#image-search-error').show();
                    console.error("Image search error:", images.error);
                    return;
                }

                if (images.length === 0) {
                    $('#image-search-error').html('<p>No images found.</p>');
                    $('#image-search-error').show();

                    return;
                }
                $('#image-search-error').hide();
                $('#image-search-error').html('');

                // $('.pexels-logo', this.imageSearchWindow.content).hide();
                
                images.forEach((url) => {
                    const $img = $(`<img src="${url}" style="width: 100%; cursor: pointer; border-radius: 4px;" />`);
                    $img.on('click', () => {
                        if (this.selectedImages.has(url)) {
                            this.selectedImages.delete(url);
                            // $img.css('border', 'none');
                        } else {
                            //$img.css('border', '3px solid #0f0');
                            this.selectedImages.add(url);
                            sendImageToChat.call(this);


                        }
                    });
                    $results.append($img);
                });

            });

            this.selectedImages = new Set(); // inside constructor or open()

            async function sendImageToChat() {

                let windowIdPrefix = this.output === 'pond' ? 'pond_message_-' : 'buddy_message_-';

                let windowId = windowIdPrefix + this.context;
                // console.log('opening chat window ', windowId)
                let chatWindow = this.bp.apps.ui.windowManager.getWindow(windowId);


                console.log(`context: ${this.context}, type: ${this.type}`);
                console.log('chatWindow', chatWindow);
                const files = [];

                for (let url of this.selectedImages) {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    let filename = url.split('/').pop().split('?')[0]; // crude filename
                    // create new file name as timestamp + original filename
                    filename = `${Date.now()}_${filename}`;
                    const file = new File([blob], filename, { type: blob.type });
                    files.push(file);
                    // remove the image from the selectedImages set
                    this.selectedImages.delete(url);
                }

                if (files.length === 0) return;

                // Simulate a drop event to reuse the drop handler
                const dt = new DataTransfer();
                files.forEach(file => dt.items.add(file));

                this.bp.apps.droparea.dropTarget = chatWindow.container; // set the drop target to the active window
                const event = new DragEvent('drop', {
                    dataTransfer: dt,
                    bubbles: true,
                    cancelable: true,
                    // target: activeWindow // not working?
                });

                chatWindow.container.dispatchEvent(event);
                // focus the active chat window
                if (chatWindow) {

                    let id = $(chatWindow).attr('id');
                    this.bp.apps.ui.windowManager.focusWindow(id);


                    //  activeWindow.focus();
                } else {
                    console.warn("No active chat window found to send images to.");
                }

            }
        }

        if (options.provider) {
            $('#image-search-provider', this.imageSearchWindow.content).val(options.provider);

            if (options.provider === 'pexels') {
                $('.pexels-logo', this.imageSearchWindow.content).flexShow();
                $('.giphy-logo', this.imageSearchWindow.content).hide();

            } else {
                $('.pexels-logo', this.imageSearchWindow.content).hide();
                $('.giphy-logo', this.imageSearchWindow.content).flexShow();
            }
        }

        // focus the input field
        $('#image-search-input', this.imageSearchWindow.content).focus();

        $('#image-search-provider', this.imageSearchWindow.content).on('change', (e) => {
            // toggle the logos
            const provider = e.target.value;
            if (provider === 'pexels') {
                $('.pexels-logo', this.imageSearchWindow.content).show();
                $('.giphy-logo', this.imageSearchWindow.content).hide();
            } else {
                $('.pexels-logo', this.imageSearchWindow.content).hide();
                $('.giphy-logo', this.imageSearchWindow.content).show();
            }

            // if search bar is not empty, re-fetch images
            const query = $('#image-search-input', this.imageSearchWindow.content).val().trim();
            if (query) {
                $('#image-search-form', this.imageSearchWindow.content).trigger('submit');
            }
        });
        return this.imageSearchWindow;
    }

    async fetchImages(query, numResults = 12, provider = 'pexels') {
        try {
            const _provider = provider || $('#image-search-provider').val() || 'google';
            const url = `${buddypond.imageSearchEndpoint}/image-search?q=${encodeURIComponent(query)}&num=${numResults}&provider=${_provider}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.bp.qtokenid}`, // Use your actual token
                    'X-Me': this.bp.me // Use your actual user identifier
                }
            });
            if (!response.ok) {
                throw new Error(`Image search failed: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.warn("ImageSearch error:", err);
            return [];
        }
    }

}
