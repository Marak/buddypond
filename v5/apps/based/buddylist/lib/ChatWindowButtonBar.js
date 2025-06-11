export default class ChatWindowButtonBar {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;

        // Button objects provided via options
        const inputButtons = options.buttons || [];

        // Read stored order of button labels
        const storedOrder = this.bp.settings?.['buttonBar.buttons'];

        if (Array.isArray(storedOrder)) {
            // Sort input buttons by stored order
            this.buttons = this.sortButtonsByOrder(inputButtons, storedOrder);
        } else {
            this.buttons = inputButtons;
        }

        this.container = this.render();       // DOM
        this.enableDragAndDrop();             // jQuery UI sorting
        return this;
    }

    render() {
        const buttonBar = document.createElement('div');
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

        element.dataset.text = button.text;
        element.onclick = button.onclick;

        return element;
    }

    addButton(button) {
        if (this.buttons.some(b => b.text === button.text)) {
            console.warn(`Button with text "${button.text}" already exists.`);
            return;
        }

        this.buttons.push(button);
        const newButtonElement = this.createButtonElement(button);
        this.container.appendChild(newButtonElement);
        this.refreshSortable();
    }

    removeButton(buttonText) {
        const index = this.buttons.findIndex(button => button.text === buttonText);
        if (index === -1) return;

        this.buttons.splice(index, 1);

        const children = Array.from(this.container.children);
        for (const el of children) {
            if ((el.innerText === buttonText || el.alt === buttonText) && el.classList.contains('button-bar-button')) {
                this.container.removeChild(el);
                break;
            }
        }

        this.refreshSortable();
        this.saveButtonOrder();
    }

    enableDragAndDrop() {
        $(this.container).sortable({
            items: '.button-bar-button',
            tolerance: 'pointer',
            stop: () => this.syncButtonOrder()
        });
    }

    refreshSortable() {
        $(this.container).sortable('refresh');
    }

    syncButtonOrder() {
        const orderedTexts = Array.from(this.container.children).map(el => el.dataset.text);
        this.buttons = orderedTexts
            .map(text => this.buttons.find(b => b.text === text))
            .filter(Boolean);

        this.saveButtonOrder();
    }

    saveButtonOrder() {
        const orderedTexts = this.buttons.map(b => b.text);
        this.bp.set('buttonBar.buttons', orderedTexts);

        const openWindows = this.bp.apps.ui.windowManager.findWindows({
            app: 'buddylist',
            type: ['buddy', 'pond']
        });

        console.log('openWindows to reorder', openWindows);

        openWindows.forEach(window => {
            if (window.buttonBar) {
                // Reorder buttons
                window.buttonBar.buttons = this.sortButtonsByOrder(window.buttonBar.buttons, orderedTexts);

                // Re-render DOM
                window.buttonBar.reRenderButtons();
            }
        });
    }


    //reRenderButtons() is only used when making a remote change to the button order from an outside source
    // drag and drop does not use this method and instead uses syncButtonOrder
    // we use reRenderButtons to update the button bar in all other existing open windows
    reRenderButtons() {
        // Clear the container
        this.container.innerHTML = '';

        // Recreate and append all buttons in current order
        this.buttons.forEach(button => {
            const el = this.createButtonElement(button);
            this.container.appendChild(el);
        });

        // Re-enable drag and drop after replacing children
        this.refreshSortable();
    }

    sortButtonsByOrder(buttons, order) {
        const buttonMap = Object.fromEntries(buttons.map(b => [b.text, b]));
        const ordered = order.map(text => buttonMap[text]).filter(Boolean);

        // Append any new buttons not in stored order
        const remaining = buttons.filter(b => !order.includes(b.text));
        return [...ordered, ...remaining];
    }
}
