
import WallpaperManager from './WallpaperManager.js';

export default class Wallpaper {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Wallpaper');

        // Usage:
        const wallpaperManager = new WallpaperManager(this.bp);
        wallpaperManager.load({}, () => console.log('Wallpapers loaded'));
        this.wallpaperManager = wallpaperManager;

        this.bp.on('settings::wallpaper_name', 'update-wallpaper', function (data) {
            //console.log('data::hello.world.name', data);

            wallpaperManager.stop();
            console.log(`Wallpaper changed to ${data}`);
            wallpaperManager.active = data;
            wallpaperManager.start();
            // same as:
            //console.log(bp.data.hello.world.name);
        });

        


        return 'loaded Wallpaper';
    }
}


