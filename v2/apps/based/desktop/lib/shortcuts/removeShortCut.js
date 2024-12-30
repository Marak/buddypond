export default function removeShortCut(appName) {
    // Find and remove a shortcut based on the app name
    const shortcuts = Array.from(this.shortCutsContainer.children);
    const shortcut = shortcuts.find(el => el.querySelector('.title').textContent === appName);
    if (shortcut) {
        this.shortCutsContainer.removeChild(shortcut);
    }
}