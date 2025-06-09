export default function  showContextMenu(x, y) {

    const menu = document.createElement('div');
    menu.className = 'desktop-context-menu';
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.style.display = 'block';
    // z-index is needed to display the menu on top of other elements
    menu.style.zIndex = '9999';
    menu.innerHTML = `
        <ul>
            <!-- <li onclick="bp.apps.desktop.createShortCut()">New Shortcut...</li> -->
            <li onclick="bp.apps.desktop.arrangeShortcuts(2, {
    rowWidth: 80,
    rowHeight: 100,
    x: 0,
    y: 0,
    ignoreSavedPosition: true
            })">Arrange Icons</li>
            <li onclick="bp.open('profile', { context: 'themes' })">Desktop Settings</li>
            <li onclick="bp.apps.wallpaper.removeWallpaper()">Remove Wallpaper</li>
            <li onclick="bp.apps.desktop.viewSource()">View Source</li>
        </ul>
    `;
    // clear the body before appending the menu
    document.body.appendChild(menu);
    // Hide menu on click anywhere
    document.addEventListener('click', () => menu.remove(), { once: true });
}