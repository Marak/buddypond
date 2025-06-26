export default class VisionInstrument {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.numStrings = 8;
        this.lastPlucked = {}; // Map finger ID to last string index
        this.stringVibrations = Array(this.numStrings).fill(0);

        this.lastPluckTime = Array(this.numStrings).fill(0); // Track last pluck time
        this.cooldown = 100; // Cooldown in milliseconds

        this.fingerPositions = {}; // Track previous finger positions
        this.velocityThreshold = 0.05; // Minimum movement speed to trigger a note

        this.fingerTrails = {}; // Maps fingerID → array of {x, y, time}
        this.trailDuration = 500; // ms


        return this;
    }

    async init() {
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/tone/15.2.6/Tone.js');
        await this.bp.appendCSS('/v5/apps/based/vision-harp/vision-harp.css');
        this.html = await this.bp.load('/v5/apps/based/vision-harp/vision-harp.html');

        return 'loaded VisionInstrument';
    }

    async open() {

        if (this.win) {
            console.log('VisionInstrument window is already open');
            this.win.restore();
            this.win.focus();
            return this.win; // Return existing window if already open
        }

        this.win = this.bp.window(this.window());

        // this should be in open, not init
        // Create a polyphonic synth with harp-like settings
        this.synth = new Tone.PolySynth(Tone.FMSynth, {
            harmonicity: 3,
            modulationIndex: 10,
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.5,
                release: 1.5
            }
        });

        // Add effects chain: gain -> reverb -> destination
        const chorus = new Tone.Chorus(4, 2.5, 0.3).start();
        const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination();
        const gain = new Tone.Gain(0.7).connect(chorus).connect(reverb);
        this.synth.connect(gain);

        gain.toDestination();



        this.startLoadingSequence();
        this.startVisionInstrument();
        this.win.maximize();
        return this.win;
    }

    window() {
        const content = this.html;
        return {
            id: 'vision-harp',
            title: 'Vision Harp',
            icon: 'desktop/assets/images/icons/icon_vision-harp_64.png',
            x: 300,
            y: 100,
            width: 700,
            height: 520,
            minWidth: 400,
            content,
            parent: $('#desktop')[0],
            resizable: true,
            maximizable: true,
            closable: true,

            onClose: () => {
                this.win = null; // Clear reference on close
                // close the camera
                this.video.srcObject.getTracks().forEach(track => track.stop());
                this.video = null;
            }


        };
    }

    async startVisionInstrument() {
        this.video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const noteIndicator = document.getElementById('note-indicator');

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.video.srcObject = stream;

        await new Promise(resolve => this.video.onloadeddata = resolve);
        this.video.play();

        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            selfieMode: true // Add this to flip landmarks for mirrored cameras
        });

        const camera = new Camera(this.video, {
            onFrame: async () => await hands.send({ image: this.video }),
            width: 640,
            height: 480,
        });
        camera.start();

        let firstResults = false


        hands.onResults((results) => {

            if (!firstResults) {
                firstResults = true;
                $('.vision-harp-loading', this.win.content).fadeOut(300);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const height = canvas.height;

            // Animate vibrating strings
            for (let i = 0; i < this.numStrings; i++) {
                const x = i * width / this.numStrings + width / (2 * this.numStrings);
                const vibration = this.stringVibrations[i];
                const offset = Math.sin(Date.now() / 30) * vibration * 5;

                ctx.beginPath();
                ctx.moveTo(x + offset, 0);
                ctx.lineTo(x - offset, height);
                // Color strings differently
                const hue = (i * 360 / this.numStrings) % 360;
                ctx.strokeStyle = `hsla(${hue}, 70%, 70%, 0.8)`;
                ctx.lineWidth = 2 + vibration; // Thicker when vibrating
                ctx.stroke();

                this.stringVibrations[i] *= 0.9;
            }
            if (!results.multiHandLandmarks) {
                this.fingerPositions = {}; // Reset positions if no hands detected
                return;
            }

            for (let handIndex = 0; handIndex < results.multiHandLandmarks.length; handIndex++) {
                const hand = results.multiHandLandmarks[handIndex];
                const fingers = [4, 8, 12, 16, 20]; // Finger tip indices

                for (let f = 0; f < fingers.length; f++) {

                    const fingerLandmarkIndex = fingers[f];
                    if (!this.isFingerExtended(hand, fingerLandmarkIndex)) continue;

                    const tip = hand[fingers[f]];
                    const x = tip.x * width;
                    const y = tip.y * height;

                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, 2 * Math.PI);
                    ctx.fillStyle = 'rgba(255,255,255,0.85)';
                    ctx.fill();

                    const fingerID = `${handIndex}-${f}`;


                    // Store ghost trail
                    if (!this.fingerTrails[fingerID]) this.fingerTrails[fingerID] = [];
                    this.fingerTrails[fingerID].push({ x, y, time: Date.now() });

                    // Prune old trail points
                    this.fingerTrails[fingerID] = this.fingerTrails[fingerID].filter(p => Date.now() - p.time < this.trailDuration);


                    const stringWidth = width / this.numStrings;
                    const offset = stringWidth / 2;
                    const stringIndex = Math.floor((x + offset) / stringWidth);

                    // Calculate velocity
                    let velocity = 0;
                    if (this.fingerPositions[fingerID]) {
                        const prev = this.fingerPositions[fingerID];
                        const dx = x - prev.x;
                        const dy = y - prev.y;
                        velocity = Math.sqrt(dx * dx + dy * dy);
                    }
                    this.fingerPositions[fingerID] = { x, y };

                    // Trigger note only if moving fast enough and not recently plucked
                    if (velocity > this.velocityThreshold && this.lastPlucked[fingerID] !== stringIndex) {
                        this.playNote(stringIndex);
                        this.lastPlucked[fingerID] = stringIndex;
                        noteIndicator.innerText = `🎵 Finger ${f + 1} hit string ${stringIndex + 1}`;
                    }
                }
            }

            for (const trail of Object.values(this.fingerTrails)) {
                for (const p of trail) {
                    const age = Date.now() - p.time;
                    const alpha = 1 - age / this.trailDuration;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(0, 255, 255, ${alpha.toFixed(2)})`;
                    ctx.fill();
                }
            }

        });
    }

    isFingerExtended(landmarks, tipIndex) {
        const mcp = landmarks[tipIndex - 3]; // MCP joint (base of finger)
        const pip = landmarks[tipIndex - 2]; // PIP joint (mid)
        const dip = landmarks[tipIndex - 1]; // DIP joint
        const tip = landmarks[tipIndex];     // fingertip

        // Calculate angles between joints: tip -> dip -> pip -> mcp
        const vec1 = { x: dip.x - tip.x, y: dip.y - tip.y };
        const vec2 = { x: pip.x - dip.x, y: pip.y - dip.y };
        const vec3 = { x: mcp.x - pip.x, y: mcp.y - pip.y };

        const dot1 = vec1.x * vec2.x + vec1.y * vec2.y;
        const dot2 = vec2.x * vec3.x + vec2.y * vec3.y;

        const len1 = Math.hypot(vec1.x, vec1.y);
        const len2 = Math.hypot(vec2.x, vec2.y);
        const len3 = Math.hypot(vec3.x, vec3.y);

        const angle1 = Math.acos(dot1 / (len1 * len2));
        const angle2 = Math.acos(dot2 / (len2 * len3));

        // If both angles are close to straight (i.e., 180 deg or pi), finger is likely extended
        return angle1 < 0.5 && angle2 < 0.5; // radians
    }

    playNote(stringIndex, velocity = 1) {
        const now = Date.now();
        if (now - this.lastPluckTime[stringIndex] < this.cooldown) return;

        const notes = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'];
        const note = notes[stringIndex % notes.length];

        try {
            // Scale volume based on velocity (0.1 to 1)
            const volume = Math.min(1, Math.max(0.1, velocity * 2));
            this.synth.set({ volume: -20 + volume * 20 }); // -20dB to 0dB
            this.synth.triggerAttackRelease(note, '8n');
            this.stringVibrations[stringIndex] = velocity; // Scale vibration with velocity
            this.lastPluckTime[stringIndex] = now;
        } catch (err) {
            console.warn('Error playing note:', err);
        }
    }

    startLoadingSequence() {
        const steps = [
            "Initializing camera...",
            "Loading vision model...",
            "Warming up tensors...",
            "Calibrating hand gestures...",
            "Initializing Synth...",
            "Finalizing setup..."
        ];

        let stepIndex = 0;
        const $loadingText = $('#loading-text', this.win.content);

        const interval = setInterval(() => {
            $loadingText.text(steps[stepIndex]);
            stepIndex++;

            // End of steps — stop interval
            if (stepIndex >= steps.length) {
                clearInterval(interval);
            }
        }, 1200); // Change step every 1.2s
    }

}
