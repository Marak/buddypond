desktop.app.appstore = {};

desktop.app.appstore.apps = {
  'admin': {
    label: 'Admin',
    icon: 'folder',
    version: '4.20.69' 
  },
  'appstore': {
    label: 'App Store',
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
  'mirror': {
    label: 'Mirror',
    version: '4.20.69'
  },
  'mtv': {
    label: 'Mtv',
    version: '4.20.69'
  },
  'solitare': {
    label: 'Solitare',
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
  

/*
//TODO
desktop.app.appstore.apps = {
  'Featured': {
    'paint': {
      
    },
    'piano': {
      
    }
  },
  'Arcade': {},
  'Create': {},
  'Work': {},
  'Play': {},
  'Develop': {}
}
*/

desktop.app.appstore.label = 'appstore';

desktop.app.appstore.load = function loadappstoreGames (params, next) {
  desktop.load.remoteAssets([
    'appstore' // this loads the sibling desktop.app.appstore.html file into <div id="window_appstore"></div>
  ], function (err) {
    $('.addApp').each(function(i, el){
      // TODO: replace double loop
      for (let app in desktop.settings.apps_installed) {
        if ($(el).data('app') === app) {
          $(el).html('Remove');
        }
      }
    })
    next();
  });
};

desktop.app.appstore.addApp = function addApp (appName, params, cb) {
  setTimeout(function(){
    let installedApps = desktop.settings.apps_installed;
    // TODO: lookup actual app object from appstore.apps
    installedApps[appName] = desktop.app.appstore.apps[appName];
    desktop.set('apps_installed', installedApps);
    desktop.ui.renderDesktopShortCuts();
    desktop.play('APP-ADD.wav');
    cb();
  }, 1333)
}

desktop.app.appstore.removeApp = function removeApp (appName, params, cb) {
  setTimeout(function(){
    let installedApps = desktop.settings.apps_installed;
    delete installedApps[appName];
    desktop.set('apps_installed', installedApps);
    desktop.ui.renderDesktopShortCuts();
    desktop.play('APP-REMOVE.wav');
    cb();
  }, 1333)
}

/*
// TODO
desktop.app.appstore.renderAppPreview = function renderAppPreview (category, appName) {
  let app = desktop.app.appstore.apps[category][appName];
  let str = `
    <div class="appPreview ">
      <div class="title">Paint</div>
      <div class="appicon"><img src="desktop/assets/images/icons/icon_paint_64.png"/></div>
      <div class="desc">A Retro Paint and Image Editor. Create awesome paintings</div>
      <div class="downloads">Downloads: 21,333</div>
      <div class="install">
        <button class="addApp" data-app="paint">Install</button>
        <button class="openApp" data-app="paint">Open</button>
      </div>
    </div>
  `;
  $(category, '#window_appstore').append(str);
}
*/

desktop.app.appstore.openWindow = function openWindow () {
  $('#window_appstore').css('width', 760);
  $('#window_appstore').css('height', 495);
  $('#window_appstore').css('left', 50);
  $('#window_appstore').css('top', 50);
  return true;
};

desktop.app.appstore.closeWindow = function closeWindow () {
  return true;
};