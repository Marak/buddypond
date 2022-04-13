desktop.app.console = {};
desktop.app.console.label = 'Console';

desktop.app.console.MAX_CONSOLE_OUTPUT = Infinity;

desktop.app.console.load = function loadDesktop (params, next) {
  desktop.load.remoteAssets([
    'desktop/assets/js/jquery.dateformat.js',
    'console' // this loads the sibling desktop.app.console.html file into <div id="window_console"></div>
  ], function (err) {
    // Remark: map shortcut method for easily calling `desktop.log()` from apps
    desktop.log = desktop.app.console.log;

    let d = $(document);

    d.on('submit', function(){
      return false;
    })

    d.on('mousedown', '.consoleMessageSubmit', function () {
      // Remark: Is not code as this point, it's coode
      let str = $('.console_message_text').val();
      desktop.app.console.evalCoode(str);
    });

    /*
    d.keypress(function (ev) {
      if (ev.which === 13 && $(ev.target).hasClass('')) {
        let str = $('.console_message_text').val();
        desktop.app.console.evalCoode(str);
        return false;
      }
    });
    */

    $('#window_console').css('width', '100vw');
    $('#window_console').css('height', '40vh');
    $('#window_console').css('bottom', 41);
    $('#window_console').css('left', '0vw');
    // for now
    $('.console_send_message_form').hide();
    next();
  });
};

desktop.app.console.log = function logDesktop () {
  // first send desktop.log statements to the actual console
  console.log.apply(this, arguments);
  let consoleItems = $('.console li').length;
  if (consoleItems > desktop.app.console.MAX_CONSOLE_OUTPUT) {
    $('.console li').get(0).remove();
  }
  let output = '';
  arguments[0] = '<span class="purple">' + arguments[0] + '</span>';
  for (let arg in arguments) {
    let str = arguments[arg];
    if (typeof str === 'object') {
      str = JSON.stringify(str, true, 2);
    }
    output += (str + ' ');
  }
  // output = output.substr(0, output.length - 2);
  let now = new Date();
  
  let dateString = DateFormat.format.date(new Date(), 'HH:mm:ss');
  $('.console').append('<li>' + dateString + ': ' + output + '</li>');
  // TODO: fix scrollTop issue ( should scroll to bottom )
  let el = $('.console li');
  //$('.console').scrollTop($(el)[0].scrollHeight + 300);
};

// TODO: map all known apps

desktop.app.console._allowCommands = {
    logout: {
      command: 'desktop.app.login.logoutDesktop();'
    },
    idc: {
      command: 'desktop.ui.openWindow("interdimensionalcable");'
    },
    gbp: {
      command: 'desktop.ui.openWindow("gbp");'
    },
    goodbuddypoints: {
      command: 'desktop.ui.openWindow("gbp");'
    },
    gifstudio: {
      command: function(params) {
        let str = `desktop.ui.openWindow("gifstudio", { output: '${params.output}', context: '${params.context}' });`
        return str;
      }
    },
    paint: {
      command: function(params) {
        let str = `desktop.ui.openWindow("paint", { output: '${params.output}', context: '${params.context}' });`
        return str;
      }
    },
    mirror: {
      command: function(params) {
        let str = `desktop.ui.openWindow("mirror", { output: '${params.output}', context: '${params.context}' });`
        return str;
      }
    },
    mtv: {
      command: 'desktop.ui.openWindow("mtv");'
    },
    soundrecorder: {
      command: function(params) {
        let str = `desktop.ui.openWindow("soundrecorder", { output: '${params.output}', context: '${params.context}' });`
        return str;
      }
    }
  }

desktop.app.console.isValidBuddyScript = function isValidBuddyScript (coode) {
  // TODO: validate pipe section as well
  let isValidBuddyScript = false;
  let tokens = coode.split(' ');
  // only allow specific command mappings to eval
  if (Object.keys(desktop.app.console._allowCommands).indexOf(tokens[0]) !== -1) {
    isValidBuddyScript = true;
  }
  return isValidBuddyScript;
}

// Remark: Is not code as this point, it's coode
desktop.app.console.evalCoode = function (coode, params) {
  params = params || {}
  // TODO: refactor command parsing code into function
  let tokens = coode.split(' ');
  let pipes = coode.split('|');
  let output, context;
  if (pipes.length && pipes.length > 1) {
    // TODO: allow N pipes
    let pipeCommandA =  pipes[1].split(' ');
    params.output = escape(pipeCommandA[1]);
    params.context = escape(pipeCommandA[2]);
  }

  let isValid = desktop.app.console.isValidBuddyScript(coode);
  if (isValid) {
    let _command = desktop.app.console._allowCommands[tokens[0]].command;
    if (typeof _command === 'function') {
      _command = _command(params);
    }
    eval(_command);
  } else {
    alert('Invalid BuddyScript');
    //desktop.log('Invalid BuddyScript! Ask your Buddy about the BuddyScript they sent you?');
  }
}