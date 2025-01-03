export default class DropArea {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.dropTarget = null; // Initialize with null to ensure proper targeting
        this.dropInfoBar = this.createDropInfoBar(); // Create the UI element for displaying drop information
    }

    // Create a UI bar at the top of the document
    createDropInfoBar() {
        const bar = document.createElement('div');
        bar.style.position = 'fixed';
        bar.style.top = '0';
        bar.style.left = '0';
        bar.style.width = '100%';
        bar.style.height = '120px';
        bar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        bar.style.color = 'white';
        bar.style.display = 'none'; // Start hidden
        bar.style.alignItems = 'center';
        bar.style.justifyContent = 'center';
        bar.style.zIndex = '1000';
        bar.style.padding = '10px';
        document.body.appendChild(bar);
        return bar;
    }

    // Called from parent bp app
    async init() {
        this.bp.log('Hello from DropArea');
        this.setupListeners();
        return 'DropArea loaded';
    }

    setupListeners() {
        document.addEventListener('dragover', this.handleDragOver.bind(this), false);
        document.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
        document.addEventListener('drop', this.handleDrop.bind(this), false);
        document.addEventListener('dragend', this.handleDragEnd.bind(this), false);
        document.addEventListener('mouseleave', this.handleDragLeave.bind(this), false);
    }

    handleDragOver(event) {
        event.preventDefault(); // Prevent default behavior (prevent file from being opened)
        this.dropInfoBar.style.display = 'flex'; // Show the info bar

        let targetElement = event.target;
        // Traverse up the DOM
        while (targetElement && !targetElement.classList.contains('has-droparea')) {
            if (targetElement === document.body) {
                targetElement = null;
                break;
            }
            targetElement = targetElement.parentNode;
        }

        // Update the visual state and drop information
        if (targetElement !== this.dropTarget) {
            if (this.dropTarget) {
                this.dropTarget.style.border = ''; // Remove border from old drop target
            }
            if (targetElement) {
                targetElement.style.border = '2px dashed #f0f'; // Apply border to new drop target
                this.updateDropInfoBar(event, targetElement);
            }
            this.dropTarget = targetElement; // Update current drop target
        } else if (targetElement) {
            this.updateDropInfoBar(event, targetElement);
        }
    }

    updateDropInfoBar(event, targetElement) {
        const files = Array.from(event.dataTransfer.files).map(f => f.name).join(', ');
        console.log("Files during drag:", event.dataTransfer.files);

        // Gather data attributes from the target element
        let targetData = {
            id: targetElement.id || 'None',
            app: targetElement.dataset.app || 'None',
            type: targetElement.dataset.type || 'None',
            context: targetElement.dataset.context || 'None'
        };
        console.log('Target Data:', targetData);

        // Build a string to display optional data attributes
        let dataAttributes = `
            <strong>ID:</strong> ${targetData.id}<br>
            <strong>App:</strong> ${targetData.app}<br>
            <strong>Type:</strong> ${targetData.type}<br>
            <strong>Context:</strong> ${targetData.context}`;

        // Update the innerHTML of the dropInfoBar to include targetData
        this.dropInfoBar.innerHTML = `
            <strong>Target:</strong> ${targetElement.className || 'None'}<br>
            <strong>Files:</strong> ${files || 'None'}<br>
            ${dataAttributes}`;
    }


    async handleDrop(event) {
        event.preventDefault();
        if (this.dropTarget && event.target === this.dropTarget) {
            this.triggerDropAreaHandler(event);
        }
        console.log('Files dropped:', event.target, event.dataTransfer.files);
        // TODO: this should be on the EE for buddylist
        // check to see if the target.id was "mainOverlay"
        if (!this.dropTarget || this.dropTarget.id === 'mainOverlay') {
            // open the file viewer
            await this.bp.open('file-viewer');
        } else {
            let targetId = this.dropTarget.id;
            let targetElement = $(this.dropTarget);
            let targetApp = targetElement.data('app');
            let targetType = targetElement.data('type');
            let targetContext = targetElement.data('context');




            if (targetApp === 'buddylist') {


                // insert a div above the .aim-input div
                // this should be a preview of the file
                let preview = document.createElement('div');
                preview.innerHTML = 'File Preview';
                preview.classList.add('file-preview');
                preview.style.border = '1px solid #f0f';
                preview.style.padding = '10px';
                preview.style.margin = '10px';
                preview.style.backgroundColor = '#f0f';
                preview.style.color = '#fff';
                preview.style.fontWeight = 'bold';
                preview.style.textAlign = 'center';

                let aimInput = $('.aim-input', this.dropTarget);

                for (let i = 0; i < event.dataTransfer.files.length; i++) {
                    let file = event.dataTransfer.files[i];

                    let fileType = file.type;
                    console.log("check file type", fileType);
                    const fileCategory = buddypond.getFileCategory(fileType);
                    if (fileCategory === 'binary') {
                        // not supported yet
                        console.error('uploading binary files not supported yet...');

                    } else {
                        console.log('ffff', file)
                        let fileViewerPreview = this.bp.apps['file-viewer'].displaySingleFile(file, preview);
                        aimInput.before(preview);

                    }


                }



            }

            //alert('Dropped on ' + targetId);
        }

        this.bp.emit('ui::droparea::drop', event.dataTransfer.files);
        this.clearDropTarget();
    }

    handleDragLeave(event) {
        if (event.target === document.documentElement || event.target === document.body) {
            this.clearDropTarget();
        }
    }

    handleDragEnd(event) {
        this.clearDropTarget();
    }

    clearDropTarget() {
        if (this.dropTarget) {
            this.dropTarget.style.border = '';
            this.dropTarget = null;
        }
        this.dropInfoBar.style.display = 'none'; // Hide the info bar
    }

    triggerDropAreaHandler(event) {
        console.log('Files dropped:', event.dataTransfer.files);
        // Implement custom handling logic here
    }
}
