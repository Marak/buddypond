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
  
  //'background': 'body',

  'property_name': 'whateverwtf .cssValue',
  //'window_bar_top': '#bar_top',
  //'window_bar_bottom': '#bar_bottom',
  //'window_top': '.window_top',
  //'window_main': '.window_main',
  //'window_content': '.window_content',
  //'window_bottom': '.window_bottom',

  'desktop_top_bar': '#bar_top',
  'desktop_bottom_bar': '#bar_bottom',
  'desktop_text': '.desktop-shortcuts-container span.title, .desktop-shortcuts-container-folder a',
  'inputs_text': 'input[type="text"]'

};

let gradients = {

  'rainbow': 'linear-gradient(90deg, rgb(255,0,0) 0%, rgb(143,221,53) 25%, rgb(47,201,226) 50%, rgb(140,16,245) 75%, rgb(255,0,0) 100%)',
  'matrix': 'linear-gradient(90deg, rgb(11,30,11) 0%, rgb(20,38,20) 20%, rgb(0,0,0) 50%, rgb(17,40,17) 80%, rgb(11,30,11) 100%)',
  'ripples': 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
  
}

// takes a JSON object representing a Buddy Pond Theme and applies it do document and localstorage
desktop.app.themes.applyTheme = function applyTheme (theme) {
  if (!theme) {
    return;
  }
  
  // change all the css tyles
  for (var prop in theme.styles) {
    for (var attr in theme.styles[prop]) {
      $(themeMappings[prop]).css(attr, theme.styles[prop][attr])
    }
  }

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
    'color': '#E3E3E3'
  },
  'styles': {
    'window_bar_top': {
      'background': '#E3E3E3',
      'color': '#181818'
    },
    'window_top': {
      'background': '#E3E3E3',
      'color': '#181818'
    },
    'window_main': {
      'background': 'white',
      'color': '#181818'
    },
    'window_content': {
      'background': 'white',
      'color': '#181818'
    },
    'window_bottom': {
      'background': 'white',
      'color': '#181818'
    },
    'desktop_text': {
      'color': '#181818'
    }
  }
};

desktop.app.themes.themes['Dark'] = {
  'wallpaper': {
    'name': 'solid',
    'color': '#181818'
  },
  'styles': {
    'window_bar_top': {
      'background': '#181818',
      'color': '#E3E3E3'
    },
    'window_top': {
      'background': '#181818',
      'color': '#E3E3E3'
    },
    'window_main': {
      'background': '#181818',
      'color': '#E3E3E3',
    },
    'window_content': {
      'background': '#181818',
      'color': '#E3E3E3'
    },
    'window_bottom': {
      'background': '#181818',
      'color': '#E3E3E3'
    },
    'desktop_text': {
      'color': '#E3E3E3'
    }
  }
};


desktop.app.themes.themes['Nyan'] = {
  'wallpaper': {
    'name': 'nyancat'
  },
  'styles': {
    'window_bar_top': {
      'background': '#181818',
      'color': '#E3E3E3'
    },
    'window_top': {
      'background': gradients['rainbow'],
      'color': 'hotpink'
    },
    'window_main': {
      'background': gradients['rainbow'],
      'color': 'hotpink'
    },
    'window_content': {
      'background': gradients['rainbow'],
      'color': 'hotpink'
    },
    'window_bottom': {
      'background': gradients['rainbow'],
      'color': 'hotpink'
    },
    'desktop_text': {
      'color': 'hotpink'
    },
    'background': {
      'background': '#0D1730'
    }
  }
};

desktop.app.themes.themes['Hacker'] = {
  'wallpaper': {
    'name': 'matrix',
    'color': 'green'
  },
  'styles': {
    'window_bar_top': {
      'background': '#181818',
      'color': '#E3E3E3'
    },
    'window_top': {
      'background': gradients['matrix'],
      'color': 'green'
    },
    'window_main': {
      'background': gradients['matrix'],
      'color': 'green'
    },
    'window_content': {
      'background': gradients['matrix'],
      'color': 'green'
    },
    'window_bottom': {
      'background': '#181818',
      'color': 'green'
    },
    'desktop_text': {
      'color': 'green'
    },
    'background': {
      'background': 'none'
    }
  }
};

desktop.app.themes.themes['Water'] = {
  'wallpaper': {
    'name': 'ripples'
  },
  'styles': {
    'window_bar_top': {
      'background': '#62697C',
      'color': '#C1DEFF'
    },
    'window_top': {
      'background': '#62697C',
      'color': '#C1DEFF'
    },
    'window_main': {
      'background': gradients['ripples'],
      'color': '#7B92AD'
    },
    'window_content': {
      'background': gradients['ripples'],
      'color': '#134074'
    },
    'window_bottom': {
      'background': '#62697C',
      'color': '#C1DEFF'
    },
    'desktop_text': {
      'color': 'white'
    },
    'background': {
      'background': '#62697C'
    }
  }
};

 
// TODO: have click button to export current custmo theme as .js file with name ( can make pull request with  )
//       theme.name = "Marak's Awesome Theme";
/*
  // TODO: two forms, one for switching between themes, one for editing theme properties / export theme as json
*/
desktop.app.themes.paused = false;