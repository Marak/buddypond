import enumerateDevices from "./lib/enumerateDevices.js";
import replaceStream from "./lib/replaceStream.js";
import addLocalCamera from "./lib/addLocalCamera.js";

let wsEndpoint = 'wss://videochat.buddypond.com/ws';
// wsEndpoint = 'wss://192.168.200.59:8001/ws';

export default class VideoChat {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.webrtc = null;
        this.localStream = null;
        this.remoteStream = null;
        this.callInProgress = false;
        this.pollSignal = false;
        this.devices = { videoinput: {}, audioinput: {}, audiooutput: {} };
        this.alldevices = {};
        this.currentBuddy = null;
        this.websocket = null;
        this.isHost = false;
        this.remoteBuddy = null;
        this.acceptedCall = false;
        this.videoEnabled = true;
        this.audioEnabled = true;
        this.signalQueue = [];

        return this;
    }

    async init() {
        await this.bp.load('/v5/apps/based/videochat/videochat.css');
        this.html = await this.bp.load('/v5/apps/based/videochat/videochat.html');
        await this.bp.load('/desktop/assets/js/simplepeer.min.js');
        this.bindEvents();
    }

    bindEvents() {
        const d = $(document);
        d.on('mousedown', '.startVideoCall', (e) => {
            if (this.bp.me === 'anonymous') {
                alert('You must create an account. Anonymous cannot make video calls');
                return;
            }
            const buddyName = $('#videochat-buddyname').val();
            const isHost = $('#videochat-isHost').is(':checked');
            this.startCall(this.isHost, this.remoteBuddy);
        });

        d.on('mousedown', '.endVideoCall', (e) => {
            const buddyName = $(e.target).closest('.buddy_message').data('context');
            this.endCall(buddyName);
        });

        d.on('change', '.selectCamera', (e) => {
            const newDeviceLabel = $(e.target).val();
            this.replaceStream(newDeviceLabel, 'video');
        });

        d.on('change', '.selectAudio', (e) => {
            // const newDevicecopy {
            const newDeviceLabel = $(e.target).val();
            this.replaceStream(newDeviceLabel, 'audio');
        });

        d.on('mousedown', '.toggleVideo', () => {
            this.toggleVideo();
        });

        d.on('mousedown', '.toggleAudio', () => {
            this.toggleAudio();
        });
    }

    toggleVideo() {
        if (!this.localStream) return;
        this.videoEnabled = !this.videoEnabled;
        this.localStream.getVideoTracks().forEach(track => {
            track.enabled = this.videoEnabled;
        });
        const $toggleButton = $('.toggleVideo', this.videocallWindow.content);
        $toggleButton.text(this.videoEnabled ? 'Turn Video Off' : 'Turn Video On');
        $toggleButton.toggleClass('muted', !this.videoEnabled);
    }

    toggleAudio() {
        if (!this.localStream) return;
        this.audioEnabled = !this.audioEnabled;
        this.localStream.getAudioTracks().forEach(track => {
            track.enabled = this.audioEnabled;
        });
        const $toggleButton = $('.toggleAudio', this.videocallWindow.content);
        $toggleButton.text(this.audioEnabled ? 'Mute Audio' : 'Unmute Audio');
        $toggleButton.toggleClass('muted', !this.audioEnabled);
    }

    async open(options = {}) {
        console.log('Opening Video Call Window', options);
        let buddyname = options.context || null;

        if (typeof options.isHost !== 'undefined') {
            this.isHost = options.isHost;
        }

        if (!this.videocallWindow) {
            this.videocallWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'videochat-window',
                title: 'Video Chat',
                x: 50,
                y: 100,
                width: 800,
                height: 480,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                icon: '/desktop/assets/images/icons/icon_interdimensionalcable_64.png',
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => this.close()
            });
        }

        this.videocallWindow.focus();
        this.remoteBuddy = buddyname;

        if (options.acceptedCall) {
            this.acceptedCall = true;
        }

        await this.addLocalCamera();
        await this.initWebSocket(buddyname);

        return this.videocallWindow; // TODO
    }

    async close() {
        console.log('closing app', this)
        await this.endCall(this.currentBuddy);
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = null;
        }
        if (this.videocallWindow) {
            this.videocallWindow = null;
        }
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }

    async startCall(isHost, buddyName) {
        console.log('Starting call with', buddyName, 'isHost:', isHost);
        if (!navigator.mediaDevices) {
            alert('navigator.mediaDevices is undefined. Are you having HTTPS/SSL issues?');
            return;
        }

        if (this.callInProgress) {
            console.warn('Call already in progress');
            return;
        }

        this.callInProgress = true;
        this.currentBuddy = buddyName;
        $('.endVideoCall').css('opacity', '1');
        $('.startVideoCall').css('opacity', '0.4');
        $('.buddyName', this.videocallWindow.content).html(buddyName);
        $('.webrtcStatus', this.videocallWindow.content).html('Sending WebRTC Handshake Request...');
        await this.initPeer(isHost, buddyName);
    }

    async endCall(buddyName) {
        this.pollSignal = false;
        this.signalQueue = [];

        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }

        if (this.videocallWindow.content) {
            $('.startVideoCall').css('opacity', '1');
            $('.endVideoCall').css('opacity', '0.4');
            $('.webrtcStatus', this.videocallWindow.content).html(`Click Start Call to connect to ${buddyName}`);
        }

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

    async initWebSocket(buddyName) {
        let wsUrl = wsEndpoint + `?me=${encodeURIComponent(this.bp.me)}&buddyname=${encodeURIComponent(buddyName)}&qtokenid=${encodeURIComponent(this.bp.qtokenid)}`;
        console.log('Connecting to WebSocket:', wsUrl);
        this.websocket = new WebSocket(wsUrl);

        this.currentBuddy = buddyName;

        this.websocket.onmessage = async (event) => {
            try {
                console.log('WebSocket message received:', event.data);
                const data = JSON.parse(event.data);

                if (data.status === 'connected') {
                    console.log('WebSocket connection opened:', { me: data.me, buddyname: data.buddyname });
                    if (this.isHost) {
                        $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to connect...`);
                    } else {
                        $('.webrtcStatus', this.videocallWindow.content).html(`Click Start Call to accept call from ${buddyName}`);
                    }
                    return;
                }

                if (data.type === 'buddyready') {
                    console.log(`Buddy ${buddyName} is ready for pairing`);
                    $('.webrtcStatus', this.videocallWindow.content).html(`${buddyName} is ready! Starting call...`);
                    $('.startVideoCall').css('opacity', '1');
                    $('.startVideoCall').removeClass('disabled');
                    if (this.isHost || this.acceptedCall) {
                        await this.startCall(this.isHost, this.remoteBuddy);
                    }
                    return;
                }

                if (data.type === 'buddydisconnected') {
                    console.log(`Buddy ${buddyName} disconnected`);
                    $('.webrtcStatus', this.videocallWindow.content).html(`${buddyName} disconnected`);
                    this.endCall(buddyName);
                    return;
                }

                if (data.error) {
                    console.error('WebSocket server error:', data.error, 'code:', data.code);
                    $('.webrtcStatus', this.videocallWindow.content).html('Connection failed');
                    this.endCall(buddyName);
                    return;
                }

                if (data && this.webrtc) {
                    console.log(`Received signal for ${buddyName}: ${data.type}`);
                    this.webrtc.signal(data);

                    if (this.signalQueue.length > 0 && data.type === this.signalQueue[0].signal.type) {
                        this.signalQueue.shift();
                        if (this.callTimersignalQueue.length === 0) {
                            clearInterval(retryInterval);
                        }
                    }
                }

            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        this.websocket.onerror = (err) => {
            console.error('WebSocket error:', err);
            $('.webrtcStatus', this.videocallWindow.content).html('WebSocket connection failed');
            this.endCall(buddyName);
        };
        // TODO: add a reconnection strategy for unexpected closures
        this.websocket.onclose = (event) => {
            console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
            if (this.videocallWindow && this.videocallWindow.content) {
                $('.webrtcStatus', this.videocallWindow.content).html('WebSocket connection closed');
            }
            this.endCall(buddyName);
        };

        try {
            await new Promise((resolve, reject) => {
                this.websocket.onopen = () => {
                    console.log('WebSocket connection opened');
                    resolve();
                };
                this.websocket.onerror = (err) => {
                    reject(new Error('WebSocket connection failed'));
                };
            });
        } catch (err) {
            console.error('Failed to open WebSocket:', err);
            throw err;
        }
    }

    async initPeer(isHost, buddyName) {
        console.log('Initializing WebRTC peer connection', isHost, buddyName);
        $('.webrtcStatus', this.videocallWindow.content).html('Initiating Peer Connection...');
        this.webrtc = new SimplePeer({
            initiator: isHost,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    // Add TURN server if available
                    // { urls: 'turn:your.turn.server', username: 'username', credential: 'password' }
                ]
            }
        });

        let retryInterval = null;
        const maxRetries = 9999;
        const maxDelay = 8000;
        const retryTimeout = 60000;
        let retryCount = 0;
        let startTime = Date.now();

        const retrySignals = () => {
            if (retryCount >= maxRetries || Date.now() - startTime > retryTimeout) {
                console.log(`Stopped retrying for ${buddyName}: max retries or timeout reached`);
                $('.webrtcStatus', this.videocallWindow.content).html('Failed to connect: Buddy not available');
                this.endCall(buddyName);
                return;
            }

            if (this.signalQueue.length === 0 || this.websocket.readyState !== WebSocket.OPEN) {
                return;
            }

            const signalData = this.signalQueue[0];
            console.log(`Retrying signal to ${buddyName} (attempt ${retryCount + 1}/${maxRetries})`);
            $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to accept the call...`);
            this.websocket.send(JSON.stringify(signalData));
        };

        this.webrtc.on('stream', (stream) => {
            console.log(`${buddyName} Camera Connected`);
            const video = document.querySelector('#chatVideoBuddy');
            video.srcObject = stream;
            this.remoteStream = stream;
        });

        this.webrtc.on('signal', (data) => {
            console.log(`Got signal`, data);
            const signalData = { buddyname: buddyName, signal: data };
            this.signalQueue.push(signalData);

            if (this.websocket.readyState === WebSocket.OPEN) {
                console.log(`Sending signal to ${buddyName}:`, signalData);
                this.websocket.send(JSON.stringify(signalData));
            }

            if (!retryInterval) {
                retryInterval = setInterval(() => {
                    retrySignals();
                }, Math.min(1000 * Math.pow(2, retryCount), maxDelay));
            }
        });

        this.webrtc.on('error', (err) => {
            console.error('WebRTC error:', err);
            if (retryInterval) {
                clearInterval(retryInterval);
            }
            this.restartPeerConnection();

            //this.endCall(buddyName);
        });

        this.webrtc.on('close', () => {
            console.log(`WebRTC connection with ${buddyName} closed`);
            clearInterval(retryInterval);
            this.endCall(buddyName);
        });

        this.webrtc.on('connect', async () => {
            console.log('WebRTC peer connection established');
            $('.webrtcStatus', this.videocallWindow.content).html('WebRTC peer connection established!');
            clearInterval(retryInterval);
            this.signalQueue.length = 0;
            // Only add stream to WebRTC if not already added
            if (this.localStream && this.webrtc) {
                this.localStream.getVideoTracks().forEach(track => {
                    track.enabled = this.videoEnabled;
                });
                this.localStream.getAudioTracks().forEach(track => {
                    track.enabled = this.audioEnabled;
                });
                this.webrtc.addStream(this.localStream);
            }
            this.startCallTimer();
        });

        this.webrtc.on('iceConnectionStateChange', () => {
            const iceState = this.webrtc._pc.iceConnectionState;
            console.log(`ICE connection state: ${iceState}`);
            $('.webrtcStatus', this.videocallWindow.content).html(`ICE state: ${iceState}`);
            if (iceState === 'disconnected' || iceState === 'failed') {
                this.restartPeerConnection();
            }
        });


        $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to connect...`);
    }

    startCallTimer() {
        let seconds = 0;
        this.callTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.videocallWindow.setTitle(`Video Chat - (${minutes}:${secs.toString().padStart(2, '0')})`);
        }, 1000);
    }

    restartPeerConnection() {
        if (!this.callInProgress) return;
        console.log('Restarting WebRTC connection...');
        if (this.webrtc) {
            this.webrtc.destroy();
            this.webrtc = null;
        }
        setTimeout(() => {
            this.initPeer(this.isHost, this.currentBuddy);
        }
        , 1000);
    }

}

VideoChat.prototype.addLocalCamera = addLocalCamera;
VideoChat.prototype.enumerateDevices = enumerateDevices;
VideoChat.prototype.replaceStream = replaceStream;