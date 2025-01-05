import handleDrop from "./lib/handleDrop.js";
import FileTree from "./FileTree/FileTree.js";
import FileUploadOverlay from "./FileUploadOverlay.js";

export default class FileExplorer {
    constructor(bp) {
        this.bp = bp;
    }


    async init() {

        this.html = await this.bp.load('/v5/apps/based/file-explorer/file-explorer.html');

        await this.bp.load('/v5/apps/based/file-explorer/file-explorer.css');


        this.fileTreeInstance = new FileTree(this.bp, {});

        await this.fileTreeInstance.init();

        this.fileTree = this.fileTreeInstance;

        return 'loaded file explorer';
    }

    create(options = {}) {

        let container = document.createElement('div');
        container.innerHTML = this.html;
        container.classList.add('bp-file-explorer');

        let fileTreeHolder = $('.bp-file-explorer-tree', container);
        fileTreeHolder.html('');
        this.fileTree = this.fileTreeInstance.create(fileTreeHolder[0], {
            onFileSelect: (filePath, target) => {
                this.loadFile(filePath);
            },
            onFolderToggle: (folderPath, isExpanded) => {
                console.log('Folder toggled:', folderPath, isExpanded);
            }
        });

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

        this.uploadOverlay = new FileUploadOverlay(container, async (file, onProgress)=>{
            // upload file here
            console.log("uploading file", file);
            await this.bp.apps.client.api.uploadFile(file, onProgress);
        });
        this.uploadOverlay.hide();
        this.container = container;

        return this;


    }

}


FileExplorer.prototype.handleDrop = handleDrop;