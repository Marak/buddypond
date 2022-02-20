desktop.console = {};
desktop.console.label = "Console";

desktop.console.MAX_CONSOLE_OUTPUT = 40;

desktop.console.load = function loadDesktop (params, next) {
  desktop.remoteLoadAppHTML('console', function (responseText, textStatus, jqXHR) {
    // Remark: map shortcut method for easily calling `desktop.log()` from apps
    desktop.log = desktop.console.log;
    next();
  });
};

desktop.console.log = function logDesktop () {
  // first send desktop.log statements to the actual console
  console.log.apply(this, arguments)
  let consoleItems = $('.console li').length;
  if (consoleItems > desktop.console.MAX_CONSOLE_OUTPUT) {
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

