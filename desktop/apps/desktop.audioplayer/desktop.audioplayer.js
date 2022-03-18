desktop.app.audioplayer = {};
desktop.app.audioplayer.icon = 'folder';
desktop.app.audioplayer.load = function loadAudioPlayer (params, next) {
  next();
};

// keeps track of playing sounds so that Apps don't accidentally spam audio
desktop.app.audioplayer.playing = {};

desktop.app.audioplayer.play = function playAudio (soundPath, tryHard, callback) {
  callback = callback || function noop () {}
  if (!desktop.settings.audio_enabled) {
    // do not play any audio if desktop is not enabled
    return callback(null, false);
  } else {
    // play the audio
    if (desktop.app.audioplayer.playing[soundPath]) {
      console.log(`Warning: Already playing ${soundPath}, will not play same audio file concurrently.`);
      return callback(null, false);
    }
    // set a flag for this audio file path to ensure we don't attempt to play it concurrently with itself
    desktop.app.audioplayer.playing[soundPath] = true;
    try {
      var audio = new Audio(soundPath);
      audio.addEventListener('ended', function() {
        // the audio file has completed, reset the flag to indicate the audio file path can be played again
        desktop.app.audioplayer.playing[soundPath] = false;
        if (callback) {
          callback(null, true);
        }
      }, false);

      // Remark: Wrap audio.play() promise in _play function to allow `tryHard` retries
      //         This allows the Desktop to optionaly retry audio if the the first attempt fails
      //.        This is currently being used to ensure WELCOME sound plays on first document interaction
      function _play () {
        audio.play()
          .then(() => {
            // success
          })
          .catch(error => {
            // console.log('Unable to play the audio, User has not interacted yet.');
            desktop.app.audioplayer.playing[soundPath] = false;
            if (tryHard) {
              tryHard--;
              setTimeout(function(){
                _play();
              }, 333)
            }
        });
      }
      _play();


    } catch (err) {
      console.log('Warning Audio Error:', err.message)
      desktop.app.audioplayer.playing[soundPath] = false;
      return callback(err, false);
    }
  }
}