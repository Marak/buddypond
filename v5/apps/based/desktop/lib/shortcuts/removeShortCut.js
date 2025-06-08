export default function removeShortCut(appName) {
    console.log(`Removing shortcut for app: ${appName}`);
    // Find and remove a shortcut based on the app name
    const shortcuts = Array.from(this.shortCutsContainer.children);
    const shortcut = shortcuts.find(el => $(el).data('app') === appName);
    if (shortcut) {
        this.shortCutsContainer.removeChild(shortcut);
    }
}