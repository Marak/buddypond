desktop.app.wallpaper = {};
desktop.app.wallpaper.canvas = null;
desktop.app.wallpaper.label = 'Wallpaper';
desktop.app.wallpaper.settings = null;
desktop.app.wallpaper.init = false;
desktop.app.wallpaper.width = 0;
desktop.app.wallpaper.height = 0;


// initially empty reference to store wallpapers as they are loaded
desktop.app.wallpaper.wallpapers = {};

// internal reference for wallpaper names and remote script locations
desktop.app.wallpaper._wallpapers = {
  'solid':  {
    label: 'Solid',
    src: ['desktop/apps/desktop.wallpaper/wallpapers/solid.js']
  },
  'matrix':  {
    label: 'Matrix',
    src: ['desktop/apps/desktop.wallpaper/wallpapers/matrix.js']
  },
  'nyancat':  {
    label: 'Nyan Cat',
    src: ['desktop/apps/desktop.wallpaper/wallpapers/nyancat.js']
  },
  'ripples':  {
    label: 'Ripples',
    src: [
      'desktop/apps/desktop.wallpaper/wallpapers/ripples/vendor/jquery.ripples.js',
      'desktop/apps/desktop.wallpaper/wallpapers/ripples/ripples.js'
    ]
  }
};

desktop.app.wallpaper.paused = false;
desktop.app.wallpaper.load = function desktopLoadBuddyList (params, next) {
  desktop.load.remoteAssets([
    'desktop/assets/js/jquery.simple-color.js',
    'wallpaper',
  ], function (err) {

    // adjust the wallpaper size to the current window size
    desktop.app.wallpaper.resizeCanvasToWindow();

    // set the default wallpaper to 'matrix' ( Note: This is also defaulted in `App.Settings` )
    desktop.app.wallpaper.active = desktop.settings.wallpaper_name || 'matrix';

    desktop.app.wallpaper.start();

    desktop.on('desktop.settings.wallpaper_name', 'update-wallpaper-active', function (wallpaperName) {
      // stop the current wallpaper
      desktop.app.wallpaper.stop();
      // swap the active wallpaper
      desktop.app.wallpaper.active = wallpaperName;
      // start the new one
      desktop.app.wallpaper.start();
      
    });

    desktop.on('desktop.settings.wallpaper_color', 'update-wallpaper-bg-color', function (color) {
      desktop.app.wallpaper.wallpapers[ desktop.app.wallpaper.active].changeColor(color);
    });

    $('#window_wallpaper').css('width', 366);
    $('#window_wallpaper').css('height', 444);


    $('.pauseWallpaper').on('click', function () {
      if (desktop.app.wallpaper.paused) {
        desktop.app.wallpaper.start();
        $('.pauseWallpaper ').html('Pause Wallpaper');
      } else {
        $('#wallpaper').fadeOut('slow');
        $('.pauseWallpaper ').html('Resume Wallpaper');
        desktop.app.wallpaper.pause();
      }
    });

    $('input[name=wallpaper_opt]').on('input', function () {
      let radioValue = $('input[name=wallpaper_opt]:checked').val();
      // update desktop.settings.wallpaper_name
      desktop.set('wallpaper_name', radioValue);
    });

    $( window ).resize(function (e) {
      if (e.target !== window) {
        return;
      }
      desktop.app.wallpaper.resizeCanvasToWindow();
      desktop.app.wallpaper.wallpapers[desktop.app.wallpaper.active].resize();
    });

    function onSelect (context, hex) {
      desktop.set('wallpaper_color', '#' + hex);
    }

    function onCellEnter (context, hex) {
      desktop.set('wallpaper_color', '#' + hex);
    }

    $('.wallpaperOptionColor').simpleColor({
      boxHeight: 20,
      cellWidth: 16,
      cellHeight: 16,
      defaultColor: desktop.settings.wallpaper_color || '#008F11',
      inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
      chooserCSS: { 'border': '1px solid #660033', 'right': '0px', 'top': '-150px' },
      displayCSS: {  },
      displayColorCode: true,
      livePreview: true,
      insert: 'before',
      onSelect: function (hex, element) {
        onSelect(desktop.app.wallpaper.active, hex);
      },
      onCellEnter: function (hex, element) {
        onCellEnter(desktop.app.wallpaper.active, hex);
      },
      onClose: function (element) {
      }
    });
    next();
  });
};

desktop.app.wallpaper.resizeCanvasToWindow = function () {
  let c = document.getElementById('c');
  c.height = window.innerHeight;
  c.width = window.innerWidth;
  desktop.app.wallpaper.height = window.innerHeight;
  desktop.app.wallpaper.width = window.innerWidth;
};

desktop.app.wallpaper.start = function startWallpaper () {
  desktop.app.wallpaper.paused = false;
  desktop.app.wallpaper.resizeCanvasToWindow();
  // check to see if wallpaper is already loaded
  if (!desktop.app.wallpaper.wallpapers[desktop.app.wallpaper.active]) {
    // if not, load the wallpaper before calling .start()
    let remoteScript = desktop.app.wallpaper._wallpapers[desktop.app.wallpaper.active].src;
    desktop.load.remoteAssets(remoteScript, function (err) {
      desktop.app.wallpaper.wallpapers[desktop.app.wallpaper.active].start();
    });
  } else {
    desktop.app.wallpaper.wallpapers[desktop.app.wallpaper.active].start();
  }
};

desktop.app.wallpaper.clear = function () {
  let c = document.getElementById('c');
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
};

desktop.app.wallpaper.pause = function pauseWallpaper () {
  desktop.app.wallpaper.paused = true;
  desktop.app.wallpaper.wallpapers[desktop.app.wallpaper.active].pause();
};

desktop.app.wallpaper.stop = function () {
  desktop.app.wallpaper.wallpapers[desktop.app.wallpaper.active].stop();
  //desktop.app.wallpaper.pause()
  desktop.app.wallpaper.clear();
};