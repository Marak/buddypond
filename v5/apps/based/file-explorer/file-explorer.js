import FileExplorerClass from "./FileExplorer.js";

export default class FileExplorer {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {

        this.bp.log('Hello from File Explorer');
  
        let fileExplorerInstance = new FileExplorerClass(this.bp);
        await fileExplorerInstance.init();

        this.fileExplorer = fileExplorerInstance.create();

        console.log('created explorer', this.fileExplorer);

        this.fileExplorerWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'file-explorer',
            title: 'File Explorer',
            app: 'file-explorer',
            x: 100,
            y: 50,
            width: 800,
            height: 600,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            content:  this.fileExplorer.container,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false
        });

        this.fileExplorerWindow.container.classList.add('has-droparea');

        this.handleDrop = this.fileExplorer.handleDrop.bind(this.fileExplorer);


        return 'loaded File Explorer';
    }

}