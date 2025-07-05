import StartPanel from "./StartPanel.js";

export default class TaskBar {
    constructor({ homeCallback, bp } = {}) {
        this.taskBarElement = document.createElement("div");
        this.taskBarElement.className = "taskbar-container";
        document.body.appendChild(this.taskBarElement);

        // Create containers for anchored and scrollable items
        this.taskbarLeft = document.createElement("div");
        this.taskbarLeft.className = "taskbar-left";
        this.taskBarElement.appendChild(this.taskbarLeft);

        this.taskbarItems = document.createElement("div");
        this.taskbarItems.className = "taskbar-items";
        this.taskBarElement.appendChild(this.taskbarItems);

        this.taskbarRight = document.createElement("div");
        this.taskbarRight.className = "taskbar-right";
        this.taskBarElement.appendChild(this.taskbarRight);

        this.bp = bp; // Reference to the base platform instance
        this.items = new Map(); // id -> config
        this.shortcuts = new Set(); // id

        // Add scroll listener for indicator visibility
        this.taskbarItems.addEventListener('scroll', () => {
            const isAtEnd = this.taskbarItems.scrollLeft + this.taskbarItems.clientWidth >= this.taskbarItems.scrollWidth - 1;
            console.log("Scroll end reached:", isAtEnd);
            this.taskbarItems.setAttribute('data-scroll-end', isAtEnd);
        });

        function openStartPanel() {
            if (!this.startPanel) {
                this.startPanel = new StartPanel({ bp: this.bp });
            }
            this.startPanel.open();
        }

        // Add "home" button (anchored right)
        if (homeCallback) {
            this.addItem({
                id: "home",
                label: "Home",
                onClick: openStartPanel,
                icon: "desktop/assets/images/icons/icon_mantra_64.png",
                isShortcut: true,
                anchor: "right"
            });
        }

        // Add "settings" button (anchored left on mobile)
        if (this.bp.isMobile()) {
            this.addItem({
                id: "settings",
                label: "Settings",
                onClick: (e) => {
                    e.stopPropagation();
                    const $menu = $('.menu-bar'); // TODO: Reference class property, not DOM
                    if ($menu.hasClass("mobile-active")) {
                        $menu.animate({ left: "-100%" }, 300, () => {
                            $menu.removeClass("mobile-active");
                        });
                    } else {
                        $menu
                            .css({ left: "-100%", display: "flex" })
                            .addClass("mobile-active")
                            .animate({ left: "0%" }, 300);
                    }
                },
                icon: "desktop/assets/images/icons/icon_settings_64.png",
                isShortcut: true,
                anchor: "left"
            });
        }
        // Handle context menu (desktop)
        this.taskBarElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const target = e.target.closest('.taskbar-item');
            if (!target) return;
            const id = target.dataset.id;
            if (!id || id === 'home' || id === 'settings') return; // Exclude anchored items
            this.showContextMenu(id, e.clientX, e.clientY);
        });

        // Handle long-press context menu (mobile)
        if (this.bp.isMobile()) {
            let pressTimer = null;
            let startX = 0, startY = 0;

            this.taskBarElement.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                const target = e.target.closest('.taskbar-item');
                if (!target) return;
                const id = target.dataset.id;
                if (!id || id === 'home' || id === 'settings') return;

                startX = touch.clientX;
                startY = touch.clientY;

                pressTimer = setTimeout(() => {
                    this.showContextMenu(id, startX, startY);
                }, 600); // Long press threshold
            });

            this.taskBarElement.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });

            this.taskBarElement.addEventListener('touchmove', () => {
                clearTimeout(pressTimer); // Cancel if finger moves
            });
        }

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
        menu.style.visibility = 'hidden';
        document.body.appendChild(menu);

        const makeOption = (label, handler) => {
            const option = document.createElement('div');
            option.className = 'taskbar-context-menu-item';
            option.textContent = label;
            option.onclick = () => {
                handler();
                this.startPanel.close();
                menu.remove();
            };
            menu.appendChild(option);
        };

        if (item.isOpen) {
            makeOption('Close', () => this.closeItem(id));
        } else {
            makeOption('Open', () => this.openItem(item));
        }

        if (this.shortcuts.has(id)) {
            makeOption('Unpin from Taskbar', () => {
                this.shortcuts.delete(id);
                if (!item.isOpen) {
                    this.removeItem(id);
                }
            });
        } else {
            if (item.app !== 'buddylist' && id !== 'buddylist' && item.app !== 'emulator') {
                makeOption('Keep in Taskbar', () => {
                    this.shortcuts.add(item.app || id);
                    let installedTaskBarApps = this.bp.settings.taskbar_apps || {};
                    installedTaskBarApps[item.app || id] = {
                        app: item.app || id,
                        context: item.context || 'default',
                        label: item.label || id,
                        icon: item.icon || ''
                    };
                    this.bp.set('taskbar_apps', installedTaskBarApps);
                });
            }
        }

        requestAnimationFrame(() => {
            const menuHeight = menu.offsetHeight;
            const viewportHeight = window.innerHeight;
            let top = y - menuHeight - 4;
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

    // same as addItem ( calls into addItem )
    // except it also saves the item to localStorage
    // this is used when the user explicitly pins an app to the taskbar from outside API
    saveItem(config) {
        // first add the item to the taskbar
        config.isShortcut = true; // Ensure it's treated as a shortcut
        const itemElement = this.addItem(config);
        if (!itemElement) return;

        let { app, id, context, label = "", onClick, icon, isShortcut = true, anchor } = config;

        let installedTaskBarApps = this.bp.settings.taskbar_apps || {};
        if (id !== 'home' && id !== 'settings') {
            installedTaskBarApps[app || id] = {
                id: id,
                app: app || id,
                context: context || 'default',
                label: label || id,
                icon: icon || ''
            };
            this.bp.set('taskbar_apps', installedTaskBarApps);
        }

    }

    addItem(config) {
        let { app, id, context, label = "", onClick, icon, isShortcut = true, anchor } = config;

        if (typeof onClick !== 'function') {
            onClick = async (ev, itemElement) => {
                let existingWindow = this.bp.apps.ui.windowManager.getWindow(id);
                if (!existingWindow) {
                    let win = await this.bp.open(app || id, { context });
                } else {
                    if (existingWindow.isMinimized) {
                        existingWindow.restore();
                        existingWindow.focus();
                    } else {
                        existingWindow.minimize();
                    }
                }
                this.startPanel.close();
                ev.stopPropagation();
            };
        }

        let existing = this.taskBarElement.querySelector(`[data-id="${id}"]`);
        if (existing) return existing;

        const itemElement = document.createElement("div");
        itemElement.className = "taskbar-item";
        itemElement.dataset.id = id;
        itemElement.draggable = id !== 'home' && id !== 'settings'; // Disable drag for anchored items

        if (!this.bp.isMobile()) {
            const itemText = document.createElement("div");
            itemText.className = "taskbar-item-text";
            itemText.textContent = label;
            itemElement.appendChild(itemText);
        }

        if (!icon && app === 'buddylist' && this.bp.apps.buddylist) {
            // Remark: special case for default dicebar avatars for buddies
            let defautSvgAvatar = this.bp.apps.buddylist.defaultAvatarSvg(context.replace('messages/', ''));
            const svgContainer = document.createElement('div');
            svgContainer.className = 'start-panel-app-icon';
            svgContainer.innerHTML = defautSvgAvatar;
            svgContainer.title = context;
            label = label || context.replace('messages/', '');
            // itemText.textContent = label; // Update text content with context
            itemElement.appendChild(svgContainer);
        } else if (icon) {
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

        // Append to appropriate container
        if (id === 'home' && anchor === 'right') {
            this.taskbarRight.appendChild(itemElement);
        } else if (id === 'settings' && anchor === 'left') {
            this.taskbarLeft.appendChild(itemElement);
        } else {
            this.taskbarItems.appendChild(itemElement);
            // Scroll to the newly added item
            if (this.bp.isMobile()) {
                requestAnimationFrame(() => {
                    itemElement.scrollIntoView({ behavior: 'smooth', inline: 'start' });
                });
            }
        }

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
            // Scroll to the opened item
            if (this.bp.isMobile()) {
                requestAnimationFrame(() => {
                    item.element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
                });
            }
        } else {
            this.addItem({ ...config, isShortcut: false });
            this.openItem(config); // Scroll happens in addItem
        }
    }

    closeItem(id) {
        const item = this.items.get(id);
        if (!item) return;

        item.isOpen = false;
        item.element.classList.remove("taskbar-item-open");

        if (!this.shortcuts.has(id)) {
            this.removeItem(id);
        }

        const win = this.bp.apps.ui.windowManager.getWindow(id);
        if (win) {
            win.close();
        } else {
            console.warn(`No window found with ID: ${id}`);
        }
    }

    removeItem(id) {
        const item = this.items.get(id);
        if (!item) return;

        item.element.parentNode.removeChild(item.element);
        this.items.delete(id);
        this.shortcuts.delete(id);

        let taskBarApps = this.bp.settings.taskbar_apps || {};
        if (taskBarApps[id]) {
            delete taskBarApps[id];
            this.bp.set('taskbar_apps', taskBarApps);
        }
    }

    getItem(id) {
        return this.items.get(id);
    }

    alertItem(id) {
        const item = this.items.get(id);
        if (item) {
            item.element.classList.add("taskbar-item-alert");
            setTimeout(() => item.element.classList.remove("taskbar-item-alert"), 1000);
        }
    }

    enableDragAndDrop() {

        let dragged = null;

        this.taskbarItems.addEventListener("dragstart", (e) => {
            dragged = e.target.closest(".taskbar-item");
            if (dragged && (dragged.dataset.id === 'home' || dragged.dataset.id === 'settings')) {
                e.preventDefault(); // Prevent dragging anchored items
                dragged = null;
            }
        });

        this.taskbarItems.addEventListener("dragover", (e) => {
            e.preventDefault();
            const over = e.target.closest(".taskbar-item");
            if (dragged && over && dragged !== over && over.dataset.id !== 'home' && over.dataset.id !== 'settings') {
                const draggedIndex = [...this.taskbarItems.children].indexOf(dragged);
                const overIndex = [...this.taskbarItems.children].indexOf(over);
                if (draggedIndex < overIndex) {
                    this.taskbarItems.insertBefore(over, dragged);
                } else {
                    this.taskbarItems.insertBefore(dragged, over);
                }
            }
        });

        this.taskbarItems.addEventListener("dragend", () => {
            if (dragged) {
                const newOrder = Array.from(this.taskbarItems.children).map(item => item.dataset.id);
                // references the saved / pinned taskbar apps
                let taskBarApps = this.bp.settings.taskbar_apps || {};
                const newTaskBarApps = {};
                newOrder.forEach(id => {
                    // only save the order of taskbar apps that are currently pinned
                    if (taskBarApps[id]) {
                        let _app = taskBarApps[id];
                        newTaskBarApps[id] = _app;
                    }
                });
                this.bp.set('taskbar_apps', newTaskBarApps);
            }
            dragged = null;
        });
    }
}