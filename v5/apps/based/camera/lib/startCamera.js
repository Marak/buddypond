export default function startCamera(deviceLabel) {
    // opens local camera device and streams it to <video> tag
    // takes in optional device label
    // if no label is provided, will default to first camera found in array
    // console.log('starting with device label: ', deviceLabel)
    let that = this;
        let deviceId = this.devices.videoinput[deviceLabel].deviceId;
        navigator.mediaDevices.getUserMedia({
            video: {
                'deviceId': deviceId
            },
            audio: false
        }).then(function (stream) {
            stream.getTracks().forEach(function (track) {
                $('.selectMirrorCamera').val(track.label);
            });
            let video = document.querySelector('#mirrorVideoMe');

            video.onplay = function () {
                if (this.snapContext) {
                    $('.recordSnap').show();
                } else {
                    // desktop.app.mirror.showFullMirror();
                }
            };

            video.srcObject = stream;
            that.localStream = stream;
            //video.style.display = 'block';
            $('#mirrorPlaceHolder', that.cameraWindow.content).fadeOut();
            // show the 
        }).catch((err) => {
            console.log('error in calling navigator.mediaDevices.getUserMedia', err);
        });
 

}