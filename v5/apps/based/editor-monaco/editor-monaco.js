
export default class MonacoWrapper {
    constructor(bp, options = {}) {
        this.editor = null;
        this.bp = bp;
        this.options = options;
    }

    async init() {


        await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.js');
        await this.bp.appendCSS('/v5/apps/based/editor-monaco/editor-monaco.css');


        if (!this.editorWindow) {
            this.editorWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'monaco-editor',
                title: 'VSCode',
                x: 50,
                y: 100,
                width: 700,
                height: 600,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                //context: uddyname || b'default',
                //content: profileContent,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.profileWindow = null;
                }
            });

            this.editorWindow.content.style.flexDirection = 'row';

            this.editorHolder = document.createElement('div');
            this.editorHolder.className = 'editor-holder';


            this.fileTree = document.createElement('div');
            this.fileTree.className = 'file-tree';
            this.editorWindow.content.appendChild(this.fileTree);
            this.editorWindow.content.appendChild(this.editorHolder);


        }

        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' } });

        this.create(this.editorWindow.content);

    }

    async create(el) {
        let that = this;
        require(['vs/editor/editor.main'], function () {
            that.editor = monaco.editor.create(el, {
                value: 'Hello, World!',
                language: 'html'
            });


        });


        // Example usage
        const fileTree = this.bp.apps['file-tree'].create(this.fileTree, {
            onFileSelect: (filePath, target) => {
                console.log('File selected:', filePath, target);
                // alert(filePath)
                // load the contents of the file into the editor
                // get the content from the file object
                // let file = fileTree.getFileFromPath(filePath);
                let fileContent = defaultFileContent[filePath];
                alert(filePath)
                if (fileContent) {
                    this.setValue(fileContent);
                }
            },
            onFolderToggle: (folderPath, isExpanded) => {
                console.log('Folder toggled:', folderPath, isExpanded);
            }
        });
        fileTree.render(files);
        // open the first folder of the fileTree
        fileTree.toggleFolder('/myprofile');

    }

    setValue(content = "") {
        if (this.editor) {
            this.editor.setValue(content);
        }
    }

    getValue() {
        return this.editor ? this.editor.getValue() : "";
    }

    dispose() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}


let defaultFileContent = {};

defaultFileContent['/myprofile/index.html'] = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>My Profile</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>Welcome to my profile</h1>
        <script src="pad.js"></script>
    </body>
    </html>
`;

defaultFileContent['/myprofile/pad.js'] = `
    console.log('Hello from pad.js');
`;

defaultFileContent['/myprofile/style.css'] = `
    body {
        font-family: Arial, sans-serif;
    }
`;

// Example data structure
const files = [
    {
        type: 'folder',
        name: 'myprofile',
        path: '/myprofile',
        children: [
            {
                type: 'file',
                name: 'index.html',
                path: '/myprofile/index.html'
            },

            {
                type: 'file',
                name: 'pad.js',
                path: '/myprofile/pad.js'
            },
            {
                type: 'file',
                name: 'style.css',
                path: '/myprofile/style.css'
            }

           
        ]
    }]


   

