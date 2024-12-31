/* Desktop.js - Buddy Pond - Marak Squires - 2023 */
import addFolder from "./lib/addFolder.js";

// shortcuts
import addShortCut from "./lib/shortcuts/addShortCut.js";
import removeShortCut from "./lib/shortcuts/removeShortCut.js";
import arrangeShortcuts from "./lib/shortcuts/arrangeShortCuts.js";

// context menu(s)
import setupContextMenu from "./lib/contextmenu/setupContextMenu.js";
import showContextMenu from "./lib/contextmenu/showContextMenu.js";

export default class Desktop {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;

        this.folders = [];

        // Setup containers for the desktop and shortcuts
        this.container = document.createElement('div');
        this.container.id = 'desktop-container';
        this.container.className = 'desktop-container';

        this.shortCutsContainer = document.createElement('div');
        this.shortCutsContainer.id = 'desktop-shortcuts-container';
        this.shortCutsContainer.className = 'desktop-shortcuts-container';
        this.container.appendChild(this.shortCutsContainer);

        // Set parent container
        this.parent = options.parent || document.body;
        this.parent.appendChild(this.container);

        this.enableShortcutDragging = true;

        if (typeof options.enableShortcutDragging === 'boolean') {
            this.enableShortcutDragging = options.enableShortcutDragging;
        }


        // Context menu for desktop
        // this.setupContextMenu();
    }

    async init() {
        await this.bp.load('/v5/apps/based/desktop/desktop.css');
        // TODO: after launch, port legacy wallpaper app
        // this.setupWallpaper(); // Set initial wallpaper
        return 'loaded desktop';
    }

  
   
}

Desktop.prototype.addShortCut = addShortCut;
Desktop.prototype.removeShortCut = removeShortCut;
Desktop.prototype.arrangeShortcuts = arrangeShortcuts;
Desktop.prototype.setupContextMenu = setupContextMenu;
Desktop.prototype.showContextMenu = showContextMenu;
Desktop.prototype.addFolder = addFolder;
