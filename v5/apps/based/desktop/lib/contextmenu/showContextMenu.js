export default function  showContextMenu(x, y) {

    // find any existing context menu and remove it
    const existingMenu = document.querySelector('.desktop-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.className = 'desktop-context-menu';
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.style.display = 'block';
    // z-index is needed to display the menu on top of other elements
    menu.style.zIndex = '9999';
    menu.innerHTML = `
        <ul>
            <li onclick="bp.apps.wallpaper.setWallpaper()">Set Wallpaper to Url</li>
            <li onclick="bp.apps.wallpaper.removeWallpaper()">Remove Wallpaper</li>
            <li onclick="bp.apps.desktop.viewSource()">View Source</li>
        </ul>
    `;
    // clear the body before appending the menu
    document.body.appendChild(menu);
    // Hide menu on click anywhere
    document.addEventListener('click', () => menu.remove(), { once: true });
}