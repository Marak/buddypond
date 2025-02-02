export default function renderPathContents(path) {
    // $('.bp-file-explorer-address-input').val(path); // maybe no slash?

    this.setPreviewAddressBar(path);

    path = path.replace('/', '');
    let instance = $('#jtree').jstree(true);

    if (path === '') {
        path = this.bp.me;
    }

    // console.log('going to merge metadata from ', this.cloudFiles)
    let node = instance.get_node(path);
    if (node) {
        // console.log('found node', node);

        let type = node.children.length > 0 ? 'folder' : 'file';

        if (type === 'file') {
            this.showFile(this.bp.me, path);
            return;
        }

        this.currentSelectedNode = node;

        let contents = node.children;
        // console.log('444 showing contents of folder', node.id, contents);

        // check this.cloudFiles.metadata[node.id] for the contents of the folder
        // it *should* always exist, if not show error

        if (!this.cloudFiles) {
            alert('cloudFiles not loaded cannot show contents');
            return;
        }


        // go through each child and get their node data from jstree
        contents = contents.map(child => {
            let childNode = instance.get_node(child);

            let metadata = {};
            // console.log('this.cloudFiles', this.cloudFiles.metadata);
            if (!this.cloudFiles.metadata[childNode.id]) {
                // Remark: Folders are not returning metadata?
                // TODO: should server return folder metadata?
                //console.error(`No metadata found for ${childNode.id} cannot show metadata`);
                //console.error(`This should *not* happen and indicates that the metadata and Object Store are out of sync`);
            } else {
                // we found the metadata ( as expected )
                metadata = this.cloudFiles.metadata[childNode.id];
            }

            return {
                name: childNode.text,
                type: childNode.children.length > 0 ? 'folder' : 'file',
                path: childNode.id,
                size: metadata.size,
                date: metadata.lastModified
            };
        });
        // console.log('5555 showing contents of folder', node.id, contents);
        // update the .bp-file-explorer-address-input with the folder path
        //$('.bp-file-explorer-address-input').val('/' + this.bp.me + '/' + node.id);

        this.renderFolderContents(contents);

    }

}