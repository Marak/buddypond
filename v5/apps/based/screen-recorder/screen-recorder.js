export default class ScreenRecorder {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.recorder = null;
        this.recordedChunks = [];
        this.stream = null;
        this.videoBlob = null;
        this.videoURL = null;
        this.timerInterval = null;
        this.secondsElapsed = 0;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/screen-recorder/screen-recorder.html');
        await this.bp.load('/v5/apps/based/screen-recorder/screen-recorder.css');
        return 'loaded ScreenRecorder';
    }

    async open() {
        this.win = this.bp.apps.ui.windowManager.createWindow({
            id: 'screen-recorder',
            title: 'Screen Recorder',
            icon: 'desktop/assets/images/icons/icon_console_64.png',
            x: 100,
            y: 75,
            width: 600,
            height: 550,
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
            onclose: () => this.cleanup()
        });

        this.bindUI();
        return this.win;
    }

    bindUI() {
        // TODO: use jQuery to bind events
        // use this jQuery pattern $('#screen-recorder-start', this.win.content) to bind events
        $('#screen-recorder-start', this.win.content).on('click', () => this.startRecording());
        document.getElementById('screen-recorder-preview').onclick = () => this.startPreview();
        //document.getElementById('screen-recorder-start').onclick = () => this.startRecording();
        document.getElementById('screen-recorder-stop').onclick = () => this.stopRecording();
        document.getElementById('screen-recorder-download').onclick = () => this.downloadRecording();
        document.getElementById('screen-recorder-screenshot').onclick = () => this.takeScreenshot();
        document.getElementById('screen-recorder-preview-stop').onclick = () => this.stopPreview();
    }

    async startPreview() {
        try {
            if (!this.stream) {
                this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

                const liveVideo = document.getElementById('screen-recorder-live-video');
                liveVideo.srcObject = this.stream;
                liveVideo.play();

                this.togglePreviewUI(true);
            }
        } catch (err) {
            console.error('Error starting screen preview:', err);
        }
    }

    stopPreview() {
        const liveVideo = document.getElementById('screen-recorder-live-video');
        liveVideo.pause();
        liveVideo.srcObject = null;

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.togglePreviewUI(false);
    }

    startRecording() {
        if (!this.stream) {
            console.warn('Stream not initialized. Please start preview first.');
            return;
        }

        this.recordedChunks = [];
        this.videoBlob = null;
        this.videoURL = null;

        this.recorder = new MediaRecorder(this.stream);
        this.recorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.recordedChunks.push(e.data);
        };

        this.recorder.onstop = () => {
            this.generatePreview();
            this.stopTimer();
        };

        this.recorder.start();
        this.startTimer();
        this.toggleRecordingUI(true);

        console.log('Recording started');
    }

    stopRecording() {
        if (this.recorder && this.recorder.state !== 'inactive') {
            this.recorder.stop();
            console.log('Recording stopped');
            this.toggleRecordingUI(false);
        }
    }

    generatePreview() {
        this.videoBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.videoURL = URL.createObjectURL(this.videoBlob);

        const container = document.getElementById('screen-recorder-preview-video');
        container.innerHTML = '';

        const video = document.createElement('video');
        video.src = this.videoURL;
        video.controls = true;
        video.style.width = '100%';
        container.appendChild(video);
    }

    togglePreviewUI(isPreviewing) {
        document.getElementById('screen-recorder-preview').disabled = isPreviewing;
        document.getElementById('screen-recorder-preview-stop').disabled = !isPreviewing;
        document.getElementById('screen-recorder-screenshot').disabled = !isPreviewing;
    }


    downloadRecording() {
        if (!this.videoBlob) return;

        const a = document.createElement('a');
        a.href = this.videoURL;
        a.download = `buddypond-screen-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async takeScreenshot() {
        try {
            // Prompt user for screen capture if stream doesn't exist
            if (!this.stream) {
                this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            }

            const videoTrack = this.stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(videoTrack);

            const bitmap = await imageCapture.grabFrame();
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            canvas.getContext('2d').drawImage(bitmap, 0, 0);

            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const img = document.createElement('img');
                img.src = url;
                img.alt = 'Screenshot';
                img.className = 'screen-recorder-screenshot';

                const container = document.getElementById('screen-recorder-preview-screenshots');
                container.appendChild(img);
            }, 'image/png');
        } catch (err) {
            console.error('Screenshot error:', err);
        }
    }


    startTimer() {
        alert('Starting timer');
        const indicator = document.getElementById('screen-recorder-indicator');
        const timer = document.getElementById('screen-recorder-timer');
        this.secondsElapsed = 0;

        this.timerInterval = setInterval(() => {
            this.secondsElapsed++;
            const min = String(Math.floor(this.secondsElapsed / 60)).padStart(2, '0');
            const sec = String(this.secondsElapsed % 60).padStart(2, '0');
            timer.textContent = `${min}:${sec}`;
        }, 1000);

        indicator.classList.add('recording');
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        document.getElementById('screen-recorder-indicator').classList.remove('recording');
        document.getElementById('screen-recorder-timer').textContent = '00:00';
    }

    toggleRecordingUI(isRecording) {
        //document.getElementById('screen-recorder-start').disabled = isRecording;
        //document.getElementById('screen-recorder-stop').disabled = !isRecording;
        //document.getElementById('screen-recorder-screenshot').disabled = !isRecording;
    }

    cleanup() {
        this.stopTimer();
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
}
