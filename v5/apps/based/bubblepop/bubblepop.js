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
        this.spawnRate = 1000; // Milliseconds between bubble spawns
        this.burstAnimations = []; // Array for burst effect animations
        this.lastPopTime = 0; // Track last pop sound time
        this.cooldown = 50; // Cooldown in milliseconds
        return this;
    }

    async init() {
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/tone/15.2.6/Tone.js');
        await this.bp.appendCSS('/v5/apps/based/bubblepop/bubble-pop.css');
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
        this.win = this.bp.window(this.window());
        this.startBubblePop();
        this.win.maximize();
        return this.win;
    }

    window() {
        const content = `
        <video class="bubble-pop-video" id="video" width="640" height="480" autoplay style="display:none;"></video>
        <canvas id="canvas" width="640" height="480" style="background:black; cursor:none;"></canvas>
        <div style="position:absolute; top:10px; left:10px; color:white; font-size:14px;" id="status">
            🎈 BubblePop | Score: 0 | C: Clear, R: Reset
        </div>
        `;
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
        const radius = 20 + Math.random() * 20; // Random radius between 20 and 40
        const x = Math.random() * (640 - 2 * radius) + radius; // Random x within canvas
        const speedY = -(1 + Math.random() * 2); // Upward speed (1-3 pixels/frame)
        const speedX = (Math.random() - 0.5) * 2; // Slight horizontal drift
        if (this.bubbles.length >= this.maxBubbles) {
            // Remove the oldest bubble if max limit reached
            //this.bubbles.shift();
            return;
        }
        this.bubbles.push({ x, y: 480 + radius, radius, speedY, speedX });
    }

    async startBubblePop() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const status = document.getElementById('status');

        // Keyboard controls (unchanged)
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'c':
                    this.bubbles = [];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    status.innerText = `🎈 BubblePop | Score: ${this.score} | C: Clear, R: Reset`;
                    break;
                case 'r':
                    this.bubbles = [];
                    this.score = 0;
                    this.spawnRate = 1000;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    status.innerText = `🎈 BubblePop | Score: ${this.score} | C: Clear, R: Reset`;
                    break;
            }
        });

        // Start bubble spawning (unchanged)
        const spawnInterval = setInterval(() => {
            this.spawnBubble();
            this.spawnRate = Math.max(300, this.spawnRate * 0.95);
        }, this.spawnRate);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await new Promise(resolve => (video.onloadeddata = resolve));
        video.play();

        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            selfieMode: true
        });

        const camera = new Camera(video, {
            onFrame: async () => await hands.send({ image: video }),
            width: 640,
            height: 480,
        });
        camera.start();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw bubbles (unchanged)
            this.bubbles.forEach(bubble => {
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0{atan2(0, 0)})';
                ctx.stroke();
                bubble.y += bubble.speedY;
                bubble.x += bubble.speedX;
            });

            // Draw burst animations (unchanged)
            this.burstAnimations = this.burstAnimations.filter(anim => anim.radius < 60);
            this.burstAnimations.forEach(anim => {
                ctx.beginPath();
                ctx.arc(anim.x, anim.y, anim.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - anim.radius / 60})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                anim.radius += 2;
            });

            // Remove off-screen bubbles (unchanged)
            this.bubbles = this.bubbles.filter(bubble => bubble.y > -bubble.radius);

            // Update spawn interval (unchanged)
            clearInterval(spawnInterval);
            setInterval(() => this.spawnBubble(), this.spawnRate);

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        hands.onResults((results) => {
            if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
                this.lastPos = null;
                this.positionHistory = [];
                status.innerText = `🎈 BubblePop | Score: ${this.score} | C: Clear, R: Reset`;
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

            // Draw cursor
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();

            // Check for bubble collisions
            const now = Date.now();
            this.bubbles = this.bubbles.filter(bubble => {
                const distance = Math.hypot(x - bubble.x, y - bubble.y);
                if (distance < bubble.radius && now - this.lastPopTime >= this.cooldown) {
                    this.score++;
                    this.synth.triggerAttackRelease('C5', '16n', Tone.now());
                    this.lastPopTime = now;
                    this.burstAnimations.push({ x: bubble.x, y: bubble.y, radius: bubble.radius });
                    status.innerText = `🎈 BubblePop | Score: ${this.score} | C: Clear, R: Reset`;
                    return false; // Remove popped bubble
                }
                return true;
            });

            this.lastPos = { x, y };
        });
    }
}