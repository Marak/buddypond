desktop.app.merlin = {};
desktop.app.merlin.label = 'Merlin';
desktop.app.merlin.agent = null;
desktop.app.merlin.hiddenByDefault = true;
desktop.app.merlin.load = function loadmerlinGames (params, next) {

  desktop.load.remoteAssets([
    'desktop/appstore/desktop.merlin/clippy/clippy.css',
    'desktop/appstore/desktop.merlin/clippy/clippy.min.js',
    'merlin' // this loads the sibling desktop.app.merlin.html file into <div id="window_merlin"></div>
  ], function (err) {

    $('.agent_merlin_active').on('change', function(){
      // TODO: load / unload merlin if he's active
      desktop.set('agent_merlin_active', $(this).prop('checked'));
    })

    if (!desktop.settings.agent_merlin_active) {
      return next();
    }

    clippy.load('Merlin', function (agent) {
      desktop.app.merlin.agent = agent;
      agent.show();

      // setup an event listener so we can emit messages for merlin to speak
      desktop.on('merlin-speaks', 'merlin-app-clippy-speak', function (text) {
        agent.speak(text);
      });

      desktop.on('merlin-hides', 'merlin-app-clippy-hide', function (text) {
        agent.hide();
      });

      if (!buddypond.qtokenid) {
        agent.speak('Welcome to Buddy Pond! I am Merlin. Please click around and enjoy.');
      }

      next();

    });

  });
};

// TODO: make window for interacting with merlin / going through each clippy interaction
desktop.app.merlin.openWindow = function openWindow () {
  $('#window_merlin').hide();

  $('#window_merlin').remove();
  return true;
  $('#window_merlin').css('width', '22vw');
  $('#window_merlin').css('height', '55vh');
  $('#window_merlin').css('left', 50);
  $('#window_merlin').css('top', 50);
  $('.agent_merlin_active').prop('checked', desktop.settings.agent_merlin_active);
  if (desktop.app.merlin.agent) {
    desktop.app.merlin.agent.show();
    desktop.emit('merlin-speaks', `So you'd like to learn Magic from Merlin? Let's begin.`);
  }
  return true;
};

desktop.app.merlin.closeWindow = function closeWindow () {
  return true;
};