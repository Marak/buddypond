export default function dropareaEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("file-explorer handling drop event", e);
    let items = e.dataTransfer.items;

    let ignoredFiles = ['.DS_Store', '.git', '.gitignore', '.gitattributes', '.gitmodules', '.gitkeep', '.npmignore', '.npmrc', '.yarnignore', '.yarnrc', '.editorconfig', '.eslint'];
    let ignoredDirs = ['.git', 'node_modules'];

    // Function to check if the file or directory should be ignored
    const shouldIgnore = (fileName, fullPath) => {
        return ignoredFiles.includes(fileName) || ignoredDirs.some(dir => fullPath.includes(`/${dir}/`));
    };



    const processEntry = (entry, path = '') => {
        return new Promise((resolve, reject) => {
            console.log('processing item:', entry, 'currentNode', this.currentSelectedNode);
    
            // Scope the path to the current selected folder if applicable
            if (this.currentSelectedNode) {
                // path += this.currentSelectedNode.id + '/';
                console.log('Updated path to scope to the selected folder:', path);
            }
    
            if (entry.isFile) {
                entry.file(file => {
                    const filePath = path + file.name;
                    if (shouldIgnore(file.name, filePath)) {
                        console.log('Ignoring file:', filePath);
                        resolve([]);
                    } else {
                        file.filePath = filePath;
                        console.log(filePath); // Optionally log the file path
                        resolve({path: filePath, file: file});
                    }
                }, reject);
            } else if (entry.isDirectory) {
                let reader = entry.createReader();
                reader.readEntries(entries => {
                    Promise.all(entries.map(entryItem => processEntry(entryItem, path + entry.name + '/')))
                        .then(files => resolve(files.flat()))
                        .catch(reject);
                }, reject);
            }
        });
    };
    

    const promises = [];
    // Process each dragged item
    for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : items[i].getAsEntry();
        if (item) {
            if (!shouldIgnore(item.name, item.fullPath)) {
                // check if this is the root node
                // we could also check bp.me === node.id, checking for jsTree parent indicator seems safer
                if (this.currentSelectedNode.parent !== '#') {
                    promises.push(processEntry(item, this.currentSelectedNode.id + '/'));
                } else {
                    promises.push(processEntry(item));
                }
            }
        }
    }

    Promise.all(promises)
        .then(files => {
            console.log('All files:', files.flat());
            // Here, you would typically update your UI to show the files and await user confirmation before upload
            this.uploadOverlay.show(files.flat());
        })
        .catch(error => console.error('Error processing files:', error));
}
