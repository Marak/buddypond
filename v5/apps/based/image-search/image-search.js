/* image-search.js - Marak Squires 2025 - BuddyPond */


let defaultImageSearchEndpoint = ' http://192.168.200.59:9005';

export default class ImageSearch {
    constructor(bp, config = {}) {
        this.bp = bp;
        this.apiEndpoint = config.imageSearchEndpoint || defaultImageSearchEndpoint;
    }

    async init() {

        this.html = await this.bp.load('/v5/apps/based/image-search/image-search.html');
        this.bp.searchImages = async (query, numResults = 6) => {
            return await this.fetchImages(query, numResults);
        };
        this.bp.searchImage = async (query) => {
            let imgs = await this.fetchImages(query, 10);
            return imgs[Math.floor(Math.random() * imgs.length)];
        };
    }


    async open() {
        if (!this.imageSearchWindow) {

            this.imageSearchWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'image-search',
                title: 'Search Images',
                icon: 'desktop/assets/images/icons/icon_console_64.png',
                x: 250,
                y: 75,
                width: 600,
                height: 400,
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
                onclose: () => {
                    // optional cleanup
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
                const images = await this.fetchImages(query, 6);

                if (images.length === 0) {
                    $results.html('<p>No images found.</p>');
                    return;
                }

                images.forEach((url) => {
                    const $img = $(`<img src="${url}" style="width: 100%; cursor: pointer; border-radius: 4px;" />`);


                    $img.on('click', () => {
                        if (this.selectedImages.has(url)) {
                            this.selectedImages.delete(url);
                            $img.css('border', 'none');
                        } else {
                            this.selectedImages.add(url);
                            $img.css('border', '3px solid #0f0');
                        }
                    });


                    $results.append($img);
                });
            });

            this.selectedImages = new Set(); // inside constructor or open()



            $('#send-selected-images').on('click', async () => {
                const files = [];

                for (let url of this.selectedImages) {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const filename = url.split('/').pop().split('?')[0]; // crude filename
                    const file = new File([blob], filename, { type: blob.type });
                    files.push(file);
                }

                if (files.length === 0) return;

                // Simulate a drop event to reuse the drop handler
                const dt = new DataTransfer();
                files.forEach(file => dt.items.add(file));

                // get the active chat window
                // const activeWindow = this.bp.apps.ui.windowManager.getActiveWindow();
                // find the first element that has both classes .has-droparea and .chatWindow
                let activeWindow = document.querySelector('.has-droparea.chatWindow');
                console.log('Active chat window:', activeWindow);
                this.bp.apps.droparea.dropTarget = activeWindow; // set the drop target to the active window
                const event = new DragEvent('drop', {
                    dataTransfer: dt,
                    bubbles: true,
                    cancelable: true,
                    // target: activeWindow // not working?
                });

                activeWindow.dispatchEvent(event);
            });
        }
    }

    async fetchImages(query, numResults = 6) {
        try {
            const provider = $('#image-search-provider').val() || 'google';
            const url = `${this.apiEndpoint}/image-search?q=${encodeURIComponent(query)}&num=${numResults}&provider=${provider}`;
            console.log('ImageSearch: fetching from', url);

            const response = await fetch(url);
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
