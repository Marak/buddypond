import setWallpaper from './setWallpaper.js';
import removeWallpaper from './removeWallpaper.js';

export default class WallpaperManager {
    constructor(bp) {
        this.bp = bp;
        this.canvas = null;
        this.label = 'Wallpaper';
        this.settings = {};
        this.init = false;
        this.width = 0;
        this.height = 0;
        this.wallpapers = {};
        this.paused = false;
        this.active = null;
        this._wallpapers = {
            'solid': {
                label: 'Solid',
                src: ['/v5/apps/based/wallpaper/wallpapers/solid.js']
            },
            'matrix': {
                label: 'Matrix',
                src: ['/v5/apps/based/wallpaper/wallpapers/matrix.js']
            },
            'nyancat': {
                label: 'Nyan Cat',
                src: ['/v5/apps/based/wallpaper/wallpapers/nyancat.js']
            },
            'ripples': {
                label: 'Ripples',
                src: [
                    '/v5/apps/based/wallpaper/wallpapers/ripples/ripples.js'
                ]
            },
            'url': {
                label: 'URL',
                src: ['/v5/apps/based/wallpaper/wallpapers/url.js']
            }
        };


        bp.on('settings::wallpaper_color', 'update-wallpaper-bg-color', (color) => {
            if (this.wallpapers[this.active]) {
                this.wallpapers[this.active].changeColor(color);
            }
        });

    }

    async load(params, next) {
        try {
            this.resizeCanvasToWindow();
            // console.log('Loading wallpapers', this.bp.settings);
            // check to see if this.settings.wallpaper_url is set
            if (this.bp.settings.wallpaper_url) {
                this.setWallpaper(this.bp.settings.wallpaper_url);
            } else {
                this.active = this.bp.settings.wallpaper_name || 'solid';
                this.start();
            }
            this.setupEventListeners();
            next();
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    }

    resizeCanvasToWindow() {
        let canvas = document.getElementById('c');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        this.height = window.innerHeight;
        this.width = window.innerWidth;
    }

    async start() {
        this.paused = false;
        this.resizeCanvasToWindow();

        if (!this.wallpapers[this.active]) {
            let remoteScript = this._wallpapers[this.active].src;
            // console.log('Loading wallpaper:', this.active, remoteScript);
            let wp = await this.bp.importModule(remoteScript[0], {}, false);
            this.wallpapers[this.active] = new wp.default('c');
            // check for load function, call if required
            // Remark: This is a bit of a "sub-app" pattern,
            // it might be better to have each wallpaper be it's own app
            this.wallpapers[this.active].start(this.bp);

        } else {
            this.wallpapers[this.active].start(this.bp);
        }
    }

    pause() {
        this.paused = true;
        this.wallpapers[this.active].pause();
    }

    stop() {
        if (this.wallpapers[this.active] && this.wallpapers[this.active].stop) {
            this.wallpapers[this.active].stop();
        }
        this.clear();
    }

    clear() {
        let canvas = document.getElementById('c');
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    loadRemoteAssets(assets, callback) {
        // Simulate asset loading
        console.log(`Loading assets: ${assets.join(', ')}`);
        setTimeout(callback, 1000); // Simulating async loading
    }

    setupEventListeners() {
        window.addEventListener('resize', (e) => {
            if (e.target !== window) return;
            this.resizeCanvasToWindow();
            if (this.wallpapers[this.active]) {
                this.wallpapers[this.active].resize();
            }
        });

        $('.pauseWallpaper').on('click', () => {
            if (this.paused) {
                this.start();
                $('.pauseWallpaper').html('Pause Wallpaper');
            } else {
                $('#wallpaper').fadeOut('slow');
                $('.pauseWallpaper').html('Resume Wallpaper');
                this.pause();
            }
        });
    }
}

WallpaperManager.prototype.setWallpaper = setWallpaper;
WallpaperManager.prototype.removeWallpaper = removeWallpaper;