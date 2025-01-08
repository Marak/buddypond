import FileExplorerClass from "./FileExplorer.js";
import getCloudFiles from "./lib/getCloudFiles.js";
import PadEditor from "../pad/PadEditor.js";

export default class FileExplorer {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {

        let mime = await this.bp.importModule('/v5/apps/based/file-explorer/lib/mime.js', {}, false);
        this.mime = mime.default;


        this.bp.log('Hello from File Explorer');
        //await this.bp.load('/v5/apps/based/file-explorer/FileTree/jsTree.css');
        await this.bp.load('https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css');

        this.fileExplorerInstance = new FileExplorerClass(this.bp, {
            fileTree: {
                onFileSelect: (filePath, target) => {
                    console.log('File selected:', filePath);
                },
                onFolderToggle: async (folderPath, isExpanded) => {
                    // display the contents of the folder in the main window
                    console.log("Folder toggled:", folderPath, isExpanded);
                    return;

                },
                onFolderSelect: async (folderPath, target) => {
                    console.log('Folder selected:', folderPath);


                }
            }
        });
        await this.fileExplorerInstance.init();


        return 'loaded File Explorer';
    }

    async create() {

        if (!this.fileExplorer) {
            this.fileExplorer = this.fileExplorerInstance.create();
            this.handleDrop = this.fileExplorer.handleDrop.bind(this.fileExplorer);
        }
        // TODO: move all this code to inside FileExplorer class
        // keep file-explorer app very minimal and just wrapper to FileExplorer class + optional windowing

        let defaultFileContent = {};

        let padEditorHolder = document.createElement('div');
        padEditorHolder.className = 'pad-editor-holder';
        $('.bp-file-explorer-file-viewer-editor', this.fileExplorer.content).append(padEditorHolder);

        this.fileExplorer.getUsage();
        const editor = new PadEditor(padEditorHolder, {
            bp: this.bp,
            // fileTree: fileTreeComponent, // Your file tree implementation
            files: [],
            getFileContent: (filePath) => {
                // Your logic to get file content
                return defaultFileContent[filePath];
            },
            onEdit: (content) => {
                // hide the preview and show the code editor
                $('.editor-content').flexShow();
                //$('.myProfile').flexHide();

                // show the Update and Cancel buttons
                $('.pad-editor-button-update').show();
                $('.pad-editor-button-cancel').show();

            },

            onDelete: async (filePath) => {
                let relativePath = filePath.replace('https://files.buddypond.com/' + this.bp.me + '/', '');
                console.log('relativePath', relativePath);
                try {
                    await this.bp.apps.client.api.removeFile(relativePath);
                    // at this point we have confirmd with server that file is being deleted
                    // we should immediately remove the file from the file tree
                    let tree = $('#jtree').jstree(true);
                    // let localPath = filePath.replace('https://files.buddypond.com/', '');
                    console.log('looking for node with path', relativePath);
                    let node = tree.get_node(relativePath);
                    console.log('found node', node);
                    tree.delete_node(node);
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
            },

            onUpdate: async (filePath, content) => {
                console.log("onUpdate", filePath, content);

                let relativePath = filePath.replace('https://files.buddypond.com/' + this.bp.me + '/', '');
                console.log('relativePath', relativePath);
                console.log("MIMMMMME", this.mime);

                let mimeType = this.mime.getType(relativePath);
                console.log('using mimeType', mimeType);

                // Assuming 'content' is a string, we need to convert it to a Blob, then to a File
                const blob = new Blob([content], { type: mimeType });  // Adjust the MIME type as necessary

                // Creating a File object from the Blob
                const file = new File([blob], relativePath.split('/').pop(), {
                    type: blob.type,
                    lastModified: new Date()  // You might need to adjust this if you have specific requirements
                });
                file.filePath = relativePath;

                console.log('going to upload file', file);

                // Assuming uploadFile() expects a standard File type object
                try {
                    await this.bp.apps.client.api.uploadFile(file);
                } catch (err) {
                    alert('Error uploading file: ' + err.message);
                }

                this.fileExplorer.getUsage();

                this.bp.emit('file-explorer::update', {
                    path: relativePath,
                });

            },

            onPreview: (content) => {
                // hide the code editor and show the preview .myProfile
                //$('.editor-content').flexHide();
                //editor.togglePreview(true);



                console.log("onPreview", content);
                // replace <script src="pad.js"></script> with the content of pad.js
                //let almostApp = content.replace('<script src="pad.js"></script>', '<script>' + defaultFileContent['/myprofile/pad.js'] + '</script>');
                // do the same for the style.css
                //almostApp = almostApp.replace('<link rel="stylesheet" href="style.css">', '<style>' + defaultFileContent['/myprofile/style.css'] + '</style>');

                //editor.updatePreview(almostApp);
                //$('.myProfile').flexShow();
            },
            onCancel: () => {
                console.log('Cancel clicked');
                // hide the Update and Cancel buttons
                $('.pad-editor-button-update').hide();
                $('.pad-editor-button-cancel').hide();
                // hide the code editor and show the preview
                $('.pad-editor-button-preview').click();

            }
        });

        this.editor = editor;

        await editor.init();

        // set the editor in the file explorer
        this.fileExplorer.editor = editor;

        // load the content of the first file
        //editor.loadFile('/myprofile/index.html');

        // set the height of the editor
        editor.editorContainer.style.height = '600px';
        // this.editor.previewFrame.setContent(buddyProfilePad.content);


        // get the latest cloud files to populate the file explorer
        let cloudFiles = await this.getCloudFiles('', 6); // hard-coded to 6 ( for now )

        const treeData = buildJsTreeData(this.bp.me, cloudFiles.files);
        this.fileExplorer.cloudFiles = cloudFiles;
        console.log("making tree with data", treeData);
        // console.log("treeData", JSON.stringify(treeData, true, 2));
        // TODO: connect tree to AJAX backend for granular loading ( not just loading the whole tree at once )

        $('#jtree').jstree({
            'core': {
                'data': treeData,
                // This option ensures that when a node is selected by clicking it won't be opened/closed
                'multiple': true,  // This allows single selection of nodes
                'check_callback': true  // This allows certain operations in the tree
            },
            'plugins': ['contextmenu'],  // Add 'contextmenu' to the list of plugins
            'contextmenu': {
                'items': function (node) {
                    console.log(node)
                    var tree = $('#jtree').jstree(true);

                    return {
                        /* TODO: create and delete
                        "Create": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Create",
                            "action": function (obj) {
                                tree.create_node(node);
                            }
                        },
                        "Rename": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Rename",
                            "action": function (obj) {
                                tree.edit(node);
                            }
                        },
                        */
                        "Delete": {
                            "separator_before": false,
                            "separator_after": true,
                            "label": "Delete",
                            "action": function (obj) {
                                tree.delete_node(node);
                            }
                        }
                    }
                }
            }
        }).on("select_node.jstree", (e, data) => {
            // Get the reference to the jsTree instance
            var instance = data.instance;
            var node = data.node;

            if (node.children.length > 0) {  // Check if the node has children, indicating it's a folder
                // Prevent the default select action to toggle on first click
                e.preventDefault();
                // Toggle open/close on single click
                this.fileExplorer.currentSelectedNode = node;
                instance.toggle_node(node);
            }
        }).on('ready.jstree', (e, data) => {
            console.log('Tree is now ready');
            // render the root folder contents

            if (this.options.context) {
                this.fileExplorer.renderPathContents(this.options.context);

            } else {
                this.fileExplorer.renderPathContents('/');

            }

        });

        $('.bp-file-explorer-drag-upload').flexShow();
        $('.bp-file-explorer-address-input').val('/');

        // TODO: move as much of this logic to the FileExplorer class as possible

        $('#jtree').on("delete_node.jstree", (e, data) => {
            // delete the file or directory from CDN
            console.log("delete_node.jstree", e, data);
            let node = data.node;
            let path = node.id;
            console.log('jstree request to delete', path);

            // delete the file from the CDN
            // not needed?
            //let relativePath = path.replace('https://files.buddypond.com/' + this.bp.me + '/', '');
            let relativePath = path;
            console.log('relativePath', relativePath);

            this.bp.apps.client.api.removeFile(relativePath).then(() => {
                console.log('file removed from CDN');
            });

        });

        $('#jtree').on("changed.jstree", (e, data) => {
            console.log('changed.jstree', e, data.selected);

            // determine if the selected node is a file or folder
            let node = data.instance.get_node(data.selected[0]);
            // renderNodeContents(data, node);
            if (node) {
                this.fileExplorer.renderPathContents(node.id);
            } else {
                console.log('node not found', data.selected[0]);
            }

        });

        console.log('got the cloud files', cloudFiles.files);
        return this;


    }

    async open({ context }) {
        console.log(`Opening file explorer with context ${context}`);
        this.options.context = context;
        if (!this.fileExplorer) {
            this.fileExplorer = this.fileExplorerInstance.create();
            this.handleDrop = this.fileExplorer.handleDrop.bind(this.fileExplorer);

        }

        console.log('created explorer', this.fileExplorer);


        if (!this.fileExplorerWindow) {
            this.fileExplorerWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'file-explorer',
                title: 'Cloud Files',
                app: 'file-explorer',
                x: 100,
                y: 30,
                width: 1000,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                content: this.fileExplorer.container,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    // delete the local reference to the file explorer
                    this.fileExplorerWindow = null;
                }
            });

            this.fileExplorerWindow.container.classList.add('has-droparea');

            // this window should have no selectable text
            this.fileExplorerWindow.container.style.userSelect = 'none';
        }


        this.create();

   
    }

}

FileExplorer.prototype.getCloudFiles = getCloudFiles;

// TODO: move to separate file
function buildJsTreeData(id, paths) {
    const root = { id: id, text: id, state: { opened: true }, children: [] };

    paths.forEach(path => {
        const parts = path.split('/').filter(part => part.length);
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFile = i === parts.length - 1 && part.includes('.');
            const newPath = parts.slice(0, i + 1).join('/');

            let node = current.children.find(child => child.text === part);
            if (!node) {
                node = {
                    id: newPath, // Unique identifier based on the path
                    text: part,  // Display text
                    icon: isFile ? 'jstree-file' : 'jstree-folder', // Custom icon class if needed
                    children: isFile ? [] : [],
                    state: {
                        opened: false, // Folders are closed by default unless specified
                        selected: false,
                        disabled: false
                    }
                };
                current.children.push(node);
            }

            // Only navigate into non-file nodes
            if (!isFile) {
                current = node;
            }
        }
    });

    return [root]; // jsTree expects an array of nodes
}