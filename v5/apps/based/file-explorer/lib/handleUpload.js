export default async function handleUploadEvent(e, options = { includeRootDirectory: true, path: '' }) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Handling file input event", e);
    const items = e.target.files; // This is a FileList object, not a DataTransferItem

    let ignoredFiles = ['.DS_Store', '.git', '.gitignore', '.gitattributes', '.gitmodules', '.gitkeep', '.npmignore', '.npmrc', '.yarnignore', '.yarnrc', '.editorconfig', '.eslint'];
    let ignoredDirs = ['.git', 'node_modules'];

    // Function to check if the file or directory should be ignored
    const shouldIgnoreLegacy = (fileName, fullPath) => {
        return ignoredFiles.includes(fileName) || ignoredDirs.some(dir => fullPath.includes(`/${dir}/`));
    };

    const shouldIgnore2 = (fileName, fullPath) => {
        // Check ignored filenames (dotfiles, etc.)
        if (ignoredFiles.includes(fileName)) return true;

        // Normalize path segments
        const pathSegments = fullPath.split('/');

        // Check if any directory in the path is ignored
        return pathSegments.some(segment => ignoredDirs.includes(segment));
    };

     const shouldIgnore = (fileName, fullPath) => {
        if (ignoredFiles.includes(fileName)) return true;
        const pathSegments = fullPath.split('/');
        return pathSegments.some(segment => ignoredDirs.includes(segment));
    };


    const processFileLegacy = (file, path = '') => {
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

    const processFile2 = (file, path = '') => {
        return new Promise((resolve) => {
            // Get the relative path like "folderA/sub/file.txt"
            let relPath = path + file.webkitRelativePath || file.name;

            // Strip the top-level folder from webkitRelativePath
            const pathParts = relPath.split('/');
            if (pathParts.length > 1) {
                pathParts.shift(); // remove the root folder name
                relPath = pathParts.join('/');
            }
            console.log('Processing file:', file.name, relPath);
            if (shouldIgnore(file.name, relPath)) {
                console.log('Ignoring file:', relPath);
                resolve([]);
            } else {
                if (this.currentSelectedNode.parent !== '#') {
                    file.filePath = this.currentSelectedNode.id + '/' + relPath;
                } else {
                    file.filePath = relPath;
                }
                console.log('assigning filePath:', file.filePath);
                resolve({ path: file.filePath, file: file });
            }
        });
    };

     const processFile = (file, path = '') => {
        return new Promise((resolve) => {
            let relPath = path + file.webkitRelativePath || file.name;

            // ⚙️ Handle includeRootDirectory option
            if (!options.includeRootDirectory) {
                const pathParts = relPath.split('/');
                if (pathParts.length > 1) {
                    pathParts.shift(); // remove top-level folder
                    relPath = path + pathParts.join('/');
                }
            }

            console.log('Processing file:', file.name, relPath);

            if (shouldIgnore(file.name, relPath)) {
                console.log('Ignoring file:', relPath);
                resolve([]);
            } else {
                if (this.currentSelectedNode.parent !== '#') {
                    file.filePath = this.currentSelectedNode.id + '/' + relPath;
                } else {
                    file.filePath = relPath;
                }
                console.log('assigning filePath:', file.filePath);
                resolve({ path: file.filePath, file });
            }
        });
    };


    // Initialize path if directory input is supported
    const promises = Array.from(items).map(file => processFile(file, options.path));

    await Promise.all(promises)
        .then(files => {
            console.log('All processed files:', files.flat());
            // Update your UI to show these files or handle them further
            this.uploadOverlay.show(files.flat());
        })
        .catch(error => console.error('Error processing files:', error));

}
