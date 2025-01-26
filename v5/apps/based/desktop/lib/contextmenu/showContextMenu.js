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
            <li onclick="bp.apps.desktop.setWallpaper()">Set Wallpaper to Url</li>
            <li onclick="bp.apps.desktop.removeWallpaper()">Remove Wallpaper</li>
        </ul>
    `;
    // clear the body before appending the menu
    document.body.appendChild(menu);
    // Hide menu on click anywhere
    document.addEventListener('click', () => menu.remove(), { once: true });
}