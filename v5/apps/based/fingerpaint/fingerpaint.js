export default class FingerPaint {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.isDrawing = false;
        this.lastPos = null;
        this.isErasing = false;
        this.brushColor = 'rgba(255,255,255,0.9)';
        this.brushSize = 12;
        this.positionHistory = []; // For smoothing
        this.maxHistory = 3; // Number of points to average for smoothing
        return this;
    }

    async init() {
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendCSS('/v5/apps/based/fingerpaint/fingerpaint.css');
        this.html = await this.bp.load('/v5/apps/based/fingerpaint/fingerpaint.html');
        return 'loaded FingerPaint';
    }

    async open() {
        this.win = this.bp.window(this.window());
        this.startFingerPaint();
        this.win.maximize();
        return this.win;
    }

    window() {
        const content = this.html;
        return {
            id: 'fingerpaint',
            title: 'FingerPaint',
            icon: 'desktop/assets/images/icons/icon_paint_64.png',
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

    isFingerExtended(landmarks, tipIdx) {
        const baseIdx = tipIdx - 2; // Knuckle
        return landmarks[tipIdx].y < landmarks[baseIdx].y;
    }

    isHandOpen(landmarks) {
        // Hand is open if index and middle fingers are extended
        return this.isFingerExtended(landmarks, 8) && this.isFingerExtended(landmarks, 12);
    }

    isHandClosed(landmarks) {
        // Hand is closed if index and middle fingers are not extended
        return !this.isFingerExtended(landmarks, 8) && !this.isFingerExtended(landmarks, 12);
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

    async startFingerPaint() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const status = document.getElementById('status');
        const overlayCanvas = document.getElementById('overlayCanvas');
        const overlayCtx = overlayCanvas.getContext('2d');

        // Keyboard controls for brush customization
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'r':
                    this.brushColor = 'rgba(255,0,0,0.9)';
                    status.innerText = `🖌️ Red Brush | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                    break;
                case 'b':
                    this.brushColor = 'rgba(0,0,255,0.9)';
                    status.innerText = `🖌️ Blue Brush | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                    break;
                case 'g':
                    this.brushColor = 'rgba(0,255,0,0.9)';
                    status.innerText = `🖌️ Green Brush | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                    break;
                case '+':
                    this.brushSize = Math.min(this.brushSize + 2, 30);
                    status.innerText = `🖌️ Brush Size: ${this.brushSize}px | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                    break;
                case '-':
                    this.brushSize = Math.max(this.brushSize - 2, 4);
                    status.innerText = `🖌️ Brush Size: ${this.brushSize}px | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                    break;
                case 'c':
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    status.innerText = `🖌️ Canvas Cleared | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                    break;
            }
        });

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

        hands.onResults((results) => {
            // ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Optional: Show webcam feed

            overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);


            if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
                this.lastPos = null;
                this.positionHistory = [];
                status.innerText = `🖌️ No hand detected | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                return;
            }

            const hand = results.multiHandLandmarks[0];
            const tip = hand[8]; // Index finger tip
            let x = tip.x * canvas.width;
            let y = tip.y * canvas.height;

            // Smooth the position
            const smoothedPos = this.smoothPosition({ x, y });
            x = smoothedPos.x;
            y = smoothedPos.y;

            // Check hand state
            this.isErasing = [8, 12, 16, 20].every(tipIdx => this.isFingerExtended(hand, tipIdx));
            const isHandOpen = this.isHandOpen(hand);
            const isHandClosed = this.isHandClosed(hand);

            // Set cursor appearance
            ctx.beginPath();
            ctx.arc(x, y, this.isErasing ? this.brushSize * 1.5 : this.brushSize / 2, 0, 2 * Math.PI); // Larger eraser cursor
            if (isHandClosed) {

                overlayCtx.beginPath();
                overlayCtx.arc(x, y, this.brushSize / 2, 0, 2 * Math.PI);
                overlayCtx.fillStyle = 'transparent';
                overlayCtx.strokeStyle = 'rgba(128,128,128,0.5)'; // Gray outline
                overlayCtx.lineWidth = 2;
                overlayCtx.stroke();
                status.innerText = `🖌️ Closed fist - not drawing | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;

                /*
                ctx.fillStyle = 'transparent'; // No fill
                ctx.strokeStyle = 'rgba(128,128,128,0.5)'; // Gray outline
                ctx.lineWidth = 2;
                ctx.stroke();

                status.innerText = `🖌️ Closed fist - not drawing | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
                */
            } else if (this.isErasing) {
                ctx.fillStyle = 'rgb(0,0,0)'; // Black for erasing
                ctx.fill();
                status.innerText = `🖌️ Erasing (Size: ${this.brushSize * 3}px) | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
            } else {
                ctx.fillStyle = this.brushColor; // Brush color for drawing
                ctx.fill();
                status.innerText = `🖌️ Drawing | R: Red, B: Blue, G: Green, +: Bigger, -: Smaller, C: Clear`;
            }

            // Set drawing mode
            ctx.strokeStyle = this.isErasing ? 'black' : this.brushColor;
            ctx.lineWidth = this.isErasing ? this.brushSize * 3 : this.brushSize; // Larger eraser stroke
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            // Draw only if hand is open and not erasing
            if (isHandOpen && !this.isErasing && this.lastPos) {
                ctx.beginPath();
                ctx.moveTo(this.lastPos.x, this.lastPos.y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            // Update last position only if hand is open or erasing
            this.lastPos = (isHandClosed) ? null : { x, y };
        });
    }
}