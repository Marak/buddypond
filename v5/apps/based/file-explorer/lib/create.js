import FileUploadOverlay from "../FileUploadOverlay.js";


export default function create(options = {}) {

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

    this.uploadOverlay = new FileUploadOverlay({ parent: container, fileExplorer: this }, async (file, onProgress) => {
        // upload file here
        // console.log("uploading file", file);
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
