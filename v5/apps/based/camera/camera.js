import enumerateDevices from './lib/enumerateDevices.js';
import startCamera from './lib/startCamera.js';
import bindUIEvents from './lib/bindUIEvents.js';
import resizeFullVideo from './lib/resizeFullVideo.js';


// snaps
import takeSnap from './lib/snaps/takeSnap.js';
import takeSingleSnap from './lib/snaps/takeSingleSnap.js';
import recordSnaps from './lib/snaps/recordSnaps.js';
import createGif from './lib/snaps/createGif.js';

export default class Camera {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.allDevices = {};
        this.devices = {
            videoinput: {},
            audioinput: {},
            audiooutput: {}
        };


        // "local" mode indicates the mirror will save photos locally to file-system
        // This could also be "snap" which indicates photos will be sent out as Snaps ( multimedia chat messages )
        this.mode = 'local';

        this.fullMirror = false;
        this.showingControls = true;

        // Three view modes available for Mirror: Normal, Half, Full
        this.viewMode = 'Normal';


        this.selectedCameraIndex = 0;

        // starts photo record
        this.MAX_FRAMES_PER_SNAP = 10;
        this.DEFAULT_SNAP_TIMER = 777;
        this.CAMERA_SHUTTER_DELAY = 55;
        this.currentFrame = 0;

        // temporary storage for snaps before being sent out
        this.snaps = [];





        return this;
    }

    async init() {
        this.bp.log('Hello from Example');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/camera/camera.css');
        await this.bp.appendScript('/v5/apps/based/camera/vendor/jsman.js');
        await this.bp.appendScript('/v5/apps/based/camera/lib/CanvasVideo.js');
        await this.bp.appendScript('/desktop/assets/js/gif.js');



        // fetches html from the fragment and returns it as a string
        let html = await this.bp.load('/v5/apps/based/camera/camera.html');
        // await imports the module and returns it
        // let module = await this.bp.load('/v5/apps/based/_example/_example.js');

        this.html = html;







        return 'loaded Camera';
    }

    async open(options = {}) {

        if (!this.cameraWindow) {
            this.cameraWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'camera',
                title: 'Camera',
                x: 50,
                y: 100,
                width: 640,
                height: 580,
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

                    delete this.cameraWindow;
                    // alert('closing camera');

                    if (this.makingSnap) {
                        this.cancelSnap();
                    }

                    console.log('tttt', this)
                    // when closing the window for the Mirror App
                    // stop all tracks associated with open stream
                    if (this.localStream && this.localStream.getTracks) {
                        this.localStream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    }


                }
            });




            $('#mirrorCanvasMe', this.cameraWindow.content).css('width', 640);
            $('#mirrorCanvasMe', this.cameraWindow.content).css('height', 480);

            $('#snapDelaySlider', this.cameraWindow.content).show();
            this.bindUIEvents();





        }


        this.snapContext = options.context;
        this.snapType = options.type;

        if (options.context) {
            this.mode = 'snap';
        } else {
            this.mode = 'local';
        }

        if (this.mode === 'local') {
            $('.approveSnap').attr('title', 'Save to Local');
        } else {
            $('.approveSnap').attr('title', 'Approve and Send');
        }

        /*
        $('.snapControl').hide();
        $('.confirmSnap').hide();
        $('#snapDelaySlider').slider('value', 777);
        $('#snapDelaySlider').data('delay', 777);
        */




        await this.enumerateDevices();

        let firstCamera = this.devices.videoinput[Object.keys(this.devices.videoinput)[0]].label;
        //let defaultCamera = desktop.settings.mirror_selected_camera_device_label;


        await this.startCamera(firstCamera);

        // Focus on the newly created or updated window
        this.bp.apps.ui.windowManager.focusWindow(this.cameraWindow);

    }
}



Camera.prototype.enumerateDevices = enumerateDevices;
Camera.prototype.startCamera = startCamera;
Camera.prototype.bindUIEvents = bindUIEvents;
Camera.prototype.resizeFullVideo = resizeFullVideo;

// snaps
Camera.prototype.takeSingleSnap = takeSingleSnap;
Camera.prototype.recordSnaps = recordSnaps;
Camera.prototype.createGif = createGif;
Camera.prototype.takeSnap = takeSnap;