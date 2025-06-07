import WallpaperManager from './WallpaperManager.js';

export default class Wallpaper {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        const wallpaperManager = new WallpaperManager(this.bp);
        wallpaperManager.load({}, () => console.log('Wallpapers loaded'));
        this.wallpaperManager = wallpaperManager;
        this.bp.on('settings::wallpaper_name', 'update-wallpaper', function (data) {
            wallpaperManager.stop();
            console.log(`Wallpaper changed to ${data}`);
            wallpaperManager.active = data;
            wallpaperManager.start();
        });
        return 'loaded Wallpaper';
    }

    setWallpaper(url) {
        this.wallpaperManager.setWallpaper(url);
    }

    removeWallpaper() {
        this.wallpaperManager.removeWallpaper();
    }
}