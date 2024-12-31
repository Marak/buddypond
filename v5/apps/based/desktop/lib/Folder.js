export default class Folder {
    constructor(name, options = {}) {
        this.name = name;
        this.items = []; // This will store Folder and Shortcut instances

        this.onOpen = options.onOpen || (() => console.log('Folder opened:', this.name));
        this.onOpen.bind(this);

    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    getItems() {
        return this.items;
    }

    render() {

        let app = this;

        // Create the shortcut element
        const folderDiv = document.createElement('div');
        folderDiv.className = `folder ${app.class || ''}`;

        const anchor = document.createElement('a');
        anchor.href = app.href || `#icon_dock_${app.name}`;

        const image = document.createElement('img');
        image.className = 'bp-desktop-icon';
        image.loading = 'lazy';
        image.src = 'desktop/assets/images/icons/icon_folder_64.png';

        const title = document.createElement('span');
        title.className = 'title';
        title.textContent = app.label || app.name;

        anchor.appendChild(image);
        anchor.appendChild(title);
        folderDiv.appendChild(anchor);


        folderDiv.onclick = () => this.openFolder(); // Placeholder for folder opening logic


        $(folderDiv).draggable({
            containment: 'parent' // Confine dragging within the parent container
        });



        return folderDiv;
    }

    openFolder() {
        console.log('Opening folder:', this.name);
        this.onOpen();
        // should just call this.onOpen() ( bound from the calling API )
        // Future implementation: Show contents in a dedicated UI component
    }
}
