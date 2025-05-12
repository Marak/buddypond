export default class Say {
  constructor(bp, settings = {}) {
      this.bp = bp;
      this.settings = {
          audioEnabled: settings.audioEnabled || true,
          ttsEnabled: settings.ttsEnabled || true,
          ttsVoiceIndex: settings.ttsVoiceIndex || 0,
          language: settings.language || 'en-US'
      };
      this.voices = [];
  }

  init() {
      if ('speechSynthesis' in window) {
          this.available = true;
          this.loadVoices();
          if (typeof speechSynthesis.onvoiceschanged !== 'undefined') {
              speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
          }
      } else {
          this.available = false;
          console.log('Speech Synthesis not supported in this browser.');
      }
      this.bp.say = this.speak.bind(this);
      this.bp.on('say::message', 'speak-message-text', (message) => {
          this.speak(message.text);
      });
  }

  loadVoices() {
      this.voices = speechSynthesis.getVoices();
  }

  speak(text) {
      if (!this.available || !this.settings.audioEnabled || !this.settings.ttsEnabled) {
          console.log('Warning: TTS Engine not available or disabled.');
          return;
      }

      const speech = new SpeechSynthesisUtterance(text);
      speech.voice = this.voices[this.settings.ttsVoiceIndex] || this.voices[0];
      speech.lang = this.settings.language;

      window.speechSynthesis.speak(speech);
  }

  setVoice(index) {
      if (index < 0 || index >= this.voices.length) {
          console.log('Invalid voice index.');
          return;
      }
      this.settings.ttsVoiceIndex = index;
  }

  setLanguage(language) {
      this.settings.language = language;
  }

  enableTTS(enable = true) {
      this.settings.ttsEnabled = enable;
  }

  enableAudio(enable = true) {
      this.settings.audioEnabled = enable;
  }

  processMessages(message) {
      const now = new Date();
      const messageDate = new Date(message.ctime);
      const timeDiff = (now.getTime() - messageDate.getTime()) / 1000;

      if (timeDiff > 10) {
          // console.log('Message is too old to be processed for TTS.');
          return;
      }

      if (message.text.startsWith('/say')) {
          const parts = message.text.split(' ');
          parts.shift(); // Remove '/say'
          const textToSpeak = parts.join(' ');

          if (message.card && typeof message.card.voiceIndex !== 'undefined') {
              const originalVoiceIndex = this.settings.ttsVoiceIndex;
              this.setVoice(message.card.voiceIndex);
              this.speak(textToSpeak || 'no text provided');
              this.setVoice(originalVoiceIndex); // Restore original voice index
          } else {
              this.speak(textToSpeak || 'no text provided');
          }
      }
  }
}

/*
// Example usage:
const say = new Say({ audioEnabled: true, ttsEnabled: true, ttsVoiceIndex: 0, language: 'en-US' });
say.processMessages({
  ctime: new Date().toISOString(),
  text: '/say Hello, how are you today?',
  card: { voiceIndex: 1 }
});
*/