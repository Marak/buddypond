desktop.audioplayer = {};

desktop.audioplayer.load = function loadAudioPlayer (params, next) {
  return true;
};

// keeps track of playing sounds so that Apps don't accidentally spam audio
desktop.audioplayer.playing = {};

desktop.audioplayer.play = function playAudio (soundPath) {
  if (desktop.settings.audio_muted) {
    // do not play any audio if desktop is muted
  } else {
    // play the audio
    if (desktop.audioplayer.playing[soundPath]) {
      console.log(`Warning: Already playing ${soundPath}, will not play same audio file concurrently.`);
      return;
    }
    desktop.audioplayer.playing[soundPath] = true;
    var audio = new Audio(soundPath);
    audio.addEventListener('ended', function() {
      desktop.audioplayer.playing[soundPath] = false;
    },false);
    audio.play();
  }
}