export default class UrlWallpaper {
    constructor(canvasId, settings) {
    }
  
    setUrl(url) {
        
        // set the #wallpaper element to the url
        let wallpaper = document.getElementById('wallpaper');
        wallpaper.src = url;

        // save the wallpaper setting in local storage
        this.bp.set('wallpaper_url', url);
    }

    start(url) {
        // Optionally give a short pause to allow other canvas operations to stop
        setTimeout(() => {
            this.setUrl(url);
        }, 33);
    }
  
    stop() {
        // Stopping the solid wallpaper doesn't need to clear anything
    }
  
    pause() {
        // Pausing the solid wallpaper doesn't need to do anything
    }
  }
  