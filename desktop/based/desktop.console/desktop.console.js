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
      let coode = $('.console_message_text').val();
      coode = coode.substr(1, coode.length - 1);
      desktop.log('Attempting to eval() string ' + coode);
      desktop.app.console.evalCoode(coode,'#window_console' );
      $('.console_message_text').val('');
    });

    d.keypress(function (ev) {
      if (ev.which === 13 && $(ev.target).hasClass('console_message_text')) {
        // Remark: Is not code as this point, it's coode
        let coode = $('.console_message_text').val();
        coode = coode.substr(1, coode.length - 1);
        desktop.log('Attempting to eval() string ' + coode);
        desktop.app.console.evalCoode(coode,'#window_console' );
        $('.console_message_text').val('');
        return false;
      }
    });

    $('.console_send_message_form').hide(); // for now

    $('#window_console').css('width', '100vw');
    $('#window_console').css('height', '40vh');
    $('#window_console').css('bottom', 41);
    $('#window_console').css('left', '0vw');
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
    appstore: {
      command: 'desktop.ui.openWindow("appstore");',
      description: 'View Buddy Pond App Store',
      icon: 'appstore'
    },
    ayyowars: {
      command: 'desktop.ui.openWindow("ayyowars");',
      description: 'Alien Wars - Ayyowars Game',
      icon: 'ayyowars'
    },
    av: {
      command: 'desktop.ui.openWindow("visuals");',
      description: 'Use the Microphone Audio to create Cool Visuals',
      icon: 'visuals'
    },
    bs: {
      command: function(params) {
        let str = `desktop.app.console.listBuddyScriptCommands({ windowId: '${params.windowId}'});`
        return str;
      },
      description: 'Lists all BuddyScript Commands',
      icon: 'folder'
    },
    console: {
      command: 'desktop.ui.openWindow("console");',
      description: 'Buddy Pond Console Terminal ( For Hackers )',
      icon: 'lofi'
    },
    faq: {
      command: 'desktop.ui.openWindow("faq");',
      description: 'Frequently Asked Questions',
      icon: 'folder'
    },
    lofi: {
      command: 'desktop.ui.openWindow("lofi");',
      description: 'Chill Vibes Lofi Music Channel',
      icon: 'lofi'
    },
    logout: {
      command: 'desktop.app.login.logoutDesktop();',
      description: 'Logs you out of Buddy Pond Desktop',
      icon: 'login'
    },
    fluids: {
      command: 'desktop.ui.openWindow("fluidsimulation");',
      description: 'Fluid Simulations ( Trippy )',
      icon: 'fluidsimulation'
    },
    games: {
      command: 'desktop.ui.openWindow("games");',
      description: 'Stay Entertained with Buddy Pond Games',
      icon: 'folder'
    },
    gbp: {
      command: 'desktop.ui.openWindow("gbp");',
      description: 'Give and receive Good Buddy Points',
      icon: 'gbp'
    },
    gifstudio: {
      command: function(params) {
        let str = `desktop.ui.openWindow("gifstudio", { output: '${params.output}', context: '${params.context}' });`
        return str;
      },
      description: 'Create, Edit, and Remix Animated GIFs',
      icon: 'gifstudio'
    },
    globe: {
      command: 'desktop.ui.openWindow("globe");',
      description: '3-D Geo Map of World.',
      icon: 'globe'
    },
    hack: {
      command: 'desktop.ui.openWindow("hackertyper");',
      description: 'A.I. Assisted Auto-Hacking Console',
      icon: 'hackertyper'
    },
    help: {
      command: function(params) {
        // params is windowId as string, such as `#window_console`
        let str = `desktop.commands.chat.help({ windowId: '${params.windowId}'});`
        return str;
      },
      description: 'Shows basic Help commands',
      img: '/desktop/assets/images/icons/svg/1f9ae.svg'
    },
    idc: {
      command: 'desktop.ui.openWindow("interdimensionalcable");',
      description: 'Interdimensional Cable',
      icon: 'interdimensionalcable'
    },
    instruments: {
      command: 'desktop.ui.openWindow("midifighter");',
      description: 'Opens Musical Instruments',
      icon: 'midifighter'
    },
    midi: {
      command: 'desktop.ui.openWindow("midi");',
      description: 'Audio MIDI Setup',
      icon: 'midi'
    },
    midifighter: {
      command: 'desktop.ui.openWindow("midifighter");',
      description: 'MIDI Fighter styled Music Pad.',
      icon: 'midifighter'
    },
    maps: {
      command: 'desktop.ui.openWindow("maps");',
      description: '2-D Geo Maps of world.',
      icon: 'maps'
    },
    memepool: {
      command: 'desktop.ui.openWindow("memepool");',
      description: 'Manage and Catalog your Memes.',
      icon: 'memepool'
    },
    memes: {
      command: 'desktop.ui.openWindow("memepool");',
      description: 'Mnemosyne - A.I. Powered Meme Oracle',
      icon: 'memepool'
    },
    merlin: {
      command: 'desktop.ui.openWindow("merlin");',
      description: 'Merlin Automated Assistant',
      icon: 'merlin'
    },
    /*
    office: {
      command: 'desktop.ui.openWindow("libreoffice");',
      description: 'Libre Office',
      icon: 'libreoffice'
    },
    */
    nes: {
      command: 'desktop.ui.openWindow("nes");',
      description: 'Nintendo Entertainment System',
      icon: 'nes'
    },
    n64: {
      command: 'desktop.ui.openWindow("n64");',
      description: 'NINTENDO SIXTY FOOOOOOUUUUURRRR!!!!',
      icon: 'n64'
    },
    paint: {
      command: function(params) {
        let str = `desktop.ui.openWindow("paint", { output: '${params.output}', context: '${params.context}' });`
        return str;
      },
      description: 'Paint Editor. Draw cool paintings for Buddies.',
      icon: 'paint'
    },
    profile: {
      command: 'desktop.ui.openWindow("profile");',
      description: 'Buddy Profile Settings',
      icon: 'profile'
    },
    mirror: {
      command: function(params) {
        let str = `desktop.ui.openWindow("mirror", { output: '${params.output}', context: '${params.context}' });`
        return str;
      },
      description: 'Camera with Visual Effects',
      icon: 'mirror'
    },
    mtv: {
      command: 'desktop.ui.openWindow("mtv");',
      description: 'Non-stop Music Videos',
      icon: 'mtv'
    },
    piano: {
      command: 'desktop.ui.openWindow("piano");',
      description: 'Tiny Piano Synth Keyboard for Jamming',
      icon: 'piano'
    },
    soundcloud: {
      command: 'desktop.ui.openWindow("soundcloud");',
      description: 'Curated Music Playlists and Featured Buddies',
      icon: 'soundcloud'
    },
    record: {
      command: function(params) {
        let str = `desktop.ui.openWindow("soundrecorder", { output: '${params.output}', context: '${params.context}' });`
        return str;
      },
      description: 'Sound Recorder App. Record and Edit Audio',
      icon: 'soundrecorder'
    },
    streamsquad: {
      command: 'desktop.ui.openWindow("streamsquad");',
      description: 'Watch Live Streamers with your Buddies',
      icon: 'soundrecorder'
    },
    /* TODO: > settings audio_tts_enabled false
             // click to disable tts settings
    settings: {
      command: function(params) {
        let str = `desktop.ui.openWindow("soundrecorder", { output: '${params.output}', context: '${params.context}' });`
        return str;
      }
    },
    */
    spellbook: {
      command: 'desktop.ui.openWindow("spellbook");',
      description: 'Forbidden Spellbook. Matrix Agents Only.',
      icon: 'spellbook'
    },
    visuals: {
      command: 'desktop.ui.openWindow("visuals");',
      description: 'Use the Microphone Audio to create Cool Visuals',
      icon: 'visuals'
    }
  }


