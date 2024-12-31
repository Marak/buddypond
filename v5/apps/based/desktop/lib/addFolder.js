export default function addFolder(metadata) {
    const folder = new Folder(metadata.name, {
        onOpen: () => {
            console.log('Folder opened:', metadata.name);
            this.bp.apps.ui.windowManager.createWindow({
                title: metadata.name,
                width: 500,
                height: 500,
                content: `
                    <h1>${metadata.name}</h1>
                    <p>Folder content goes here</p>
                    <p>${JSON.stringify(metadata)}</p>
                `
            });

        }
    });
    this.folders.push(folder);
    //this.addShortCut(folder);
    this.shortCutsContainer.appendChild(folder.render());
}