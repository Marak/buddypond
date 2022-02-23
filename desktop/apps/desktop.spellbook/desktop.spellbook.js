desktop.spellbook = {};
desktop.spellbook.label = "Spellbook";
desktop.spellbook.spells = [
  'ebublio',
  'rickroll',
  'alert',
  'logout',
  'banhammer'
];

desktop.spellbook.load = function loadSpellBook (params, next) {
  desktop.loadRemoteAssets([
    'spellbook' // this loads the sibling desktop.spellbook.html file into <div id="window_spellbook"></div>
  ], function (err) {
    $('#window_spellbook').css('width', 662);
    $('#window_spellbook').css('height', 533);
    $('#window_spellbook').css('left', 50);
    $('#window_spellbook').css('top', 50);

    // load omegaSpellTome drop down
    desktop.spellbook.spells.forEach(function(spell){
      $('.omegaSpellTome').append(`<option value="${spell}">${spell}</option>`)
    });

    function castSpell () {
      let spellName = $('.omegaSpellTome').val();
      let buddyName = $('#castSpellBuddyName').val();
      if (spellName.length > 0 && buddyName.length > 0) {
        // if Buddy fails role check, reflect the spell back onto them
        $( ".castSpellForm" ).effect("shake", { direction: 'down', distance: 10, times: 33 }, 300, function(){
          buddypond.castSpell(buddyName, spellName, function(err, data){
            if (err) {
              alert(err.message);
            }
            if (data.success === false) {
              if (data.message === 'qtokenid is required') {
                alert(`You didn't even try to login!\n\n${spellName} has fizzled.`);
                //desktop.spellbook[spellName]();
              } else {
                alert(`${data.message}\n\nReflecting ${spellName} back to Desktop Client`);
                desktop.spellbook[spellName]();
              }
            } else {
              // success
            }
          })
        });
      }
    }

    $('.castSpellForm').on('submit', function(){
      castSpell();
      return false;
    })

    $('.ponderSpellbook').on('click', function(){
      castSpell();
    });

    next();
  });
}

// basic alert window to client
desktop.spellbook.alert = function spellbookAlert () {
  alert('Hello Buddy. Hope you are having a wonderful day.');
} 

// instructs desktop client to log buddy out of the system locally
// this is useful if you need to sign out your account on a remote device
desktop.spellbook.logout = function logoutBuddy () {
  desktop.login.logoutDesktop();
} 

desktop.spellbook.banhammer = function banBuddy () {
  alert('You have been banned from the Mickey Mouse Club for inappropiate behavior.');
  desktop.login.logoutDesktop();
} 

// sends Desktop client to a new url
desktop.spellbook.rickroll = function rickroll () {
  document.location = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
} 

desktop.spellbook.ebublio = function lightingBolt () {
  // summon Merlin
  $("#loaderHolder").show()
  $('#mainOverlay').hide();
  
  desktop.Merlin.show();
  desktop.Merlin.speak("Ebublio!");
  desktop.Merlin.play("DoMagic1", 4444, function(){
    desktop.Merlin.speak("Be cool my dude.");
    $( "#wallpaper" ).effect("shake", { direction: 'left', distance: 112, times: 111 }, function(){
      $( "#wallpaper" ).effect("shake", { direction: 'down', distance: 112, times: 111 }, function(){
        desktop.Merlin.speak("Would you like to learn Magic with Merlin?");
        $( "#wallpaper" ).effect("shake", { direction: 'right', distance: 112, times: 111 }, function(){
          $( "#wallpaper" ).effect("shake", { direction: 'up', distance: 112, times: 111 }, function(){
          $('#loaderHolder').fadeOut({
            easing: 'linear',
            duration: 388
          });
          $('#mainOverlay').fadeIn({
            easing: 'linear',
            duration: 777,
            complete: function(){
              // desktop should already be started and running
            }
          });
        });
      });
    });
  });
});
}