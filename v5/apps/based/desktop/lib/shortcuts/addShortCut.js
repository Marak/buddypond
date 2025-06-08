export default function addShortCut(app, options = {}, parent) {
    // Default onClick behavior if not provided
    if (typeof options.onClick !== 'function') {
        options.onClick = () => console.log('desktop app - Missing options.onClick function', app.name);
    }

    // Create the shortcut element
    const el = document.createElement('div');
    el.className = `icon shortcut ${app.class || ''} bp-desktop-shortcut`;
    // add data-app attribute for easy identification
    el.setAttribute('data-app', app.name);
    const anchor = document.createElement('a');
    anchor.href = app.href || `#icon_dock_${app.name}`;

    if (!app.textIcon) {
        const image = document.createElement('img');
        image.className = 'bp-desktop-icon';
        image.loading = 'lazy';
        image.src = app.icon;
        if (options.imageStyle) {
            Object.keys(options.imageStyle).forEach(key => {
                image.style[key] = options.imageStyle[key];
            });
        }
        anchor.appendChild(image);

    } else {
        const image = document.createElement('div');
        // image.className = 'bp-desktop-icon';
        image.textContent = app.textIcon;
        image.style.fontSize = '32px';
        //image.style.paddingLeft = '20px';
        image.style.position = 'relative';
        image.style.bottom = '10px';
        if (options.imageStyle) {
            Object.keys(options.imageStyle).forEach(key => {
                image.style[key] = options.imageStyle[key];
            });
        }    anchor.appendChild(image);

    }

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = app.label || app.name;

    anchor.appendChild(title);
    el.appendChild(anchor);

    // Adding onClick event to the .icon container
    el.addEventListener('click', (e) => {
        e.preventDefault();
        options.onClick(e, app);
        return false;
    });

    // Append the new shortcut to the container
    let p = parent || this.shortCutsContainer;

    p.appendChild(el);

    // Apply jQuery UI draggable if enabled
    if (this.enableShortcutDragging) {
        $(el).draggable({
            containment: 'parent' // Confine dragging within the parent container
        });
    }

    // register the app with desktop.apps
    // console.log('ADDING APP', app.name, app, options);
    app.options = options;
    if (options && options.context) {
        this.apps[app.name + '-' + options.context] = app;

    } else {
        this.apps[app.name] = app;

    }

}

/*

export default function addShortCut(container, app, options = {}) {
    if (typeof options.onClick !== 'function') {
        options.onClick = () => console.log('desktop app - Missing options.onClick function', app.name);
    }

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

    el.addEventListener('click', options.onClick);

    container.appendChild(el);

    if (this.enableShortcutDragging) {
        $(el).draggable({
            containment: 'parent'
        });
    }
}

*/