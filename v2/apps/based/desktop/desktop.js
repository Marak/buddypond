/* Desktop.js - Buddy Pond - Marak Squires - 2023 */
export default class Desktop {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;

        // Setup containers for the desktop and shortcuts
        this.container = document.createElement('div');
        this.container.id = 'desktop-container';
        this.container.className = 'desktop-container';

        this.shortCutsContainer = document.createElement('div');
        this.shortCutsContainer.id = 'desktop-shortcuts-container';
        this.shortCutsContainer.className = 'desktop-shortcuts-container';
        this.container.appendChild(this.shortCutsContainer);

        // Set parent container
        this.parent = options.parent || document.body;
        this.parent.appendChild(this.container);

        this.enableShortcutDragging = true;

        if (typeof options.enableShortcutDragging === 'boolean') {
            this.enableShortcutDragging = options.enableShortcutDragging;
        }

        // Context menu for desktop
        // this.setupContextMenu();
    }

    async init() {
        await this.bp.load('/v2/apps/based/desktop/desktop.css');
        this.setupWallpaper(); // Set initial wallpaper
        return 'loaded desktop';
    }

    // TODO: should import 'wallpaper' app, port from v4
    setupWallpaper() {
        // Example setting up a default wallpaper, could be user defined
        this.container.style.backgroundImage = 'url("path/to/default/wallpaper.jpg")';
        this.container.style.backgroundSize = 'cover';
    }

    // TODO: implement context menu options for desktop itself
    setupContextMenu() {
        this.container.oncontextmenu = (event) => {
            event.preventDefault();
            this.showContextMenu(event.clientX, event.clientY);
        };
    }

    showContextMenu(x, y) {
        const menu = document.createElement('div');
        menu.className = 'desktop-context-menu';
        menu.style.top = `${y}px`;
        menu.style.left = `${x}px`;

        menu.innerHTML = `
            <ul>
                <li onclick="this.changeWallpaper()">Change Wallpaper</li>
                <li onclick="this.arrangeShortcuts()">Arrange Icons</li>
                <li onclick="this.refreshDesktop()">Refresh</li>
            </ul>
        `;
        document.body.appendChild(menu);

        // Hide menu on click anywhere
        document.addEventListener('click', () => menu.remove(), { once: true });
    }

    changeWallpaper() {
        // Logic to change the desktop wallpaper
        console.log('Change wallpaper logic here');
    }

    arrangeShortcuts(cols = 4) {
        const containerWidth = this.shortCutsContainer.offsetWidth || 800; // Get the container's width
        console.log('containerWidth:', containerWidth);
        const iconWidth = 74; // Assuming width + margin of icons
        const rowHeight = 100; // Assuming height + margin of icons
        const maxCols = Math.floor(containerWidth / iconWidth); // Calculate the maximum number of columns
        const actualCols = cols < maxCols ? cols : maxCols; // Choose the lesser to avoid overflow
    
        Array.from(this.shortCutsContainer.children).forEach((icon, index) => {
            const x = (index % actualCols) * iconWidth; // Calculate x position
            const y = Math.floor(index / actualCols) * rowHeight; // Calculate y position
            console.log('x:', x, 'y:', y);
            icon.style.position = 'absolute'; // Corrected typo here
            icon.style.left = `${x}px`; // Set left position
            icon.style.top = `${y}px`; // Set top position
        });
    }
    

    refreshDesktop() {
        // Refresh desktop logic
        console.log('Refresh desktop logic here');
    }

    addShortCut(app, options = {}) {
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

    removeShortCut(appName) {
        // Find and remove a shortcut based on the app name
        const shortcuts = Array.from(this.shortCutsContainer.children);
        const shortcut = shortcuts.find(el => el.querySelector('.title').textContent === appName);
        if (shortcut) {
            this.shortCutsContainer.removeChild(shortcut);
        }
    }
}
