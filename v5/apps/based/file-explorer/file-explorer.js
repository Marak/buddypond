import handleDrop from "./lib/handleDrop.js";
import FileTree from "../file-tree/file-tree.js";
import FileUploadOverlay from "./FileUploadOverlay.js";
export default class FileExplorer {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');



        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/file-explorer/file-explorer.css');

        // fetches html from the fragment and returns it as a string
        let html = await this.bp.load('/v5/apps/based/file-explorer/file-explorer.html');


        let exampleWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'file-explorer',
            title: 'File Explorer',
            app: 'file-explorer',
            x: 50,
            y: 100,
            width: 400,
            height: 300,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            content: html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });

        exampleWindow.container.classList.add('has-droparea');



        let ft = new FileTree(this.bp, {});
        await ft.init();
        let fileTreeHolder = $('.bp-file-explorer-tree', exampleWindow.content);
        fileTreeHolder.html('');
        this.fileTree = ft.create(fileTreeHolder[0], {
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






        // Usage:
        this.uploadOverlay = new FileUploadOverlay(async (file, onProgress)=>{
            // upload file here
            console.log("uploading file", file);
            await this.bp.apps.client.api.uploadFile(file, onProgress);
        });
        this.uploadOverlay.hide();




        return 'loaded File Explorer';
    }

}

FileExplorer.prototype.handleDrop = handleDrop;