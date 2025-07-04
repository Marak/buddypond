// Remark: We may be able to remove UI and put all this logic in the desktop app
import WindowManager from "./Window/WindowManager.js";
import CountdownManager from "../ui/CountdownManager.js";

export default class UI {
    constructor(bp, options = {}) {
        this.bp = bp;

        let windowManagerOptions = {};
        windowManagerOptions.openWindow = this.bp.open.bind(this.bp),
        windowManagerOptions.window = options.window || {};
        windowManagerOptions.hideTaskBar = options.hideTaskBar;
        this.windowManager = new WindowManager(this, windowManagerOptions);
        this.bp.windows = this.windowManager.windows;
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

        this.countdownManager = new CountdownManager(this.bp);
        // this.countdownManager.updateCountdowns();
        let that = this;
        this.bp.window = that.windowManager.createWindow.bind(that.windowManager);

        function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        // Run on load and resize
        window.addEventListener('resize', setViewportHeight);
        setViewportHeight();


        return this;
    }

    async init() {

        // base CSS for ui, this can be themed in the future
        if (!this.options.noCSS) {
            this.bp.appendCSS('/v5/apps/based/ui/ui.css'); // no need to wait for CSS to load?
            if (this.bp.mode !== 'prod') {
                this.bp.appendCSS('/v5/apps/based/ui/mobile.css'); // no need to wait for CSS to load?
                this.bp.appendCSS('/v5/apps/based/ui/Window/Window.css'); // no need to wait for CSS to load?
                this.bp.appendCSS('/v5/apps/based/ui/Window/TaskBar.css'); // no need to wait for CSS to load?
                this.bp.appendCSS('/v5/apps/based/ui/Window/StartPanel.css'); // no need to wait for CSS to load?

            }
        }

        if (this.options.fontAwesome) {
            this.bp.appendCSS('/v5/vendor/font-awesome/css/fontawesome.css', false, true);
            this.bp.appendCSS('/v5/vendor/font-awesome/css/all.min.css', false, true);
        }

        // TODO: add these lines back after removing v4 completely ( as jQuery is already loaded in v4)
        if (!this.options.noZepto) {
            // If you need jQuery or another version of $
            // we have the ability to not load Zepto as $
            //await this.bp.appendScript('/v5/vendor/zepto.min.js');
        } else {
            //await this.bp.appendScript('/v5/vendor/jquery.min.js');

        }

        // await this.bp.appendScript('/desktop/assets/js/jquery.js');


        if (!this.options.noTabs) {
            // what happened here with config? we shouldn't need to reference host here,
            // TODO: check implementation of importModule with options
            let SimpleTabs = await this.bp.importModule(this.bp.config.host + '/v5/apps/based/ui/SimpleTabs.js', {}, false)
            this.Tabs = SimpleTabs.default;

        }

        await this.bp.appendScript('/v5/vendor/DateFormat.js');

        // bind common document events
        // TODO: move UI events to separate file
        let d = document;

        $(d).on('click', '.open-app', function (e) {
            let appName = $(this).data('app');
            let context = $(e.target).data('context');
            let type = $(this).data('type');
            // let output = $(this).data('output');

            console.log('open-app ' + appName);
            // check to see if legacy app ( for now)
            bp.open(appName, { context, type });

        });

        return 'loaded ui';
    }

    async appendToElement(el) {
        console.log('appendToElement', this);
        let html = await fetchHTMLFragment('ui.html'); // TODO: might need root
        console.log(html);
        el.innerHTML = html;
        return 'hello ui';
    }

    async loadDocumentBody() {
        console.log('loadDocumentBody', this);
        let html = await this.bp.fetchHTMLFragment('/v5/apps/based/ui/ui.html'); // TODO: might need root
        console.log(html);
        $('body').append(html);
        //document.body.innerHTML = html;
        return 'hello ui';

    }

    toggleFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

}