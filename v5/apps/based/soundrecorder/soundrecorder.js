export default class SoundRecorder {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from SoundRecorder');

        let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        let eventer = window[eventMethod];
        let messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
    
        // Listen to message from child window
        eventer(messageEvent, (e) => {
            console.log("desktop.app.soundrecorder: message received", e);
          let key = e.message ? 'message' : 'data';
          let data = e[key];
          if (data === 'app_soundrecorder_needs_close') {
            // close the window
            this.soundRecorderWindow.close();

            return;
          }
    
          try {
            let message = JSON.parse(data);
            console.log(`desktop.app.soundrecorder: message received:`, message);
            console.log('emit buddy::sendMessage', message);
            bp.emit('buddy::sendMessage', message);
    
          } catch (err) {
            console.error('desktop.app.soundrecorder: error parsing message:', err);        
          }
    
        },false);
      

        return 'loaded SoundRecorder';
    }


    async open (params = {}) {


        if (!this.soundRecorderWindow) {



            let soundUrlQueryParam = '';
            let context = '';
            let type = '';
          
            if (params.type) {
              type = '&type=' + params.type;
            }
          
            if (params.context) {
              context = '&context=' + params.context;
            }
          
            if (params.soundUrl) {
              desktop.app.soundrecorder.activeSound = params.soundUrl;
              soundUrlQueryParam = '&src=' + params.soundUrl;
              // desktop.app.soundrecorder.mode = 'closeAfterPlayed';
            }
          
            let qtokenidParam = '';
            if (bp.apps.client.api.qtokenid) {
              qtokenidParam = '&_qtokenid=' + bp.apps.client.api.qtokenid  + `&_me=${bp.me}`;
            }
    
            let src;
            if (params.soundUrl) {
              src = `v5/apps/based/soundrecorder/vendor/programs/sound-recorder/index.html?AC=3${qtokenidParam}${soundUrlQueryParam}${type}${context}`;
            } else {
              src = `v5/apps/based/soundrecorder/vendor/programs/sound-recorder/index.html?AC=3${qtokenidParam}${type}${context}`;
            }
    
            this.soundRecorderWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'soundrecorder',
                title: 'Sound Recorder',
                x: 50,
                y: 100,
                width: 662,
                height: 388,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                icon: '/desktop/assets/images/icons/icon_soundrecorder_64.png',
                iframeContent: src,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.soundRecorderWindow = null;
                }
            });
        }

        // Focus on the newly created or updated window
        this.bp.apps.ui.windowManager.focusWindow(this.soundRecorderWindow);

    }

}