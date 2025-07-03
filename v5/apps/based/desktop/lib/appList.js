export default {
  "admin": {
    name: 'admin',
    icon: `desktop/assets/images/icons/icon_admin_64.png`,
    label: 'Admin',
    "onClick": "bp.open('admin')",
    adminOnly: true,
  },
  "profile": {
    "icon": "desktop/assets/images/icons/icon_myprofile_64.png",
    "label": "My Profile",
    "description": "Manage your profile and settings",
    "onClick": "bp.open('profile')",
    "categories": ["social", "productivity"]
  },
  "buddylist": {
    "icon": "desktop/assets/images/icons/icon_profile_64.png",
    "label": "BuddyList",
    "description": "View and manage your contacts",
    "onClick": "bp.open('buddylist')",
    "categories": ["social", "community"]
  },
  "pad": {
    "icon": "desktop/assets/images/icons/icon_pad_64.png",
    "label": "Buddy Apps",
    "description": "Create hosted Apps for Buddy Pond",
    "onClick": "bp.open('pad')",
    "categories": ["productivity", "creative", "community"],
    "alias": ["buddy-apps"]
  },
  "pond": {
    "icon": "desktop/assets/images/icons/icon_pond_64.png",
    "label": "Ponds",
    "description": "Explore shared content or communities",
    "onClick": "bp.open('pond')",
    "categories": ["community", "social"]
  },
  "file-explorer": {
    "icon": "desktop/assets/images/icons/icon_file-explorer_64.png",
    "label": "Buddy Files",
    "description": "Browse and manage your files",
    "onClick": "bp.open('file-explorer')",
    "desktopOnly": true,
    "categories": ["files", "productivity"],
    "alias": ["buddy-files", "files"]
  },
  "plays-doodle-jump-extra": {
    "icon": "desktop/assets/images/icons/icon_doodle-jump-extra_64.png",
    "label": "Doodle Jump",
    "description": "Play Doodle Jump Extra game",
    "onClick": "bp.open('doodle-jump-extra')",
    "categories": ["games", "entertainment"],
    "author": "Plays.org",
    "alias": ["doodle-jump"],
  },
  "plays-malpek": {
    "icon": "desktop/assets/images/icons/icon_plays-malpek_64.png",
    "label": "Malpek",
    "description": "Play Malpek game",
    "onClick": "bp.open('plays-malpek')",
    "categories": ["games", "entertainment"],
    "author": "Plays.org",
    "alias": ["malpek"],
  },
  "frvr-kittenforce": {
    "icon": "desktop/assets/images/icons/icon_kittenforce-frvr_64.png",
    "label": "Kitten Force",
    "description": "Play Kitten Force FRVR game",
    "onClick": "bp.open('frvr-kittenforce')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["kittenforce"]
  },

  "marbleblast": {
    "icon": "desktop/assets/images/icons/icon_marbleblast_64.png",
    "label": "Marble Blast",
    "description": "Play the Marble Blast game",
    "onClick": "bp.open('marbleblast')",
    "categories": ["games", "entertainment"],
    "author": "Vanilagy",
    "alias": ["marble-blast"]
  },
  "frvr-greed": {
    "icon": "desktop/assets/images/icons/icon_frvr-greed_64.png",
    "label": "Greed",
    "description": "Play Greedy FRVR game",
    "onClick": "bp.open('frvr-greed')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["greed"]
  },
  'jutsu-caster': {
    "icon": "desktop/assets/images/icons/icon_jutsu_64.png",
    "label": "Jutsu Caster",
    "description": "Cast Jutsu spells using hand gestures",
    "onClick": "bp.open('jutsu-caster')",
    "categories": ["tools", "creative", "computer-vision"],
    "author": "BuddyPond",
    "alias": ["jutsu"]
  },
  "minipaint": {
    "icon": "desktop/assets/images/icons/icon_minipaint_64.png",
    "label": "miniPaint",
    "author": "ViliusL",
    "description": "Advanced image editor to create and edit images",
    "onClick": "bp.open('minipaint')",
    "categories": ["art", "creative"]
  },

  "patatap": {
    "icon": "desktop/assets/images/icons/icon_patatap_64.png",
    "label": "Patatap",
    "description": "Create music and animations with touch and keyboard input",
    "onClick": "bp.open('patatap')",
    "categories": ["audio", "music", "creative"],
    "author": "Jono Brandel"
  },
  /*
  "sandspiel": {
    "icon": "desktop/assets/images/icons/icon_sandspiel_64.png",
    "label": "Sandspiel",
    "description": "A creative sandbox game with sand and physics",
    "onClick": "bp.open('sandspiel')",
    "categories": ["games", "creative"]
  },
  */
  "vision-harp": {
    "icon": "desktop/assets/images/icons/icon_vision-harp_64.png",
    "label": "Vision Harp",
    "description": "Play music using hand gestures",
    "onClick": "bp.open('vision-harp')",
    "categories": ["audio", "computer-vision", "music", "creative"],
    "author": "BuddyPond",
    "alias": ["harp"]
  },
  /*
  "fingerpaint": {
    "icon": "desktop/assets/images/icons/icon_finger-paint_64.png",
    "label": "Finger Paint",
    "description": "Create art using hand gestures",
    "onClick": "bp.open('fingerpaint')",
    "categories": ["art", "creative", "computer-vision"],
    "author": "BuddyPond",
    "alias": ["hand-paint", "hand-art"]
  },
  */
  "soundrecorder": {
    "icon": "desktop/assets/images/icons/icon_soundrecorder_64.png",
    "label": "Sound Recorder",
    "author": "Isaiah Odhner",
    "description": "Record and save audio clips",
    "onClick": "bp.open('soundrecorder')",
    "desktopOnly": true,
    "categories": ["audio", "creative"],
    "alias": ["recorder"]
  },
  "youtube": {
    "icon": "desktop/assets/images/icons/icon_interdimensionalcable_64.png",
    "label": "IDC Cable",
    "description": "Watch and browse YouTube videos",
    "onClick": "bp.open('youtube')",
    "categories": ["entertainment", "media"],
    "alias": ["idc"]
  },
  "camera": {
    "icon": "desktop/assets/images/icons/icon_camera_64.png",
    "label": "Camera",
    "description": "Capture photos or videos",
    "onClick": "bp.open('camera')",
    "categories": ["media", "creative"]
  },

  "coin": {
    "icon": "desktop/assets/images/icons/icon_coin_64.png",
    "label": "Buddy Coins",
    "description": "Manage your virtual currency",
    "onClick": "bp.open('coin')",
    "categories": ["finance"]
  },

  "fluid-simulation": {
    "icon": "desktop/assets/images/icons/icon_fluidsimulation_64.png",
    "author": "Pavel Dobryakov",
    "label": "Fluid Simulation",
    "description": "Interact with a fluid dynamics simulation",
    "onClick": "bp.open('fluid-simulation')",
    "categories": ["creative", "entertainment"],
    "alias": ["fluids"]
  },
  "sampler": {
    "icon": "desktop/assets/images/icons/icon_midifighter_64.png",
    "label": "Sampler",
    "description": "Create and mix audio samples",
    "onClick": "bp.open('sampler')",
    "categories": ["audio", "music", "creative"]
  },
  "audio-visual": {
    "icon": "desktop/assets/images/icons/icon_visuals_64.png",
    "author": "lachlanmaclean",
    "label": "Audio Visuals",
    "description": "Experience audio-responsive visuals",
    "onClick": "bp.open('audio-visual')",
    "categories": ["creative", "entertainment", "audio"],
    "alias": ["av"]
  },
  "chalkboard": {
    "icon": "desktop/assets/images/icons/icon_chalkboard_64.png",
    "label": "Chalkboard",
    "description": "Draw and write on a virtual chalkboard",
    "onClick": "bp.open('chalkboard')",
    "categories": ["art", "creative"],
    "chatWindowButton": ['buddy', 'pond'], // adds this app as a button in the chat window, array is types of windows to add it to
    "chatButton": {
      text: 'Chalkboard',
      image: 'desktop/assets/images/icons/icon_chalkboard_64.png',
      onclick: async (ev) => {
        let context = ev.target.dataset.context;
        let type = ev.target.dataset.type;
        // Open the image search window
        bp.open('chalkboard', {
          output: type || 'buddy',
          context: context,
        });
        return false;
      }
    }
  },
  "piano": {
    "icon": "desktop/assets/images/icons/icon_piano_64.png",
    "label": "Piano",
    "description": "Play a virtual piano keyboard",
    "onClick": "bp.open('piano')",
    "desktopOnly": true,
    "categories": ["music", "creative"]
  },
  "bubblepop": {
    "icon": "desktop/assets/images/icons/icon_bubblepop_64.png",
    "label": "Bubble Pop",
    "description": "Pop bubbles and enjoy the visuals",
    "onClick": "bp.open('bubblepop')",
    "categories": ["games", "entertainment", "computer-vision"],
    "author": "BuddyPond",
    "alias": ["bubblepop"]
  },

  "portfolio": {
    "icon": "desktop/assets/images/icons/icon_portfolio_64.png",
    "label": "Portfolio",
    "description": "Track your investments and assets",
    "onClick": "bp.open('portfolio')",
    "categories": ["finance"]
  },
  "audio-player": {
    "icon": "desktop/assets/images/icons/icon_audio-player_64.png",
    "label": "Audio Player",
    "description": "Play and manage audio files",
    "onClick": "bp.open('audio-player')",
    "categories": ["media", "audio"]
  },
  "paint": {
    "icon": "desktop/assets/images/icons/icon_paint_64.png",
    "label": "Paint",
    "author": "Isaiah Odhner",
    "description": "A Classic Retro Style Image Editor",
    "onClick": "bp.open('paint')",
    "categories": ["art", "creative"],
    "chatWindowButton": ['buddy', 'pond'] // adds this app as a button in the chat window, array is types of windows to add it to
  },
  "painterro": {
    "icon": "desktop/assets/images/icons/icon_painterro_64.png",
    "label": "Painterro",
    "author": "Ivan Borshchov",
    "description": "Easy to use image editing tool",
    "onClick": "bp.open('painterro')",
    "categories": ["art", "creative"]
  },
  /* FRVR Games */
  "frvr-basketball": {
    "icon": "desktop/assets/images/icons/icon_basketball-frvr_64.png",
    "label": "BasketBall",
    "description": "Play Basketball game",
    "onClick": "bp.open('frvr-basketball')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["basketball"]
  },
  "frvr-bowlingo": {
    "icon": "desktop/assets/images/icons/icon_frvr-bowlingo_64.png",
    "label": "Bowlingo",
    "description": "Play Bowlingo game",
    "onClick": "bp.open('frvr-bowlingo')",
    "categories": ["games", "entertainment"],
    "author": "FRVR Games",
    "alias": ["bowling"]
  },
  "mantra": {
    "icon": "desktop/assets/images/icons/icon_mantra_64.png",
    "label": "Mantra",
    "description": "Play the Mantra game",
    "categories": ["games"]
  },
  "minesweeper": {
    "icon": "desktop/assets/images/icons/icon_minesweeper_64.png",
    "label": "Minesweeper",
    "description": "Classic Minesweeper puzzle game",
    "categories": ["games"]
  },
  "emulator-nes": {
    "icon": "desktop/assets/images/icons/icon_nes_64.png",
    "app": "emulator",
    "context": 'nes',
    "label": "NES",
    "description": "Play Nintendo Entertainment System games",
    "options": { "context": "nes" },
    "categories": ["games", "emulators"]
  },
  "emulator-sega": {
    "icon": "desktop/assets/images/icons/icon_sega_64.png",
    "app": "emulator",
    "context": 'sega',
    "label": "Sega",
    "description": "Play Sega console games",
    "options": { "context": "sega" },
    "categories": ["games", "emulators"]
  },
  "emulator-snes": {
    "icon": "desktop/assets/images/icons/icon_snes_64.png",
    "app": "emulator",
    "context": 'snes',
    "label": "SNES",
    "description": "Play Super Nintendo games",
    "options": { "context": "snes" },
    "categories": ["games", "emulators"]
  },
  "emulator-atari2600": {
    "icon": "desktop/assets/images/icons/icon_atari2600_64.png",
    "app": "emulator",
    "context": 'atari2600',
    "label": "Atari 2600",
    "description": "Play Atari 2600 games",
    "options": { "context": "atari2600" },
    "categories": ["games", "emulators"]
  },
  "emulator-n64": {
    "icon": "desktop/assets/images/icons/icon_n64_64.png",
    "app": "emulator",
    "context": 'n64',
    "label": "n64",
    "description": "Play Nintendo 64 games",
    "options": { "context": "n64" },
    "categories": ["games", "emulators"]
  },
  "solitaire": {
    "icon": "desktop/assets/images/icons/icon_solitaire_64.png",
    "label": "Solitaire",
    "description": "Classic Solitaire card game",
    "categories": ["games"]
  },
  "stickman": {
    "icon": "desktop/assets/images/icons/icon_stickman_64.png",
    "label": "Stickman",
    "description": "Control a stickman using body poses",
    "onClick": "bp.open('stickman')",
    "categories": ["creative", "computer-vision", "entertainment"],
    "author": "BuddyPond",
    "alias": ["stickman"]
  },

  "spellbook": {
    "icon": "desktop/assets/images/icons/icon_spellbook_64.png",
    "label": "Spellbook",
    "description": "Manage scripts or commands",
    "categories": ["tools", "productivity"]
  },

  "globe": {
    "icon": "desktop/assets/images/icons/icon_globe_64.png",
    "label": "Globe",
    "description": "Visualize global network data",
    "categories": ["tools"]
  },
  "file-viewer": {
    "icon": "desktop/assets/images/icons/icon_file-viewer_64.png",
    "label": "File Viewer",
    "description": "View files in various formats",
    "onClick": "bp.open('file-viewer')",
    "categories": ["files", "productivity"]
  },
  "hacker-typer": {
    "icon": "desktop/assets/images/icons/icon_hacker-typer_64.png",
    "label": "Hack Typer",
    "description": "Simulate hacking with a typing game",
    "categories": ["tools", "games"]
  },
  "hex-editor": {
    "icon": "desktop/assets/images/icons/icon_hex-editor_64.png",
    "label": "Hex Editor",
    "description": "Edit files in hexadecimal format",
    "categories": ["tools", "productivity"]
  },
  "maps": {
    "icon": "desktop/assets/images/icons/icon_maps_64.png",
    "label": "Maps",
    "description": "Access mapping and navigation tools",
    "categories": ["tools"]
  },

  "aero-player": {
    "icon": "desktop/assets/images/icons/icon_aero-player_64.png",
    "label": "Aero Player",
    "description": "Play music with Aero Player",
    "onClick": "bp.open('aero-player')",
    "categories": ["audio", "music", "entertainment"],
    "author": "Swayam",
    "authorUrl": "https://github.com/swayam25/Aero",
     adminOnly: true
  },

  "motd": {
    "icon": "desktop/assets/images/icons/icon_console_64.png",
    "label": "MOTD",
    "description": "Message of the Day",
    "onClick": "bp.open('motd')",
    "categories": ["social", "community"],
    "chatWindowButton": ['buddy', 'pond'] // adds this app as a button in the chat window, array is types of windows to add it to
  }


}