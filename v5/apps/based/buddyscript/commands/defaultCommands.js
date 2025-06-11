export default function Commands(bp) {

  this.bp = bp;

  const commands = {};
  this.commands = commands;

  /*
  commands.say = function (context) {
    console.log('Saying:', context);
    bp.say(context);
  };
  */

  /*
  commands.give = async function (context) {
    console.log('Giving:', context);
    // load the portfolio app
    await bp.load('portfolio');
    console.log('loaded', bp.apps.portfolio);
    bp.apps.portfolio.portfolio.transfer(null, {
      from: bp.me,
      to: context[0],
      symbol: 'GBP',
      amount: context[1]
    });
  }
  */


  /*
  commands.give = function (context) {
      console.log('Giving:', context);
      return false;
  };
  */


  // for all the legacy commands, call the legacy command
  for (let command in legacyCommands) {

          let commandObj = legacyCommands[command];
      let commandStr = commandObj.command;

    let evaler = function (context, options) {
      let params = context.params;
      console.log('Executing legacy command:', command, commandStr, context);
      if (typeof commandStr === 'function') {
        commandStr(context, options);
        //eval(commandStr)

      } else {
        eval(commandStr)

      };

    };
    //commands[command] = evaler;

    commands[command] = {
      fn: evaler,
      object: commandObj
    };

    //console.log('new commands', command, commands);
  }

  return this;

}

/* Legacy commands, should be moved outside of this file and into the app itself on registration */