desktop.app.console.listBuddyScriptCommands = function listBuddyScriptCommands (params) {
  let commands = desktop.app.console._allowCommands;
  let keys = Object.keys(commands);
    const helpText = `
      <div class="help">
        <h2 class="hidesHelp">🤖 BuddyScript v4.20.69 🤖 </h2>
        <p>
          The following <span class="bash">bs</span> commands are available:
        </p>
        <br/>
        ${keys.map(item => `
          <div class="help-text">
            <div class="help-command">
              <i>/${item}</i>${commands[item].additional || ''}
            </div>
            <span class="help-description">&nbsp;${commands[item].description}</span>
          </div>
        `).join('')}
        <br/>
        Typing any of these commands will run the <span class="bash">bs</span> locally.<br/>
        You can also send <span class="bash">bs</span> to a Buddy by using <span class="bash">\\</span> instead of <span class="bash">/</span><br/>
        <br/>
        <strong>Examples:</strong> <br/>
        <br/>
        <div class="help-example">
          Opens Paint Editor Locally<br/>
          <span class="bash">/paint </span><br/>
          <br/>
          Sends Message To Buddy Requesting They Open Paint Editor<br/>
          <span class="bash">\\paint</span>
        </div>
        <br/>
      <div>
    `;

    $('.chat_messages', params.windowId).append(`<div class="message">${helpText}</div>`);
    $('.no_chat_messages', params.windowId).hide();
    let el = $('.message_main', params.windowId);
    $(el).scrollTop(999999);
};

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
    return true;
  } else {
    // not a valid /command, will send message to server since its just text
    // desktop.log('Invalid BuddyScript', coode);
    return false;
    //desktop.log('Invalid BuddyScript! Ask your Buddy about the BuddyScript they sent you?');
  }
}