desktop.console = {};
desktop.console.MAX_CONSOLE_OUTPUT = 40;

desktop.console.load = function loadDesktop() {
  
  $('#desktop').append(`
    <a class="abs icon" style="left:20px;top:200px;" href="#icon_dock_console">
      <img src="assets/images/icons/icon_console.png" />
      Console
    </a>
    `);

  $('#dock').append(`
      <li id="icon_dock_console">
        <a href="#window_console">
          <img height="22" width="22" src="assets/images/icons/icon_console.png" />
          Console
        </a>
      </li>
    `);

  // Remark: map shortcut method for easily calling `desktop.log()` from apps
  desktop.log = desktop.console.log;

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
    output += (str + ', '); 
  }
  output = output.substr(0, output.length - 2);
  let now = new Date();
  let dateString = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  $('.console').append('<li>' + dateString + ': ' + output + '</li>');
  // TODO: fix scrollTop issue ( should scroll to bottom )
  //let el = $('.console_holder')
  //$(el).scrollTop($(el).scrollHeight);
}

