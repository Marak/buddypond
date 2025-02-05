import Folder from './Folder.js';
import arrangeShortcuts from '../lib/shortcuts/arrangeShortCuts.js';
export default function addFolder(metadata) {

    let that = this;

    function renderItem(_item, parent) {

        let item = {};
        if (typeof _item === 'string') {
            item.id = _item;
            item.name = _item;
            item.label = _item;
        } else {
            item = _item;
        }

        if (!item.icon) {
            item.icon = `/desktop/assets/images/icons/icon_${item.id}_64.png`;
        }

        item.options = item.options || {};

        that.addShortCut({
            name: item.id,
            icon: item.icon,
            label: item.label,
        }, {
            onClick: () => {
                bp.open(item.id, item.options);
            }
        }, parent);

    }

    let folderHolder = document.createElement('div');
    folderHolder.className = 'folder-holder';

    metadata.items.forEach(item => {
        renderItem(item, folderHolder);
    });


    const folder = new Folder(metadata, {
        desktop: this,
        parentElement: this.shortCutsContainer,
        depth: 0,
        onOpen: () => {

            this.arrangeShortcuts(4, {
                parent: folderHolder,
                x: 0,
                y: 20
            })

            console.log('Folder opened:', metadata.name);
            this.bp.apps.ui.windowManager.createWindow({
                id: metadata.name,
                title: metadata.name,
                icon: '/desktop/assets/images/icons/icon_folder.png',
                width: 400,
                height: metadata.height || 150,
                parent: $('#desktop').get(0),
                content: folderHolder
            });

        }
    });
    this.folders.push(folder);
    folder.render()
    //this.addShortCut(folder);
    // this.shortCutsContainer.appendChild(folder.render());
}