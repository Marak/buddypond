export default class AppStore {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {

        this.apps = legacyApps;
   

        return 'loaded appstore';
    }
}

let legacyApps = {
    'admin': {
      label: 'Admin',
      icon: 'folder',
      version: '4.20.69' 
    },
    'appstore': {
      label: 'App Store',
      version: '4.20.69' 
    },
    'ayyowars': {
      label: 'Ayyo Wars',
      version: '4.20.69'
    },
    'console': {
      label: 'Console',
      version: '4.20.69' 
    },
    'buddylist': {
      label: 'Buddy List',
      version: '4.20.69'
    },
    'mantra': {
      label: 'Mantra',
      version: '1.1.1'
    },
    'paint': {
      label: 'Paint',
      version: '4.20.69'
    },
    'pond': {
      label: 'Ponds',
      version: '4.20.69'
    },
    'profile': {
      label: 'Profile',
      version: '4.20.69' 
    },
    
    'interdimensionalcable': {
      label: 'IDC Cable',
      version: '4.20.69'
    },
    'games': {
      label: 'Games',
      icon: 'folder',
      version: '4.20.69'
    },
    'gbp': {
      label: 'Good Budd Points',
      version: '4.20.69'
    },
    'gifstudio': {
      label: 'GIF Studio',
      version: '4.20.69',
      description: 'GIF Studio ( Animation Editor )'
    },
    'globe': {
      label: 'Globe',
      version: '4.20.69'
    },
    'hackertyper': {
      label: 'Hacker Typer',
      version: '4.20.69',
      description: 'A.I. Powered Auto-Hacking Console'
    },
    'lofi': {
      label: 'Lofi Room',
      version: '4.20.69'
    },
    'merlin': {
      label: 'Merlin Automated Assistant',
      version: '4.20.69'
    },
    'midifighter': {
      label: 'Music Pad',
      version: '4.20.69'
    },
    'nes': {
      label: 'NES',
      version: '4.20.69'
    },
    'n64': {
      label: 'n64',
      version: '4.20.69'
    },
    'maps': {
      label: 'Maps',
      version: '4.20.69'
    },
    'memepool': {
      label: 'Meme Pool',
      version: '4.20.69',
      description: 'Meme Pool ( Powered By: Mnemosyne )'
    },
    'midi': {
      label: 'MIDI',
      version: '4.20.69'
    },
    'mirror': {
      label: 'Mirror',
      version: '4.20.69'
    },
    'mtv': {
      label: 'Mtv',
      version: '4.20.69'
    },
    'solitaire': {
      label: 'Solitaire',
      version: '4.20.69'
    },
    'minesweeper': {
      label: 'Minesweeper',
      version: '4.20.69'
    },
    'soundcloud': {
      label: 'Sound Cloud',
      version: '4.20.69'
    },
    'soundrecorder': {
      label: 'Sound Recorder',
      version: '4.20.69'
    },
    'soundcloud': {
      label: 'SoundCloud',
      version: '4.20.69'
    },
    'spellbook': {
      label: 'Spellbook',
      version: '4.20.69'
    },
    'streamsquad': {
      label: 'StreamSquad',
      version: '4.20.69'
    },
    'piano': {
      label: 'Piano',
      version: '4.20.69'
    },
    'visuals': {
      label: 'Audio Visuals',
      description: 'Audio Visualizer ( Requires Microphone )',
      version: '4.20.69'
    }
    
    
  }
    