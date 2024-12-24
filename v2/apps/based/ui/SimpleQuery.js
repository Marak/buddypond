export default class SimpleQuery {
    constructor(selector, context = window.document) {
        console.log('selector', selector, 'context', context);

        // Ensure context is either a SimpleQuery instance or a native DOM element
        if (context instanceof SimpleQuery) {
            context = context.elements[0]; // Use the first element if it's a SimpleQuery object
        }

        if (typeof context === 'string') {
            context = document.querySelector(context);
        }

        // Support only tag selectors for simplicity
        if (selector.startsWith('<') && selector.endsWith('>')) {
            const tagName = selector.slice(1, -1);
            this.elements = [document.createElement(tagName)];
        } else {
            // Use the context if provided, or default to document if not
            this.elements = Array.from(context.querySelectorAll(selector));
        }

        console.log("SimpleQuery", this.elements);
    }

    append(child) {
        this.elements.forEach(element => {
            if (typeof child === 'string') {
                // Create a temporary container for the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = child;

                while (tempDiv.firstChild) {
                    const childNode = tempDiv.firstChild;

                    // Special handling for script tags
                    if (childNode.tagName === 'SCRIPT') {
                        const script = document.createElement('script');
                        if (childNode.src) {
                            script.src = childNode.src;
                        } else {
                            script.textContent = childNode.textContent;
                        }
                        document.head.appendChild(script); // Append to head to ensure execution
                    } else {
                        element.appendChild(childNode);
                    }
                }
            } else if (child instanceof SimpleQuery) {
                child.elements.forEach(childElement => {
                    element.appendChild(childElement);
                });
            }
        });
        return this;
    }

    last() {
        return new SimpleQuery(this.elements[this.elements.length - 1].tagName).elements[0];
    }

    first() {
        return new SimpleQuery(this.elements[0].tagName).elements[0];
    }

    remove() {
        this.elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        return this;
    }

    forEach(callback) {
        this.elements.forEach((element, index) => {
            callback(new SimpleQuery(element.tagName).elements[0], index);
        });
        return this;
    }

    // A very basic selector that only supports tag names
    querySelector(selector) {
        return new SimpleQuery(selector, this);
    }

    hide() {
        this.elements.forEach(element => {
            element.style.display = 'none';
        });
        return this;
    }

    show() {
        this.elements.forEach(element => {
            element.style.display = '';
        });
        return this;
    }
}
