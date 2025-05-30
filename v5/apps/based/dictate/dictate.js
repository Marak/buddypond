/* Dictate.js - Marak Squires 2025 - BuddyPond */
export default class Dictate {
    constructor(bp, settings = {}) {
        this.bp = bp;
        this.settings = {
            dictationEnabled: settings.dictationEnabled || true,
            language: settings.language || 'en-US'
        };
        this.recognition = null;
        // this.init(); // do not call init() in constructor, allow bp.init() to call it automatically on load
    }

    async init() {
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

        await this.bp.appendCSS('/v5/apps/based/dictate/dictate.css');
    }


    open({ targetEl }) {
        console.log('Opening Dictate recorder...', targetEl);
        this.targetEl = targetEl;
        this.start();
    }


    start() {
        if (!this.available || !this.settings.dictationEnabled) {
            console.log('Warning: Speech recognition not available or disabled.');
            return;
        }

        if (this.listening) {
            // stop if already listening
            console.log('Stopping speech recognition as it is already active.');
            this.stop();
            //console.log('Speech recognition is already active.');
            return;
        }

        this.listening = true;
        console.log('Starting speech recognition...');
        this.recognition.start();
        // add style to targetEl
        this.targetEl.addClass('dictate-active');
        // update placeholder text to indicate dictation is active
        this.targetEl.attr('placeholder', 'Listening... Speak now!');
        console.log('added class dictate-active to targetEl', this.targetEl);
    }

    stop() {
        if (!this.available) return;
        console.log('Stopping speech recognition...');
        this.recognition.stop();
        // remove style from targetEl

    }

    onResult(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized text:', transcript);
        // targetEl is a jquery object
        if (this.targetEl.val()) {
            this.targetEl.val(this.targetEl.val() + ' ' + transcript);

        } else {
            this.targetEl.val(transcript);
        }


    }

    onError(event) {
        console.error('Speech recognition error:', event.error);
        if (this.targetEl) {
            this.targetEl.removeClass('dictate-active');
            console.log('removed class dictate-active from targetEl', this.targetEl);
        }
    }

    onEnd() {
        console.log('Speech recognition ended.');

        if (this.targetEl) {
            this.targetEl.removeClass('dictate-active');
            console.log('removed class dictate-active from targetEl', this.targetEl);
        }
        this.listening = false;
        this.targetEl.attr('placeholder', 'Type your message...');

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
