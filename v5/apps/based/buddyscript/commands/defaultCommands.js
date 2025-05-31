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

    let evaler = function (context) {
      let params = context.params;
      console.log('Executing legacy command:', command, commandStr, context);
      if (typeof commandStr === 'function') {
        commandStr(context);
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

    console.log('new commands', command, commands);
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
  'cast': {
    command: function (params) {
      bp.open('spellbook');
    },
    description: 'Cast Spells with the Buddy Pond Spellbook',
    icon: 'spellbook'
  },
  /*
  bs: {
    command: function(params) {
      let str = `desktop.app.console.listBuddyScriptCommands({ windowId: '${params.windowId}'});`
      return str;
    },
    description: 'Lists all BuddyScript Commands',
    icon: 'folder'
  },
  */
  console: {
    command: function (params) {
      bp.open('console');
    },
    description: 'Buddy Pond Console Terminal ( For Hackers )',
    icon: 'lofi'
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
  /*
  games: {
    command: function(params) {
      bp.open('games');
    },
    description: 'Stay Entertained with Buddy Pond Games',
    icon: 'folder'
  },
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
  hack: {
    command: function (params) {
      bp.open('hacker-typer');
    },
    description: 'A.I. Assisted Auto-Hacking Console',
    icon: 'hackertyper'
  },

  help: {
    command: function (params) {
      // params is windowId as string, such as `#window_console`
      let str = `desktop.commands.chat.help({ windowId: '${params.windowId}'});`
      return str;
    },
    description: 'Shows basic Help commands',
    img: '/desktop/assets/images/icons/svg/1f9ae.svg'
  },
  youtube: {
    command: function (params) {
      bp.open('youtube');
    },
    description: 'Interdimensional Cable',
    icon: 'interdimensionalcable'
  },
  instruments: {
    command: 'desktop.ui.openWindow("midifighter");',
    description: 'Opens Musical Instruments',
    icon: 'midifighter'
  },
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
      bp.open('emulator');
      //let str = `desktop.ui.openWindow("paint", { output: '${params.output}', context: '${params.context}' });`
      //return str;
    },
    description: 'Nintendo Entertainment System',
    icon: 'nes'
  },
  /*
  n64: {
    command: 'desktop.ui.openWindow("n64");',
    description: 'NINTENDO SIXTY FOOOOOOUUUUURRRR!!!!',
    icon: 'n64'
  },
  */
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
      bp.open('profile');
    },
    description: 'Buddy Profile Settings',
    icon: 'profile'
  },
  camera: {
    command: function (params) {
      bp.open('camera');
    },

    description: 'Camera with Visual Effects',
    icon: 'mirror'
  },
  /*
  mtv: {
    command: 'desktop.ui.openWindow("mtv");',
    description: 'Non-stop Music Videos',
    icon: 'mtv'
  },
  */
  mute: {
    command: `desktop.set('audio_enabled', false);`,
    description: 'Mute Desktop Audio'
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
    }
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