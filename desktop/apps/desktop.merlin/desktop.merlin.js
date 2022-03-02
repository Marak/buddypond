desktop.app.merlin = {};
desktop.app.merlin.icon = "folder";
desktop.app.merlin.label = "Merlin";

desktop.app.merlin.load = function loadmerlinGames (params, next) {
  desktop.load.remoteAssets([
    'desktop/apps/desktop.merlin/clippy/clippy.css',
    'desktop/apps/desktop.merlin/clippy/clippy.min.js'
    // 'merlin' // this loads the sibling desktop.app.merlin.html file into <div id="window_merlin"></div>
  ], function (err) {

    clippy.load('Merlin', function(agent) {
       desktop.app.Merlin = agent;
       agent.show();

       // setup an event listener so we can emit messages for merlin to speak
       desktop.on('merlin-speaks', 'merlin-app-clippy-speak', function(text){
         agent.speak(text);
       })

       if (!buddypond.qtokenid) {
         agent.speak('Welcome to Buddy Pond! I am Merlin. Please click around and enjoy. Try the Interdimensional Cable!');
       }

     });

    next();
  });
};

// TODO: make window for interacting with merlin / going through each clippy interaction
desktop.app.merlin.openWindow = function openWindow () {
  return true;
};

desktop.app.merlin.closeWindow = function closeWindow () {
  return true;
};