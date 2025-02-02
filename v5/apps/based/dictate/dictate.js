/* Dictate.js - Marak Squires 2025 - BuddyPond */
export default class Dictate {
    constructor(bp, settings = {}) {
        this.bp = bp;
        this.settings = {
            dictationEnabled: settings.dictationEnabled || true,
            language: settings.language || 'en-US'
        };
        this.recognition = null;
        this.init();
    }

    open ({ targetEl }) {
        console.log('Opening Dictate recorder...', targetEl);
        this.targetEl = targetEl;
        this.start();
    }

    init() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false; // Stop after one sentence
            this.recognition.interimResults = false; // Only final results
            this.recognition.lang = this.settings.language;
            this.available = true;
            
            this.recognition.onresult = this.onResult.bind(this);
            this.recognition.onerror = this.onError.bind(this);
            this.recognition.onend = this.onEnd.bind(this);
        } else {
            this.available = false;
            console.log('Speech Recognition not supported in this browser.');
        }

        this.bp.dictate = this.start.bind(this);
    }

    start() {
        if (!this.available || !this.settings.dictationEnabled) {
            console.log('Warning: Speech recognition not available or disabled.');
            return;
        }
        console.log('Starting speech recognition...');
        this.recognition.start();
    }

    stop() {
        if (!this.available) return;
        console.log('Stopping speech recognition...');
        this.recognition.stop();
    }

    onResult(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized text:', transcript);
        // targetEl is a jquery object
        this.targetEl.val(this.targetEl.val() + ' ' + transcript);
    }

    onError(event) {
        console.error('Speech recognition error:', event.error);
    }

    onEnd() {
        console.log('Speech recognition ended.');
    }

    enableDictation(enable = true) {
        this.settings.dictationEnabled = enable;
    }

    setLanguage(language) {
        this.settings.language = language;
        if (this.recognition) {
            this.recognition.lang = language;
        }
    }
}
