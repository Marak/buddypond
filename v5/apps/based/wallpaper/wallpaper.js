
import WallpaperManager from './WallpaperManager.js';

export default class Wallpaper {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/_example/_example.css');

        // fetches html from the fragment and returns it as a string
        let html = await this.bp.load('/v5/apps/based/_example/_example.html');

        // await imports the module and returns it
        //        let module = await this.bp.load('/v5/apps/based/_example/_example.js');



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
        bp.set('hello.world.name', 'world');


        return 'loaded Wallpaper';
    }
}


