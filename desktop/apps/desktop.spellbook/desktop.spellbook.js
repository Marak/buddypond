desktop.app.spellbook = {};
desktop.app.spellbook.label = "Spellbook";
desktop.app.spellbook.spells = [
  // 'ebublio',
  'zalgo',
  'babel.js',
  'riddikulus',
  'episkey',
  'rickroll',
  'alert',
  'logout',
  'banhammer'
];

desktop.app.spellbook.load = function loadSpellBook (params, next) {
  desktop.load.remoteAssets([
    'spellbook' // this loads the sibling desktop.app.spellbook.html file into <div id="window_spellbook"></div>
  ], function (err) {
    $('#window_spellbook').css('width', 662);
    $('#window_spellbook').css('height', 533);
    $('#window_spellbook').css('left', 50);
    $('#window_spellbook').css('top', 50);

    // load omegaSpellTome drop down
    desktop.app.spellbook.spells.forEach(function(spell){
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
                //desktop.app.spellbook[spellName]();
              } else {
                if (buddyName === buddypond.me) {
                  alert(`You targeted yourself? Well played.`);
                } else {
                  alert(`${data.message}\n\nReflecting ${spellName} back to Desktop Client`);
                }
                if (desktop.app.spellbook && desktop.app.spellbook[spellName]) {
                  desktop.app.spellbook[spellName]();
                } else {
                  alert(spellName + ' is forbidden knowledge');
                  $('#window_spellbook').hide();
                }
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
desktop.app.spellbook.alert = function spellbookAlert () {
  alert('Hello Buddy. Hope you are having a wonderful day.');
} 

// instructs desktop client to log buddy out of the system locally
// this is useful if you need to sign out your account on a remote device
desktop.app.spellbook.logout = function logoutBuddy () {
  desktop.login.logoutDesktop();
} 

desktop.app.spellbook.banhammer = function banBuddy () {
  alert('You have been banned from the Mickey Mouse Club for inappropiate behavior.');
  desktop.login.logoutDesktop();
} 

// sends Desktop client to a new url
desktop.app.spellbook.rickroll = function rickroll () {
  document.location = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
} 

desktop.app.spellbook.ebublio = function lightingBolt () {
  // summon Merlin
  $("#loaderHolder").show()
  $('#mainOverlay').hide();
  
  desktop.app.Merlin.show();
  desktop.app.Merlin.speak("Ebublio!");
  desktop.app.Merlin.play("DoMagic1", 4444, function(){
    desktop.app.Merlin.speak("Be cool my dude.");
    $( "#wallpaper" ).effect("shake", { direction: 'left', distance: 112, times: 111 }, function(){
      $( "#wallpaper" ).effect("shake", { direction: 'down', distance: 112, times: 111 }, function(){
        desktop.app.Merlin.speak("Would you like to learn Magic with Merlin?");
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


// please no
desktop.app.spellbook.zalgo = function castZalgoSpell (params, next) {
  $('span, label, a').each(function(i, item){
    if($(this).css('display') === 'block') {
        $(this).attr('data-og-zalgo', $(this).html());
        $(this).html(desktop.app.spellbook._zalgo($(this).html()))
        $(this).addClass('rainbowFast');
      }
  });
  let count = 0;
  let zalgoInt = setInterval(function(){
    $('span, label, a').each(function(i, item){
      if($(this).css('display') === 'block') {
        $(this).html(desktop.app.spellbook._zalgo($(this).attr('data-og-zalgo')))
      }
    });
    count++;
    if (count > 13) {
      clearInterval(zalgoInt);
      $('span, label, a').each(function(i, item){
        if ($(this).css('display') === 'block') {
          $(this).html($(this).attr('data-og-zalgo'))
          $(this).removeClass('rainbowFast');
        }
      });
    }
  }, 1666)
} 

// he comes
let _zalgo = desktop.app.spellbook._zalgo = function zalgo(text, options) {
  text = text || '   he is here   ';
  var soul = {
    'up': [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚',
    ],
    'down': [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣',
    ],
    'mid': [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉',
    ],
  };
  var all = [].concat(soul.up, soul.down, soul.mid);

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function isChar(character) {
    var bool = false;
    all.filter(function(i) {
      bool = (i === character);
    });
    return bool;
  }


  function heComes(text, options) {
    var result = '';
    var counts;
    var l;
    options = options || {};
    options['up'] =
      typeof options['up'] !== 'undefined' ? options['up'] : true;
    options['mid'] =
      typeof options['mid'] !== 'undefined' ? options['mid'] : true;
    options['down'] =
      typeof options['down'] !== 'undefined' ? options['down'] : true;
    options['size'] =
      typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
    text = text.split('');
    for (l in text) {
      if (isChar(l)) {
        continue;
      }
      result = result + text[l];
      counts = {'up': 0, 'down': 0, 'mid': 0};
      switch (options.size) {
        case 'mini':
          counts.up = randomNumber(4);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(4);
          break;
        case 'maxi':
          counts.up = randomNumber(4) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(16) + 3;
          break;
        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
      }

      var arr = ['up', 'mid', 'down'];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
};

