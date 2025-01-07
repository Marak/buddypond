import handleDrop from "./lib/handleDrop.js";
import FileTree from "./FileTree/FileTree.js";
import FileUploadOverlay from "./FileUploadOverlay.js";

export default class FileExplorer {
    constructor(bp, options = {}) {
        this.bp = bp;

        if (!options.fileTree) {
            options.fileTree = {};
        }

        this.options = options;

        // root path
        this.currentSelectedNode = {
            id: ""
        };
    }


    async init() {

        this.html = await this.bp.load('/v5/apps/based/file-explorer/file-explorer.html');

        await this.bp.load('/v5/apps/based/file-explorer/file-explorer.css');

        let bytes = await this.bp.importModule('/v5/apps/based/file-explorer/lib/bytes.js', {}, false);
        this.bytes = bytes.default;


        this.fileTreeInstance = new FileTree(this.bp, this.options.fileTree);

        await this.fileTreeInstance.init();

        this.fileTree = this.fileTreeInstance;


        $(document).on('click', (e) => {
            // check to see if target was '.bp-file-explorer-item'
            let target = $(e.target);
            if (target.hasClass('bp-file-explorer-column')) {

                let parent = target.parent();

                let type = parent.data('type');
                let name = parent.data('name');
                let size = parent.data('size');
                let date = parent.data('date');
                let path = parent.data('path');
                console.log('clicked', type, path);


                // update the .bp-file-explorer-address-input with the folder path
                $('.bp-file-explorer-address-input').val('/' + path);

                if (type === 'folder') {
                    // open folder
                    console.log('open folder', type, path);
                    // TODO: path is the node.js from the jsTree
                    // we need to get that node reference and get its children
                    //let node = this.fileTree.getNode(path);
                    let instance = $('#jtree').jstree(true);
                    let node = instance.get_node(path);
                   

                    let contents = node.children;
                    console.log('111 showing contents of folder', node.id, contents);

                    // go through each child and get their node data from jstree
                    contents = contents.map(child => {
                        let childNode = instance.get_node(child);
                        return {
                            name: childNode.text,
                            type: childNode.children.length > 0 ? 'folder' : 'file',
                            path: childNode.id
                        };
                    });
                    console.log('222 showing contents of folder', node.id, contents);
                    // update the .bp-file-explorer-address-input with the folder path
                    $('.bp-file-explorer-address-input').val('/' + node.id);

                    this.renderFolderContents(contents);

                    $('.bp-file-explorer-file-viewer').hide();
                    $('.bp-file-explorer-files').show();
                    $('.bp-file-explorer-drag-upload').flexShow();





                } else {
                    // open file
                    console.log('open file', type);
                    this.showFile(this.bp.me, path);
                    $('.bp-file-explorer-drag-upload').hide();

                    //this.showFile('/v5/apps/based/file-explorer/files', name);
                }
            }
        });

        return 'loaded file explorer';
    }

    create(options = {}) {

        let container = document.createElement('div');
        container.innerHTML = this.html;
        container.classList.add('bp-file-explorer');
        /*
        let fileTreeHolder = $('.bp-file-explorer-tree', container);
        fileTreeHolder.html('');
        this.fileTree = this.fileTreeInstance.create(fileTreeHolder[0], this.options.fileTree);

        this.fileTree.render([
            {
                name: 'index.html',
                type: 'file',
            },
            {
                name: 'style.css',
                type: 'file',
            },
            {
                name: 'script.js',
                type: 'file',
            },
            {
                name: 'images',
                type: 'folder',
                children: [
                    {
                        name: 'logo.png',
                        type: 'file',
                    },
                    {
                        name: 'background.jpg',
                        type: 'file',
                    },
                ]
            }
        ]);
        */

        this.uploadOverlay = new FileUploadOverlay({parent: container, fileExplorer: this }, async (file, onProgress) => {
            // upload file here
            console.log("uploading file", file);
            await this.bp.apps.client.api.uploadFile(file.file, onProgress);
        });
        this.uploadOverlay.hide();
        this.container = container;

        // TODO
        /*
        $('.bp-file-explorer-sidebar').resizable({
            handles: 'e' // 'e' stands for east, i.e., the right side
        });
        */

        $('.bp-file-explorer-address-input', this.container).on('keyup', (e) => {
            // check to see if we matched a node in the jstree
            // if so, load the contents of that node
            // check on each keyup
            let path = $('.bp-file-explorer-address-input').val();
            this.renderPathContents(path);
        });


        return this;


    }

