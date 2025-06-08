// TODO: implement context menu options for desktop itself
export default function setupContextMenu() {
    this.container.oncontextmenu = (event) => {
        // check if target has class "bp-desktop-icon"
        if (event.target.classList.contains('bp-desktop-icon')) {
            // If it does, prevent the default context menu
            return;
        }

        // find any existing context menu and remove it
        const existingMenu = $('.desktop-context-menu');
        existingMenu.hide();

        event.preventDefault();
        this.showContextMenu(event.clientX, event.clientY);
    };
}