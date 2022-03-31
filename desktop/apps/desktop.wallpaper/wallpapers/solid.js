desktop.app.wallpaper.wallpapers.solid = {};

desktop.app.wallpaper.wallpapers.solid.changeColor = function (color) {
  desktop.app.wallpaper.wallpapers.solid.draw(color);
};

desktop.app.wallpaper.wallpapers.solid.draw = function (color) {
  // TODO: use background color and not canvas
  let c = document.getElementById('c');
  let ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
};

desktop.app.wallpaper.wallpapers.solid.resize = function () {
  desktop.app.wallpaper.wallpapers.solid.draw(desktop.settings.wallpaper_color);
};

desktop.app.wallpaper.wallpapers.solid.start = function () {
  desktop.app.wallpaper.wallpapers.solid.draw(desktop.settings.wallpaper_color);
};

desktop.app.wallpaper.wallpapers.solid.stop = function () {};
desktop.app.wallpaper.wallpapers.solid.pause = function () {};