    async showFile(root, file, showEditor = false) {

        $('.bp-file-explorer-file-viewer').show();
        $('.bp-file-explorer-files').hide();


        let supportedEditorTypes = ['js', 'json', 'html', 'css', 'txt'];

        // check to see if the file is a supported editor type
        let ext = file.split('.').pop();
        if (supportedEditorTypes.includes(ext)) {
            showEditor = true;
        }

        // show the file in the iframe

        if (!showEditor) {

            let fileViewerIframe = $('.bp-file-explorer-file-viewer-iframe', this.container);
            // set height and width of iframe
            fileViewerIframe.css('height', '500px');
            fileViewerIframe.css('width', '500px');
            let src = root + '/' + file;
            console.log('loading src', src);
            fileViewerIframe.attr('src', src);

            $('.bp-file-explorer-file-viewer-iframe').show();
            $('.bp-file-explorer-file-viewer-editor').hide();

        }

        if (showEditor) {
            // instead of loading the file in iframe, we will display its contents in the code editor

            // first we fetch the file contents using fetch
            let filePath = '/' + root + '/' + file;
            let fileCDN = 'https://files.buddypond.com';
            filePath = fileCDN + filePath;
            console.log("fetching filePath", filePath);
            let fileContents = await fetch(filePath);

            // now we will write the contents to the editor
            // for now just JSON.stringify the contents to .bp-file-explorer-file-viewer
            let fileText = await fileContents.text();
            console.log('setting file text', fileText);
            if (this.editor) {
                console.log('setting editor value', this.editor);
                this.editor.editor.setValue(fileText);
                this.editor.filePath = filePath;
            } else {
                let fileViewerEditor = $('.bp-file-explorer-file-viewer-editor', this.container);
                console.log("setting text content", fileText);
    
            }

            //fileViewerEditor.html('');
            //let pre = document.createElement('pre');
            //pre.textContent = await fileContents.text();
            //fileViewerEditor.append(pre);

            // show the iframe, hide the editor
            $('.bp-file-explorer-file-viewer-iframe').hide();
            $('.bp-file-explorer-file-viewer-editor').show();

        }


    }

    renderPathContents (path) {
        path = path.replace('/', '');
        let instance = $('#jtree').jstree(true);

        if (path === '') {
            path = this.bp.me;
        }
        console.log('searching for path', path);
        let node = instance.get_node(path);
        if (node) {
            console.log('found node', node);
            

            let type = node.children.length > 0 ? 'folder' : 'file';

            if (type === 'file') {
                this.showFile(this.bp.me, path);
                return;

            }

            this.currentSelectedNode = node;

            let contents = node.children;
            console.log('444 showing contents of folder', node.id, contents);

            // go through each child and get their node data from jstree
            contents = contents.map(child => {
                let childNode = instance.get_node(child);
                return {
                    name: childNode.text,
                    type: childNode.children.length > 0 ? 'folder' : 'file',
                    path: childNode.id
                };
            });
            console.log('5555 showing contents of folder', node.id, contents);
            // update the .bp-file-explorer-address-input with the folder path
            //$('.bp-file-explorer-address-input').val('/' + this.bp.me + '/' + node.id);



            this.renderFolderContents(contents);


        }

    }

    renderFolderContents(files) {

        // clear the bp-file-explorer-files div
        let filesContainer = $('.bp-file-explorer-files', this.container);
        filesContainer.html('');

        // iterate over the files and add them to the bp-file-explorer-files div
        for (let file of files) {
            // create using JS DOM API not string
            let item = document.createElement('div');
            item.classList.add('bp-file-explorer-item');
            item.dataset.type = file.type;
            item.dataset.name = file.name;
            item.dataset.size = file.size;
            item.dataset.date = file.date;
            item.dataset.path = file.path;
            console.log('file', file);
            let columns = ['name', 'size', 'type', 'date'];
            for (let column of columns) {
                let columnDiv = document.createElement('div');
                columnDiv.classList.add('bp-file-explorer-column');
                columnDiv.textContent = file[column];
                item.appendChild(columnDiv);
            }




            filesContainer.append(item);
        }

        $('.bp-file-explorer-file-viewer-iframe', this.content).hide();
        $('.bp-file-explorer-file-viewer-editor', this.content).hide();
        $('.bp-file-explorer-files', this.content).show();

    }

    async getUsage() {

        // get initial file usage
        let currentUsage = await this.bp.apps.client.api.getFileUsage();
        console.log('currentUsage', currentUsage);
        this.currentStorageUsage = currentUsage.usage;
        let storageLimit = 10000000; // 10mb
        let storageRemaining = storageLimit - currentUsage.usage;
        this.currentStorageRemaining = storageRemaining;

        $('.storageUsed', this.content).text(this.bytes(currentUsage.usage));
        $('.storageRemaining', this.content).text(this.bytes(storageRemaining));
}

}


FileExplorer.prototype.handleDrop = handleDrop;