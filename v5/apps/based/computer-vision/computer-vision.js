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

        this.html = await this.bp.load('/v5/apps/based/computer-vision/computer-vision.html');

        this.spellMap = {
            'victory-thumbs_up': {
                gestures: '✌️👍',
                spell: 'fireball',
                jutsu: 'fireball',
                type: 'jutsu',
                emoji: '🔥',
                label: '🔥 Fireball 🔥',
            },
            // thumbs up + thumbs down = barrelroll
            'thumbs_up-thumbs_down': {
                gestures: '👍👎',
                spell: 'barrelroll',
                jutsu: 'barrelroll',
                type: 'jutsu',
                emoji: '🌀',
                label: '🌀 Barrel Roll 🌀',
            },
            'thumbs_down-thumbs_up': {
                // use emoji symbols in gestures field
                gestures: '👎👍',
                spell: 'barrelroll',
                jutsu: 'barrelroll',
                type: 'jutsu',
                emoji: '🌀',
                label: '🌀 Barrel Roll 🌀',
            },
            // left point + right point = lightning
            'point_right-point_left': {
                gestures: '👉👈',
                spell: 'lightning',
                jutsu: 'lightning',
                type: 'jutsu',
                emoji: '⚡',
                label: '⚡ Lightning ⚡',
            },
            'point_left-point_right': {
                gestures: '👈👉',
                spell: 'lightning',
                jutsu: 'lightning',
                type: 'jutsu',
                emoji: '⚡',
                label: '⚡ Lightning ⚡',
            },

            // two open palms is earthquake
            'open_palm-open_palm': {
                gestures: '👐👐',
                spell: 'earthquake',
                jutsu: 'earthquake',
                type: 'jutsu',
                emoji: '🌍',
                label: '🌍 Earthquake 🌍'
            },
            // flood spell
            'hang_loose-hang_loose': {
                gestures: '🤙🤙',
                spell: 'flood',
                jutsu: 'flood',
                type: 'jutsu',
                emoji: '🌊',
                label: '🌊 Flood 🌊'
            },
            // vortex spell
            'devil_horns-devil_horns': {
                gestures: '🤘🤘',
                spell: 'vortex',
                jutsu: 'vortex',
                type: 'jutsu',
                emoji: '🌪️',
                label: '🌪️ Vortex 🌪️'
            },

            // Add more spells here!
        };

        console.log(fp.Gestures)
        const { Finger, FingerCurl, FingerDirection, GestureDescription } = fp;

        const fistGesture = new GestureDescription('fist_thumb_in');
        for (let finger of Finger.all) {
            fistGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
        }

        const openPalmGesture = new fp.GestureDescription('open_palm');

        // All fingers extended and vertical
        for (let finger of fp.Finger.all) {
            openPalmGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
            openPalmGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 0.9);
        }

        // Optional: Suggest finger spread (for added realism if your detector supports it)
        openPalmGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.5);
        openPalmGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpRight, 0.5);


        // 🖖 Boar Seal – Spock hand, index/middle separated from ring/pinky
        /*
        const boarSealGesture = new fp.GestureDescription('boar_seal');
        boarSealGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
        boarSealGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
        // Differentiate with direction: index/middle vs. ring/pinky form a "V"
        boarSealGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.9);
        boarSealGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpLeft, 0.9);
        boarSealGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.DiagonalUpRight, 0.9);
        boarSealGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpRight, 0.9);
        boarSealGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.8); // Thumb often extends outward
        */

        // 🤞 "Bird Seal" – middle over index
        /*
        const birdSealGesture = new GestureDescription('bird_seal');
        birdSealGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
        birdSealGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
        birdSealGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
        birdSealGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
        birdSealGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
        */


        const pointUpGesture = new GestureDescription('point_up');
        pointUpGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
        pointUpGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
        [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
            pointUpGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
        });


        // describe hang loose gesture 🤙
        const hangLooseGesture = new GestureDescription('hang_loose');

        // thumb:
        // - curl: none (must)
        // - direction vertical up (best)
        // - direction diagonal up left / right (acceptable)
        hangLooseGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
        hangLooseGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
        hangLooseGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
        hangLooseGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9);
        hangLooseGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9);

        // all other fingers:
        // - curled (best)
        // - half curled (acceptable)
        // - pointing down is NOT acceptable
        for (let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
            hangLooseGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
            hangLooseGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
        }


        const thumbsDownGesture = new GestureDescription('thumbs_down');

        // Thumb: no curl, pointing down
        thumbsDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
        thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);
        thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.9);
        thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.9);

        // All other fingers: curled
        for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
            thumbsDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
            thumbsDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
        }

        const tightVictoryGesture = new GestureDescription('tight_victory');

        // Index & middle fingers: no curl, same upward direction
        for (let finger of [Finger.Index, Finger.Middle]) {
            tightVictoryGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
            tightVictoryGesture.addDirection(finger, FingerDirection.VerticalUp, 1.0);
            tightVictoryGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9);
            tightVictoryGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9);
        }

        // Remaining fingers: curled
        for (let finger of [Finger.Ring, Finger.Pinky]) {
            tightVictoryGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
        }

        tightVictoryGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

        const okayGesture = new GestureDescription('okay');
        // Thumb: Half curl (touching index)
        okayGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
        // Index: Half curl (touching thumb)
        okayGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
        // Middle, Ring, Pinky: No curl (extended)
        [Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
            okayGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
        });

        const pointGesture = new GestureDescription('point');
        pointGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
        [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
            pointGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
            pointGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
        });

        const devilHornsGesture = new GestureDescription('devil_horns');

        // Index & pinky: extended
        [Finger.Index, Finger.Pinky].forEach(finger => {
            devilHornsGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
        });

        // Middle & ring: curled
        [Finger.Middle, Finger.Ring].forEach(finger => {
            devilHornsGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
            devilHornsGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
        });

        // Thumb: either half curled or extended
        devilHornsGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.9);
        devilHornsGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);


        // 🧠 Setup in your init
        this.GE = new fp.GestureEstimator([
            fp.Gestures.VictoryGesture,
            fp.Gestures.ThumbsUpGesture,
            fistGesture,
            //birdSealGesture,
            pointUpGesture,
            openPalmGesture,
            // boarSealGesture,
            hangLooseGesture,
            thumbsDownGesture,
            tightVictoryGesture,
            okayGesture,
            devilHornsGesture,
            pointGesture
        ]);

        /*

                    'bird_seal': '🐦',
            'boar_seal': '🐗',
*/

        this.gestureEmoji = {
            'victory': '✌️',
            'thumbs_up': '👍',
            'fist_left': '🤛',
            'fist_right': '🤜',
            'point_up': '☝️',
            'open_palm': '🖐️',
            'hang_loose': '🤙',
            'thumbs_down': '👎',
            'tight_victory': '🤞',
            'okay': '👌',
            'devil_horns': '🤘',
            'point_left': '👈',
            'point_right': '👉'
        };

        this.jutsuQueue = [];
        //         this.jutsuQueue = { left: [], right: [] }; // Separate queues for left and right hands

        this.lastGestureTime = Date.now();

        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        return 'loaded ComputerVision';
    }

    async open() {

        if (this.win) {
            this.win.focus();
            return this.win;
        }

        this.win = this.bp.window(this.window());

        document.getElementById('toggle-dots-btn').onclick = () => {
            this.showDots = !this.showDots;
            $('.spell-guide', this.win.content).toggle();
        };

        this.renderSpellGuide(this.spellMap); // Call this on init


        function startFakeLoadingSequence() {
            const steps = [
                "Initializing camera...",
                "Loading vision model...",
                "Warming up tensors...",
                "Calibrating hand gestures...",
                "Syncing overlays...",
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
        startFakeLoadingSequence.call(this);

        this.startObjectDetection();
        this.win.maximize();
        return this.win;
    }

    window() {

        return {
            id: 'computer-vision',
            title: 'Jutsu Caster',
            icon: 'desktop/assets/images/icons/icon_jutsu_64.png',
            x: 250,
            y: 75,
            width: 600, // Increased width for two-column layout
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            content: this.html,
            // iframeContent: 'https://plays.org/game/doodle-jump-extra/',
            //iframeContent: iframeUrl,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onClose: () => {
                this.win = null; // Clear reference on close
                // close the camera
                this.video.srcObject.getTracks().forEach(track => track.stop());
                this.video = null;
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
        this.video = video;

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
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.85,
            minTrackingConfidence: 0.85,
            selfieMode: true,
        });

        this.previousGestures = {}; // Maps hand index => previous gesture name
        this.lastGestureTimePerHand = {};      // hand index => timestamp (ms)

        let foundFirstHandGesture = false;
        let startTime = Date.now();

        // create a default timer to hide instruction overlay after 7 seconds
        setTimeout(() => {
            if (!foundFirstHandGesture) {
                $('.instruction-overlay', this.win.content).hide();
                foundFirstHandGesture = true;
            }
        }, 10000);

        hands.onResults(async (results) => {
            const gestureTrailEl = document.getElementById('gesture-trail');
            const gestureSpellEl = document.getElementById('gesture-spell');
            const now = Date.now();

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {

                if (!foundFirstHandGesture) {
                    let now = Date.now();
                    // wait at least a few seconds before showing the overlay
                    if (now - startTime > 7000) {
                        $('.instruction-overlay', this.win.content).hide();
                        foundFirstHandGesture = true;
                    }
                }

                const allGestures = [];

                // Reset if timeout
                if (now - this.lastGestureTime > 5000) {
                    this.jutsuQueue = [];
                    gestureTrailEl.innerHTML = '';
                    this.previousGestures = {};
                    this.lastGestureTimePerHand = {};
                }

                for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                    const rawLandmarks = results.multiHandLandmarks[i];
                    const landmarks = rawLandmarks.map(p => [p.x, p.y, p.z]);
                    const est = this.GE.estimate(landmarks, 8.5);
                    const handLabel = results.multiHandedness?.[i]?.label; // 'Left' or 'Right'


                    if (est.gestures.length > 0) {
                        const best = est.gestures.reduce((p, c) => (p.score > c.score ? p : c));
                        let name = best.name;

                        // If it's the 'point' gesture, specialize based on handedness
                        if (name === 'point') {
                            name = handLabel === 'Left' ? 'point_left' : 'point_right';
                        }

                        if (name === 'fist_thumb_in') {
                            name = handLabel === 'Left' ? 'fist_left' : 'fist_right';
                        }

                        const emoji = this.gestureEmoji[name] || '❓';

                        const lastName = this.previousGestures[i];
                        const lastTime = this.lastGestureTimePerHand[i] || 0;

                        // Only process gesture if it's new AND enough time has passed
                        const gestureChanged = lastName !== name;
                        const debouncePassed = now - lastTime > 500;

                        if (gestureChanged && debouncePassed) {
                            this.previousGestures[i] = name;
                            this.lastGestureTimePerHand[i] = now;

                            allGestures.push({ name, emoji });

                            // UI update
                            const span = document.createElement('span');
                            span.textContent = emoji;
                            span.style.marginRight = '6px';
                            gestureTrailEl.prepend(span);

                            while (gestureTrailEl.children.length > 10) {
                                gestureTrailEl.removeChild(gestureTrailEl.firstChild);
                            }

                            console.log('[Hand Gesture]', name);
                            this.jutsuQueue.push(name);
                        }
                    } else {
                        // If no gesture is detected, clear state for that hand
                        this.previousGestures[i] = null;
                        this.lastGestureTimePerHand[i] = 0;
                    }
                }

                this.lastGestureTime = now;

                // Truncate to the last 2 gestures
                if (this.jutsuQueue.length > 2) {
                    this.jutsuQueue = this.jutsuQueue.slice(-2);
                }

                if (allGestures.length > 0) {
                    // hide the first time a spell is cast
                    let result = await this.handleJutsuCast(this.jutsuQueue, gestureSpellEl, this.bp);
                    if (result && !foundFirstHandGesture) {
                        $('.instruction-overlay', this.win.content).hide();
                        foundFirstHandGesture = true;
                    }


                }
            }
        });


        let firstResults = false

        holistic.onResults((results) => {

            if (!firstResults) {
                $('#cv-loading', this.win.content).fadeOut(300);
                // document.getElementById('cv-loading').style.display = 'none';
                // $('#cv-loading').fadeOut(300);

                // video.style.display = 'block';
                firstResults = true;
                $('.instruction-overlay', this.win.content).flexShow();
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

                const listEl = $('#object-list', this.win.content)[0];
                listEl.innerHTML = '';

                predictions.forEach((pred) => {
                    const [x, y, width, height] = pred.bbox;

                    if (this.showDots) {
                        ctx.beginPath();
                        ctx.rect(x, y, width, height);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = 'red';
                        ctx.fillStyle = 'red';
                        ctx.stroke();
                        ctx.fillText(pred.class, x, y > 10 ? y - 5 : 10);

                    }


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


    async handleJutsuCast(jutsuQueue, gestureTrailEl) {
        const key = jutsuQueue.join('-');
        const spellMeta = this.spellMap[key];
        if (!spellMeta) return;

        console.log(`🔥 Jutsu Cast: ${spellMeta.jutsu.charAt(0).toUpperCase() + spellMeta.jutsu.slice(1)}!`);
        gestureTrailEl.innerHTML = spellMeta.label;

        try {
            const spellModule = await this.bp.importModule(
                `/v5/apps/based/spellbook/spells/${spellMeta.spell}/${spellMeta.spell}.js`, {}, false
            );
            spellModule.default.call(this);
        } catch (error) {
            console.error('Error importing spell module:', error);
        }

        jutsuQueue.length = 0; // clear queue in-place
        setTimeout(() => {
            gestureTrailEl.innerHTML = '';
        }, 2000);
        return true; // Indicate spell was cast
    }

    renderSpellGuide(spellMap) {
        const $list = $('#spell-list');
        const addedCombos = new Set();

        for (const [combo, info] of Object.entries(spellMap)) {
            // Avoid showing duplicates of same spell (some combos are symmetric)
            const key = info.jutsu + info.emoji;
            if (addedCombos.has(key)) continue;
            addedCombos.add(key);

            let label = info.label || `${info.emoji} ${info.spell}`;
            label = info.gestures + ` ${label}`;
            $list.append(`<li>${label}</li>`);
        }
    }


}