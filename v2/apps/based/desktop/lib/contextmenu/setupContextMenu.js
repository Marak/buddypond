// TODO: implement context menu options for desktop itself
export default function setupContextMenu() {
    this.container.oncontextmenu = (event) => {
        event.preventDefault();
        this.showContextMenu(event.clientX, event.clientY);
    };
}
