export default function removeWallpaper () {


    // set the #wallpaper element to the url
    let wallpaper = document.getElementById('wallpaper');
    wallpaper.src = '';
    // hide the wallpaper
    wallpaper.style.display = 'none';

    // save the wallpaper setting in local storage
    this.bp.set('wallpaper_url', null);

    if (this.bp.apps.wallpaper && this.bp.apps.wallpaper.wallpaperManager) {
        this.bp.apps.wallpaper.wallpaperManager.stop();
    }

}