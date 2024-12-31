// MenuBar.js
export default class MenuBar {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
    }

    async init() {
        await this.bp.appendCSS('/v2/apps/based/menubar/menubar.css');
    }

    createMenu(menuData = [
        { label: 'Item 1', submenu: [{ label: 'Sub Item 1', submenu: [{ label: 'Sub Sub Item 1' }] }] },
        { label: 'Item 2' }
    ]) {
        const menuBar = new MenuBarClass(menuData);
        return menuBar.createMenu();
    }
}

class MenuBarClass {
    constructor(menuTemplate, options = {}) {
        this.menuTemplate = menuTemplate;
        this.menuBarElement = null;
        this.menuTimer = null;
        this.id = options.id || "menu-bar";
    }

    createMenu() {
        this.menuBarElement = document.createElement("div");
        this.menuBarElement.classList.add("menu-bar");
        this.menuBarElement.id = this.id;
        this.menuTemplate.forEach((menuItem) => this.createMenuItem(menuItem));
        this.addGlobalEventListeners();
        return this.menuBarElement;
    }

    createMenuItem(menuItem) {
        const menuButton = document.createElement("div");
        menuButton.classList.add("menu-item");
        if (menuItem.flex) {
            menuButton.style.flex = menuItem.flex;
        }

        if (menuItem.label instanceof HTMLElement) {
            menuButton.appendChild(menuItem.label);
        } else if (typeof menuItem.label === 'object') {
            menuButton.textContent = menuItem.label.label;
        } else {
            menuButton.innerHTML = menuItem.label;
        }

        if (menuItem.className) {
            menuButton.classList.add(menuItem.className);
        }

        menuButton.onclick = () => {
            if (menuItem.label.click) {
                menuItem.label.click();
            }
            // this.closeAllSubmenus();
        };

        if (menuItem.submenu) {
            this.createSubMenu(menuItem.submenu, menuButton, 0);
        }

        this.menuBarElement.appendChild(menuButton);
    }

    createSubMenu(submenuItems, parentItem, depth) {
        const submenuContainer = document.createElement("div");
        submenuContainer.classList.add("submenu");
        submenuContainer.style.left = `${depth * 100}%`; // Position submenus to the right
        submenuItems.forEach((subItem) => this.createSubmenuItem(subItem, submenuContainer, depth + 1));
        parentItem.appendChild(submenuContainer);
        this.addSubMenuEventListeners(submenuContainer, parentItem, depth);
        return submenuContainer;
    }

    createSubmenuItem(subItem, submenuContainer, depth) {
        const subMenuItem = document.createElement("div");
        subMenuItem.classList.add("submenu-item");
        subMenuItem.innerHTML = subItem.label;

        if (subItem.disabled) {
            subMenuItem.classList.add("disabled");
        }

        if (subItem.submenu) {
            let submenuContainer = this.createSubMenu(subItem.submenu, subMenuItem, depth);

            subMenuItem.addEventListener("mouseover", (ev) => {
                // TOOD: fix this, opens submenus
                //alert($('.submenu').length)
                //$('.submenu', submenuContainer).show();


                    // clear the menu timer
                    if (this.menuTimer) {
                        clearTimeout(this.menuTimer);
                    }
                    // ensure all other submenus are hidden
                    const submenus = subMenuItem.querySelectorAll(".submenu");
                    submenus.forEach((submenu) => {
                        console.log("SHOWING SUBMENU", submenu);
                        // ensure the submenu is not child of current submenuContainer
                        if (submenu !== submenuContainer && !submenuContainer.contains(submenu)) {
                            //submenu.style.display = "none";
                        }
                        submenu.style.display = "block !important";
                        subMenuItem.style.display = "block !important";
                            // submenu.style.display = "none";
                        //alert('yo')
                    });
                    //submenuContainer.style.display = "block";


            });
        }


        subMenuItem.onclick = (ev) => {
            ev.stopPropagation(); // Prevents the submenu from closing immediately after clicking
            if (subItem.click) subItem.click();
        };

        submenuContainer.appendChild(subMenuItem);
    }

    addSubMenuEventListeners(submenuContainer, parentItem, depth) {
        
        parentItem.addEventListener("mousedown", () => {
            clearTimeout(this.menuTimer);
            // TODO: we can't close all submenus since we need to keep the parent submenu open
            if (depth === 0) {
                this.closeAllSubmenus(parentItem);
            }
            submenuContainer.style.display = "block";

        });

        parentItem.addEventListener("mouseout", () => {
           
        });
    }

    addGlobalEventListeners() {
        document.addEventListener("click", (ev) => {
            if (!this.menuBarElement.contains(ev.target)) {
                this.closeAllSubmenus();
            }
        });

        document.addEventListener("keydown", (ev) => {
            if (ev.key === "Escape") {
                this.closeAllSubmenus();
            }
        });
    }

    closeAllSubmenus(container) {
        const submenus = document.querySelectorAll(".submenu");
        submenus.forEach(submenu => submenu.style.display = "none");
    }
}