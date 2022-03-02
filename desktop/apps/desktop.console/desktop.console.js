desktop.app.console = {};
desktop.app.console.label = "Console";

desktop.app.console.MAX_CONSOLE_OUTPUT = Infinity;

desktop.app.console.load = function loadDesktop (params, next) {
  desktop.load.remoteAssets([
    'desktop/assets/js/jquery.dateformat.js',
    'console' // this loads the sibling desktop.app.console.html file into <div id="window_console"></div>
  ], function (err) {
    // Remark: map shortcut method for easily calling `desktop.log()` from apps
    desktop.log = desktop.app.console.log;
    next();
  });
};

desktop.app.console.log = function logDesktop () {
  // first send desktop.log statements to the actual console
  console.log.apply(this, arguments)
  let consoleItems = $('.console li').length;
  if (consoleItems > desktop.app.console.MAX_CONSOLE_OUTPUT) {
    $('.console li').get(0).remove();
  }
  let output = '';
  arguments[0] = '<span class="purple">' + arguments[0] + '</span>';
  for (let arg in arguments) {
    let str = arguments[arg];
    if (typeof str === 'object') {
      str = JSON.stringify(str, true, 2)
    }
    output += (str + ' ');
  }
  // output = output.substr(0, output.length - 2);
  let now = new Date();
  
  let dateString = DateFormat.format.date(new Date(), "HH:mm:ss");
  $('.console').append('<li>' + dateString + ': ' + output + '</li>');
  // TODO: fix scrollTop issue ( should scroll to bottom )
  let el = $('.console li');
  //$('.console').scrollTop($(el)[0].scrollHeight + 300);
}

