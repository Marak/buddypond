export default class SigilCaster {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.showDots = true;
        this.path = []; // User-drawn path
        this.lastPointTime = Date.now();
        this.sigilTemplates = {}; // Store SVG path points
        this.gestureLostFrames = 0;
        this.gestureLostThreshold = 12; // adjust this value (e.g., ~6 = ~200ms buffer)

        return this;
    }

    async init() {
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils');
        await this.bp.appendScript('https://cdn.jsdelivr.net/npm/fingerpose/dist/fingerpose.min.js');
        await this.bp.appendCSS('/v5/apps/based/sigil-caster/sigil-caster.css');

        this.html = await this.bp.load('/v5/apps/based/sigil-caster/sigil-caster.html');

        // Define point gesture
        const { Finger, FingerCurl, GestureDescription } = fp;
        const pointGesture = new GestureDescription('point');
        pointGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
        [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
            pointGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
            pointGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
        });

        this.GE = new fp.GestureEstimator([pointGesture]);
        this.gestureEmoji = { 'point': '👈' };
        this.spellMap = {
            'lightning': {
                spell: 'lightning',
                type: 'sigil',
                emoji: '⚡',
                label: '⚡ Lightning ⚡',
                svg: '/v5/apps/based/sigil-caster/sigils/lightning.svg'
            },
            'circle': {
                spell: 'fireball',
                type: 'sigil',
                emoji: '🔥',
                label: '🔥 Fireball 🔥',
                svg: '/v5/apps/based/sigil-caster/sigils/circle.svg'
            },
            'cross': {
                spell: 'flood',
                type: 'sigil',
                emoji: '❤️',
                label: '❤️ Heal ❤️',
                svg: '/v5/apps/based/sigil-caster/sigils/cross.svg'
            },
            'triangle': {
                spell: 'barrelRoll',
                type: 'sigil',
                emoji: '🔺',
                label: '🔺 Teleport 🔺',
                svg: '/v5/apps/based/sigil-caster/sigils/triangle.svg'
            },
            'square': {
                spell: 'earthquake',
                type: 'sigil',
                emoji: '🛡️',
                label: '🛡️ Shield 🛡️',
                svg: '/v5/apps/based/sigil-caster/sigils/square.svg'
            },
            'star': {
                spell: 'peanut-butter-jelly-time',
                type: 'sigil',
                emoji: '⭐',
                label: '⭐ Starburst ⭐',
                svg: '/v5/apps/based/sigil-caster/sigils/star.svg'
            },
        };

        // Create hidden container for SVG loading
        this.svgContainer = document.createElement('div');
        this.svgContainer.style.display = 'none';
        document.body.appendChild(this.svgContainer);

        // Load SVG templates
        for (const [spell, meta] of Object.entries(this.spellMap)) {
            if (meta.svg) {
                console.log(`Loading SVG for ${spell}:`, meta.svg);
                try {
                    const response = await fetch(meta.svg);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const svgText = await response.text();
                    console.log(`SVG text for ${spell}:`, svgText); // Debug log
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                    const pathElement = svgDoc.querySelector('path');
                    if (!pathElement) throw new Error('No path found in SVG');
                    console.log('SVG path element:', pathElement); // Debug log
                    this.sigilTemplates[spell] = this.extractPathPoints(pathElement.getAttribute('d'));

                    console.log(`Loaded SVG for ${spell}:`, this.sigilTemplates[spell]);
                } catch (error) {
                    console.error(`Failed to load SVG for ${spell}:`, error);
                }
            }
        }

        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.85,
            minTrackingConfidence: 0.85,
            // selfieMode: true
        });

        return 'loaded SigilCaster';
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

        this.renderSpellGuide(this.spellMap);

        const startFakeLoadingSequence = () => {
            const steps = [
                "Initializing camera...",
                "Loading vision model...",
                "Calibrating finger tracking...",
                "Syncing sigil detector...",
                "Finalizing setup..."
            ];
            let stepIndex = 0;
            const $loadingText = $('#loading-text', this.win.content);
            const interval = setInterval(() => {
                $loadingText.text(steps[stepIndex]);
                stepIndex++;
                if (stepIndex >= steps.length) {
                    clearInterval(interval);
                }
            }, 1200);
        };
        startFakeLoadingSequence.call(this);

        this.startObjectDetection();
        this.win.maximize();
        return this.win;
    }

    window() {
        return {
            id: 'sigil-caster',
            title: 'Sigil Caster',
            icon: 'desktop/assets/images/icons/icon_sigil-caster_64.png',
            x: 250,
            y: 75,
            width: 600,
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            content: this.html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onClose: () => {
                this.win = null;
                if (this.video) {
                    this.video.srcObject.getTracks().forEach(track => track.stop());
                    this.video = null;
                }
            }
        };
    }

    async startObjectDetection() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const model = await cocoSsd.load();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        this.video = video;

        await new Promise(resolve => video.onloadeddata = resolve);
        video.play();
        video.style.display = 'none';

        let foundFirstSigil = false;
        setTimeout(() => {
            if (!foundFirstSigil) {
                $('.instruction-overlay', this.win.content).hide();
                foundFirstSigil = true;
            }
        }, 10000);

        let firstResult = false;

        this.hands.onResults(async (results) => {
            if (!firstResult) {
                firstResult = true;
                $('.cv-loading', this.win.content).hide();
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            const sigilTrailEl = document.getElementById('sigil-trail');
            const sigilSpellEl = document.getElementById('sigil-spell');
            const now = Date.now();

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0].map(p => [p.x, p.y, p.z]);
                const est = this.GE.estimate(landmarks, 8.5);

                if (est.gestures.length > 0 && est.gestures[0].name === 'point') {
                    this.gestureLostFrames = 0;

                    const indexTip = results.multiHandLandmarks[0][8];
                    const x = indexTip.x * canvas.width;
                    const y = indexTip.y * canvas.height;

                    if (now - this.lastPointTime > 100) {
                        this.path.push({ x, y });
                        this.lastPointTime = now;
                    }

                    if (this.path.length > 200) this.path.shift();

                    // Draw path...
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(-canvas.width, 0);
                    ctx.beginPath();
                    ctx.strokeStyle = 'cyan';
                    ctx.lineWidth = 3;
                    for (let i = 1; i < this.path.length; i++) {
                        ctx.moveTo(this.path[i - 1].x, this.path[i - 1].y);
                        ctx.lineTo(this.path[i].x, this.path[i].y);
                    }
                    ctx.stroke();
                    ctx.restore();

                    sigilTrailEl.textContent = `Sigil: Drawing (${this.path.length} points)`;

                    const matchedSpell = this.detectSigil(this.path);
                    if (matchedSpell) {
                        this.castSpell(matchedSpell, sigilSpellEl);
                        this.path = [];
                        sigilTrailEl.textContent = 'Sigil: ';
                        foundFirstSigil = true;
                        $('.instruction-overlay', this.win.content).hide();
                    }
                } else {
                    if (this.path.length > 0) {
                        this.gestureLostFrames++;
                        if (this.gestureLostFrames > this.gestureLostThreshold) {
                            this.path = [];
                            this.gestureLostFrames = 0;
                            sigilTrailEl.textContent = 'Sigil: ';
                            console.log('Path reset: Point gesture lost for too long');
                        } else {
                            console.log(`Gesture temporarily lost (${this.gestureLostFrames})`);
                        }
                    }
                }

                if (this.showDots && results.multiHandLandmarks[0]) {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(-canvas.width, 0);
                    for (const lm of results.multiHandLandmarks[0]) {
                        const x = lm.x * canvas.width;
                        const y = lm.y * canvas.height;
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, 2 * Math.PI);
                        ctx.fillStyle = 'cyan';
                        ctx.fill();
                    }
                    ctx.restore();
                }
            } else {
                if (this.path.length > 0) {
                    this.path = [];
                    sigilTrailEl.textContent = 'Sigil: ';
                    console.log('Path reset: No hand detected');
                }
            }

            const predictions = await model.detect(video);
            const listEl = $('#object-list', this.win.content)[0];
            listEl.innerHTML = '';
            predictions.forEach(pred => {
                const [x, y, width, height] = pred.bbox;
                if (this.showDots) {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(-canvas.width, 0);
                    ctx.beginPath();
                    ctx.rect(x, y, width, height);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'red';
                    ctx.fillStyle = 'red';
                    ctx.stroke();
                    ctx.fillText(pred.class, x, y > 10 ? y - 5 : 10);
                    ctx.restore();
                }
                const li = document.createElement('li');
                li.textContent = `${pred.class} (${(pred.score * 100).toFixed(1)}%)`;
                listEl.appendChild(li);
            });
        });

        const camera = new Camera(video, {
            onFrame: async () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                await this.hands.send({ image: video });
            },
            width: 640,
            height: 480
        });

        camera.start();
    }

    extractPathPoints(d) {
        const commands = d.match(/[ML][^ML]+/g);
        if (!commands) return [];

        const points = commands
            .map(cmd => cmd.trim().slice(1).trim().split(/[ ,]+/).map(Number))
            .filter(pair => pair.length === 2)
            .map(([x, y]) => ({ x, y }));

        const bounds = this.getBounds(points);
        return points.map(p => ({
            x: (p.x - bounds.minX) / (bounds.maxX - bounds.minX || 1),
            y: (p.y - bounds.minY) / (bounds.maxY - bounds.minY || 1)
        }));
    }



    getBounds(points) {
        return points.reduce(
            (b, p) => ({
                minX: Math.min(b.minX, p.x),
                maxX: Math.max(b.maxX, p.x),
                minY: Math.min(b.minY, p.y),
                maxY: Math.max(b.maxY, p.y)
            }),
            { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
        );
    }

    detectSigil(path) {
        if (path.length < 10) return null;

        // Smooth noisy path
        const smoothed = this.smoothPath(path, 3);

        // Normalize to [0, 1] space
        const bounds = this.getBounds(smoothed);
        const boundsArea = (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
        if (boundsArea < 0.01) return null; // Reject too-small gestures

        const normalizedPath = smoothed.map(p => ({
            x: (p.x - bounds.minX) / (bounds.maxX - bounds.minX),
            y: (p.y - bounds.minY) / (bounds.maxY - bounds.minY)
        }));

        // Frame-to-frame matching buffer
        this.matchBuffer = this.matchBuffer || {};

        for (const [spell, template] of Object.entries(this.sigilTemplates)) {
            if (template.length < 2) continue;

            const distance = Math.min(
                this.comparePaths(normalizedPath, template),
                this.comparePaths(normalizedPath, [...template].reverse())
            );

            // Adaptive threshold: tighter for longer paths
            const adaptiveThreshold = Math.max(0.12, 0.35 - 0.0015 * normalizedPath.length);

            // Keep track of match streak
            if (!this.matchBuffer[spell]) this.matchBuffer[spell] = 0;
            if (distance < adaptiveThreshold) {
                this.matchBuffer[spell]++;
                if (this.matchBuffer[spell] >= 3) { // Require 3 consecutive frames
                    this.matchBuffer = {}; // reset buffer
                    return spell;
                }
            } else {
                this.matchBuffer[spell] = 0;
            }
        }

        return null;
    }

    smoothPath(path, windowSize = 3) {
        const smoothed = [];
        const half = Math.floor(windowSize / 2);
        for (let i = 0; i < path.length; i++) {
            let sumX = 0, sumY = 0, count = 0;
            for (let j = -half; j <= half; j++) {
                const p = path[i + j];
                if (p) {
                    sumX += p.x;
                    sumY += p.y;
                    count++;
                }
            }
            smoothed.push({ x: sumX / count, y: sumY / count });
        }
        return smoothed;
    }


    comparePaths(path1, path2) {
        // Resample paths to same length for comparison
        const n = Math.min(50, Math.max(path1.length, path2.length));
        const resampled1 = this.resamplePath(path1, n);
        const resampled2 = this.resamplePath(path2, n);

        // Calculate average point-to-point distance
        let totalDistance = 0;
        for (let i = 0; i < n; i++) {
            const dx = resampled1[i].x - resampled2[i].x;
            const dy = resampled1[i].y - resampled2[i].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }
        return totalDistance / n;
    }

    resamplePath(path, n) {
        if (path.length < 2) return path;
        const totalLength = path.slice(1).reduce((len, p, i) => {
            const prev = path[i];
            return len + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
        }, 0);

        const resampled = [path[0]];
        const step = totalLength / (n - 1);
        let currentLength = 0;
        let index = 0;

        for (let i = 1; i < n - 1; i++) {
            const targetLength = i * step;
            while (index < path.length - 1 && currentLength < targetLength) {
                const p1 = path[index];
                const p2 = path[index + 1];
                const segmentLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
                currentLength += segmentLength;
                index++;
            }
            if (index >= path.length) break;

            const p1 = path[index - 1];
            const p2 = path[index];
            const segmentLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            const t = (targetLength - (currentLength - segmentLength)) / segmentLength;
            resampled.push({
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y)
            });
        }
        if (path.length > 0) resampled.push(path[path.length - 1]);
        return resampled;
    }

    async castSpell(spellName, sigilSpellEl) {
        const spellMeta = this.spellMap[spellName];
        if (!spellMeta) return;

        console.log(`⚡ Sigil Cast: ${spellMeta.spell.charAt(0).toUpperCase() + spellMeta.spell.slice(1)}!`);
        // this.bp.toast(spellMeta.label);
        sigilSpellEl.innerHTML = spellMeta.label;

        try {
            const spellModule = await this.bp.importModule(
                `/v5/apps/based/spellbook/spells/${spellMeta.spell}/${spellMeta.spell}.js`, {}, false
            );
            spellModule.default.call(this);
        } catch (error) {
            console.error('Error importing spell module:', error);
        }

        setTimeout(() => {
            sigilSpellEl.innerHTML = '';
        }, 2200);
    }

    renderSpellGuide(spellMap) {
        const $list = $('#spell-list', this.win.content);
        for (const [spell, info] of Object.entries(spellMap)) {
            $list.append(`<li>${info.label} (Draw ${spell})</li>`);
        }
    }
}