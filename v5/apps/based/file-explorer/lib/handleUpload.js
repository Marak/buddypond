export default async function handleUploadEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Handling file input event", e);
    const items = e.target.files; // This is a FileList object, not a DataTransferItem

    let ignoredFiles = ['.DS_Store', '.git', '.gitignore', '.gitattributes', '.gitmodules', '.gitkeep', '.npmignore', '.npmrc', '.yarnignore', '.yarnrc', '.editorconfig', '.eslint'];
    let ignoredDirs = ['.git', 'node_modules'];

    // Function to check if the file or directory should be ignored
    const shouldIgnore = (fileName, fullPath) => {
        return ignoredFiles.includes(fileName) || ignoredDirs.some(dir => fullPath.includes(`/${dir}/`));
    };

    const processFile = (file, path = '') => {
        return new Promise((resolve) => {
            // Assume path includes directory structure if supported
            const fullPath = path + file.webkitRelativePath || file.name; // Use webkitRelativePath if available
            if (shouldIgnore(file.name, fullPath)) {
                console.log('Ignoring file:', fullPath);
                resolve([]);
            } else {
                if (this.currentSelectedNode.parent !== '#') {
                    file.filePath = this.currentSelectedNode.id + '/' + fullPath;
                } else {
                    file.filePath = fullPath;
                }
                console.log('assigning filePath:', file.filePath);
                resolve({ path: file.filePath, file: file });
            }
        });
    };

    // Initialize path if directory input is supported
    const promises = Array.from(items).map(file => processFile(file, ''));

    await Promise.all(promises)
        .then(files => {
            console.log('All processed files:', files.flat());
            // Update your UI to show these files or handle them further
            this.uploadOverlay.show(files.flat());
        })
        .catch(error => console.error('Error processing files:', error));
}
