/* MenuBar.js - Marak Squires - BuddyPond - 2023 */
import defaultMenuBar from "./lib/defaultMenuBar.js";

export default class MenuBar {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.menus = {}; // Store named menus
        this.currentMenuData = []; // Active menu structure
        this.menuBarElement = null; // Reference to menu DOM element
    }

    async init() {
        await this.bp.appendCSS('/v5/apps/based/menubar/menubar.css');


        this.bp.on('auth::logout', 'reset-menu', () => $('.me_title').html('Sign In'));
        
    }

    load(menuData = {}, parent = document.body) {
        this.currentMenuData = defaultMenuBar(this.bp);
        this.renderMenu(parent);
    }

    setDefaultMenu() {
        this.currentMenuData = defaultMenuBar(this.bp);
        this.renderMenu();
    }

    setMenu(menuName, menuItems) {
        if (menuName) {
            if (menuItems) {
                this.menus[menuName] = menuItems; // Add/update a named menu
            } else {
                delete this.menus[menuName]; // Remove a named menu
            }
        } else {
            this.currentMenuData = menuItems || []; // Replace the entire menu
        }

        // Ensure that the most relevant menu data is used
        const menuData = this.currentMenuData.length 
            ? this.currentMenuData 
            : Object.values(this.menus).flat();

        console.log('new menuData', menuData);
        this.renderMenu(undefined, menuItems);
    }

    renderMenu(parent = document.body, menuData = this.currentMenuData) {
        if (this.menuBarElement) {
            this.menuBarElement.remove();
        }

        //console.log('Rendering menu with data:', menuData);

        this.menuBarElement = new MenuBarClass(menuData).createMenu();
        console.log('new menuBarElement', parent, this.menuBarElement);

        // update the default values based on local storage settings
        // TODO: we may want to move this somewhere else
        console.log('setting current theme', this.bp.settings.active_theme);
        if (this.bp.settings.active_theme) {
            $('.selectTheme', this.menuBarElement).val(this.bp.settings.active_theme);
        } else {
            $('.selectTheme', this.menuBarElement).val('Hacker'); // for now
        }
        console.log('setting audio', this.bp.settings.audio_enabled);
        if (this.bp.settings.audio_enabled === false) {
            $('.volumeFull', this.menuBarElement).hide();
            $('.volumeMuted', this.menuBarElement).show();
        } else {
            $('.volumeFull', this.menuBarElement).show();
            $('.volumeMuted', this.menuBarElement).hide();
        }
        // alert(this.bp.settings.audio_enabled);

        parent.appendChild(this.menuBarElement);
    }
}

class MenuBarClass {
    constructor(menuTemplate, options = {}) {
        this.menuTemplate = menuTemplate;
        this.menuBarElement = null;
        this.id = options.id || "menu-bar";
    }

    createMenu() {
        this.menuBarElement = document.createElement("div");
        this.menuBarElement.classList.add("menu-bar");
        this.menuBarElement.id = this.id;

        this.menuTemplate.forEach(menuItem => this.createMenuItem(menuItem));
        this.addGlobalEventListeners();

        return this.menuBarElement;
    }

    createMenuItem(menuItem) {
        const menuButton = document.createElement("div");
        menuButton.classList.add("menu-item");
        menuButton.innerHTML = menuItem.label;

        if (menuItem.flex) {
            menuButton.style.flex = menuItem.flex;
        }

        /*
        if (menuItem.label instanceof HTMLElement) {
            menuButton.appendChild(menuItem.label);
        } else if (typeof menuItem.label === 'object') {
            menuButton.textContent = menuItem.label.label;
        } else {
            menuButton.innerHTML = menuItem.label;
        }
        */


        if (menuItem.className) {
            menuButton.classList.add(menuItem.className);
        }

        menuButton.onclick = (event) => {
            event.stopPropagation();
            if (menuItem.click) {
                menuItem.click();
            }
        };

        if (menuItem.submenu) {
            const submenuContainer = this.createSubMenu(menuItem.submenu);
            menuButton.appendChild(submenuContainer);
            menuButton.addEventListener("mouseover", () => submenuContainer.style.display = "block");
            menuButton.addEventListener("mouseleave", () => submenuContainer.style.display = "none");
        }

        this.menuBarElement.appendChild(menuButton);
    }

    createSubMenu(submenuItems) {
        const submenuContainer = document.createElement("div");
        submenuContainer.classList.add("submenu");

        submenuItems.forEach(subItem => {
            const subMenuItem = document.createElement("div");
            subMenuItem.classList.add("submenu-item");
            subMenuItem.innerHTML = subItem.label;

            if (subItem.click) {
                subMenuItem.onclick = (event) => {
                    event.stopPropagation();
                    subItem.click();
                };
            }

            if (subItem.submenu) {
                const nestedSubMenu = this.createSubMenu(subItem.submenu);
                subMenuItem.appendChild(nestedSubMenu);
                subMenuItem.addEventListener("mouseover", () => nestedSubMenu.style.display = "block");
                subMenuItem.addEventListener("mouseleave", () => nestedSubMenu.style.display = "none");
            }

            submenuContainer.appendChild(subMenuItem);
        });

        return submenuContainer;
    }

    addGlobalEventListeners() {
        document.addEventListener("click", (event) => {
            if (!this.menuBarElement.contains(event.target)) {
                this.closeAllSubmenus();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.closeAllSubmenus();
            }
        });
    }

    closeAllSubmenus() {
        document.querySelectorAll(".submenu").forEach(submenu => submenu.style.display = "none");
    }
}
