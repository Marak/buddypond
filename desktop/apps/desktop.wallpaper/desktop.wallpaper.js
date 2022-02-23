// TODO: have ability to set custom wallpapers with settings
// TODO: have matrix wallpaper be first with color and speed adjustment

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
  $('.pauseWallpaper').on('click', function(){
    if (desktop.wallpaper.paused) {
      desktop.wallpaper.paused = false;
      desktop.wallpaper.start();
      $('.label', '.pauseWallpaper ').html('Pause Wallpaper');
    } else {
      $('#wallpaper').fadeOut('slow');
      $('.label', '.pauseWallpaper ').html('Resume Wallpaper');
      desktop.wallpaper.pause();
    }
  });
  desktop.loadRemoteAssets([
    'desktop/assets/js/jquery.simple-color.js',
    'wallpaper'
  ], function (err) {
    desktop.wallpaper.wallpaperCanvasSize()
    settingsString = window.localStorage.getItem('wallpaper_opts')
    if (settingsString == null) {
      desktop.wallpaper.settings = { active: "matrix", matrix: { color: desktop.wallpaper.matrixTextColor }, solid: { color: "#0000FF" } }
    } else {
      desktop.wallpaper.settings = JSON.parse(settingsString)
    }
    window.localStorage.setItem('wallpaper_opts', JSON.stringify(desktop.wallpaper.settings))

    $("#wp_save_opts").on('click', function() {
      window.localStorage.setItem('wallpaper_opts', JSON.stringify(desktop.wallpaper.settings))
    })
    $('#wp_opt_'+desktop.wallpaper.settings.active).prop("checked", true)
    desktop.wallpaper.handleWallpaperOption()

    $('input[name=wallpaper_opt]').on('input', desktop.wallpaper.handleWallpaperOption)

    $( window ).resize(function() {
      desktop.wallpaper.wallpaperCanvasSize()
      if (desktop.wallpaper.settings.active === "solid") {
        desktop.wallpaper.drawSolid(desktop.wallpaper.settings.solid.color)
      } else if (desktop.wallpaper.settings.active === "matrix") {
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

    $('.wp_opt_matrix_color').simpleColor({
        boxHeight: 20,
        cellWidth: 16,
        cellHeight: 16,
        defaultColor: desktop.wallpaper.settings.matrix.color,
        inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
        chooserCSS: { 'border': '1px solid #660033', 'left': '-315px', 'top': '-50px' },
        displayCSS: {  },
        displayColorCode: true,
        livePreview: true,
        insert: 'before',
        onSelect: function(hex, element) {
          desktop.wallpaper.matrixTextColor = '#' + hex;
          desktop.wallpaper.settings.matrix.color = '#' + hex;
        },
        onCellEnter: function(hex, element) {
          desktop.wallpaper.matrixTextColor = '#' + hex;
          desktop.wallpaper.settings.matrix.color = '#' + hex;
        },
        onClose: function(element) {
        }
      })
    $('.wp_opt_solid_color').simpleColor({
        boxHeight: 20,
        cellWidth: 16,
        cellHeight: 16,
        defaultColor: desktop.wallpaper.settings.solid.color,
        inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
        chooserCSS: { 'border': '1px solid #660033', 'left': '-315px', 'top': '-50px' },
        displayCSS: {  },
        displayColorCode: true,
        livePreview: true,
        insert: 'before',
        onSelect: function(hex, element) {
          desktop.wallpaper.settings.solid.color = '#' + hex;
          desktop.wallpaper.drawSolid(desktop.wallpaper.settings.solid.color)
        },
        onCellEnter: function(hex, element) {
          desktop.wallpaper.settings.solid.color = '#' + hex;
          desktop.wallpaper.drawSolid(desktop.wallpaper.settings.solid.color)
        },
        onClose: function(element) {
        }
      })
    next();
  })
  return true;
};

desktop.wallpaper.handleWallpaperOption = function () {
  var radioValue = $('input[name=wallpaper_opt]:checked').val()
  switch (radioValue) {
    case "matrix":
      $('#wp_opt_matrix_settings').show()
      $('#wp_opt_color_settings').hide()
      break;
    case "solid":
      $('#wp_opt_color_settings').show()
      $('#wp_opt_matrix_settings').hide()
      break;
    default:
      break;
  }
  desktop.wallpaper.settings.active = radioValue
  desktop.wallpaper.applyOptions()
}

desktop.wallpaper.applyOptions = function () {
  var opts = desktop.wallpaper.settings
  switch (opts.active) {
    case "matrix":
      desktop.wallpaper.matrixTextColor = opts.matrix.color
      if (!desktop.wallpaper.init) {
        desktop.wallpaper.start()
        desktop.wallpaper.init = true
      } else {
        if (desktop.wallpaper.paused) {
          desktop.wallpaper.clear()
          desktop.wallpaper.start()
        }
      }
      break;
    case "solid":
      desktop.wallpaper.kill()
      desktop.wallpaper.drawSolid(opts.solid.color)
      break;
    default:
      break;
  }
}

desktop.wallpaper.pause = function pauseWallpaper () {
  desktop.wallpaper.paused = true;
  clearInterval(desktop.wallpaper.canvasTimer);
}

desktop.wallpaper.wallpaperCanvasSize = function() {
  var c = document.getElementById("c");
  c.height = window.innerHeight;
  c.width = window.innerWidth;
  desktop.wallpaper.height = window.innerHeight;
  desktop.wallpaper.width = window.innerWidth;
}

desktop.wallpaper.matrixTextColor = "#008F11"; //green text

var drops = []; // matrix specific, can move, scoped outside function to perserve position
desktop.wallpaper.start = function startWallpaper () {

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

    ctx.fillStyle = desktop.wallpaper.matrixTextColor;
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

desktop.wallpaper.drawSolid = function (color) {
  var c = document.getElementById("c")
  var ctx = c.getContext("2d")
  ctx.fillStyle = color
  ctx.fillRect(0, 0, c.width, c.height)
}

desktop.wallpaper.clear = function () {
  var c = document.getElementById("c")
  var ctx = c.getContext("2d")
  ctx.clearRect(0, 0, c.width, c.height)
}

desktop.wallpaper.kill = function () {
  desktop.wallpaper.pause()
  desktop.wallpaper.clear()
}