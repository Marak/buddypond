import WindowManager from "./Window/WindowManager.js";
export default class UI {
    constructor(bp, options = {}) {
        this.bp = bp;

        this.bp.isMobile = this.isMobile;

        let windowManagerOptions = {};
        windowManagerOptions.openWindow = this.bp.open.bind(this.bp),
        windowManagerOptions.window = options.window || {};
        windowManagerOptions.hideTaskBar = options.hideTaskBar;
        this.windowManager = new WindowManager(this, windowManagerOptions);

        // will re-load any previous stored metadata about windows
        // storage provider is defaulted to localStorage
        this.windowManager.loadWindows();

        options.parent = options.parent || document.body;

        // options.parent.classList.add('droparea');

        this.options = options;

        if (typeof options.fontAwesome !== 'boolean') {
            options.fontAwesome = true;
        }

        this.parent = options.parent;
        return this;
    }

    async init() {

        // base CSS for ui, this can be themed in the future
        if (!this.options.noCSS) {
            this.bp.appendCSS('/v5/apps/based/ui/ui.css'); // no need to wait for CSS to load?
            this.bp.appendCSS('/v5/apps/based/ui/mobile.css'); // no need to wait for CSS to load?
            this.bp.appendCSS('/v5/apps/based/ui/Window/Window.css'); // no need to wait for CSS to load?
            this.bp.appendCSS('/v5/apps/based/ui/Window/TaskBar.css'); // no need to wait for CSS to load?
        }

        if (this.options.fontAwesome) {
            this.bp.appendCSS('/v5/vendor/font-awesome/css/fontawesome.css');
            this.bp.appendCSS('/v5/vendor/font-awesome/css/all.min.css');
        }

        // TODO: add these lines back after removing v4 completely ( as jQuery is already loaded in v4)
        if (!this.options.noZepto) {
            // If you need jQuery or another version of $
            // we have the ability to not load Zepto as $
            //await this.bp.appendScript('/v5/vendor/zepto.min.js');
        } else {
            //await this.bp.appendScript('/v5/vendor/jquery.min.js');

        }

        if (!this.options.noTabs) {
            let SimpleTabs = await this.bp.importModule('/v5/apps/based/ui/SimpleTabs.js', {}, false)
            this.Tabs = SimpleTabs.default;

        }

        await this.bp.appendScript('/v5/vendor/DateFormat.js');

        
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
        let html = await this.bp.fetchHTMLFragment('/v5/apps/based/ui/ui.html'); // TODO: might need root
        console.log(html);
        $('body').append(html);
        //document.body.innerHTML = html;
        return 'hello ui';

    }

    isMobile () {
        return window.innerWidth < 1000;
    }

}