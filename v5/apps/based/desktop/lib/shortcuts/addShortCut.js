export default function addShortCut(app, options = {}, parent) {
    // Default onClick behavior if not provided
    if (typeof options.onClick !== 'function') {
        options.onClick = () => console.log('desktop app - Missing options.onClick function', app.name);
    }

    // Create the shortcut element
    const el = document.createElement('div');
    el.className = `icon shortcut ${app.class || ''} bp-desktop-shortcut`;
    el.setAttribute('data-app', app.name);
    const anchor = document.createElement('a');
    // anchor.href = app.href || `#${app.name}`;

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
        image.textContent = app.textIcon;
        image.style.fontSize = '32px';
        image.style.position = 'relative';
        image.style.bottom = '10px';
        if (options.imageStyle) {
            Object.keys(options.imageStyle).forEach(key => {
                image.style[key] = options.imageStyle[key];
            });
        }
        anchor.appendChild(image);
    }

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = app.label || app.name;
    anchor.appendChild(title);
    el.appendChild(anchor);

    // Adding onClick event to the .icon container
    // TODO: make this event only happen on touchend
    // the idea here is that if the element was dragged, we don't want to trigger the click event
    // but if it was tapped, we do want to trigger the click event 
    /*
    el.addEventListener('click', (e) => {
        alert()
        e.preventDefault();
        options.onClick(e, app);
        return false;
    });
    */

    let pointerDownPos = null;
    let wasDragging = false;

    el.addEventListener('pointerdown', (e) => {
        pointerDownPos = { x: e.clientX, y: e.clientY };
        wasDragging = false;
    });

    el.addEventListener('pointermove', (e) => {
        if (!pointerDownPos) return;

        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If moved more than a threshold, consider it a drag
        if (distance > 5) {
            wasDragging = true;
        }
    });

    el.addEventListener('pointerup', (e) => {
        if (!wasDragging) {
            e.preventDefault(); // Prevent default anchor behavior
            options.onClick(e, app);
        }

        pointerDownPos = null;
        wasDragging = false;

        // update the x/y position of the app shortcut inside this.bp.settings.installed_apps
        let appsInstalled = this.bp.settings.apps_installed || {};
        appsInstalled[app.name] = appsInstalled[app.name] || app;

        appsInstalled[app.name].position = {
            x: el.offsetLeft,
            y: el.offsetTop
        }

        this.bp.set('apps_installed', appsInstalled);

        return false;

    });

    // remove all existing context menus to avoid duplicates
    /*
    const existingMenus = document.querySelectorAll('.desktop-context-menu');
    existingMenus.forEach(menu => {
        menu.remove();
    });
    */

    // Context menu setup
    const contextMenu = document.createElement('div');
    contextMenu.className = 'desktop-context-menu';
    contextMenu.innerHTML = `
        <div class="bp-context-menu-item" data-action="delete">Delete Shortcut</div>
        <div class="bp-context-menu-item" data-action="rename">Rename Shortcut</div>
    `;
    document.body.appendChild(contextMenu); // Append to body for positioning

    // Hide context menu on click elsewhere
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    // Prevent default context menu and show custom menu
    el.addEventListener('contextmenu', (e) => {

        const existingMenu = $('.desktop-context-menu');
        // existingMenu.hide();


        console.log('Context menu triggered for app:', app.name);
        e.preventDefault();
        // Position menu near cursor, ensuring it stays within viewport
        const menuWidth = 150; // Approximate width of context menu
        const menuHeight = 80; // Approximate height of context menu
        const posX = e.clientX;
        const posY = e.clientY;
        const maxX = window.innerWidth - menuWidth;
        const maxY = window.innerHeight - menuHeight;
        contextMenu.style.left = `${Math.min(posX, maxX)}px`;
        contextMenu.style.top = `${Math.min(posY, maxY)}px`;
        contextMenu.style.display = 'block';
    });

    // Handle context menu actions
    contextMenu.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (action === 'delete') {
            this.deleteShortcut(app.name, app, options.context);
        } else if (action === 'rename') {
            this.renameShortCut(app.name, title, options.context);
        }
        contextMenu.style.display = 'none';
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

    // Register the app with desktop.apps
    app.options = options;
    const appKey = options && options.context ? `${app.name}-${options.context}` : app.name;
    this.apps[appKey] = app;

    // Stubbed functions for context menu actions
    this.deleteShortcut = function (appName, app, context) {
        console.log(`Stub: Deleting shortcut for ${appName}${context ? `-${context}` : ''}`);
        // Call removeApp to align with App Store logic
        this.removeApp(appName, app);
    };

}