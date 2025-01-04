// FileTree.js
export default class FileTree {
    constructor(bp, options = {}) {
        this.bp = bp;
    }

    async init () {
        await this.bp.appendCSS('/v5/apps/based/file-tree/file-tree.css');

    }

    create(container, options) {

        this.options = {
            onFileSelect: options.onFileSelect || ((file) => console.log('File selected:', file)),
            onFolderToggle: options.onFolderToggle || ((folder, isExpanded) => console.log('Folder toggled:', folder, isExpanded)),
            indent: options.indent || 20,
        };    
        

        this.container = typeof container === 'string' ? document.querySelector(container) : container;
     
        
        // Initialize root container
        this.treeRoot = document.createElement('div');
        this.treeRoot.className = 'bp-filetree-container';
        this.container.appendChild(this.treeRoot);

        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.renderItem = this.renderItem.bind(this);
        
        // Add event listener
        this.treeRoot.addEventListener('click', this.handleClick);
        return this;

    }

    handleClick(event) {
        const target = event.target.closest('.bp-filetree-item');
        if (!target) return;

        const isFolder = target.dataset.type === 'folder';
        const path = target.dataset.path;

        if (isFolder) {
            const isExpanded = target.classList.toggle('bp-filetree-expanded');
            const childContainer = target.nextElementSibling;
            childContainer.style.display = isExpanded ? 'block' : 'none';
            this.options.onFolderToggle(path, isExpanded);
        } else {
            this.options.onFileSelect(path, target);
        }
    }

    getFileIcon(filename) {
        // Basic file type detection based on extension
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            js: '📄',
            json: '📋',
            html: '🌐',
            css: '🎨',
            png: '🖼️',
            jpg: '🖼️',
            pdf: '📑',
            default: '📄'
        };
        return iconMap[ext] || iconMap.default;
    }

    renderItem(item, level = 0) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'bp-filetree-item-container';
        
        const itemElement = document.createElement('div');
        itemElement.className = 'bp-filetree-item';
        itemElement.dataset.path = item.path;
        itemElement.dataset.type = item.type;
        itemElement.style.paddingLeft = `${level * this.options.indent}px`;

        // Create icon element
        const icon = document.createElement('span');
        icon.className = 'bp-filetree-icon';
        icon.textContent = item.type === 'folder' ? '📁' : this.getFileIcon(item.name);
        
        // Create name element
        const name = document.createElement('span');
        name.className = 'bp-filetree-name';
        name.textContent = item.name;

        itemElement.appendChild(icon);
        itemElement.appendChild(name);
        itemContainer.appendChild(itemElement);

        if (item.type === 'folder' && Array.isArray(item.children)) {
            const childContainer = document.createElement('div');
            childContainer.className = 'bp-filetree-children';
            childContainer.style.display = 'none';
            
            item.children.forEach(child => {
                childContainer.appendChild(this.renderItem(child, level + 1));
            });
            
            itemContainer.appendChild(childContainer);
        }

        return itemContainer;
    }

    toggleFolder(path) {
        const folder = this.treeRoot.querySelector(`.bp-filetree-item[data-path="${path}"]`);
        if (!folder) return;
        
        const isExpanded = folder.classList.toggle('bp-filetree-expanded');
        const childContainer = folder.nextElementSibling;
        childContainer.style.display = isExpanded ? 'block' : 'none';
        this.options.onFolderToggle(path, isExpanded);
    }

    render(files) {
        // Clear existing content
        this.treeRoot.innerHTML = '';
        
        // Render each root item
        files.forEach(file => {
            this.treeRoot.appendChild(this.renderItem(file));
        });
    }

    destroy() {
        this.treeRoot.removeEventListener('click', this.handleClick);
        this.container.removeChild(this.treeRoot);
    }
}