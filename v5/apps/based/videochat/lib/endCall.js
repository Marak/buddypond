export default async function endCall(buddyName) {
    this.pollSignal = false;

    if (this.callTimer) {
        clearInterval(this.callTimer);
        this.callTimer = null;
    }

    $('.startVideoCall').css('opacity', '1');
    $('.endVideoCall').css('opacity', '0.4');
    $('.webrtcStatus', this.videocallWindow.content).html(`Click Start Call to connect to ${buddyName}`);

    if (this.remoteStream) {
        this.remoteStream.getTracks().forEach((track) => track.stop());
    }

    if (this.webrtc) {
        this.webrtc.destroy();
        this.webrtc = null;
    }

    this.callInProgress = false;
    this.currentBuddy = null;

}
