export default function arrangeShortcuts(cols = 2, options = {
    rowWidth: 80,
    rowHeight: 100,
    x: 0,
    y: 0,
    ignoreSavedPosition: true
}) {
    let parent = options.parent || this.shortCutsContainer;

    if (typeof options.rowWidth !== 'number') {
        options.rowWidth = this.bp.isMobile() ? 256 : 74;
    }

    if (typeof options.rowHeight !== 'number') {
        options.rowHeight = this.bp.isMobile() ? 256 : 100;
    }

    if (typeof options.x !== 'number') options.x = 0;
    if (typeof options.y !== 'number') options.y = 0;

    const containerHeight = parent.offsetHeight || 600;
    // continerHeight might not yet be defined if the desktop is not visible
    // alert(`Container height: ${containerHeight}`);
    const maxRows = Math.floor(containerHeight / options.rowHeight);

    let appsInstalled = this.bp.settings.apps_installed || {};
    
    let col = 0;
    let row = 0;

    Array.from(parent.children).forEach((icon, index) => {
        const appName = icon.getAttribute('data-app');
        const app = appsInstalled[appName] || {};

        // Respect saved position if allowed
        // console.log('Arranging shortcut:', options);
        /* Removes saved shortcut positions ( for now )
        if (app.position && !options.ignoreSavedPosition) {
            console.log('using saved position for', appName, app.position);
            icon.style.left = `${app.position.x}px`;
            icon.style.top = `${app.position.y}px`;
            return;
        }
        */

        // Calculate position
        let x = options.x + col * options.rowWidth + 15;
        let y = options.y + row * options.rowHeight + (this.bp.isMobile() ? 100 : 0);

        // Move to next column if exceeds height
        if (y + options.rowHeight > containerHeight) {
            col++;
            row = 0;
            x = options.x + col * options.rowWidth + 15;
            y = options.y + row * options.rowHeight + (this.bp.isMobile() ? 100 : 0);
        }

        // Save back position
        appsInstalled[appName] = appsInstalled[appName] || {};
        appsInstalled[appName].position = { x, y };
        // console.log('saving position for', appName, appsInstalled[appName].position);

        // Apply styles
        icon.style.position = 'absolute';
        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;

        row++; // advance row counter
    });

    this.bp.set('apps_installed', appsInstalled);
}
