export default class BubblePop {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.bubbles = []; // Array of bubble objects {x, y, radius, speedY, speedX}
        this.score = 0;
        this.maxBubbles = 50; // Maximum bubbles on screen
        this.lastPos = null;
        this.positionHistory = []; // For smoothing finger position
        this.maxHistory = 3; // Number of points to average
        this.spawnRate = 200; // Milliseconds between bubble spawns
        this.burstAnimations = []; // Array for burst effect animations
        this.lastPopTime = 0; // Track last pop sound time
        this.cooldown = 50; // Cooldown in milliseconds

        this.lastCursorTime = 0; // Track last hand detection time
        this.cursorTimeout = 500; // 500ms timeout for cursor persistence

        this.spawnInterval = null; // Initialize spawnInterval
        this.animationFrameId = null; // Initialize animation frame ID

        this.chainCount = 0; // Track number of chained pops
        this.chainThreshold = 800; // 800ms threshold for pitch chain
        this.pitchNotes = ['C5', 'C#5', 'D5', 'D#5', 'E5', 'F5']; // Pitch progression
    

        return this;
    }

    async init() {
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/tone/15.2.6/Tone.js');
        this.html = await this.bp.load('/v5/apps/based/bubblepop/bubblepop.html');
        await this.bp.appendCSS('/v5/apps/based/bubblepop/bubblepop.css');
        this.synth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
        try {
            Tone.start(); // don't wait for user interaction, Tone.js will handle it
        } catch (err) {
            console.log(err);
        }
        return 'loaded BubblePop';
    }

    async open() {

        if (this.win) {
            console.warn('BubblePop window already open, returning existing window');
            this.win.restore();
            this.win.focus();
            return this.win;
        }

        this.win = this.bp.window(this.window());
        this.startLoadingSequence();
        this.startBubblePop();
        this.win.maximize();
        return this.win;
    }

    window() {
        const content = this.html;
        return {
            id: 'bubblepop',
            title: 'BubblePop',
            icon: 'desktop/assets/images/icons/icon_game_64.png',
            x: 300,
            y: 100,
            width: 700,
            height: 520,
            content,
            parent: $('#desktop')[0],
            resizable: true,
            maximizable: true,
            closable: true,
            onClose: () => {
                // Clean up resources
                if (this.spawnInterval) {
                    clearInterval(this.spawnInterval);
                    this.spawnInterval = null;
                }
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
                if (this.camera) {
                    this.camera.stop();
                    this.camera = null;
                }
                if (this.hands) {
                    this.hands.close();
                    this.hands = null;
                }
                if (this.video && this.video.srcObject) {
                    this.video.srcObject.getTracks().forEach(track => track.stop());
                    this.video.srcObject = null;
                }
                this.video = null;
                this.bubbles = [];
                this.positionHistory = [];
                this.lastPos = null;
                this.lastCursorTime = 0;
                this.burstAnimations = [];
                this.score = 0;
                this.win = null;
            }

        };
    }

    smoothPosition(newPos) {
        this.positionHistory.push(newPos);
        if (this.positionHistory.length > this.maxHistory) {
            this.positionHistory.shift();
        }
        const avgPos = { x: 0, y: 0 };
        this.positionHistory.forEach(pos => {
            avgPos.x += pos.x;
            avgPos.y += pos.y;
        });
        avgPos.x /= this.positionHistory.length;
        avgPos.y /= this.positionHistory.length;
        return avgPos;
    }

    spawnBubble() {
        const radius = 20 + Math.random() * 20;
        const x = Math.random() * (640 - 2 * radius) + radius;
        const speedY = -(1 + Math.random() * 1.5);
        const speedX = (Math.random() - 0.5) * 1.5;
        if (this.bubbles.length >= this.maxBubbles) {
            return;
        }
        this.bubbles.push({ x, y: 480 + radius, radius, speedY, speedX });
    }

 async startBubblePop() {
        this.video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const status = document.getElementById('status');
        const scoreDisplay = document.getElementById('score-display');

        // Initialize score display
        scoreDisplay.innerText = `Score: ${this.score}`;

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'c':
                    this.bubbles = [];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    status.innerText = `🎈 BubblePop | C: Clear, R: Reset`;
                    scoreDisplay.innerText = `Score: ${this.score}`;
                    break;
                case 'r':
                    this.bubbles = [];
                    this.score = 0;
                    this.chainCount = 0; // Reset chain count
                    this.spawnRate = 1000;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    status.innerText = `🎈 BubblePop | C: Clear, R: Reset`;
                    scoreDisplay.innerText = `Score: ${this.score}`;
                    if (this.spawnInterval) {
                        clearInterval(this.spawnInterval);
                        this.spawnInterval = setInterval(() => this.spawnBubble(), this.spawnRate);
                    }
                    break;
            }
        });

        // Start bubble spawning
        this.spawnInterval = setInterval(() => {
            this.spawnBubble();
            const newSpawnRate = Math.max(300, this.spawnRate * 0.95);
            if (Math.abs(newSpawnRate - this.spawnRate) > 1) { // Only update if significant change
                this.spawnRate = newSpawnRate;
                if (this.spawnInterval) {
                    clearInterval(this.spawnInterval);
                    this.spawnInterval = setInterval(() => this.spawnBubble(), this.spawnRate);
                }
            }
        }, this.spawnRate);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.video.srcObject = stream;
        await new Promise(resolve => (this.video.onloadeddata = resolve));
        this.video.play();

        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            selfieMode: true
        });

        this.camera = new Camera(this.video, {
            onFrame: async () => await this.hands.send({ image: this.video }),
            width: 640,
            height: 480,
        });
        this.camera.start();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw bubbles
            this.bubbles.forEach(bubble => {
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 1;
                ctx.stroke();
                bubble.y += bubble.speedY;
                bubble.x += bubble.speedX;
            });

            // Draw burst animations
            this.burstAnimations = this.burstAnimations.filter(anim => anim.radius < 60);
            this.burstAnimations.forEach(anim => {
                ctx.beginPath();
                ctx.arc(anim.x, anim.y, anim.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - anim.radius / 60})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                anim.radius += 2;
            });

            // Draw cursor if within timeout
            if (this.lastPos && Date.now() - this.lastCursorTime < this.cursorTimeout) {
                ctx.beginPath();
                ctx.arc(this.lastPos.x, this.lastPos.y, 6, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255, 255, 255, ${1 - (Date.now() - this.lastCursorTime) / this.cursorTimeout})`;
                ctx.fill();
            }

            // Remove off-screen bubbles
            this.bubbles = this.bubbles.filter(bubble => bubble.y > -bubble.radius);

            this.animationFrameId = requestAnimationFrame(animate);
        };
        this.animationFrameId = requestAnimationFrame(animate);

        let firstResults = false;

        this.hands.onResults((results) => {
            if (!firstResults) {
                firstResults = true;
                $('.bubblepop-loading', this.win.content).fadeOut(300);
            }

            if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
                status.innerText = `🎈 BubblePop | No hand detected | C: Clear, R: Reset`;
                return;
            }

            const hand = results.multiHandLandmarks[0];
            const tip = hand[8]; // Index finger tip
            let x = tip.x * canvas.width;
            let y = tip.y * canvas.height;

            // Smooth position
            const smoothedPos = this.smoothPosition({ x, y });
            x = smoothedPos.x;
            y = smoothedPos.y;

            // Update cursor position and timestamp
            this.lastPos = { x, y };
            this.lastCursorTime = Date.now();

            // Check for bubble collisions
            const now = Date.now();
            this.bubbles = this.bubbles.filter(bubble => {
                const distance = Math.hypot(x - bubble.x, y - bubble.y);
                if (distance < bubble.radius && now - this.lastPopTime >= this.cooldown) {
                    this.score++;
                    // Calculate pitch based on chain
                    if (now - this.lastPopTime <= this.chainThreshold) {
                        this.chainCount = Math.min(this.chainCount + 1, this.pitchNotes.length - 1);
                    } else {
                        this.chainCount = 0; // Reset chain if too much time has passed
                    }
                    const note = this.pitchNotes[this.chainCount];
                    this.synth.triggerAttackRelease(note, '16n', Tone.now());
                    this.lastPopTime = now;
                    this.burstAnimations.push({ x: bubble.x, y: bubble.y, radius: bubble.radius });
                    scoreDisplay.innerText = `Score: ${this.score}`;
                    status.innerText = `🎈 BubblePop | C: Clear, R: Reset`;
                    return false;
                }
                return true;
            });
        });
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