export default function bindUIEvents() {
    let that = this;
    $(that.cameraWindow.container).resize(function () {
        console.log('resize');
        if (that.viewMode === 'Full') {
            that.resizeFullVideo();
        }
    });

    $('#snapDelaySlider').slider({
        value: 777,
        min: 1,
        max: 2222,
        change: function (event, ui) {
 
           let inversedValue = 2222 - ui.value;      
            that.snapDelay = inversedValue;
            $('#snapsPreview').data('delay', inversedValue);
            let delay = inversedValue;
            that.createGif(inversedValue);
        }
    });

    function toggleMirrorControls() {
        if (that.showingControls) {
            that.showingControls = false;
            hideMirrorControls();
        } else {
            that.showingControls = true;
            showMirrorControls();
        }
    }

    function hideMirrorControls() {
        $('.mirrorControl').hide();
        $('.cameraControls').hide();
        $('.snapControl').hide();
        $('.snapControls').hide();
    }

    function showMirrorControls() {
        if (that.makingSnap) {
            $('.cameraControls').show();
            $('.snapControl').show();
            $('.snapControls').show();
            if (Object.keys(that.snaps).length > 1) {
                $('.snapDelaySliderControl').show();
            }
        } else {
            $('.mirrorControl').show();
            $('.cameraControls').show();
            $('.snapControl').hide();
            $('.snapControls').hide();
        }
    }

    function toggleMirrorSize() {
        // 3 view modes we can toggle, Normal, Half, Full
        if (that.viewMode === 'Normal') {
            $('#mirrorCanvasMe').css('width', 320);
            $('#mirrorCanvasMe').css('height', 240);
            $('#snapsPreview').css('width', 320);
            $('#snapsPreview').css('height', 240);
            $('#mirrorCanvasMe').css('padding-top', 32);
            $('#snapsPreview').css('padding-top', 32);
            $('#mirrorCanvasMe').css('position', 'relative');
            that.viewMode = 'Half';
            $('.showFullMirror').html(that.viewMode + ' View');
            return;
        }
        if (that.viewMode === 'Half') {
            $('#mirrorCanvasMe').css('padding-top', 0);
            $('#snapsPreview').css('padding-top', 0);
            that.resizeFullVideo();
            that.viewMode = 'Full';
            $('.showFullMirror').html(that.viewMode + ' View');
            return;
        }
        if (that.viewMode === 'Full') {
            $('#mirrorCanvasMe').css('width', '100%');
            $('#mirrorCanvasMe').css('height', '100%');
            $('#snapsPreview').css('width', 640);
            $('#snapsPreview').css('height', 480);
            $('#mirrorCanvasMe').css('padding-top', 0);
            $('#snapsPreview').css('padding-top', 0);
            $('#mirrorCanvasMe').css('position', 'relative');
            that.viewMode = 'Normal';
            $('.showFullMirror').html(that.viewMode + ' View');
            return;
        }
    }

    $('.showMirrorControls').on('click', function () {
        toggleMirrorControls();
    });

    $('.showFullMirror').on('click', function () {
        toggleMirrorSize();
    });

    if (that.showingControls) {
        showMirrorControls();
    }


    $('.selectMirrorCamera').on('change', () => {
        let newDeviceLabel = $(this).val();
        this.bp.set('mirror_selected_camera_device_label', newDeviceLabel);
        // TODO: use localstorage to set device preference
        that.startCamera(newDeviceLabel);
    });

    // adds all JSManipulate effects as keys to the drop down
    Object.keys(JSManipulate).forEach((filter) => {
        // console.log("filter", filter);
        $('.selectMirrorFilter', this.cameraWindow.content).append(`<option value="${filter}">${filter}</option>`);
    });

    $('.selectMirrorFilter', this.cameraWindow.content).on('change', (ev) => {
        this.canvasVideo.filter = ev.currentTarget.value.toLowerCase();
    });

    this.canvasVideo = new window.CanvasVideo('#mirrorVideoMe', '#mirrorCanvasMe');
    this.canvasVideo.bindPlayEvent();
    // starts snaps photo record
    that.snaps = [];
    that.snapsGIF = [];

    $('.takeSingleSnap').on('click', function () {
        that.makingSnap = true;
        that.takeSingleSnap();
    });

    $('.takeSnap').on('click', function () {
        that.makingSnap = true;
        that.takeSnap();
    });

    $('.approveSnap').on('click', function () {
        let msg = 'I sent a Snap!';
        $('.mirrorVideoHolder').show();
        $('#snapsPreview').hide();
        $('.recordSnap').show();
        $('.confirmSnap').hide();
        $('.takeSingleSnap').css('left', '122');
        $('.cameraControls').show();

        if (that.mode === 'local') {
            let src = $('#snapsPreview').attr('src');
            // TODO: create utility function for downloading files
            let url = src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
            window.open(url);
            return;
        }

        // close mirror ( fow now )
        // JQDX.closeWindow(that.cameraWindow.content);
        let snapsGIF = $('#snapsPreview').attr('src');
        that.cameraWindow.close();

        buddypond.sendSnaps(that.snapType, that.snapContext, msg, snapsGIF, that.snapDelay, 'camera', function (err, uploadedUrl) {
            that.snaps = [];
            that.currentFrame = 0;
            $('.gifFrames').html('');
            //$('#snapsPreview').attr('src', 'desktop/assets/images/gui/rainbow-tv-loading.gif');
            $('#snapsPreview').data('stopped', true);
            $('#snapDelaySlider').slider('value', 777);
            $('#snapDelaySlider').data('delay', 777);
            that.makingSnap = false;


            // at this point with the new v5 API its expected that the client send a new messages
            // broadcasting the file upload to the CDN

            // now that we have the url, just send a regular message with the url
            // the card type should automatically be detected by the server
            // the the body of the message will be the url with extension of image, video, etc

            // Remark: It might be safer to send an actual card here...
            // The current approach requires we parse the image url on the client
            // We could be brittle if the url has spaces or other characters that break the message format


            // context is buddyname or pondname
            // output is buddy or pond

            let message = {
                to: that.snapContext,
                from: bp.me,
                type: that.snapType,
                text: uploadedUrl
            };
            console.log("sending multimedia message", message);
            bp.emit('buddy::sendMessage', message);


        });
    });

    that.cancelSnap = function cancelSnap() {
        // TODO: show frame limit / timer
        that.snaps = [];
        that.currentFrame = 0;
        $('.cameraControls').show();
        $('.gifFrames').html('');
        //$('#snapsPreview').attr('src', 'desktop/assets/images/gui/rainbow-tv-loading.gif');
        $('#snapsPreview').data('stopped', true);
        $('.mirrorVideoHolder').show();
        $('#snapsPreview').hide();
        $('.takeSingleSnap').css('left', '122');
        $('.recordSnap').show();
        $('.confirmSnap').hide();
        $('.snapDelaySliderControl').hide();
        $('#snapDelaySlider').slider('value', 777);
        $('#snapDelaySlider').data('delay', 777);
        that.makingSnap = false;
    };

    $('.cancelSnap').on('click', function () {
        that.cancelSnap();
    });

    $('.continueSnap').on('click', function () {
        $('.cameraControls').show();
        $('.mirrorVideoHolder').show();
        $('#snapsPreview').hide();
        $('.snapDelaySliderControl').hide();
        $('.recordSnap').show();
        $('.confirmSnap').hide();
        $('.takeSnap').hide();
        $('.takeSingleSnap').css('left', 244);
        $('.takeSingleSnap').show();
        //$('#snapsPreview').data('stopped', true);
        //that.takeSingleSnap();
    });

    if (bp.settings.mirror_snaps_camera_countdown_enabled) {
        $('.cameraCountdownEnabled').prop('checked', 'checked');
    }

    $('.cameraCountdownEnabled').on('change', () => {
        // alert('change')
        if ($(this).prop('checked')) {
            this.bp.set('mirror_snaps_camera_countdown_enabled', true);
        } else {
            this.bp.set('mirror_snaps_camera_countdown_enabled', false);
        }
    });




}