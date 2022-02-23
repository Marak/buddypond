desktop.wallpaper = {};
desktop.wallpaper.canvas = null;
desktop.wallpaper.canvasTimer = null;
desktop.wallpaper.label = "Wallpaper"
desktop.wallpaper.settings = null
desktop.wallpaper.init = false
desktop.wallpaper.width = 0
desktop.wallpaper.height = 0

desktop.wallpaper.paused = false;
desktop.wallpaper.load = function desktopLoadBuddyList (params, next) {
  desktop.loadRemoteAssets([
    'desktop/assets/js/jquery.simple-color.js',
    'wallpaper'
  ], function (err) {
    desktop.wallpaper.wallpaperCanvasSize()
    if (desktop.settings.wallpaper_name) {
      // since settings were found, set the current active desktop from settings
      desktop.wallpaper.active = desktop.settings.wallpaper_name;
      desktop.wallpaper.activeColor = desktop.settings.wallpaper_color;

      // TODO: remove if else replace one-liner / better DOM tags
      if (desktop.wallpaper.active === 'matrix') {
        $('#wallPaperRadioMatrix').prop('checked', true);
      } else {
        $('#wallPaperRadioSolid').prop('checked', true);
        desktop.wallpaper.drawSolid(desktop.wallpaper.activeColor)
      }

    } else {
      // default wallpaper is matrix
      $('#wallPaperRadioMatrix').prop('checked', true);
      desktop.wallpaper.active = 'matrix';
      desktop.wallpaper.activeColor = '#008F11';
    }

    desktop.wallpaper.start();

    $('#window_wallpaper').css('width', 366);
    $('#window_wallpaper').css('height', 444);

    $('.pauseWallpaper').on('click', function(){
      if (desktop.wallpaper.paused) {
        desktop.wallpaper.start();
        $('.pauseWallpaper ').html('Pause Wallpaper');
      } else {
        $('#wallpaper').fadeOut('slow');
        $('.pauseWallpaper ').html('Resume Wallpaper');
        desktop.wallpaper.pause();
      }
    });

    $(".saveWallpaperSettings").on('click', function() {
      desktop.localstorage.set('wallpaper_name', desktop.wallpaper.active);
      desktop.localstorage.set('wallpaper_color', desktop.wallpaper.activeColor);
    })

    $('input[name=wallpaper_opt]').on('input', function () {
      var radioValue = $('input[name=wallpaper_opt]:checked').val();
      // set current radio value to active wallpaper
      desktop.wallpaper.active = radioValue;

      if (desktop.wallpaper.active === 'matrix') {
        // desktop.wallpaper.matrixTextColor = opts.matrix.color
        if (!desktop.wallpaper.init) {
          desktop.wallpaper.start()
          desktop.wallpaper.init = true
        } else {
          if (desktop.wallpaper.paused) {
            desktop.wallpaper.clear()
            desktop.wallpaper.start()
          }
        }
      } else {
        desktop.wallpaper.stop();
        desktop.wallpaper.drawSolid(desktop.wallpaper.activeColor)
      }
    });

    $( window ).resize(function(e) {
      if (e.target !== window) {
        return
      }
      desktop.wallpaper.wallpaperCanvasSize()
      if (desktop.wallpaper.active === "solid") {
        desktop.wallpaper.drawSolid(desktop.wallpaper.activeColor)
      } else if (desktop.wallpaper.active === "matrix") {
        // recalc matrix columns and drops
        var font_size = 10;
        var columns = c.width / font_size;
        drops = []
        if (drops.length === 0) {
          for (var x = 0; x < columns; x++)
            drops[x] = parseInt(Math.random() * c.height);
        }
      }
    })

    function onSelect (context, hex) {
      desktop.wallpaper.activeColor = '#' + hex;
      if (context === 'solid') {
        desktop.wallpaper.drawSolid(desktop.wallpaper.activeColor)
      }
    }

    function onCellEnter (context, hex) {
      desktop.wallpaper.activeColor = '#' + hex;
      if (context === 'solid') {
        desktop.wallpaper.drawSolid(desktop.wallpaper.activeColor)
      }
    }

    $('.wallpaperOptionColor').simpleColor({
        boxHeight: 20,
        cellWidth: 16,
        cellHeight: 16,
        defaultColor: desktop.wallpaper.activeColor || '#008F11',
        inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
        chooserCSS: { 'border': '1px solid #660033', 'right': '25px', 'top': '-50px' },
        displayCSS: {  },
        displayColorCode: true,
        livePreview: true,
        insert: 'before',
        onSelect: function(hex, element) {
          onSelect(desktop.wallpaper.active, hex);
        },
        onCellEnter: function(hex, element) {
          onCellEnter(desktop.wallpaper.active, hex);
        },
        onClose: function(element) {
        }
      })
    next();
  })
  return true;
};

desktop.wallpaper.drawSolid = function (color) {
  var c = document.getElementById("c")
  var ctx = c.getContext("2d")
  ctx.fillStyle = color
  ctx.fillRect(0, 0, c.width, c.height)
}

desktop.wallpaper.wallpaperCanvasSize = function() {
  var c = document.getElementById("c");
  c.height = window.innerHeight;
  c.width = window.innerWidth;
  desktop.wallpaper.height = window.innerHeight;
  desktop.wallpaper.width = window.innerWidth;
}

var drops = []; // matrix specific, can move, scoped outside function to perserve position
desktop.wallpaper.start = function startWallpaper () {

  if (desktop.wallpaper.active !== 'matrix') {
    return;
  }

  desktop.wallpaper.paused = false;

  desktop.wallpaper.wallpaperCanvasSize()

  var c, ctx;
  c = document.getElementById("c");
  ctx = c.getContext("2d");

  var matrix = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345666777788889@#$%^&*()*&^%+-/~{[|`]}";

  //converting the string into an array of single characters
  matrix = matrix.split("");

  var font_size = 10;
  var columns = c.width / font_size; //number of columns for the rain
  //an array of drops - one per column
  //x below is the x coordinate
  //1 = y co-ordinate of the drop(same for every drop initially)
  
  if (drops.length === 0) {
    for (var x = 0; x < columns; x++)
      drops[x] = parseInt(Math.random() * c.height);
  }

  //drawing the characters
  function draw() {
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0,  desktop.wallpaper.width,  desktop.wallpaper.height);

    ctx.fillStyle = desktop.wallpaper.activeColor;
    ctx.font = font_size + "px arial";
    //looping over drops
    for (var i = 0; i < drops.length; i++) {
      //a random chinese character to print
      var text = matrix[Math.floor(Math.random() * matrix.length)];
      //x = i*font_size, y = value of drops[i]*font_size
      ctx.fillText(text, i * font_size, drops[i] * font_size);

      //sending the drop back to the top randomly after it has crossed the screen
      //adding a randomness to the reset to make the drops scattered on the Y axis
      if (drops[i] * font_size > c.height && Math.random() > 0.975)
        drops[i] = 0;

      //incrementing Y coordinate
      drops[i]++;
    }
  }
  desktop.wallpaper.canvasTimer = setInterval(function(){
    draw();
  }, 66);
}

desktop.wallpaper.clear = function () {
  var c = document.getElementById("c")
  var ctx = c.getContext("2d")
  ctx.clearRect(0, 0, c.width, c.height)
}

desktop.wallpaper.pause = function pauseWallpaper () {
  desktop.wallpaper.paused = true;
  clearInterval(desktop.wallpaper.canvasTimer);
}

desktop.wallpaper.stop = function () {
  desktop.wallpaper.pause()
  desktop.wallpaper.clear()
}