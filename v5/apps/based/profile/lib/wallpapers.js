const wallpapers = {};

wallpapers.legacyWallpapers = function (bp) {


  if (bp.apps.wallpaper) {
    renderWallpaperTypes($('.wallpaperTypes'));
    bp.on('settings::wallpaper_color', 'update-wallpaper-color-picker', function(color){
      $('.wallpaperOptionColor').setColor(color)
      $('.simpleColorDisplay').html(color)

      // update the color of the active wallpaper
      let activeName = bp.apps.wallpaper.wallpaperManager.active;
      let active = bp.apps.wallpaper.wallpaperManager.wallpapers[activeName];
      if (active) {
        active.changeColor(color);
      } else {
        console.log('cannot change color, active wallpaper not found', activeName)
      }
    });

    function onSelect (context, hex) {
      bp.set('wallpaper_color', '#' + hex);
    }

    function onCellEnter (context, hex) {
      bp.set('wallpaper_color', '#' + hex);
    }

    $('.wallpaperOptionColor').simpleColor({
      boxHeight: 20,
      cellWidth: 16,
      cellHeight: 16,
      defaultColor: desktop.settings.wallpaper_color || '#008F11',
      inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
      chooserCSS: { 'border': '1px solid #660033', 'top': '20px' },
      displayCSS: {  },
      displayColorCode: true,
      livePreview: true,
      insert: 'before',
      onSelect: function (hex, element) {
        onSelect(bp.apps.wallpaper.active, hex);
      },
      onCellEnter: function (hex, element) {
        onCellEnter(bp.apps.wallpaper.active, hex);
      },
      onClose: function (element) {
      }
    });


    $('input[name=wallpaper_opt]').on('input', function () {
      let radioValue = $('input[name=wallpaper_opt]:checked').val();
      // update desktop.settings.wallpaper_name
      bp.set('wallpaper_name', radioValue);
    });


  }

}

function renderWallpaperTypes (el) {
    for (let w in bp.apps.wallpaper.wallpaperManager._wallpapers) {
      let _wallpaper = bp.apps.wallpaper.wallpaperManager._wallpapers[w];
      let checked = '';
      if (w === desktop.settings.wallpaper_name) {
        checked = 'checked';
      }
      let str = `
      <input type="radio" id="wallPaperRadio${w}" name="wallpaper_opt" class="wallpaper_opt" value="${w}" ${checked}>
      <label for="wallPaperRadio${w}">${_wallpaper.label}</label>
      <br>
      `;
      el.append(str);
    }
  }

  export default wallpapers;