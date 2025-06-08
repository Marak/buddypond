export default class FileViewer {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        this.supportedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
        this.supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        this.supportedTextTypes = ['text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json'];
        this.fileCache = new Map(); // Add a cache for the original files

        return this;
    }

    async init() {
        this.bp.log('Initializing FileViewer');
        await this.bp.load('/v5/apps/based/file-viewer/file-viewer.css');
        this.html = await this.bp.load('/v5/apps/based/file-viewer/file-viewer.html');

        return 'FileViewer loaded';
    }

    async open() {
        this.fileViewerWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'file-viewer',
            title: 'File Viewer',
            x: 50,
            y: 100,
            width: 800,
            height: 600,
            minWidth: 400,
            minHeight: 300,
            icon: 'desktop/assets/images/icons/icon_file-viewer_64.png',
            parent: $('#desktop')[0],
            content: this.html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });
        this.updateDropTargets();
        this.initializeEventListeners();
        //$('.fileviewer-target', this.fileViewerWindow.content).flexHide(); // for now
        // this.initializeTabs();
        new this.bp.apps.ui.Tabs(this.fileViewerWindow.content);

        // hide these features for now
        $('.fileviewer-upload-cloud', this.fileViewerWindow.content).hide();
        $('.fileviewer-target', this.fileViewerWindow.content).hide();
    }

    initializeEventListeners() {
        this.bp.on('ui::droparea::drop', 'show-file-in-viewer', (files) => {
            if (files && files.length > 0) {
                this.displayFiles(files);
            }
            $('#fileviewer-viewer').flexShow();

        });

        this.bp.on('window::open', 'update-the-drop-targets', () => this.updateDropTargets());
        this.bp.on('window::close', 'update-the-drop-targets', () => this.updateDropTargets());

        // Add click handler for target app selection
        $(this.fileViewerWindow.content).find('.fileviewer-target-app').on('change', (e) => {
            const targetAppId = e.target.value;
            if (targetAppId) {
                this.sendToApp(targetAppId);
            }
        });

        $('.fileviewer-upload', this.fileViewerWindow.content).on('click', () => {


            this.uploadToCloud();
        });
    }

    initializeTabs() {
        const tabContainer = $(this.fileViewerWindow.content).find('.tabs-container');
        const tabs = tabContainer.find('.tab-list li a');
        const contents = tabContainer.find('.tab-content');

        contents.hide();
        contents.first().show();
        tabs.first().addClass('active');

        tabs.on('click', (e) => {
            e.preventDefault();
            const target = $(e.target).attr('href');

            tabs.removeClass('active');
            $(e.target).addClass('active');

            contents.hide();
            $(target).show();
        });
    }

    async displayFiles(files) {
        const viewerContainer = $(this.fileViewerWindow.content).find('.fileviewer-file');
        const metadataContainer = $(this.fileViewerWindow.content).find('#fileviewer-meta');

        viewerContainer.empty();
        metadataContainer.html('<h1>File Metadata</h1>');

        for (let file of files) {

            await this.displaySingleFile(file, viewerContainer);
            this.displayMetadata(file, metadataContainer);
        }

        this.fileViewerWindow.title = files.length === 1 ?
            `Viewing: ${files[0].name}` :
            `Viewing ${files.length} files`;
    }

    async displaySingleFile(file, container) {
        const fileContent = document.createElement('div');
        fileContent.className = 'file-content';

        // Generate a unique ID for this file
        const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        file.id = fileId;
        console.log('using file id', fileId);
        this.fileCache.set(fileId, file);

        

        // Store the original file object as a property
        fileContent.dataset.filename = file.name;
        fileContent.dataset.filetype = file.type;
        fileContent.dataset.filesize = file.size;
        fileContent.dataset.fileId = file.id;

        if (this.supportedImageTypes.includes(file.type)) {
            const img = document.createElement('img');
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;
            img.onload = () => {
                // Instead of revoking, store the blob URL
                fileContent.dataset.blobUrl = objectUrl;
            };
            fileContent.appendChild(img);
        } else if (this.supportedAudioTypes.includes(file.type)) {
            const audio = document.createElement('audio');
            audio.controls = true;
            console.log("OMGaudio", file);
            const objectUrl = URL.createObjectURL(file);
            console.log('objectUrl', objectUrl);
            audio.src = objectUrl;
            fileContent.dataset.blobUrl = objectUrl;
            fileContent.appendChild(audio);
        } else if (this.supportedVideoTypes.includes(file.type)) {
            const video = document.createElement('video');
            video.controls = true;
            const objectUrl = URL.createObjectURL(file);
            video.src = objectUrl;
            fileContent.dataset.blobUrl = objectUrl;
            fileContent.appendChild(video);
        } else if (this.supportedTextTypes.includes(file.type)) {
            try {
                const text = await file.text();
                const pre = document.createElement('pre');
                pre.textContent = text;
                fileContent.appendChild(pre);
                // Store text content directly
                fileContent.dataset.textContent = text;
            } catch (error) {
                fileContent.textContent = 'Error reading text file';
            }
        } else {
            fileContent.innerHTML = `
                <div class="binary-file">
                    <i class="file-icon"></i>
                    <p>Binary file: ${file.name}</p>
                    <p>Size: ${this.formatFileSize(file.size)}</p>
                    <p>Type: ${file.type || 'unknown'}</p>
                </div>
            `;
            // Store binary blob URL
            const objectUrl = URL.createObjectURL(file);
            fileContent.dataset.blobUrl = objectUrl;
        }


        // Add cleanup method
        fileContent.cleanup = () => {
            if (fileContent.dataset.blobUrl) {
                URL.revokeObjectURL(fileContent.dataset.blobUrl);
            }
        };

        container.append(fileContent);
    }

    displayMetadata(file, container) {
        const metadata = document.createElement('div');
        metadata.className = 'file-metadata';

        const metadataList = document.createElement('dl');
        const addMetadata = (term, definition) => {
            const dt = document.createElement('dt');
            const dd = document.createElement('dd');
            dt.textContent = term;
            dd.textContent = definition;
            metadataList.appendChild(dt);
            metadataList.appendChild(dd);
        };

        addMetadata('Name', file.name);
        addMetadata('Size', this.formatFileSize(file.size));
        addMetadata('Type', file.type || 'unknown');
        addMetadata('Last Modified', new Date(file.lastModified).toLocaleString());

        metadata.appendChild(metadataList);
        container.append(metadata);
    }

     // Method to get the original file
     getFile(fileContent) {
        console.log('fileContent', fileContent);
        const fileId = fileContent.dataset.fileId;
        return this.fileCache.get(fileId);
    }
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    updateDropTargets() {
        const select = $(this.fileViewerWindow.content).find('.fileviewer-target-app');
        select.empty();

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Select target app...';
        select.append(defaultOption);

        // Add all droparea targets
        $('.has-droparea').each((i, el) => {
            const option = document.createElement('option');
            option.value = el.id;
            option.text = el.id;
            select.append(option);

        });
    }

    async uploadToCloud () {
        // let files = this.fileViewerWindow.content.querySelectorAll('.file-content');

        // TODO: implement this ability to upload files to the cloud from file viewer
        const files = [];
        const filePreviews = $('.fileviewer-file', this.fileViewerWindow.content);
        // Collect all files first
        filePreviews.each((_, filePreview) => {
            $('.file-content', filePreview).each((_, fileContent) => {
                const file = this.bp.apps['file-viewer'].getFile(fileContent);
                if (file) {
                    files.push(file);
                }
            });
        });
    



        await buddypond.uploadFiles(files);
    }

    sendToApp(targetAppId) {
        const fileContents = this.fileViewerWindow.content.querySelectorAll('.file-content');
        fileContents.forEach(content => {
            const originalFile = this.getFile(content);
            console.log('sending file', originalFile);
            if (originalFile) {
                // TODO:
                /*
                this.bp.sendFile({
                    type: 'pond', // TOOD: hardcoded?
                    name: targetAppId,
                    text: 'Sending file: ' + originalFile.name,
                    file: originalFile
                });
                */
            }
        });
    }
}