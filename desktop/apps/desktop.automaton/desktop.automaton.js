desktop.app.automaton = {};
desktop.app.automaton.automatons = {};

desktop.app.automaton.label = "Automaton";

desktop.app.automaton.load = function loadautomatonGames (params, next) {
  desktop.load.remoteAssets([
    'desktop/apps/desktop.automaton/automatons/dicey.js',
    // 'automaton' // this loads the sibling desktop.app.automaton.html file into <div id="window_automaton"></div>
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

desktop.app.automaton.processMessages = function (data, callback) {

  // TODO: Temporary, needs to implement  desktop.app.automaton.html form and desktop.app.localstorage.set()
  if (buddypond.me === 'Dicey') {
    desktop.settings.automaton_enabled = true;
  }

  // console.log('desktop.app.automaton.processMessages', data);
  if (!desktop.settings.automaton_enabled) {
    // disabled by default for now
    return callback(null, 'skipped');
  }

  Object.keys(desktop.app.automaton.automatons).forEach(function(automatonName){
    let auto = desktop.app.automaton.automatons[automatonName];
    // console.log('auto', auto)
    data.messages.forEach(function(message){
      // perform exported action
      let numbery = 20;
      let arg = message.text.split(' ')[1] || numbery;
      try {
        numbery = new Number(arg);
      } catch (err) {
      }
      let result = auto.roll(numbery);
      if (message.text.substr(0, 5) === '/roll') {
        if (message.type === 'pond') {
          buddypond.pondSendMessage(message.to, result.toString(), function(err, data){
            console.log('auto roll result', err, data);
          });
        }
        if (message.type === 'buddy') {
          buddypond.sendMessage(message.from, result.toString(), function(err, data){
            console.log('auto roll result', err, data);
            desktop.app.closeWindow('buddy_message', message.from);
          });
        }
      } else {
        // TODO: give numbers in response to PMs
        if (message.type === 'buddy') {
          buddypond.sendMessage(message.from, result.toString(), function(err, data){
            console.log('auto roll result', err, data);
            desktop.app.closeWindow('buddy_message', message.from);
          });
        }
      }
    });
  });
  callback(null, data);
}

desktop.app.automaton.openWindow = function openWindow () {
  return true;
};

desktop.app.automaton.closeWindow = function closeWindow () {
  return true;
};