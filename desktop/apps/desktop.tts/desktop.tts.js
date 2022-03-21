desktop.app.tts = {};
desktop.app.tts.available = false;
desktop.app.tts.icon = 'folder';
desktop.app.tts.label = 'Text To Speech';
desktop.app.tts.voices = [];
desktop.app.tts.load = function loadtts (params, next) {

  if ('speechSynthesis' in window){
    desktop.app.tts.available = true;
  }

  function populateVoices () {
    var voices = speechSynthesis.getVoices();
    desktop.app.tts.voices = [];
    for(var i = 0; i < voices.length; i++) {
      desktop.app.tts.voices.push(voices[i]);
    }
  }

  if (desktop.app.tts.available) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices;
    }
    populateVoices();
  }

  // desktop can speak text via client-side TTS engine
  // creates easy reference on desktop object
  desktop.say = desktop.app.tts.say;
  next();

};

desktop.app.tts.say = function speakText (text) {
  // TODO: only speak text onces per client session, regardless of window re-opening
  // TODO: look at card cache, might be good solution, cannot use message cache ( need to replay text of message )

  if (!desktop.app.tts.available) {
    console.log('Warning: TTS Engine not available, cannot speak text.');
  }

  if (desktop.app.tts.available && desktop.settings.audio_enabled && desktop.settings.audio_tts_enabled) {
    var speech = new SpeechSynthesisUtterance(text);
    // TODO: configure voice and language to locality
    // TODO: localStorage desktop.settings for tts settings
    // speech.lang = desktop.app.tts.lang || 'en-US';
    // default to first choice if mapping doesn't work
    speech.voice = desktop.app.tts.voices[desktop.settings.tts_voice_index] || desktop.app.tts.voices[0];
    window.speechSynthesis.speak(speech);
  }
}

desktop.app.tts.processMessage = function processTTSMessage (message) {

  // localize message date time to check how old /say messages are
  let localDate = new Date();
  let remoteMessageDate = new Date(message.ctime);
  let localizedRemoteMessageDateString = DateFormat.format.toBrowserTimeZone(remoteMessageDate);
  let localizedRemoteMessageDate = new Date(localizedRemoteMessageDateString);
  let diff = (localDate.getTime() - localizedRemoteMessageDate.getTime()) / 1000;

  // do not /say messages older than 10 seconds  ( prevents message replay spam on join )
  if (diff > 10) {
    return;
  } 

  let text = '';
  text = message.text.split(' ');
  if (text[0] === '/say') {
    text.shift();
    let msg = text.join(' ');
    // TODO: send entire message obj to .say()? set locale inside say method?
    if (message.card && message.card.voiceIndex) {
      let og = desktop.settings.tts_voice_index;
      desktop.set('tts_voice_index', message.card.voiceIndex);
      desktop.app.tts.say(msg || 'nope');
      desktop.set('tts_voice_index', og);
    } else {
      desktop.app.tts.say(msg || 'nope');
    }
  }
}