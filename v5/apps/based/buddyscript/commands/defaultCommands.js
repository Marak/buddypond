export default function Commands (bp) {

    this.bp = bp;

    const commands = {};
    this.commands = commands;

    commands.say = function (context) {
        console.log('Saying:', context);
        bp.say(context);
    };

    commands.give = function (context) {
        console.log('Giving:', context);
        return false;
    };

    commands.paint = function (params) {
        alert(JSON.stringify(params));
        desktop.ui.openWindow("paint", { output: params[0], context: params[1] });
    }


    // for all the legacy commands, call the legacy command
    for (let command in legacyCommands) {
        commands[command] = function (context) {
            let params = context.params;
            let commandObj = legacyCommands[command];
            let commandStr = commandObj.command;
            console.log('Executing legacy command:', command, commandStr, context);
            eval(commandStr)
            
        };
    }

    return this;

}

/* Legacy commands, should be moved outside of this file and into the app itself on registration */

// TODO: map all known apps
let legacyCommands = {
    appstore: {
      command: 'desktop.ui.openWindow("appstore");',
      description: 'View Buddy Pond App Store',
      icon: 'appstore'
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
    meme: {
      command: function(params) {
        // handled by server via sendMessage code path
      }
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
    /*
    paint: {
      command: function(params) {
        alert(JSON.stringify(params));
        let str = `desktop.ui.openWindow("paint", { output: '${params.output}', context: '${params.context}' });`
        return str;
      },
      description: 'Paint Editor. Draw cool paintings for Buddies.',
      icon: 'paint'
    },
    */
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
    mute: {
      command: `desktop.set('audio_enabled', false);`,
      description: 'Mute Desktop Audio'
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
    /*
    say: {
      command: function(params) {
        console.log('say params', params);
        desktop.say(params);
      }
    },
    */
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
