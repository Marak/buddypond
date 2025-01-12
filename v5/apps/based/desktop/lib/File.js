

export default class File {
    constructor(data, parentElement, desktop, depth) {
        this.data = data;
        console.log("FIKLE DATA", data);
        this.parentElement = parentElement;
        this.desktop = desktop;
        this.options = {};
        this.depth = depth;
    }

    render(app = {}) {

        app = this.data;

        // Create the shortcut element
        const el = document.createElement('div');
        el.className = `icon shortcut ${app.class || ''}`;

        if (this.depth > 1) {
            el.classList.add(`hidden`);
        }

        el.classList.add('icon', 'shortcut');   


        const anchor = document.createElement('a');
        anchor.href = app.href || `#icon_dock_${app.name}`;

        const image = document.createElement('img');
        image.className = 'bp-desktop-icon';
        image.loading = 'lazy';
        image.src = app.icon;

        const title = document.createElement('span');
        title.className = 'title';
        title.textContent = app.label || app.name || app.id;

        anchor.appendChild(image);
        anchor.appendChild(title);
        el.appendChild(anchor);

        // Adding onClick event to the .icon container
        el.addEventListener('click', this.options.onClick);




        // Apply jQuery UI draggable if enabled
        if (this.enableShortcutDragging) {
            $(el).draggable({
                containment: 'parent' // Confine dragging within the parent container
            });
        }


        this.parentElement.appendChild(el);


        // Recursively render each child in this folder
    }
}
