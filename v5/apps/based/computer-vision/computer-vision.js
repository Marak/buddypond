export default class ComputerVision {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {

        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/holistic');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/fingerpose/dist/fingerpose.min.js');

        await this.bp.appendCSS('/v5/apps/based/computer-vision/computer-vision.css');

        this.GE = new fp.GestureEstimator([
            fp.Gestures.VictoryGesture,
            fp.Gestures.ThumbsUpGesture
        ]);
        this.jutsuQueue = []; this.lastGestureTime = Date.now();

        this.gestureEmoji = {
            'victory': '✌️',
            'thumbs_up': '👍',
            'thumbs_down': '👎',
            'open_palm': '🖐️',
            'fist': '✊',
            'i_love_you': '🤟'
        };


        return 'loaded ComputerVision';
    }

    async open() {
        let win = this.bp.window(this.window());
        this.startObjectDetection();
        win.maximize();
        return win;
    }

    window() {

        let content = `<video id="video" width="640" height="480" autoplay></video>
                       <div style="display: flex;">
  <canvas id="canvas" width="640" height="480" style="flex: 1;"></canvas>
  <div id="gesture-trail" style="font-size: 24px; margin-top: 10px; white-space: nowrap; overflow-x: auto;"></div>

  <div class="detected-objects">
    <h3>Detected Objects</h3>
    <ul id="object-list" style="font-size: 12px; list-style: none; padding-left: 0;"></ul>
  </div>
</div>`;
        return {
            id: 'computer-vision',
            title: 'Computer Vision',
            icon: 'desktop/assets/images/icons/icon_computer-vision_64.png',
            title: 'Computer Vision',
            icon: 'desktop/assets/images/icons/icon_doodle-jump-extra_64.png',
            x: 250,
            y: 75,
            width: 600, // Increased width for two-column layout
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            content: content,
            // iframeContent: 'https://plays.org/game/doodle-jump-extra/',
            //iframeContent: iframeUrl,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onclose: () => {
                // this.bp.apps.ui.windowManager.destroyWindow('motd');
            }
        }
    }

    async startObjectDetection() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Load TensorFlow.js model
        const model = await cocoSsd.load();

        // Start webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        await new Promise((resolve) => {
            video.onloadeddata = () => resolve();
        });

        video.play();
        video.style.display = 'none';

        // --- MediaPipe Holistic Setup ---
        const holistic = new Holistic({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
        });

       holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    selfieMode: true // Add this to flip landmarks for mirrored cameras
});


        holistic.onResults((results) => {


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
            // draw landmarks...

            const gestureTrailEl = document.getElementById('gesture-trail');

            if (results.rightHandLandmarks) {
                const est = this.GE.estimate(results.rightHandLandmarks, 7);
                if (est.gestures.length) {
                    const best = est.gestures.reduce((p, c) =>
                        (p.score > c.score ? p : c)
                    );
                    const name = best.name;
                    ctx.fillStyle = 'white';
                    ctx.fillText(name, 10, 35);

                    // 👣 Append emoji to trail
                    console.log('Gesture detected:', name);
                    const emoji = this.gestureEmoji[name] || '❓';
                    const span = document.createElement('span');
                    span.textContent = emoji;
                    span.style.marginRight = '6px';
                    gestureTrailEl.appendChild(span);

                    // ✅ Trim to last 10 emojis
                    while (gestureTrailEl.children.length > 10) {
                        gestureTrailEl.removeChild(gestureTrailEl.firstChild);
                    }
                    // Add to gesture sequence buffer
                    const now = Date.now();
                    if (now - this.lastGestureTime > 3000) {
                        this.jutsuQueue = [];
                        gestureTrailEl.innerHTML = ''; // reset visuals
                    }
                    this.lastGestureTime = now;
                    console.log(name)
                    this.jutsuQueue.push(name);

                    if (this.jutsuQueue.join('-') === 'Victory-Thumbs_Up') {
                        this.bp.toast("🔥 Jutsu Cast: Fireball!");
                        gestureTrailEl.innerHTML = '🔥 Fireball Jutsu!';
                        this.jutsuQueue = [];
                        setTimeout(() => {
                            gestureTrailEl.innerHTML = '';
                        }, 2000);
                    }
                }
            }


            // Pose landmarks
            if (results.poseLandmarks) {
                for (const lm of results.poseLandmarks) {
                    const x = lm.x * canvas.width;
                    const y = lm.y * canvas.height;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = 'lime';
                    ctx.fill();
                }
            }

            // Face landmarks (draw fewer for performance)
            if (results.faceLandmarks) {
                for (let i = 0; i < results.faceLandmarks.length; i += 10) {
                    const lm = results.faceLandmarks[i];
                    const x = lm.x * canvas.width;
                    const y = lm.y * canvas.height;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, 2 * Math.PI);
                    ctx.fillStyle = 'yellow';
                    ctx.fill();
                }
            }

            // Hand landmarks
            if (results.leftHandLandmarks) {
                for (const lm of results.leftHandLandmarks) {
                    const x = lm.x * canvas.width;
                    const y = lm.y * canvas.height;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = 'cyan';
                    ctx.fill();
                }
            }
            if (results.rightHandLandmarks) {
                for (const lm of results.rightHandLandmarks) {
                    const x = lm.x * canvas.width;
                    const y = lm.y * canvas.height;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = 'magenta';
                    ctx.fill();
                }
            }
        });

        // Use MediaPipe's camera helper to feed video frames
        const camera = new Camera(video, {
            onFrame: async () => {
                // Resize canvas
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Feed video to holistic model
                await holistic.send({ image: video });

                // Run object detection in parallel
                const predictions = await model.detect(video);

                const listEl = document.getElementById('object-list');
                listEl.innerHTML = '';

                predictions.forEach((pred) => {
                    const [x, y, width, height] = pred.bbox;
                    ctx.beginPath();
                    ctx.rect(x, y, width, height);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'red';
                    ctx.fillStyle = 'red';
                    ctx.stroke();
                    ctx.fillText(pred.class, x, y > 10 ? y - 5 : 10);

                    const li = document.createElement('li');
                    li.textContent = `${pred.class} (${(pred.score * 100).toFixed(1)}%)`;
                    listEl.appendChild(li);
                });
            },
            width: 640,
            height: 480,
        });

        camera.start();
    }

}