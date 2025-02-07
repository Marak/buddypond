/* Markup.js - Marak Squires 2023 - Buddypond */
// This Plugin will parse the DOM HTML and open buddypond apps based on the markup
// Uses the custom elements API to define custom elements
/*
    When the parser finds markup like this:
        
        <bp-audio-player  context="coolsong.mp3" type="basic"/>

    It will result in bp.open('audio-player', { context: 'coolsong.mp3', type: 'basic' }) being called
*/

export default class Markup {
    constructor(bp, options = {}) {
        this.bp = bp;
    }

    init() {
        this.bp.parseHTML = this.parseHTML.bind(this);
        // Initialization logic if needed
        //this.parseHTML();
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

        elements.forEach(async (element)  => {
            const tagName = element.tagName.toLowerCase();
            const app = tagName.replace('bp-', '');
            const context = element.getAttribute('context');
            const type = element.getAttribute('type');
            // determine if an attribute exists named "opem" ( has no value )
            const open = element.hasAttribute('open');
            // TODO: needs a way to instead replace the element with the app,
            // instead of opening the window
            // this indicates at least two types of behaviors for custom elements
            // the default behavior should be to replace the element with the app
            // the custom behavior with a flag should be to open the app in a window
            // TODO: how to get content from bp.open() without side-effects of opening a window...


            if (app) {
                await bp.load(app);
                if (bp.apps[app] && bp.apps[app].render) {
                    //let html = await bp.apps[app].render();
                    //console.log('html:', html);
                }
                if (bp.apps[app] && open && bp.apps[app].open) {
                    bp.open(app, { context, type });
                }

            }
        });

        console.log('All Buddypond apps initialized.');
    }

    displayOriginalHTML() {
        const pre = document.createElement('pre');
        pre.textContent = document.body.innerHTML;
        document.body.appendChild(pre);
    }

    parseHTML(parent = document) { // TODO: use parent to limit scope of parsing
        this.defineCustomElements();
        this.parseCustomDomElements();

        if (this.displayOriginalHTML) {
            this.displayOriginalHTML();
        }
    }
}