export default function send(params) {
    let that = this;
    $('.sendPaint').attr('disabled', true);

    params = params || {
        action: 'insert'
    };

    let keys = Object.keys(localStorage);
    let firstImg = null;
    let firstKey = null;
    keys.forEach(function (k) {
        if (k.search('image#') !== -1) {
            firstImg = localStorage.getItem(k);
            firstKey = k;
        }
    });

    if (!firstKey) {
        console.log('FAILED TO FIND IMAGE IN LOCALSTORAGE. SOMEONE PLEASE FIX JSPAINT INTEGRATION');
        $('.touchPaint').show();
        return;
    } else {
        $('.touchPaint').hide();
    }

    let output = this.output;
    let context = this.context;

    setTimeout(function () {
        // send the paint to `gifstudio` as a frame ( either existing or new )
        if (output === 'gifstudio') {
            /*
            // TODO: should not be undefined here
            if (typeof desktop.app.gifstudio.currentFrameIndex === 'undefined') {
                desktop.app.gifstudio.currentFrameIndex = 0;
            }
            if (params.action === 'insert') {
                desktop.app.gifstudio.currentFrameIndex++;
            }
            desktop.app.gifstudio.loadGifFrame(firstImg, desktop.app.gifstudio.currentFrameIndex, params.action);
            JQDX.closeWindow('#window_paint');
            // open the window we just outputted to
            // Remark: Assume gifstudio has already been loaded since we made it here
            // TODO: we should be able to call gifstudio.openWindow without it reloading entire gif
            // desktop.ui.openWindow('gifstudio');
            $('#window_gifstudio').show();
            $('.sendPaint').attr('disabled', false);
            return;
            */
        }

        // send the paint to pond or buddy chat windows as a Snap
        if (output === 'pond' || output === 'buddy') {
            // TODO: switch sending location here based on context, type, and metadata like gif frameIndex
            bp.apps.client.api.sendSnaps(output, context, 'I sent a Paint', firstImg, 100, 'paint', function (err, uploadedUrl) {
                if (err) {
                    alert('Issue sending Paint. Please try again or contact support.');
                    desktop.log(err);
                    $('.sendPaint').attr('disabled', false);
                    return;
                }
                keys.forEach(function (k) {
                    if (k.search('image#') !== -1) {
                        localStorage.removeItem(k);
                        console.log('clearing key', firstKey);
                    }
                });
                // JQDX.closeWindow('#window_paint');
                // alert('close paint window');
                that.paintWindow.close();
                // open the window we just outputted to

                // at this point with the new v5 API its expected that the client send a new messages
                // broadcasting the file upload to the CDN

                // now that we have the url, just send a regular message with the url
                // the card type should automatically be detected by the server
                // the the body of the message will be the url with extension of image, video, etc


                // context is buddyname or pondname
                // output is buddy or pond

                let message = {
                    to: context,
                    from: bp.me,
                    type: output,
                    text: uploadedUrl
                };
                console.log("sending multimedia message", message);
                bp.emit('buddy::sendMessage', message);

                /*
                JQDX.openWindow(output, {
                  context: context
                });
                */
                // TODO: show the window using new API?
                $('.sendPaint').attr('disabled', false);
            });
        }
    }, 333);


}