export default async function showFile(root, file, showEditor = false) {

    if (!file) {
        console.error('no file specified');
        return;
    }

    $('.bp-file-explorer-file-viewer').show();
    $('.bp-file-explorer-files').hide();
    $('.bp-file-explorer-header').flexHide();


    let supportedEditorTypes = ['js', 'json', 'html', 'css', 'txt', 'yml', 'md'];

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
        // console.log("fetching filePath", filePath);
        let fileContents = await fetch(filePath);

        // now we will write the contents to the editor
        // for now just JSON.stringify the contents to .bp-file-explorer-file-viewer
        let fileText = await fileContents.text();
        // let fileExt = file.split('.').pop();
        let fileMimeType = this.mime.getType(filePath);
        if (this.editor) {
            if (fileMimeType) {
                this.editor.changeEditorLanguage(fileMimeType);
            }
            this.editor.editor.setValue(fileText);
            this.editor.filePath = filePath;
        } else {
            let fileViewerEditor = $('.bp-file-explorer-file-viewer-editor', this.container);
            // console.log("setting text content", fileText);

        }

        //fileViewerEditor.html('');
        //let pre = document.createElement('pre');
        //pre.textContent = await fileContents.text();
        //fileViewerEditor.append(pre);

        // show the iframe, hide the editor
        $('.bp-file-explorer-file-viewer-iframe').hide();
        $('.bp-file-explorer-file-viewer-editor').show();
        $('.bp-file-explorer-drag-upload').hide();
        // for now, ensure that editor state resets to editor showing code ( not preview or upload )
        // this is in case the user has previous entered preview mode and then clicked new file on file tree
        $('.pad-editor-button-edit').click();

    }

}