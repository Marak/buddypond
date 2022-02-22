desktop.customise = {};
desktop.customise.label = "Customise";

desktop.customise.load = function loadDesktop (params, next) {
  desktop.loadRemoteAssets([
    'desktop/assets/js/jquery.simple-color.js',
    'customise'
  ], function (err) {
    desktop.customise.checkWallpaperOption()
    $('input[name=wallpaper_opt]').on('input', desktop.customise.checkWallpaperOption)
    $('.wp_opt_matrix_color').simpleColor({
        boxHeight: 20,
        cellWidth: 16,
        cellHeight: 16,
        defaultColor: "#008F11",
        inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
        chooserCSS: { 'border': '1px solid #660033', 'left': '-315px', 'top': '-50px' },
        displayCSS: {  },
        displayColorCode: true,
        livePreview: true,
        insert: 'before',
        onSelect: function(hex, element) {
          desktop.wallpaper.matrixTextColor = '#' + hex;
        },
        onCellEnter: function(hex, element) {
          desktop.wallpaper.matrixTextColor = '#' + hex;
        },
        onClose: function(element) {
        }
    })
    next();
  })
};

desktop.customise.checkWallpaperOption = function () {
    if ($('input[name=wallpaper_opt]:checked').val() === "matrix") {
        $('#wp_opt_matrix_settings').show()
    } else {
        $('#wp_opt_matrix_settings').hide()
    }
}