desktop.app.wallpaper.wallpapers.matrix = {};
desktop.app.wallpaper.wallpapers.matrix.canvasTimer = null;

var drops = []; // matrix specific, can move, scoped outside function to perserve position

desktop.app.wallpaper.wallpapers.matrix.start = function () {


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

    // TODO: refactor to use desktop.settings.wallpaper_color
    ctx.fillStyle = desktop.settings.wallpaper_color;
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
  // TODO: where should time timer be scoped?
  // canvasDrawTimer, should be expected by wallpaper itself or only have single one...
  desktop.app.wallpaper.wallpapers.matrix.canvasTimer = setInterval(function(){
    draw();
  }, 66);
};

desktop.app.wallpaper.wallpapers.matrix.resize = function () {
  // recalc matrix columns and drops
  var font_size = 10;
  var columns = c.width / font_size;
  drops = []
  if (drops.length === 0) {
    for (var x = 0; x < columns; x++)
      drops[x] = parseInt(Math.random() * c.height);
  }
}

desktop.app.wallpaper.wallpapers.matrix.stop = function () {
  
}

desktop.app.wallpaper.wallpapers.matrix.changeColor = function (color) {
  // do nothing, already subscribing to desktop.settings.wallpaper_color
}

desktop.app.wallpaper.wallpapers.matrix.pause = function () {
  clearInterval(desktop.app.wallpaper.wallpapers.matrix.canvasTimer);
}



/*

matrix.pause = function () {};

matrix.stop = function () {};

*/