desktop.app.memepool = {};
desktop.app.memepool.label = 'Meme Pool';

desktop.app.memepool.load = function (params, next) {

  desktop.load.remoteAssets([
    'desktop/apps/desktop.memepool/data/memes.js',
    'memepool' // this loads the sibling desktop.app.memepool.html file into <div id="window_memepool"></div>
  ], function (err) {

    $('#window_memepool').css('width', '44vw');
    $('#window_memepool').css('height', '77vh');
    $('#window_memepool').css('top', '9vh');
    $('#window_memepool').css('left', '6vw');

    $('.memePoolImage').on('click', function () {
      desktop.app.memepool.showRandomMeme();
    });

    desktop.app.memepool.showRandomMeme();
    next(null);
  });
};

desktop.app.memepool.showRandomMeme = function showRandomMeme () {
  let memes = desktop.app.memepool.memes;
  let roll = memes[Math.floor(Math.random() * memes.length)];
  console.log(roll);
  $('.memePoolImage').attr('src', '');
  
  $('.memePoolImage').attr('src', 'memes/' + roll);
};

desktop.app.memepool.openWindow = function (params) {
  return true;
};

desktop.app.memepool.closeWindow = function () {
  return true;
};