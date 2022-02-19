desktop.spellbook = {};

// basic alert window to client
desktop.spellbook.alert = function spellbookAlert () {
  alert('Hello Buddy. Hope you are having a wonderful day.');
} 

// instructs desktop client to log user out of the system locally
// this is useful if you need to sign out your account on a remote device
desktop.spellbook.logoutUser = function logoutUser () {
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