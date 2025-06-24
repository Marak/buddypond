export default class ComputerVision {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.showDots = true; // <-- add this to constructor or init

        return this;
    }

    async init() {

        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/holistic');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands');

        await this.bp.load('spellbook');

        // TODO: add loading image while we wait for camera to start
        // desktop/assets/images/gui/rainbow-tv-loading.gif'

        // not needed?
        // await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection');
        //await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/fingerpose/dist/fingerpose.min.js');

        await this.bp.appendCSS('/v5/apps/based/computer-vision/computer-vision.css');
        console.log(fp.Gestures)
        const { Finger, FingerCurl, FingerDirection, GestureDescription } = fp;



        // 🤜 "Tiger Seal" – fist with thumbs tucked
        const tigerSealGesture = new GestureDescription('tiger_seal');
        for (let finger of Finger.all) {
            tigerSealGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
        }
        tigerSealGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);

        // ✋ "Ram Seal" – open palm
        const ramSealGesture = new GestureDescription('ram_seal');
        for (let finger of Finger.all) {
            ramSealGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
        }

        // 🤞 "Bird Seal" – middle over index
        const birdSealGesture = new GestureDescription('bird_seal');
        birdSealGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
        birdSealGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
        birdSealGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
        birdSealGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
        birdSealGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);

        // 🖖 "Boar Seal" – Spock hand
        const boarSealGesture = new GestureDescription('boar_seal');
        boarSealGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

        boarSealGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0); // Could add separation later if needed

        // 🧠 Setup in your init
        this.GE = new fp.GestureEstimator([
            fp.Gestures.VictoryGesture,
            fp.Gestures.ThumbsUpGesture,
            tigerSealGesture,
            ramSealGesture,
            birdSealGesture,
            boarSealGesture
        ]);

        this.gestureEmoji = {
            'victory': '✌️',
            'thumbs_up': '👍',
            'tiger_seal': '🐯',
            'ram_seal': '🐏',
            'bird_seal': '🐦',
            'boar_seal': '🐗'
        };

        this.jutsuQueue = []; this.lastGestureTime = Date.now();

        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });




        return 'loaded ComputerVision';
    }

    async open() {
        let win = this.bp.window(this.window());

        document.getElementById('toggle-dots-btn').onclick = () => {
            this.showDots = !this.showDots;
        };

        this.startObjectDetection();
        win.maximize();
        return win;
    }

    window() {

        let content = `
<div id="cv-loading" style="position: absolute; z-index: 10; width: 640px; height: 480px; display: flex; align-items: center; justify-content: center; background: black;">
  <img src="desktop/assets/images/gui/rainbow-tv-loading.gif" alt="Loading..." style="width: 120px; height: auto;" />
</div>

<video id="video" width="640" height="480" autoplay></video>

<div>
  <canvas id="canvas" width="640" height="480" style="flex: 1;"></canvas>
  
  <div style="margin-left: 10px;">
    <div>
      <button id="toggle-dots-btn" style="margin-bottom: 10px;">Toggle Dots</button>
    </div>
    <div id="gesture-trail" style="font-size: 24px; margin-top: 10px; white-space: nowrap; overflow-x: auto;"></div>

    <div class="detected-objects">
      <h3>Detected Objects</h3>
      <ul id="object-list" style="font-size: 12px; list-style: none; padding-left: 0;"></ul>
    </div>
  </div>
</div>
`;

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
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            selfieMode: true // Add this to flip landmarks for mirrored cameras
        });

        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            selfieMode: true,
        });

        let latestHandLandmarks = null;

        hands.onResults(async (results) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                latestHandLandmarks = results.multiHandLandmarks[0];
                // console.log('Hand landmarks detected:', latestHandLandmarks);

                const rawLandmarks = results.multiHandLandmarks[0];
                const landmarks = rawLandmarks.map(p => [p.x, p.y, p.z]); // <- convert to [x, y, z]

                const est = this.GE.estimate(landmarks, 5); // loosened from 7

                // const est = this.GE.estimate(latestHandLandmarks, 7);
                if (est.gestures.length > 0) {
                    const best = est.gestures.reduce((p, c) => (p.score > c.score ? p : c));
                    const name = best.name;
                    // console.log('Detected gesture:', name);
                    const gestureTrailEl = document.getElementById('gesture-trail');
                    const emoji = this.gestureEmoji[name] || '❓';
                    const span = document.createElement('span');
                    span.textContent = emoji;
                    span.style.marginRight = '6px';
                    gestureTrailEl.appendChild(span);

                    while (gestureTrailEl.children.length > 10) {
                        gestureTrailEl.removeChild(gestureTrailEl.firstChild);
                    }

                    const now = Date.now();
                    if (now - this.lastGestureTime > 5000) {
                        this.jutsuQueue = [];
                        gestureTrailEl.innerHTML = '';
                    }
                    this.lastGestureTime = now;
                    console.log('[Hand Gesture]', name);
                    this.jutsuQueue.push(name);
                    console.log(this.jutsuQueue.join('-'))

                    // truncate this.jutsuQueue to the last 2 gestures ( for now )
                    if (this.jutsuQueue.length > 2) {
                        this.jutsuQueue = this.jutsuQueue.slice(-2);
                    }

                    if (this.jutsuQueue.join('-') === 'tiger_seal-thumbs_up') {
                        // lightning jutsu
                        console.log("🔥 Jutsu Cast: Lightning!");
                        gestureTrailEl.innerHTML = '⚡ Lightning Jutsu!';
                        let data = {
                            spell: 'lightning',
                            jutsu: 'lightning',
                            type: 'jutsu',
                            emoji: '⚡'
                        };
                        try {
                            let spellModule = await this.bp.importModule(`/v5/apps/based/spellbook/spells/${data.spell}/${data.spell}.js`, {}, false);
                            spellModule.default.call(this);
                        }
                        catch (error) {
                            console.log('Error importing spell module:', error);
                        }
                        this.jutsuQueue = [];
                        setTimeout(() => {
                            gestureTrailEl.innerHTML = '';
                        }, 2000);
                    }


                    if (this.jutsuQueue.join('-') === 'boar_seal-thumbs_up') {

                        console.log("🔥 Jutsu Cast: Fireball!");
                        gestureTrailEl.innerHTML = '🔥 Fireball Jutsu!';
                        let data = {
                            spell: 'flood',
                            type: 'jutsu',
                            emoji: '🔥'
                        };
                        try {
                            let spellModule = await this.bp.importModule(`/v5/apps/based/spellbook/spells/${data.spell}/${data.spell}.js`, {}, false);
                            spellModule.default.call(this);
                        }
                        catch (error) {
                            console.log('Error importing spell module:', error);
                        }
                        this.jutsuQueue = [];
                        setTimeout(() => {
                            gestureTrailEl.innerHTML = '';
                        }, 2000);


                    }


                    if (this.jutsuQueue.join('-') === 'victory-thumbs_up') {
                        console.log("🔥 Jutsu Cast: Fireball!");
                        gestureTrailEl.innerHTML = '🔥 Fireball Jutsu!';
                        let data = {
                            spell: 'fireball',
                            jutsu: 'fireball',
                            type: 'jutsu',
                            emoji: '🔥'
                        };
                        try {
                            let spellModule = await this.bp.importModule(`/v5/apps/based/spellbook/spells/${data.spell}/${data.spell}.js`, {}, false);
                            spellModule.default.call(this);
                        }
                        catch (error) {
                            console.log('Error importing spell module:', error);
                        }
                        this.jutsuQueue = [];
                        setTimeout(() => {
                            gestureTrailEl.innerHTML = '';
                        }, 2000);
                    }
                }
            }
        });


        let firstResults = false

        holistic.onResults((results) => {

            if (!firstResults) {
                document.getElementById('cv-loading').style.display = 'none';
                // video.style.display = 'block';
                firstResults = true;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
            // draw landmarks...

            const gestureTrailEl = document.getElementById('gesture-trail');




            // Pose landmarks
            if (this.showDots && results.poseLandmarks) {
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
            if (this.showDots && results.faceLandmarks) {
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
            if (this.showDots && results.leftHandLandmarks) {
                for (const lm of results.leftHandLandmarks) {
                    const x = lm.x * canvas.width;
                    const y = lm.y * canvas.height;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = 'cyan';
                    ctx.fill();
                }
            }
            if (this.showDots && results.rightHandLandmarks) {
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
                await hands.send({ image: video }); // Send to Hands pipeline

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