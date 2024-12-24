import WindowManager from "./Window/WindowManager.js";
export default class UI {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.windowManager = new WindowManager();

        options.parent = options.parent || document.body;

        this.options = options;

        this.parent = options.parent;
        return this;
    }

    async init() {

        // base CSS for ui, this can be themed in the future
        if (!this.options.noCSS) {
            this.bp.appendCSS('/v2/apps/based/ui/ui.css'); // no need to wait for CSS to load?
            this.bp.appendCSS('/v2/apps/based/ui/Window/Window.css'); // no need to wait for CSS to load?
        }

 
        await this.bp.appendScript('/vendor/zepto.min.js');
        await this.bp.appendScript('/vendor/DateFormat.js');

        return 'loaded ui';
    }

    async appendToElement(el) {
        console.log('appendToElement', this);
        let html = await fetchHTMLFragment('ui.html'); // TODO: might need root
        console.log(html);
        el.innerHTML = html;
        return 'hello ui';
    }

    async loadDocumentBody () {
        console.log('loadDocumentBody', this);
        let html = await this.bp.fetchHTMLFragment('/v2/apps/based/ui/ui.html'); // TODO: might need root
        console.log(html);
        $('body').append(html);
        //document.body.innerHTML = html;
        return 'hello ui';

    }

}