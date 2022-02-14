// TODO: rename to wallpaper
// TODO: have ability to set custom wallpapers with settings
// TODO: have matrix wallpaper be first with color and speed adjustment

desktop.background = {};
desktop.background.canvas = null;

desktop.background.canvasTimer = null;

desktop.background.load = function desktopLoadBuddyList () {
  $('.pauseBackground').on('dblclick', function(){
    if ($('.pauseBackground span').html() === 'Resume Wallpaper') {
      $('.pauseBackground span').html('Pause Wallpaper');
      // might be better to refactor and have actual resume
      // TODO: fix resume so it doesnt stutter
      desktop.background.start();
    } else {
      clearInterval(desktop.background.canvasTimer);
      $('.pauseBackground span').html('Resume Wallpaper');
    }
  });
};

desktop.background.start = function desktopLoadBuddyList () {
  
  var c = document.getElementById("c");
  var ctx = desktop.background.canvas = c.getContext("2d");

  //making the canvas full screen
  c.height = window.innerHeight;
  c.width = window.innerWidth;

  //chinese characters - taken from the unicode charset
  var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  //converting the string into an array of single characters
  matrix = matrix.split("");

  var font_size = 10;
  var columns = c.width / font_size; //number of columns for the rain
  //an array of drops - one per column
  var drops = [];
  //x below is the x coordinate
  //1 = y co-ordinate of the drop(same for every drop initially)
  for (var x = 0; x < columns; x++)
    drops[x] = parseInt(Math.random() * c.height);
  
  //drawing the characters
  function draw(ctx) {
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#008F11"; //green text
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
  
  desktop.background.canvasTimer = setInterval(function(){
    draw(desktop.background.canvas);
  }, 66);
}


