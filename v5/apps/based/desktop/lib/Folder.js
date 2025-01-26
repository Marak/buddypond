export default class Folder {
    constructor(data, options = {}) {
        this.data = data;
        this.parentElement = options.parentElement;
        this.desktop = options.desktop;
        this.depth = options.depth;
        this.options = options;
    }

    render(app = {}) {
    
        app = this.data;
        // Create the shortcut element
        const folderDiv = document.createElement('div');
        folderDiv.className = `folder ${app.class || ''}`;

        if (this.depth > 1) {
            folderDiv.classList.add(`hidden`);
        }
        folderDiv.classList.add('icon', 'shortcut');   
        const anchor = document.createElement('a');
        // anchor.href = app.href || `#icon_dock_${app.name}`;

        const image = document.createElement('img');
        image.className = 'bp-desktop-icon';
        image.loading = 'lazy';
        image.src = 'desktop/assets/images/icons/icon_folder_64.png';

        const title = document.createElement('span');
        title.className = 'title';
        title.textContent = app.label || app.name || app.id;

        anchor.appendChild(image);
        anchor.appendChild(title);
        folderDiv.appendChild(anchor);

        // folderDiv.onclick = () => this.openFolder(); // Placeholder for folder opening logic

        $(folderDiv).draggable({
            containment: 'parent' // Confine dragging within the parent container
        });

        // folderDiv click handler
        folderDiv.addEventListener('mousedown', (e) => {
           this.options.onOpen();
        });

        this.parentElement.appendChild(folderDiv);

        // Recursively render each child in this folder
        // this.data.children.forEach(child => this.desktop.renderNode(child, folderDiv, this.depth + 1));
    }
}
