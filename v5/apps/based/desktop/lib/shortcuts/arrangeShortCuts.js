export default function arrangeShortcuts(cols = 2, options = {
    rowWidth: 80,
    rowHeight: 100,
    x: 0, // TODO: we should start from the x and y position in our calculations
    y: 0,
    ignoreSavedPosition: true
}) {
    let parent;
    if (typeof options.parent !== 'undefined') {
        parent = options.parent;
    } else {
        parent = this.shortCutsContainer;
    }

    if (typeof options.rowWidth !== 'number') {
        options.rowWidth = 74;
        if (this.bp.isMobile()) {
            options.rowWidth = 256;
        }
    }

    if (typeof options.rowHeight !== 'number') {
        options.rowHeight = 100;
        if (this.bp.isMobile()) {
            options.rowHeight = 256;
        }
    }

    if (typeof options.x !== 'number') {
        options.x = 0;
    }

    if (typeof options.y !== 'number') {
        options.y = 0;
    }

    const containerWidth = parent.offsetWidth || 800; // Get the container's width
    const maxCols = Math.floor(containerWidth / options.rowWidth); // Calculate the maximum number of columns
    const actualCols = cols < maxCols ? cols : maxCols; // Choose the lesser to avoid overflow

    let appsInstalled = this.bp.settings.apps_installed || {};

    Array.from(parent.children).forEach((icon, index) => {
        let appName = icon.getAttribute('data-app');
        let app = appsInstalled[appName] || {};
        let x = (index % actualCols) * options.rowWidth; // Calculate x position
        let y = Math.floor(index / actualCols) * options.rowHeight; // Calculate y position

        let offSetY = 100;
        if (this.bp.isMobile()) { // TODO: remove
            y += offSetY; // Add an offset to the y position

        }
        let offsetX = 15;
        x += offsetX; // Add an offset to the x position

        x += options.x;
        y += options.y;

        if (app && app.position && !options.ignoreSavedPosition) {
            // If the app has a specific position, use that instead
            x = app.position.x || x;
            y = app.position.y || y;
        }

        // update the x/y position of the app shortcut inside this.bp.settings.installed_apps
        appsInstalled[appName] = appsInstalled[appName] || app;
        appsInstalled[appName].position = {
            x: x,
            y: y
        }

        // console.log('x:', x, 'y:', y);
        icon.style.position = 'absolute'; // Corrected typo here
        icon.style.left = `${x}px`; // Set left position
        icon.style.top = `${y}px`; // Set top position
    });
    this.bp.set('apps_installed', appsInstalled);

}