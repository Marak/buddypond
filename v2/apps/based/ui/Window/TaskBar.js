export default class TaskBar {
    constructor({ homeCallback } = {}) {
        this.taskBarElement = document.createElement('div');
        this.taskBarElement.className = 'taskbar-container';
        document.body.appendChild(this.taskBarElement);
        this.items = new Map();

        // Create home button using addItem
        if (homeCallback) {
            this.addItem({
                id: 'home',
                title: 'Home',
                onClick: homeCallback,
                icon: 'desktop/assets/images/icons/icon_mantra_64.png'
            });
        }
    }

    addItem(config) {
        const { id, title = '', onClick, content, icon } = config;
        const itemElement = document.createElement('div');
        itemElement.className = 'taskbar-item';
        const itemText = document.createElement('div');
        itemText.className = 'taskbar-item-text';
        itemText.textContent = title; // Tooltip text
        itemElement.appendChild(itemText);

        if (content) {
            itemElement.innerHTML = content;
        } else if (icon) {
            const itemIcon = document.createElement('img');
            itemIcon.src = icon;
            itemIcon.height = 32;  // Standard icon size
            itemIcon.width = 32;
            itemIcon.alt = title;
            itemElement.appendChild(itemIcon);
        } else {
            itemElement.textContent = title;
        }

        itemElement.onclick = (ev) => {
            if (onClick) {
                onClick(ev, itemElement);
            }
            this.alertItem(id);
        };

        this.taskBarElement.appendChild(itemElement);
        this.items.set(id, itemElement);
        return itemElement;
    }

    removeItem(itemId) {
        const itemElement = this.items.get(itemId);
        if (itemElement) {
            this.taskBarElement.removeChild(itemElement);
            this.items.delete(itemId);
        }
    }

    getItem(itemId) {
        return this.items.get(itemId);
    }

    alertItem(itemId) {
        const itemElement = this.items.get(itemId);
        if (itemElement) {
            itemElement.classList.add('taskbar-item-alert');
            setTimeout(() => itemElement.classList.remove('taskbar-item-alert'), 3000);
        }
    }
}
