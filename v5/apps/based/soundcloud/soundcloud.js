export default class SoundCloud {
    constructor(bp, options = {}) {
        this.bp = bp;

        this.soundCloudEmbeded = false;
        this.widget = null;

        return this;
    }

    async init() {
        this.bp.log('Hello from SoundCloud');


        // fetches html from the fragment and returns it as a string
        this.html = await this.bp.load('/v5/apps/based/soundcloud/soundcloud.html');

        return 'loaded SoundCloud';
    }

    async open(params = {}) {

        let that = this;
        if (!this.soundcloudWindow) {
            this.soundcloudWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'soundcloud',
                title: 'SoundCloud',
                x: 50,
                y: 100,
                width: 600,
                height: 300,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.soundcloudWindow = null;
                }
            });

        }

        params.playlistID = params.playlistID || '1397493787';
        if (!this.soundCloudEmbeded) {
          this.soundCloudEmbeded = true;
          // TODO: create to desktop.app.loadIframe() function ?
          let str = `
            <iframe id="soundcloudiframe" width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/${params.playlistID}&color=%23df23e4&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/marak" title="marak" target="_blank" style="color: #cccccc; text-decoration: none;">marak</a> · <a href="https://soundcloud.com/marak/sets/buddy-pond-0" title="Buddy Pond 0" target="_blank" style="color: #cccccc; text-decoration: none;">Buddy Pond 0</a></div>
            `;
          $('#soundcloudplayer').append(str);
          $('#soundcloudiframe').on('load', function () {
            let tag = document.createElement('script');
            tag.onload = function () {
              let iframeElement   = document.querySelector('#soundcloudiframe');
              let iframeElementID = iframeElement.id;
              that.widget = SC.Widget(iframeElement);
              console.log('Soundcloud App', 'Embed Loaded');
              that.widget.play();
            };
            tag.src = 'desktop/assets/js/soundcloud.js';
            let firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          });
        }
        
        this.bp.apps.ui.windowManager.focusWindow(this.soundcloudWindow);

    }
}