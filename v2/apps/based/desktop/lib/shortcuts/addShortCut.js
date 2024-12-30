export default function addShortCut(app, options = {}) {
    // Default onClick behavior if not provided
    if (typeof options.onClick !== 'function') {
        options.onClick = () => console.log('desktop app - Missing options.onClick function', app.name);
    }

    // Create the shortcut element
    const el = document.createElement('div');
    el.className = `icon shortcut ${app.class || ''}`;

    const anchor = document.createElement('a');
    anchor.href = app.href || `#icon_dock_${app.name}`;

    const image = document.createElement('img');
    image.className = 'bp-desktop-icon';
    image.loading = 'lazy';
    image.src = app.icon;

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = app.label || app.name;

    anchor.appendChild(image);
    anchor.appendChild(title);
    el.appendChild(anchor);

    // Adding onClick event to the .icon container
    el.addEventListener('click', options.onClick);

    // Append the new shortcut to the container
    this.shortCutsContainer.appendChild(el);


    // Apply jQuery UI draggable if enabled
    if (this.enableShortcutDragging) {
        $(el).draggable({
            containment: 'parent' // Confine dragging within the parent container
        });
    }



}