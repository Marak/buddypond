desktop.automaton = {};
desktop.automaton.automatons = {};

desktop.automaton.label = "Automaton";

desktop.automaton.load = function loadautomatonGames (params, next) {
  desktop.loadRemoteAssets([
    'desktop/apps/desktop.automaton/automatons/dicey.js',
    // 'automaton' // this loads the sibling desktop.automaton.html file into <div id="window_automaton"></div>
  ], function (err) {
    /*
    $('#window_automaton').css('width', 662);
    $('#window_automaton').css('height', 495);
    $('#window_automaton').css('left', 50);
    $('#window_automaton').css('top', 50);
    */
    next();
  });
};

desktop.automaton.processMessages = function (data, callback) {

  // console.log('desktop.automaton.processMessages', data);
  if (!desktop.settings.automaton_enabled) {
    // disabled by default for now
    return callback(null, 'skipped');
  }

  Object.keys(desktop.automaton.automatons).forEach(function(automatonName){
    let auto = desktop.automaton.automatons[automatonName];
    // console.log('auto', auto)
    data.messages.forEach(function(message){
      if (message.text.substr(0, 5) === '/roll') {
        // perform exported action
        let numbery = 20;
        let arg = message.text.split(' ')[1] || numbery;
        try {
          numbery = new Number(arg);
        } catch (err) {
        }
        let result = auto.roll(numbery);
        if (message.type === 'pond') {
          buddypond.pondSendMessage(message.to, result.toString(), function(err, data){
            console.log('auto roll result', err, data);
          });
        }
        if (message.type === 'buddy') {
          buddypond.sendMessage(message.from, result.toString(), function(err, data){
            console.log('auto roll result', err, data);
          });
        }
      }
    });
  });
  callback(null, data);
}

desktop.automaton.openWindow = function openWindow () {
  return true;
};

desktop.automaton.closeWindow = function closeWindow () {
  return true;
};