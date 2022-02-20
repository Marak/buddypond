// TODO: have ability to set custom wallpapers with settings
// TODO: have matrix wallpaper be first with color and speed adjustment

desktop.wallpaper = {};
desktop.wallpaper.canvas = null;
desktop.wallpaper.canvasTimer = null;

desktop.wallpaper.paused = false;
desktop.wallpaper.load = function desktopLoadBuddyList () {
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


  /*

  This works great, just needs a place in the UI for managing wallpaper settings

  <script src="desktop/assets/js/jquery.simple-color.js"></script>
  $('.wallpaperColor').simpleColor({
    boxHeight: 20,
    cellWidth: 16,
    cellHeight: 16,
    defaultColor: "#008F11",
    inputCSS: { 'border-radius': '4px', 'font-size': '4px', 'width': '10px' },
    chooserCSS: { 'border': '1px solid #660033', 'left': '-315px', 'top': '-225px' },
    displayCSS: {  },
    displayColorCode: true,
    livePreview: true,
    insert: 'before',
    onSelect: function(hex, element) {
      // alert("You selected #" + hex + " for input #" + element.attr('class'));
      desktop.wallpaper.matrixTextColor = '#' + hex;
    },
    onCellEnter: function(hex, element) {
      desktop.wallpaper.matrixTextColor = '#' + hex;
      console.log("You just entered #" + hex + " for input #" + element.attr('class'));
    },
    onClose: function(element) {
      // alert("color chooser closed for input #" + element.attr('class'));
    }
  });
  */
  return true;
};

desktop.wallpaper.pause = function pauseWallpaper () {
  desktop.wallpaper.paused = true;
  clearInterval(desktop.wallpaper.canvasTimer);
}

desktop.wallpaper.matrixTextColor = "#008F11"; //green text

var drops = []; // matrix specific, can move, scoped outside function to perserve position
desktop.wallpaper.start = function startWallpaper () {

  var c, ctx;
  c = document.getElementById("c");
  ctx = c.getContext("2d");

  //making the canvas full screen
  c.height = window.innerHeight;
  c.width = window.innerWidth;

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
    ctx.fillRect(0, 0, c.width, c.height);

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