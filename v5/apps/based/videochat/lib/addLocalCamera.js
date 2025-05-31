export default async function addLocalCamera() {
        try {
            if (!this.localStream) {
                console.log('Requesting local camera and microphone access');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                try {
                    await this.enumerateDevices();
                } catch (err) {
                    console.error('Error enumerating devices:', err);
                    $('.webrtcStatus', this.videocallWindow.content).html('Failed to access camera and microphone. Please check your browser settings.');
                    return;
                }
                console.log('Local camera and microphone access granted');
                // TODO: maybe enumerate here instead?
                this.localStream = stream;
                const video = document.querySelector('#chatVideoMe');
                video.srcObject = stream;
                video.muted = true;
            }
            // Apply current video and audio enabled states
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = this.videoEnabled;
            });
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = this.audioEnabled;
            });
            // Only add stream to WebRTC if connection is active and not already added
            if (this.webrtc && !this.webrtc._streams?.includes(this.localStream)) {
                this.webrtc.addStream(this.localStream);
            }
        } catch (err) {
            console.error('Error accessing local camera:', err);
            let errorMessage = 'Failed to access camera and microphone.';
            if (err.name === 'NotAllowedError') {
                errorMessage = 'Camera and microphone access was denied. Please allow access in your browser settings.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'No camera or microphone found. Please ensure devices are connected.';
            }
            $('.webrtcStatus', this.videocallWindow.content).html(errorMessage);
        }
    }