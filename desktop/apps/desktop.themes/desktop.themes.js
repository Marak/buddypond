desktop.app.themes = {};
desktop.app.themes.icon = 'folder';

desktop.app.themes.canvas = null;
desktop.app.themes.label = 'Wallpaper';
desktop.app.themes.settings = null;
desktop.app.themes.init = false;
desktop.app.themes.width = 0;
desktop.app.themes.height = 0;

desktop.app.themes.load = function desktopLoadBuddyList (params, next) {
  next();
};

// TODO: add all relevant theme mappings from DOM, finalize DOM structure for Alpha
let themeMappings = {
  
  'desktop_font': 'body',
  
  'property_name': 'whateverwtf .cssValue',
  'window_top': '.window_top',
  'window_main': '.window_main',

  'desktop_top_bar': '#bar_top',
  'desktop_bottom_bar': '#bar_bottom',
  'inputs_text': 'input[type="text"]'

};

// takes a JSON object representing a Buddy Pond Theme and applies it do document and localstorage
desktop.app.themes.applyTheme = function applyTheme (theme) {
  if (!theme) {
    return;
  }
  
  /*
  // TODO: uncomment this, actually apply styles
  // change all the css tyles
  for (var prop in theme.styles) {
    for (var attr in theme.styles[prop]) {
      $(themeMappings[prop]).css(attr, theme.styles[prop][attr])
    }
  }
  */

  // change the wallapper
  if (theme.wallpaper) {
    desktop.set('wallpaper_name', theme.wallpaper.name);
    if (theme.wallpaper.color) {
      desktop.set('wallpaper_color', theme.wallpaper.color);
    }
  }

};

// Buddy Pond comes with several themes to choose from
// TODO: Add more styles and customize these themes with suggested apps
desktop.app.themes.themes = {};
desktop.app.themes.themes['Light'] = {
  'wallpaper': {
    'name': 'solid',
    'color': '#FFFFFF'
  },
  'styles': {
    'window_top': {
      'background': 'white',
      'color': 'black'
    },
    'window_main': {
      'background': 'white',
      'color': 'black'
    }
  }
};

desktop.app.themes.themes['Dark'] = {
  'wallpaper': {
    'name': 'solid',
    'color': '#000000'
  },
  'styles': {
    'window_top': {
      'background': 'black',
      'color': 'white'
    },
    'window_main': {
      'background': 'black',
      'color': 'white',
    }
  }
};


desktop.app.themes.themes['Nyan'] = {
  'wallpaper': {
    'name': 'nyancat'
  },
  'styles': {
    'window_top': {
      'background': 'white',
      'color': 'pink'
    },
    'window_main': {
      'background': 'white',
      'color': 'pink'
    }
  }
};

desktop.app.themes.themes['Hacker'] = {
  'wallpaper': {
    'name': 'matrix',
    'color': 'green'
  },
  'styles': {
    'window_top': {
      'background': 'black',
      'color': 'green'
    },
    'window_main': {
      'background': 'black',
      'color': 'green'
    }
  }
};

desktop.app.themes.themes['Water'] = {
  'wallpaper': {
    'name': 'ripples'
  },
  'styles': {
    'window_top': {
      'background': 'black',
      'color': 'green'
    },
    'window_main': {
      'background': 'black',
      'color': 'green'
    }
  }
};

 
// TODO: have click button to export current custmo theme as .js file with name ( can make pull request with  )
//       theme.name = "Marak's Awesome Theme";
/*
  // TODO: two forms, one for switching between themes, one for editing theme properties / export theme as json
*/
desktop.app.themes.paused = false;