desktop.app.wallpaper = {};
desktop.app.wallpaper.canvas = null;
desktop.app.wallpaper.canvasTimer = null;
desktop.app.wallpaper.label = "Wallpaper"
desktop.app.wallpaper.settings = null
desktop.app.wallpaper.init = false
desktop.app.wallpaper.width = 0
desktop.app.wallpaper.height = 0

desktop.app.wallpaper.paused = false;
desktop.app.wallpaper.load = function desktopLoadBuddyList (params, next) {
  desktop.load.remoteAssets([
    'desktop/assets/js/jquery.simple-color.js',
    'wallpaper'
  ], function (err) {
    desktop.app.wallpaper.wallpaperCanvasSize()
    if (desktop.settings.wallpaper_name) {
      // since settings were found, set the current active desktop from settings
      desktop.app.wallpaper.active = desktop.settings.wallpaper_name;
      desktop.app.wallpaper.activeColor = desktop.settings.wallpaper_color;

      // TODO: remove if else replace one-liner / better DOM tags
      if (desktop.app.wallpaper.active === 'matrix') {
        $('#wallPaperRadioMatrix').prop('checked', true);
      } else {
        $('#wallPaperRadioSolid').prop('checked', true);
        desktop.app.wallpaper.drawSolid(desktop.app.wallpaper.activeColor)
      }

    } else {
      // default wallpaper is matrix
      $('#wallPaperRadioMatrix').prop('checked', true);
      desktop.app.wallpaper.active = 'matrix';
      desktop.app.wallpaper.activeColor = '#008F11';
    }

    desktop.app.wallpaper.start();

    $('#window_wallpaper').css('width', 366);
    $('#window_wallpaper').css('height', 444);

    $('.pauseWallpaper').on('click', function(){
      if (desktop.app.wallpaper.paused) {
        desktop.app.wallpaper.start();
        $('.pauseWallpaper ').html('Pause Wallpaper');
      } else {
        $('#wallpaper').fadeOut('slow');
        $('.pauseWallpaper ').html('Resume Wallpaper');
        desktop.app.wallpaper.pause();
      }
    });

    $(".saveWallpaperSettings").on('click', function() {
      desktop.set('wallpaper_name', desktop.app.wallpaper.active);
      desktop.set('wallpaper_color', desktop.app.wallpaper.activeColor);
    })

    $('input[name=wallpaper_opt]').on('input', function () {
      var radioValue = $('input[name=wallpaper_opt]:checked').val();
      // set current radio value to active wallpaper
      desktop.app.wallpaper.active = radioValue;

      if (desktop.app.wallpaper.active === 'matrix') {
        // desktop.app.wallpaper.matrixTextColor = opts.matrix.color
        if (!desktop.app.wallpaper.init) {
          desktop.app.wallpaper.start()
          desktop.app.wallpaper.init = true
        } else {
          if (desktop.app.wallpaper.paused) {
            desktop.app.wallpaper.clear()
            desktop.app.wallpaper.start()
          }
        }
      } else {
        desktop.app.wallpaper.stop();
        desktop.app.wallpaper.drawSolid(desktop.app.wallpaper.activeColor)
      }
    });

    $( window ).resize(function(e) {
      if (e.target !== window) {
        return
      }
      desktop.app.wallpaper.wallpaperCanvasSize()
      if (desktop.app.wallpaper.active === "solid") {
        desktop.app.wallpaper.drawSolid(desktop.app.wallpaper.activeColor)
      } else if (desktop.app.wallpaper.active === "matrix") {
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
      desktop.app.wallpaper.activeColor = '#' + hex;
      if (context === 'solid') {
        desktop.app.wallpaper.drawSolid(desktop.app.wallpaper.activeColor)
      }
    }

    function onCellEnter (context, hex) {
      desktop.app.wallpaper.activeColor = '#' + hex;
      if (context === 'solid') {
        desktop.app.wallpaper.drawSolid(desktop.app.wallpaper.activeColor)
      }
    }

    $('.wallpaperOptionColor').simpleColor({
        boxHeight: 20,
        cellWidth: 16,
        cellHeight: 16,
        defaultColor: desktop.app.wallpaper.activeColor || '#008F11',
        inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
        chooserCSS: { 'border': '1px solid #660033', 'right': '25px', 'top': '-50px' },
        displayCSS: {  },
        displayColorCode: true,
        livePreview: true,
        insert: 'before',
        onSelect: function(hex, element) {
          onSelect(desktop.app.wallpaper.active, hex);
        },
        onCellEnter: function(hex, element) {
          onCellEnter(desktop.app.wallpaper.active, hex);
        },
        onClose: function(element) {
        }
      })
    next();
  })
  return true;
};

desktop.app.wallpaper.drawSolid = function (color) {
  var c = document.getElementById("c")
  var ctx = c.getContext("2d")
  ctx.fillStyle = color
  ctx.fillRect(0, 0, c.width, c.height)
}

desktop.app.wallpaper.wallpaperCanvasSize = function() {
  var c = document.getElementById("c");
  c.height = window.innerHeight;
  c.width = window.innerWidth;
  desktop.app.wallpaper.height = window.innerHeight;
  desktop.app.wallpaper.width = window.innerWidth;
}

var drops = []; // matrix specific, can move, scoped outside function to perserve position
desktop.app.wallpaper.start = function startWallpaper () {

  if (desktop.app.wallpaper.active !== 'matrix') {
    return;
  }

  desktop.app.wallpaper.paused = false;

  desktop.app.wallpaper.wallpaperCanvasSize()

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
    ctx.fillRect(0, 0,  desktop.app.wallpaper.width,  desktop.app.wallpaper.height);

    ctx.fillStyle = desktop.app.wallpaper.activeColor;
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
  desktop.app.wallpaper.canvasTimer = setInterval(function(){
    draw();
  }, 66);
}

desktop.app.wallpaper.clear = function () {
  var c = document.getElementById("c")
  var ctx = c.getContext("2d")
  ctx.clearRect(0, 0, c.width, c.height)
}

desktop.app.wallpaper.pause = function pauseWallpaper () {
  desktop.app.wallpaper.paused = true;
  clearInterval(desktop.app.wallpaper.canvasTimer);
}

desktop.app.wallpaper.stop = function () {
  desktop.app.wallpaper.pause()
  desktop.app.wallpaper.clear()
}