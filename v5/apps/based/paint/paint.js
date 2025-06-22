import send from './lib/send.js';

export default class Paint {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.output = null;
        this.icon = '/desktop/assets/images/icons/icon_paint_64.png';
        return this;
    }

    async init() {
        this.bp.log('Hello from Paint');

        let html = this.bp.load('/v5/apps/based/paint/paint.html');
        this.html = await html;
        return 'loaded Paint';
    }

    async open(params = {}) {
        let that = this;
        if (!this.paintWindow) {
            this.paintWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'paint',
                title: 'Paint',
                x: 50,
                y: 100,
                width: 750,
                height: 520,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                icon: this.icon,
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.paintWindow = null;
                }
            });


            console.log("checkings embed params", params);
            if (params.src) {
                // send the base64 source as part of the frame
                $('#paintIframe', this.paintWindow.content).attr('src', '/v5/apps/based/paint/vendor/index.html#load:' + encodeURI(params.src));
            } else {
                $('#paintIframe', this.paintWindow.content).attr('src', '/v5/apps/based/paint/vendor/index.html');
            }


            $('.sendPaint', this.paintWindow.content).on('click', function () {
                if ($(this).hasClass('updateGif')) {
                    that.send({
                        action: 'insert'
                    });
                } else {
                    that.send({
                        action: 'replace'
                    });
                }
            });
    
            $('.sendGifStudio', this.paintWindow.container).on('click', function () {
                let action = $(this).data('action');
                that.send({ action: action });
            });
    


            // clear out localstorage images on window open
            // this will clear out all images on browser refresh
            // Remark: It's best to do this for now since we dont want to cache to grow
            //         We can later add photo manager for localstorage images
            let keys = Object.keys(localStorage);
            keys.forEach(function (k) {
                if (k.search('image#') !== -1) {
                    localStorage.removeItem(k);
                }
            });

            if (params.output) {
                that.output = params.output;
            } else {
                that.output = 'localhost';
            }

            if (params.context) {
                that.context = params.context;
            } else {
                that.context = 'file-system';
            }

            $('.paintOutputTarget').html(that.output + '/' + that.context);

            if ((that.output && that.output !== 'localhost')) {
                $('.sendPaintHolder .sendPaint').html('SEND PAINT');
                $('.sendPaintHolder').show();
            } else {
                $('.sendPaintHolder').hide();
            }
            if (that.output === 'gifstudio') {
                /*
                $('.sendPaint').hide();
                $('.sendGifStudio').show();
                //$('.insertGif').html('Insert at frame: ' + desktop.app.gifstudio.currentFrameIndex);
                //$('.updateGif').html('Update frame: ' + desktop.app.gifstudio.currentFrameIndex)
                if (desktop.app.gifstudio.currentFrameIndex === Infinity) {
                    //$('.insertGif').html('Add frame');
                    $('.updateGif', '#window_paint').hide();
                } else {
                    //$('.insertGif').html('Insert at frame: ' + desktop.app.gifstudio.currentFrameIndex);
                    //$('.updateGif').html('Update frame: ' + desktop.app.gifstudio.currentFrameIndex)
                    $('.updateGif', '#window_paint').show();
                }

                if (desktop.app.gifstudio.insertMode === 'replace') {
                    $('.insertGif', '#window_paint').hide();
                    $('.updateGif', '#window_paint').show();
                } else {
                    $('.insertGif', '#window_paint').show();
                    $('.updateGif', '#window_paint').hide();
                }
                */

            } else {
                $('.sendPaint', this.paintWindow.content).show();
                $('.sendGifStudio', this.paintWindow.content).hide();
            }

            let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
            let eventer = window[eventMethod];
            let messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

            // Remark: Frame message passing for paint currently only being used to support top left menu File->Exit command
            // Listen to message from child window
            eventer(messageEvent, function (e) {
                let key = e.message ? 'message' : 'data';
                let data = e[key];
                console.log("got event from paint", data);
                if (data === 'app_paint_needs_close') {
                    JQDX.closeWindow('#window_paint');
                }
            }, false);

         
            // return true;

        }


        return this.paintWindow;



    }
}

Paint.prototype.send = send;