// TODO: map all known apps
let legacyCommands = {
  /*
  appstore: {
    command: 'desktop.ui.openWindow("appstore");',
    description: 'View Buddy Pond App Store',
    icon: 'appstore'
  },
  */
  av: {
    command: function (params) {
      bp.open('audio-visual');
    },
    description: 'Use the Microphone Audio to create Cool Visuals',
    icon: 'visuals'
  },
  // show card
  apps: {
    command: function (params, context) {
      console.log('apps command', params, context);
      bp.apps.buddylist.showCard({ chatWindow: context.chatWindow, cardName: 'apps' });
      return;
    },
    description: 'Lists all Buddy Pond Apps',
    icon: 'merlin'
  },
  balance: {
    command: function (params) {
      console.log('balance command', params);
      if (params.length > 0) {
        bp.open('portfolio', { context: '#portfolio-balance', type: params[0] });
      } else {
        bp.open('portfolio', { context: '#portfolio-balance' });
      }
    },
    description: 'View your Buddy Coin Balances',
    icon: 'coin'
  },
  'cast': {
    command: function (params) {
      bp.open('spellbook');
    },
    description: 'Cast Spells with the Buddy Pond Spellbook',
    icon: 'spellbook'
  },
  // TODO: add bs command to list BuddyScript commands
  bs: {
    command: function(params, context) {
      console.log('bs command', params, context);
      bp.apps.buddylist.showCard({ chatWindow: context.chatWindow, cardName: 'bs-commands' });
      return;
    },
    description: 'Lists all BuddyScript Commands',
    icon: 'buddyscript'
  },
 /*
  console: {
    command: function (params) {
      bp.open('console');
    },
    description: 'Buddy Pond Console Terminal ( For Hackers )',
    icon: 'lofi'
  },
  */
  chalkboard: {
    command: function (params, context) {
      bp.open('chalkboard', { context: context.contextName, output: context.windowType });
    },
    description: 'Chalkboard. Draw and Share with Buddies',
    icon: 'chalkboard'
  },

  coin: {
    command: function (params) {
      console.log('coin command', params);
      if (params.length > 0) {
        bp.open('coin', { type: params[0] });
      } else {
        bp.open('coin');
      }
    },
    description: 'View available Buddy Coins',
    icon: 'coin'
  },

  files: {
    command: function (params) {
      console.log('files command', params);
      if (params.length > 0) {
        bp.open('file-explorer', { context: params[0] });
      } else {
        bp.open('file-explorer');
      }
    },
    description: 'View and Manage your Files',
    icon: 'folder'
  },
 
  /*
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
  */
  give: {
    command: function (params) {
      console.log('give command', params);
      if (params.length > 0) {
        bp.open('portfolio', { context: '#portfolio-transfer', type: params[0] });
      } else {
        bp.open('portfolio', { context: '#portfolio-transfer' });
      }
    },
    description: 'Give Buddy Pond Coins to Buddies',
    icon: 'coin'
  },
  install: {
    command: function (params, context) {
      if (params.length > 0) {
        let appName = params[0];
        let app = bp.apps.desktop.appList[appName];
        if (!app) {
          console.log(`App ${appName} not found in appList`);
          return;
        }
        // check if app is installed
        // TODO: move isInstalled check to helper function
        let appsInstalled = bp?.settings?.apps_installed || {};
        const isInstalled = !!appsInstalled[appName];
        if (isInstalled) {
          // if installed, open the app
          console.log(`App ${appName} is already installed`);
          console.log('Opening app with context', context);
          bp.open(appName, { context: context.contextName, output: context.windowType });
          return;
        }
        // if not installed, install the app
        bp.apps.desktop.addApp(appName, app);
        // bp.open('pad', { context: params[0] });
      } else {
        bp.open('pad');
      }
    },
    description: 'Install Buddy Pond Apps'
  },

  uninstall: {
    command: function (params) {
      if (params.length > 0) {  
        let appName = params[0];
        let app = bp.apps.desktop.appList[appName];
        if (!app) {
          console.log(`App ${appName} not found in appList`);
          bp.open('pad');
          return;
        }
        // check if app is installed 
        let appsInstalled = bp?.settings?.apps_installed || {};
        const isInstalled = !!appsInstalled[appName];
        if (!isInstalled) {
          // if not installed
          console.log(`App ${appName} is not installed`);
          bp.open('pad');
          return;
        }
        // if installed, uninstall the app
        bp.apps.desktop.removeApp(appName, app);
        return;
        // bp.open('pad', { context: params[0] });
      }
      bp.open('pad');
    },
    description: 'Uninstall Buddy Pond Apps'
  },

  leaderboard: {
    command: function (params) {
        bp.open('coin', { context: '#coin-leaderboard' });
    },
    description: 'View the Buddy Coins Leaderboards',
    icon: 'coin'
  },
  // similiar to bs, use showCard to show the markdown card
  markdown: {
    command: function (params, context) {
      console.log('markdown command', params, context);
      bp.apps.buddylist.showCard({ chatWindow: context.chatWindow, cardName: 'markdown' });
      return;
    },
    description: 'Lists all Markdown Commands',
    icon: 'markdown'
  },
  portfolio: {
    command: function (params) {
      console.log('portfolio command', params);
      if (params.length > 0) {
        bp.open('portfolio', { context: params[0] });
      } else {
        bp.open('portfolio');
      }
    },
    description: 'View your Buddy Coins Portfolio',
    icon: 'portfolio'
  },
  logout: {
    command: function (params) {
      bp.logout();
    },
    description: 'Logs you out of Buddy Pond Desktop',
    icon: 'login'
  },
  fluids: {
    command: function (params) {
      bp.open('fluid-simulation');
    },
    description: 'Fluid Simulations ( Trippy )',
    icon: 'fluidsimulation'
  },
  games: {
    command: function(params) {
      bp.apps.desktop.openFolder('Games');
    },
    description: 'Stay Entertained with Buddy Pond Games',
    icon: 'folder'
  },
  pond: {
    command: function (params) {
      console.log('ponds command', params);
      if (params.length > 0) {
        bp.open('pond', { context: params[0] });
      } else {
        bp.open('pond');
      }
    },
    description: 'View or Join a Buddy Pond',
    icon: 'pond'
  },
  /*
  */
  /*
  gbp: {
    command: 'desktop.ui.openWindow("gbp");',
    description: 'Give and receive Good Buddy Points',
    icon: 'gbp'
  },
  */
  /*
  gifstudio: {
    command: function(params) {
      let str = `desktop.ui.openWindow("gifstudio", { output: '${params.output}', context: '${params.context}' });`
      return str;
    },
    description: 'Create, Edit, and Remix Animated GIFs',
    icon: 'gifstudio'
  },
  */
  globe: {
    command: function (params) {
      bp.open('globe');
    },
    description: '3-D Geo Map of World.',
    icon: 'globe'
  },
  hex: {
    command: function (params) {
      bp.open('hex-editor');
    },
    description: 'Hex Editor. Write and Compile Hex Code',
    icon: 'hex-editor'
  },
  hack: {
    command: function (params) {
      bp.open('hacker-typer');
    },
    description: 'A.I. Assisted Auto-Hacking Console',
    icon: 'hackertyper'
  },
  hacks: {
    command: function (params) {
      bp.apps.desktop.openFolder('Hacking Tools');
    },
    description: 'Stay Entertained with Hacking Tools',
    icon: 'hackertyper'
  },
  help: {
    // show card
    command: function (params, context) {
      console.log('help command', params, context);
      bp.apps.buddylist.showCard({ chatWindow: context.chatWindow, cardName: 'help' });
      return;
    },
    description: 'Buddy Pond Help and Support',
    icon: 'help'
  },
  youtube: {
    command: function (params) {
      bp.open('youtube');
    },
    description: 'Interdimensional Cable',
    icon: 'interdimensionalcable'
  },
  /*
  instruments: {
    command: 'desktop.ui.openWindow("midifighter");',
    description: 'Opens Musical Instruments',
    icon: 'midifighter'
  },
  */
  /*
  midi: {
    command: 'desktop.ui.openWindow("midi");',
    description: 'Audio MIDI Setup',
    icon: 'midi'
  },
  */
  /*
  midifighter: {
    command: 'desktop.ui.openWindow("midifighter");',
    description: 'MIDI Fighter styled Music Pad.',
    icon: 'midifighter'
  },
  */
  maps: {
    command: function (params) {
      bp.open('maps');
    },
    description: '2-D Geo Maps of world.',
    icon: 'maps'
  },
  /*
  memepool: {
    command: 'desktop.ui.openWindow("memepool");',
    description: 'Manage and Catalog your Memes.',
    icon: 'memepool'
  },
  */
  /*
  meme: {
    command: function(params) {
      // handled by server via sendMessage code path
    }
  },
  */
  /*
  memes: {
    command: 'desktop.ui.openWindow("memepool");',
    description: 'Mnemosyne - A.I. Powered Meme Oracle',
    icon: 'memepool'
  },
  */
  /*
  merlin: {
    command: function(params) {
      bp.open('merlin');
    },      description: 'Merlin Automated Assistant',
    icon: 'merlin'
  },
  */
  /*
  office: {
    command: 'desktop.ui.openWindow("libreoffice");',
    description: 'Libre Office',
    icon: 'libreoffice'
  },
  */
  nes: {
    command: function (params) {
      bp.open('emulator', {
        context: 'nes'
      });
    },
    description: 'Nintendo Entertainment System',
    icon: 'nes'
  },
  n64: {
    command: function (params) {
      bp.open('emulator', {
        context: 'n64'
      });
    },
    description: 'Nintendo 64',
    icon: 'n64'
  },
  snes: {
    command: function (params) {
      bp.open('emulator', {
        context: 'snes'
      });
    },
    description: 'Super Nintendo Entertainment System',
    icon: 'snes'
  },
  sega: {
    command: function (params) {
      bp.open('emulator', {
        context: 'sega'
      });
    },
    description: 'Sega Genesis',
    icon: 'sega'
  },
  atari2600: {
    command: function (params) {
      bp.open('emulator', {
        context: 'atari2600'
      });
    },
    description: 'Atari 2600',
    display: false,
    icon: 'atari2600'
  },
  minesweeper: {
    command: function (params) {
      bp.open('minesweeper');
    },
    description: 'Classic Minesweeper Puzzle Game',
    icon: 'minesweeper'
  },
  pad: {
    command: function (params) {
      bp.open('pad');
    },
    description: 'Create hosted Apps for Buddy Pond',
    icon: 'pad'
  },
  sampler: {
    command: function (params) {
      bp.open('sampler');
    },
    description: 'Audio Sampler. Create and Remix Audio',
    icon: 'sampler'
  },
  solitaire: {
    command: function (params) {
      bp.open('solitaire');
    },
    description: 'Classic Solitaire Card Game',
    icon: 'solitaire'
  },
  /*

  paint: {
    command: function (params) {
      bp.open('paint');
      //let str = `desktop.ui.openWindow("paint", { output: '${params.output}', context: '${params.context}' });`
      //return str;
    },
    description: 'Paint Editor. Draw cool paintings for Buddies.',
    icon: 'paint'
  },
  profile: {
    command: function (params) {
      if (params && params.length > 0) {
        bp.open('profile', { type: params[0] });
      } else {
        bp.open('profile');
      }
    },
    description: 'Buddy Profile Settings',
    icon: 'profile'
  },
  /*
  mtv: {
    command: 'desktop.ui.openWindow("mtv");',
    description: 'Non-stop Music Videos',
    icon: 'mtv'
  },
  */
   camera: {
    command: function (params) {
      bp.open('camera');
    },

    description: 'Camera with Visual Effects',
    icon: 'mirror'
  },
  gif: {
    command: function (params) {
      bp.open('image-search');
    },
    description: 'Search and Create Animated GIFs',
    icon: 'gifstudio'
  },
  image: {
    command: function (params) {
      bp.open('image-search');
    },
    description: 'Search and Create Images',
    icon: 'image'
  },

  mantra: {
    command: function (params) {
      bp.open('mantra');
    },
    description: 'Mantra Gaming Engine Demo',
    icon: 'mantra'
  },

  mute: {
    command: function (params) {
      console.log('mute command', params);
      bp.apps.desktop.toggleMute();
    },
    description: 'Mute the Audio',
    icon: 'mute'
  },
  piano: {
    command: function (params) {
      bp.open('piano');
    },
    description: 'Tiny Piano Synth Keyboard for Jamming',
    icon: 'piano'
  },
  soundcloud: {
    command: function (params) {
      bp.open('soundcloud');
    },
    description: 'Curated Music Playlists and Featured Buddies',
    icon: 'soundcloud'
  },
  record: {
    command: function (params) {
      bp.open('soundrecorder');
      //         let str = `desktop.ui.openWindow("soundrecorder", { output: '${params.output}', context: '${params.context}' });`

    },

    description: 'Sound Recorder App. Record and Edit Audio',
    icon: 'soundrecorder'
  },
  say: {
    command: function(params) {
      console.log('say params', params);
      bp.apps.say.speak('params');
    },
    description: 'Text to Speech. Speak with Buddies',
    icon: 'say'
  },
  /*
  streamsquad: {
    command: 'desktop.ui.openWindow("streamsquad");',
    description: 'Watch Live Streamers with your Buddies',
    icon: 'soundrecorder'
  },
  */
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
    command: function (params) {
      bp.open('spellbook');
    },
    description: 'Spellbook. Cast Spells with Buddies',
    icon: 'spellbook'
  },
  visuals: {
    command: function (params) {
      bp.open('audio-visual');
    },
    description: 'Audio Visualizer. Create Cool Visuals with Music',
    icon: 'visuals'
  }
}