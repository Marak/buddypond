desktop.app.wallpaper.wallpapers.ripples = {};

desktop.app.wallpaper.wallpapers.ripples.changeImage = function (color) {
  // desktop.app.wallpaper.wallpapers.image.draw(color);
};

desktop.app.wallpaper.wallpapers.ripples.draw = function (color) {
  // TODO: use background color and not canvas
  $('body').ripples()
  /*. ripples(opts)
      imageUrl	string	null	The URL of the image to use as the background. If absent the plugin will attempt to use the value of the computed background-image CSS property instead. Data-URIs are accepted as well.
      dropRadius	float	20	The size (in pixels) of the drop that results by clicking or moving the mouse over the canvas.
      perturbance	float	0.03	Basically the amount of refraction caused by a ripple. 0 means there is no refraction.
      resolution	integer	256	The width and height of the WebGL texture to render to. The larger this value, the smoother the rendering and the slower the ripples will propagate.
      interactive	bool	true	Whether mouse clicks and mouse movement triggers the effect.
      crossOrigin	string	""	The crossOrigin attribute to use for the affected image. For more
  */
  $('#wallpaper').hide();
  $('#c').hide();
};

desktop.app.wallpaper.wallpapers.ripples.resize = function () {
  desktop.app.wallpaper.wallpapers.ripples.draw(desktop.settings.wallpaper_color);
};

desktop.app.wallpaper.wallpapers.ripples.start = function () {
  desktop.app.wallpaper.wallpapers.ripples.draw(desktop.settings.wallpaper_color);
};

desktop.app.wallpaper.wallpapers.ripples.stop = function () {
  $('body').ripples('destroy');
  $('#wallpaper').show();
  $('#c').show();
  
};
desktop.app.wallpaper.wallpapers.ripples.pause = function () {};