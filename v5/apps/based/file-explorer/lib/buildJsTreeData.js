export default function buildJsTreeData(id, paths) {
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