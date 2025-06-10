export default class ChatWindowButtonBar {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.buttons = options.buttons || [];
        this.container = this.render(); // Initializes and renders existing buttons
        return this;
    }

    render() {
        let buttonBar = document.createElement('div');
        buttonBar.classList.add('button-bar');

        this.buttons.forEach(button => {
            const element = this.createButtonElement(button);
            buttonBar.appendChild(element);
        });

        return buttonBar;
    }

    createButtonElement(button) {
        let element;

        const baseDataset = {
            context: this.options.context || button.text,
            type: this.options.type || 'buddy'
        };

        if (button.image) {
            element = document.createElement('img');
            element.src = button.image;
            element.alt = button.text;
            element.title = button.text;
            element.draggable = false;
        } else {
            element = document.createElement('button');
            element.innerText = button.text;
        }

        Object.entries(baseDataset).forEach(([key, value]) => {
            element.dataset[key] = value;
        });

        element.classList.add('button-bar-button');
        if (button.className) {
            element.classList.add(button.className);
        }

        element.onclick = button.onclick;

        return element;
    }

    // TODO: add check to prevent duplicate buttons by text property
    addButton(button) {
        // Update internal state
        this.buttons.push(button);

        // Create and append only the new button element
        const newButtonElement = this.createButtonElement(button);
        this.container.appendChild(newButtonElement);
    }

    removeButton(buttonText) {
        // Find index of button to remove
        const index = this.buttons.findIndex(button => button.text === buttonText);
        if (index === -1) return;

        // Remove from internal state
        this.buttons.splice(index, 1);

        // Remove from DOM
        const children = Array.from(this.container.children);
        for (const el of children) {
            if ((el.innerText === buttonText || el.alt === buttonText) && el.classList.contains('button-bar-button')) {
                this.container.removeChild(el);
                break;
            }
        }
    }
}
