export default class Chalkboard {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {
        return 'loaded Chalkbord';
    }

    async open(options = {}) {
        this.output = options.output;
        this.context = options.context;
        // console.log("Opening Chalkboard with options:", options);
        if (!this.chalkWindow) {
            this.chalkWindow = this.bp.window(this.window(options));

            // creates a new BroadcastChannel for the desktop
            this.bc = new BroadcastChannel("buddypond-desktop");
            // Listen for messages on the desktop channel
            this.bc.onmessage = async (event) => {
                // console.log('BroadcastChannel message received:', event.data);
                let app = event.data.app;

                // console.log(`received message from app: ${app}`);

                if (event.data.app === 'chalkboard' && event.data.action === 'save') {
                    // console.log('BroadcastChannel save action received', event.data);

                    let dataURL = event.data.image; // Remark: this was sent over a broadcast channel
                    // console.log('Data URL received:', dataURL);
                    let fileName = event.data.fileName || 'untitled.png';
                    let filePath = `paints/${fileName}`;

                    function srcToFile(src, fileName, mimeType) {
                        return (fetch(src)
                            .then(function (res) { return res.arrayBuffer(); })
                            .then(function (buf) { return new File([buf], fileName, { type: mimeType }); })
                        );
                    }

                    srcToFile(dataURL, fileName, 'image/png').then(async (file) => {

                        // Create File from Blob
                        //const file = new File([blob], fileName, { type: blob.type });
                        file.filePath = filePath;
                        console.log('File created:', file, file instanceof File);

                        // Test image display
                        const testImage = document.createElement('img');

                        // if we have no context or output, save the file locally
                        if (!this.context || !this.output) {
                            console.warn('No context or output specified, saving file locally.');
                            // Save the file locally
                            let link = document.createElement('a');
                            link.href = URL.createObjectURL(file);
                            link.download = fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            return;
                        }

                        let onProgress = (progress) => {
                            console.log(`Upload progress: ${progress}%`);
                        };

                        // ✅ Upload via buddypond API
                        try {
                            let resultingUrl = await buddypond.uploadFile(file, onProgress);
                            console.log('Upload successful:', resultingUrl);
                            let message = {
                                to: this.context,
                                from: bp.me,
                                type: this.output,
                                text: resultingUrl
                            };
                            console.log("sending multimedia message", message);
                            bp.emit('buddy::sendMessage', message);
                            // now take this image and send it to the chat window as url message
                        } catch (err) {
                            console.error('Upload failed:', err);
                        }
                    });

                }
            };

        }
        return this.chalkWindow;
    }

    window(options = {}) {
        return {
            id: 'chalkboard',
            title: 'Chalkboard',
            icon: 'desktop/assets/images/icons/icon_chalkboard_64.png',
            x: 250,
            y: 75,
            width: 600, // Increased width for two-column layout
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            iframeContent: '/v5/apps/based/chalkboard/vendor/chalkboard.html',
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onClose: () => {
                // this.bp.apps.ui.windowManager.destroyWindow('motd');
                this.chalkWindow = null; // Clear the reference to the window
                this.bc.close(); // Close the BroadcastChannel
            }
        }
    }
}