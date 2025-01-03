const wallpapers = {};

wallpapers.legacyWallpapers = function () {


  if (desktop.app.wallpaper) {
    renderWallpaperTypes($('.wallpaperTypes'));
    desktop.on('desktop.settings.wallpaper_color', 'update-wallpaper-color-picker', function(color){
      $('.wallpaperOptionColor').setColor(color)
      $('.simpleColorDisplay').html(color)
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
      chooserCSS: { 'border': '1px solid #660033', 'left': '200px', 'top': '-240px' },
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


    $('input[name=wallpaper_opt]').on('input', function () {
      let radioValue = $('input[name=wallpaper_opt]:checked').val();
      // update desktop.settings.wallpaper_name
      desktop.set('wallpaper_name', radioValue);
    });


  }


}

function renderWallpaperTypes (el) {
    for (let w in desktop.app.wallpaper._wallpapers) {
      let _wallpaper = desktop.app.wallpaper._wallpapers[w];
      let checked = '';
      if (w === desktop.get('wallpaper_name')) {
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