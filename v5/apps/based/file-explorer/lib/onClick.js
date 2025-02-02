export default function onClick() {
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
            // console.log('clicked', type, path);


            // update the .bp-file-explorer-address-input with the folder path
            this.setPreviewAddressBar('/' + path);
            // $('.bp-file-explorer-address-input').val('/' + path);

            if (type === 'folder') {
                // open folder
                // console.log('open folder', type, path);
                // TODO: path is the node.js from the jsTree
                // we need to get that node reference and get its children
                //let node = this.fileTree.getNode(path);
                let instance = $('#jtree').jstree(true);
                let node = instance.get_node(path);


                let contents = node.children;
                // console.log('111 showing contents of folder', node.id, contents);

                // go through each child and get their node data from jstree
                contents = contents.map(child => {
                    let childNode = instance.get_node(child);
                    return {
                        name: childNode.text,
                        type: childNode.children.length > 0 ? 'folder' : 'file',
                        path: childNode.id
                    };
                });
                // console.log('222 showing contents of folder', node.id, contents);
                // update the .bp-file-explorer-address-input with the folder path
                // $('.bp-file-explorer-address-input').val('/' + node.id);
                this.setPreviewAddressBar('/' + node.id);

                this.renderFolderContents(contents);

                $('.bp-file-explorer-file-viewer').hide();
                $('.bp-file-explorer-files').show();
                $('.bp-file-explorer-header').flexShow();

                $('.bp-file-explorer-drag-upload').flexShow();


            } else {
                // open file
                // console.log('open file', type);
                this.showFile(this.bp.me, path);
                $('.bp-file-explorer-drag-upload').hide();

                //this.showFile('/v5/apps/based/file-explorer/files', name);
            }
        }
    });
}
