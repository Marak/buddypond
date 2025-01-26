export default function setWallpaper (url) {

    if (!url) {
        url = prompt('Enter the URL for the wallpaper');
    }

    if (!url) {
        console.error('No URL provided for wallpaper');
        return;
    }

    // set the #wallpaper element to the url
    let wallpaper = document.getElementById('wallpaper');
    wallpaper.src = url;

    // show the element
    wallpaper.style.display = 'block';

    // save the wallpaper setting in local storage
    this.bp.set('wallpaper_url', url);

    if (this.bp.apps.wallpaper && this.bp.apps.wallpaper.wallpaperManager) {
        this.bp.apps.wallpaper.wallpaperManager.stop();
    }

}