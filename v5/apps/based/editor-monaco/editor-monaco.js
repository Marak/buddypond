
export default class MonacoWrapper {
    constructor(bp, options = {}) {
        this.editor = null;
        this.bp = bp;
        this.options = options;
    }

    async init() {

        await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.js');
        await this.bp.appendCSS('/v5/apps/based/editor-monaco/editor-monaco.css');


        return this;

    }

    async open () {

        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight - 70;
        if (!this.editorWindow) {
            this.editorWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'monaco-editor',
                title: 'VSCode',
                x: 0,
                y: 20,
                width: clientWidth,
                height: clientHeight,
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
                    this.editorWindow = null;
                    // remove the editor
                    this.dispose();

                }
            });

            this.editorWindow.content.style.flexDirection = 'row';

            this.editorHolder = document.createElement('div');
            this.editorHolder.className = 'editor-holder';


            //this.fileTree = document.createElement('div');
            //this.fileTree.className = 'file-tree';
            //this.editorWindow.content.appendChild(this.fileTree);
            this.editorWindow.content.appendChild(this.editorHolder);


        }

        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' } });

        this.create(this.editorWindow.content, this.options.content || "");


    }

    async create(el, value = "") {
        let that = this;


        return new Promise((resolve, reject) => {

            require(['vs/editor/editor.main'], function () {
                that.editor = monaco.editor.create(el, {
                    value: value,
                    language: 'html',
                    theme: 'vs-dark',
                    automaticLayout: true,
                });
    

                resolve(that);
    
            });
    
        });


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