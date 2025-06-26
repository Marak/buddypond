export default class PosePuppet {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.waveCount = 0; // Track number of wave gestures
        this.isSpinning = false; // Flag for spin animation
        this.spinAngle = 0; // Current spin angle
        this.backgroundColor = 'rgb(50, 50, 100)'; // Default background
        return this;
    }

    async init() {
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendCSS('/v5/apps/based/posepuppet/pose-puppet.css');
        return 'loaded PosePuppet';
    }

    async open() {
        this.win = this.bp.window(this.window());
        this.startPosePuppet();
        this.win.maximize();
        return this.win;
    }

    window() {
        const content = `
        <video class="pose-puppet-video" id="video" width="640" height="480" autoplay style="display:none;"></video>
        <canvas id="canvas" width="640" height="480" style="cursor:none;"></canvas>
        <div style="position:absolute; top:10px; left:10px; color:white; font-size:14px;" id="status">
            🧍 PosePuppet | Waves: 0 | B: Change Background, R: Reset
        </div>
        `;
        return {
            id: 'posepuppet',
            title: 'PosePuppet',
            icon: 'desktop/assets/images/icons/icon_puppet_64.png',
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

    isWaveGesture(landmarks) {
        // Wave: Both wrists above shoulders
        const leftWrist = landmarks[15]; // Left wrist
        const rightWrist = landmarks[16]; // Right wrist
        const leftShoulder = landmarks[11]; // Left shoulder
        const rightShoulder = landmarks[12]; // Right shoulder
        return leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    }

    async startPosePuppet() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const status = document.getElementById('status');

        let latestLandmarks = null; // 👈 cache the latest pose

        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'b':
                    this.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                    status.innerText = `🧍 PosePuppet | Waves: ${this.waveCount} | B: Change Background, R: Reset`;
                    break;
                case 'r':
                    this.waveCount = 0;
                    this.isSpinning = false;
                    this.spinAngle = 0;
                    status.innerText = `🧍 PosePuppet | Waves: ${this.waveCount} | B: Change Background, R: Reset`;
                    break;
            }
        });

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await new Promise(resolve => (video.onloadeddata = resolve));
        video.play();

        const pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });

        const camera = new Camera(video, {
            onFrame: async () => await pose.send({ image: video }),
            width: 640,
            height: 480,
        });
        camera.start();

        pose.onResults((results) => {
            if (!results.poseLandmarks) {
                latestLandmarks = null;
                return;
            }
            latestLandmarks = results.poseLandmarks;
        });

        const drawPuppet = (landmarks) => {
            const width = canvas.width;
            const height = canvas.height;

            // Map landmarks
            const map = i => ({ x: landmarks[i].x * width, y: landmarks[i].y * height });
            const leftShoulder = map(11), rightShoulder = map(12);
            const leftElbow = map(13), rightElbow = map(14);
            const leftWrist = map(15), rightWrist = map(16);
            const leftHip = map(23), rightHip = map(24);
            const leftKnee = map(25), rightKnee = map(26);
            const leftAnkle = map(27), rightAnkle = map(28);

            const centerX = (leftHip.x + rightHip.x) / 2;
            const centerY = (leftHip.y + rightHip.y) / 2;
            const shoulderMid = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.fillStyle = 'white';

            ctx.beginPath();
            ctx.moveTo(shoulderMid.x, shoulderMid.y);
            ctx.lineTo(centerX, centerY);
            ctx.stroke();

            const drawLimb = (a, b, c) => {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.lineTo(c.x, c.y);
                ctx.stroke();
            };

            drawLimb(leftShoulder, leftElbow, leftWrist);
            drawLimb(rightShoulder, rightElbow, rightWrist);
            drawLimb(leftHip, leftKnee, leftAnkle);
            drawLimb(rightHip, rightKnee, rightAnkle);

            // Head
            ctx.beginPath();
            ctx.arc(shoulderMid.x, shoulderMid.y - 30, 20, 0, 2 * Math.PI);
            ctx.fill();

            // Joints
            [leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle].forEach(joint => {
                ctx.beginPath();
                ctx.arc(joint.x, joint.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });

            if (this.isWaveGesture(landmarks) && !this.isSpinning) {
                this.waveCount++;
                this.isSpinning = true;
                status.innerText = `🧍 PosePuppet | Waves: ${this.waveCount} | B: Change Background, R: Reset`;
            }
        };

        const renderLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (latestLandmarks) {
                drawPuppet(latestLandmarks);
            } else {
                status.innerText = `🧍 PosePuppet | Waves: ${this.waveCount} | No body detected | B: Change Background, R: Reset`;
            }

            requestAnimationFrame(renderLoop);
        };

        requestAnimationFrame(renderLoop);
    }

}