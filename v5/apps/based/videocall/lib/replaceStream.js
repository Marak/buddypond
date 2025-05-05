export default async function replaceStream(label, kind) {
    const newDevice = this.alldevices[label];
    if (!newDevice) return;

    try {
        const constraints = kind === 'video' ? { video: { deviceId: newDevice.deviceId }, audio: false } : { audio: { deviceId: newDevice.deviceId }, video: false };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const newTrack = stream.getTracks()[0];

        this.localStream.getTracks().forEach((track) => {
            if (track.kind === kind) {
                this.webrtc.replaceTrack(track, newTrack, this.localStream);
                track.stop(); // Stop the old track
            }
        });

        const video = document.querySelector('#chatVideoMe');
        video.srcObject = stream;
        $(`.select${kind === 'video' ? 'Camera' : 'Audio'}`, this.videocallWindow).val(newTrack.label);
    } catch (err) {
        console.error(`Error replacing ${kind} stream:`, err);
    }
}