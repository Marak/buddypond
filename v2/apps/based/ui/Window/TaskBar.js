// Buddy Pond - TaskBar.js - Marak Squires 2023
export default class TaskBar {
    constructor({ homeCallback } = {}) {
        this.taskBarElement = document.createElement('div');
        this.taskBarElement.className = 'taskbar-container';
        document.body.appendChild(this.taskBarElement);
        this.items = new Map();

        // Optional Home Button
        if (homeCallback) {
            this.homeButton = document.createElement('div');
            this.homeButton.className = 'taskbar-item taskbar-home';
            this.homeButton.textContent = 'Home'; // You can customize the text or use an icon
            this.homeButton.onclick = homeCallback;
            this.taskBarElement.appendChild(this.homeButton);
        }
    }

    addItem(itemId, displayName, onClickCallback) {
        const itemElement = document.createElement('div');
        itemElement.className = 'taskbar-item icon';
        itemElement.textContent = displayName;
        itemElement.onclick = (ev) => {
            if (onClickCallback) {
                onClickCallback(ev, itemElement);
            }
            this.alertItem(itemId);
        };
        this.taskBarElement.appendChild(itemElement);
        this.items.set(itemId, itemElement);
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
