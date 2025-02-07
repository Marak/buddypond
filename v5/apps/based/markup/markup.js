/* Markup.js - Marak Squires 2023 - Buddypond */
// This Plugin will parse the DOM HTML and open buddypond apps based on the markup
// Uses the custom elements API to define custom elements
/*
    When the parser finds markup like this:
        
        <bp-audio-player  context="coolsong.mp3" type="basic"/>

    It will result in bp.open('audio-player', { context: 'coolsong.mp3', type: 'basic' }) being called
*/

export default class Markup {
    static id = 'markup';

    constructor({ displayOriginalHTML = false } = {}) {
        this.id = Markup.id;
        this.displayOriginalHTML = displayOriginalHTML;
    }

    init() {
        // Initialization logic if needed
        this.parseHTML();
    }

    defineCustomElements() {
        // Define all custom elements prefixed with 'bp-'
        const customTags = Array.from(document.querySelectorAll('*')).filter(el => el.tagName.toLowerCase().startsWith('bp-'));

        customTags.forEach(tag => {
            const tagName = tag.tagName.toLowerCase();
            if (!customElements.get(tagName)) {
                class CustomElement extends HTMLElement {
                    constructor() {
                        super();
                    }
                }
                customElements.define(tagName, CustomElement);
            }
        });
    }

    parseCustomDomElements() {
        console.log('Parsing custom Buddypond DOM elements...');
        const elements = Array.from(document.querySelectorAll('*')).filter(el => el.tagName.toLowerCase().startsWith('bp-'));

        elements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            const app = tagName.replace('bp-', '');
            const context = element.getAttribute('context');
            const type = element.getAttribute('type');

            if (app) {
                bp.open(app, { context, type });
            }
        });

        console.log('All Buddypond apps initialized.');
    }

    displayOriginalHTML() {
        const pre = document.createElement('pre');
        pre.textContent = document.body.innerHTML;
        document.body.appendChild(pre);
    }

    parseHTML() {
        this.defineCustomElements();
        this.parseCustomDomElements();

        if (this.displayOriginalHTML) {
            this.displayOriginalHTML();
        }
    }
}