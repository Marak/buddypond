export default class TaskBar {
    constructor({ homeCallback, bp } = {}) {
        this.taskBarElement = document.createElement("div");
        this.taskBarElement.className = "taskbar-container";
        document.body.appendChild(this.taskBarElement);

        this.bp = bp; // reference to the base platform instance

        this.items = new Map(); // id -> config
        this.shortcuts = new Set(); // id

        if (homeCallback) {
            this.addItem({
                id: "home",
                label: "Home",
                onClick: homeCallback,
                icon: "desktop/assets/images/icons/icon_mantra_64.png",
                isShortcut: true,
            });
        }
        this.taskBarElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const target = e.target.closest('.taskbar-item');
            if (!target) return;
            const id = target.dataset.id;
            if (!id || id === 'home') return;
            this.showContextMenu(id, e.clientX, e.clientY);
        });

        this.enableDragAndDrop();
    }

    showContextMenu(id, x, y) {
        const existing = document.querySelector('.taskbar-context-menu');
        if (existing) existing.remove();

        const item = this.items.get(id);
        if (!item) return;

        const menu = document.createElement('div');
        menu.className = 'taskbar-context-menu';
        menu.style.position = 'fixed';
        menu.style.left = `${x}px`;
        menu.style.visibility = 'hidden'; // hide until we calculate dimensions
        document.body.appendChild(menu);

        // Helper
        const makeOption = (label, handler) => {
            const option = document.createElement('div');
            option.className = 'taskbar-context-menu-item';
            option.textContent = label;
            option.onclick = () => {
                handler();
                menu.remove();
            };
            menu.appendChild(option);
        };

        // Options
        if (item.isOpen) {
            makeOption('Close', () => this.closeItem(id));
        } else {
            makeOption('Open', () => this.openItem(item));
        }

        if (this.shortcuts.has(id)) {
            makeOption('Unpin from Taskbar', () => {
                this.shortcuts.delete(id);
                this.removeItem(id);
            });
        } else {

            // don't allow pin of buddylist with context
            if (item.app === 'buddylist' && id !== 'buddylist') {
            } else {

                makeOption('Keep in Taskbar', () => {
                    console.log('Adding shortcut to taskbar:', id);
                    this.shortcuts.add(id);
                });
            }

        }

        // makeOption('Remove from Taskbar', () => this.removeItem(id));

        // Wait for DOM to layout, then position the menu
        requestAnimationFrame(() => {
            const menuHeight = menu.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Attempt to place above the cursor
            let top = y - menuHeight - 4; // slight offset

            // If that would go off screen, place below (fallback)
            if (top < 0) {
                top = y + 4;
            }

            menu.style.top = `${top}px`;
            menu.style.visibility = 'visible';
        });

        const removeMenu = () => menu.remove();
        setTimeout(() => {
            window.addEventListener('click', removeMenu, { once: true });
            window.addEventListener('contextmenu', removeMenu, { once: true });
        }, 0);
    }


    addItem(config) {
        let { app, id, context, label = "", onClick, icon, isShortcut = true } = config;


        // save the taskbar_apps
        let installedTaskBarApps = this.bp.settings.taskbar_apps || {};
        if (id !== 'home') {
            installedTaskBarApps[id] = {
                app: app || id,
                context: context || 'default',
                label: label || id,
                icon: icon || ''
            };

        }
        // save the taskbar_apps to settings
        this.bp.set('taskbar_apps', installedTaskBarApps);

        console.log('TaskBar.addItem', config);
        console.log(onClick, typeof onClick);
        if (typeof onClick !== 'function') {
            // default action is to open the app, bp.open()
            onClick = async (ev, itemElement) => {

                // first check to see if the window exists / is open
                let existingWindow = this.bp.apps.ui.windowManager.getWindow(id);

                if (!existingWindow) {
                    console.log('default onClick, opening window', id, config);
                    // Remark: this.bp wasn't scoped here? should work...
                    console.log('what is app', app);
                    console.log("what is id", id);

                    let win = await this.bp.open(app || id, { context });
                    console.log('TaskBar.onClick bp.open', id, win);

                } else {

                    if (existingWindow.isMinimized) {
                        console.log('TaskBar.onClick restoring window', existingWindow);
                        existingWindow.restore();
                        existingWindow.focus();
                    } else {
                        console.log('TaskBar.onClick minimizing window', existingWindow);
                        existingWindow.minimize();
                    }

                }

                ev.stopPropagation();
            };
        }

        let existing = this.taskBarElement.querySelector(`[data-id="${id}"]`);
        if (existing) return existing;

        const itemElement = document.createElement("div");
        itemElement.className = "taskbar-item";
        itemElement.dataset.id = id;
        itemElement.draggable = true;

        const itemText = document.createElement("div");
        itemText.className = "taskbar-item-text";
        itemText.textContent = label;
        itemElement.appendChild(itemText);

        if (icon) {
            const itemIcon = document.createElement("img");
            itemIcon.src = icon;
            itemIcon.height = 32;
            itemIcon.width = 32;
            itemIcon.alt = label;
            itemElement.appendChild(itemIcon);
        } else {
            itemElement.textContent = label;
        }

        itemElement.onclick = (ev) => {
            if (onClick) onClick.call(this, ev, itemElement);
            this.alertItem(id);
        };

        if (isShortcut) {
            this.shortcuts.add(id);
        }

        this.taskBarElement.appendChild(itemElement);
        this.items.set(id, {
            ...config,
            element: itemElement,
            isOpen: false,
            isShortcut: isShortcut
        });

        return itemElement;
    }

    openItem(config) {
        let item = this.items.get(config.id);
        if (item) {
            item.isOpen = true;
            item.element.classList.add("taskbar-item-open");
            console.log('TaskBar.openItem', item);
            // item.onClick?.(null, item.element); // call the onClick handler if it exists
        } else {
            this.addItem({ ...config, isShortcut: false }); // treat open as temporary unless marked otherwise
            this.openItem(config); // re-call to apply open state
        }
    }

    closeItem(id) {
        const item = this.items.get(id);
        if (!item) return;

        item.isOpen = false;
        item.element.classList.remove("taskbar-item-open");

        console.log('TaskBar.closeItem', id, item);
        console.log('shortcuts', this.shortcuts);

        // shouldn't this be checking this.shortcuts instead of item.isShortcut?
        if (!this.shortcuts.has(id)) {
            this.removeItem(id);
        }
        /*
        console.log('shortcuts', this.shortcuts);
        // If the item is NOT a shortcut, remove it from the taskbar
        if (!item.isShortcut) {
            this.removeItem(id);
        }
        */

        // get the window instance and close it
        const win = this.bp.apps.ui.windowManager.getWindow(id);
        if (win) {
            win.close();
        } else {
            console.warn(`No window found with ID: ${id}`);
        }



    }

    removeItem(id) {
        const item = this.items.get(id);
        if (item) {
            this.taskBarElement.removeChild(item.element);
            this.items.delete(id);
            this.shortcuts.delete(id);

            // save the updated taskbar_apps
            let taskBarApps = this.bp.settings.taskbar_apps || {};
            if (taskBarApps[id]) {
                delete taskBarApps[id];
                this.bp.set('taskbar_apps', taskBarApps);
            }
            console.log('TaskBar.removeItem', id, item);

        }
    }

    getItem(id) {
        return this.items.get(id);
    }

    alertItem(id) {
        const item = this.items.get(id);
        if (item) {
            item.element.classList.add("taskbar-item-alert");
            setTimeout(() => item.element.classList.remove("taskbar-item-alert"), 3000);
        }
    }

    enableDragAndDrop() {
        let dragged = null;

        this.taskBarElement.addEventListener("dragstart", (e) => {
            dragged = e.target.closest(".taskbar-item");
        });

        this.taskBarElement.addEventListener("dragover", (e) => {
            e.preventDefault();
            const over = e.target.closest(".taskbar-item");
            if (dragged && over && dragged !== over) {
                const draggedIndex = [...this.taskBarElement.children].indexOf(dragged);
                const overIndex = [...this.taskBarElement.children].indexOf(over);
                if (draggedIndex < overIndex) {
                    this.taskBarElement.insertBefore(over, dragged);
                } else {
                    this.taskBarElement.insertBefore(dragged, over);
                }
            }
        });

        this.taskBarElement.addEventListener("dragend", () => {
            dragged = null;

            // resave the new order of shortcuts
            const newOrder = Array.from(this.taskBarElement.children).map(item => item.dataset.id);
            let taskBarApps = this.bp.settings.taskbar_apps || {};
            // reorder the taskbar_apps based on the new order
            const newTaskBarApps = {};
            newOrder.forEach(id => {
                if (taskBarApps[id]) {
                    newTaskBarApps[id] = taskBarApps[id];
                }
            });
            //console.log('New taskbar order:', newOrder);
            this.bp.set('taskbar_apps', newTaskBarApps);

        });
    }
}
