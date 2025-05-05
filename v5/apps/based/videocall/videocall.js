import enumerateDevices from "./lib/enumerateDevices.js";
import replaceStream from "./lib/replaceStream.js";
let wsUrl = 'wss://192.168.200.59:8001/ws';

export default class VideoCall {
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

        return this;
    }

    async init() {
        await this.bp.load('/v5/apps/based/videocall/videocall.css');

        this.html = await this.bp.load('/v5/apps/based/videocall/videocall.html');
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
            // const buddyName = $(e.target).closest('.buddy_message').data('context');
            const buddyName = $('#videochat-buddyname').val();
            const isHost = $('#videochat-isHost').is(':checked');
            this.startCall(this.isHost, this.remoteBuddy);
        });

        d.on('mousedown', '.endVideoCall', (e) => {
            const buddyName = $(e.target).closest('.buddy_message').data('context');
            this.endCall(buddyName);
        });

        $('#videocall-window').on('change', '.selectCamera', (e) => {
            const newDeviceLabel = $(e.target).val();
            this.replaceStream(newDeviceLabel, 'video');
        });

        $('#videocall-window').on('change', '.selectAudio', (e) => {
            const newDeviceLabel = $(e.target).val();
            this.replaceStream(newDeviceLabel, 'audio');
        });
    }

    async open(options = {}) {
        if (this.videocallWindow) {
            if (this.player && options.context) {
                this.player.loadVideoById(options.context);
            }
            return;
        }

        console.log('Opening Video Call Window', options);
        let outgoingBuddy = options.context || null;
        this.videocallWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'videocall-window',
            title: 'Video Call',
            x: 50,
            y: 100,
            width: 600,
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

        // let buddyname = options.context || null;
        // $('#videochat-buddyname').val(outgoingBuddy);
        // const buddyName = $('#videochat-buddyname').val();

        let buddyName = 'Marak';
        this.isHost = false;
        if (this.bp.me === 'Marak') {
            buddyName = 'Bob';
            this.isHost = true;
        }

        this.remoteBuddy = buddyName;
        await this.enumerateDevices();
        await this.addLocalCamera();
        await this.initWebSocket(buddyName);

    }

    async close() {
        if (this.videocallWindow) {
            this.videocallWindow.close();
            this.videocallWindow = null;
        }
        await this.endCall(this.currentBuddy);
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

    async initWebSocket(buddyName) {
        wsUrl += `?me=${encodeURIComponent(this.bp.me)}&buddyname=${encodeURIComponent(buddyName)}&token=your-secret-token`;
        console.log('Connecting to WebSocket:', wsUrl);
        this.websocket = new WebSocket(wsUrl);
    
        this.currentBuddy = buddyName; // Store for use in initPeer
    
        this.websocket.onmessage = async (event) => {
            try {
                console.log('WebSocket message received:', event.data);
                const data = JSON.parse(event.data);
    
                if (data.status === 'connected') {
                    console.log('WebSocket connection opened:', { me: data.me, buddyname: data.buddyname });
                    if (this.isHost) {
                        $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to connect...`);
                    } else {
                        // Click Start Call button to start the call
                        $('.webrtcStatus', this.videocallWindow.content).html(`Click Start Call to accept call from ${buddyName}`);
                        
                    }
                    return;
                }
    
                if (data.type === 'buddyready') {
                    console.log(`Buddy ${buddyName} is ready for pairing`);
                    $('.webrtcStatus', this.videocallWindow.content).html(`${buddyName} is ready! Starting call...`);
    
                    // Determine if this client is the host (initiator)
                    // const isHost = this.bp.me < buddyName; // Alphabetical order to avoid conflicts
                    this.isHost = true;
                    if (this.bp.me !== 'Marak') {
                        this.isHost = false;
                    }
                    // instead of automatically starting the call, enable the start call button
                    $('.startVideoCall').css('opacity', '1');
                    // remove disabled class
                    $('.startVideoCall').removeClass('disabled');

                    // if isHost, start the call
                    if (this.isHost) {
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
    
        this.websocket.onclose = (event) => {
            console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
            $('.webrtcStatus', this.videocallWindow.content).html('WebSocket connection closed');
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
        this.webrtc = new SimplePeer({ initiator: isHost });
    
        // Store pending signals for retry
        const signalQueue = [];
        let retryInterval = null;
        const maxRetries = 9999; // Max retry attempts
        const maxDelay = 8000; // Max delay between retries (8s)
        const retryTimeout = 60000; // Stop retrying after 60s
        let retryCount = 0;
        let startTime = Date.now();
    
        // Retry sending queued signals
        const retrySignals = () => {
            if (retryCount >= maxRetries || Date.now() - startTime > retryTimeout) {
                console.log(`Stopped retrying for ${buddyName}: max retries or timeout reached`);
                $('.webrtcStatus', this.videocallWindow.content).html('Failed to connect: Buddy not available');
                this.endCall(buddyName);
                return;
            }
    
            if (signalQueue.length === 0 || this.websocket.readyState !== WebSocket.OPEN) {
                return;
            }
    
            const signalData = signalQueue[0]; // Retry the first signal
            console.log(`Retrying signal to ${buddyName} (attempt ${retryCount + 1}/${maxRetries})`);
            // $('.webrtcStatus', this.videocallWindow.content).html(`Retrying connection to ${buddyName}... (Attempt ${retryCount + 1})`);
            // waiting for buddyName to accept the call
            $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to accept the call...`);
            this.websocket.send(JSON.stringify(signalData));
        };
    
        // Handle WebRTC stream
        this.webrtc.on('stream', (stream) => {
            console.log(`${buddyName} Camera Connected`);
            const video = document.querySelector('#chatVideoBuddy');
            video.srcObject = stream;
            this.remoteStream = stream;
        });
    
        // Handle WebRTC signal
        this.webrtc.on('signal', (data) => {
            console.log(`Got signal`, data);
            const signalData = { buddyname: buddyName, signal: data };
            signalQueue.push(signalData);
    
            if (this.websocket.readyState === WebSocket.OPEN) {
                console.log(`Sending signal to ${buddyName}:`, signalData);
                this.websocket.send(JSON.stringify(signalData));
            }
    
            // Start retry interval if not already running
            if (!retryInterval) {
                retryInterval = setInterval(() => {
                    retrySignals();
                }, Math.min(1000 * Math.pow(2, retryCount), maxDelay));
            }
        });
    
        // Handle WebRTC errors
        this.webrtc.on('error', (err) => {
            console.error('WebRTC error:', err);
            clearInterval(retryInterval);
            this.endCall(buddyName);
        });
    
        // Handle WebRTC close
        this.webrtc.on('close', () => {
            console.log(`WebRTC connection with ${buddyName} closed`);
            clearInterval(retryInterval);
            this.endCall(buddyName);
        });
    
        // Handle WebRTC connect
        this.webrtc.on('connect', async () => {
            console.log('WebRTC peer connection established');
            $('.webrtcStatus', this.videocallWindow.content).html('WebRTC peer connection established!');
            clearInterval(retryInterval); // Stop retries on successful connection
            signalQueue.length = 0; // Clear queue
            await this.addLocalCamera();
        });
    
        // Update WebSocket message handler to manage retries
        this.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'connected') {
                    console.log('WebSocket connected:', { me: data.me, buddyname: data.buddyname });
                } else if (data.error) {
                    console.error('WebSocket server error:', data.error);
                    if (data.error.includes('not connected') && signalQueue.length > 0) {
                        retryCount++;
                        // Retry will happen via setInterval
                        $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to connect... (Attempt ${retryCount})`);
                    } else {
                        $('.webrtcStatus', this.videocallWindow.content).html('Connection failed');
                        clearInterval(retryInterval);
                        this.endCall(buddyName);
                    }
                } else if (this.webrtc) {
                    console.log(`Received signal for ${buddyName}: ${data.type}`);
                    this.webrtc.signal(data);
                    // Clear queue and stop retries if signal is successfully received
                    if (signalQueue.length > 0 && data.type === signalQueue[0].signal.type) {
                        signalQueue.shift(); // Remove the processed signal
                        if (signalQueue.length === 0) {
                            clearInterval(retryInterval);
                        }
                    }
                }
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };
    
        $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to connect...`);
    }

    async addLocalCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (this.webrtc) {
                this.webrtc.addStream(stream);
            }
            const video = document.querySelector('#chatVideoMe');
            video.srcObject = stream;
            video.muted = true;
            this.localStream = stream;
        } catch (err) {
            console.error('Error accessing local camera:', err);
        }
    }

    async endCall(buddyName) {
        this.pollSignal = false;
        $('.startVideoCall').css('opacity', '1');
        $('.endVideoCall').css('opacity', '0.4');

        // revert webrtcStatus message back to "Click Start Call" or "Waiting for buddy to connect"
        if (this.isHost) {
            $('.webrtcStatus', this.videocallWindow.content).html(`Click Start Call to connect to ${buddyName}`);
        }
        else {
            $('.webrtcStatus', this.videocallWindow.content).html(`Waiting for ${buddyName} to connect...`);
        }

        // Keep the local stream open ( if this works for reconnects )
        /*
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
        }
        */

        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach((track) => track.stop());
        }

        if (this.webrtc) {
            this.webrtc.destroy();
            this.webrtc = null;
        }

        // TODO: should probably be on window close, not endcall
        // since websocket connection is implied once window opens
        /*
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        */

        this.callInProgress = false;
        this.currentBuddy = null;

    }

   
}

VideoCall.prototype.enumerateDevices = enumerateDevices;
VideoCall.prototype.replaceStream = replaceStream;