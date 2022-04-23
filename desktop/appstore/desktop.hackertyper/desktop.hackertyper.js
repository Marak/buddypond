desktop.app.hackertyper = {};
desktop.app.hackertyper.label = 'Hacker Typer';

desktop.app.hackertyper.load = function loadhackertyper (params, next) {
  desktop.load.remoteAssets([
    'hackertyper' // this loads the sibling desktop.app.hackertyper.html file into <div id="window_hackertyper"></div>
  ], function (err) {
    $('#window_hackertyper').css('width', 662);
    $('#window_hackertyper').css('height', 495);
    $('#window_hackertyper').css('left', 50);
    $('#window_hackertyper').css('top', 50);
    next();
  });
};

desktop.app.hackertyper.openWindow = function openWindow () {
  // ensures iframe will focus on body ( required for immediate input on typer )
  var iframe = document.createElement('iframe');
  iframe.onload = function() {
    // use small timeout to ensure DOM has time to render
    setTimeout(function(){
      // set focus on the typer input
      var iframe = $("#hackertyperIframe")[0];
      iframe.contentWindow.focus();
    }, 100)
  };
  iframe.id = 'hackertyperIframe';
  iframe.src = 'desktop/appstore/desktop.hackertyper/vendor/index.html';
  $('.hackertyperHolder').append(iframe);
  return true;
};

desktop.app.hackertyper.closeWindow = function closeWindow () {
  $('#hackertyperIframe').attr('src', '');
  return true;
};