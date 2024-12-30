export default function  showContextMenu(x, y) {
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