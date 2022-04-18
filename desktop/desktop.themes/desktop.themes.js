desktop.app.themes = {};
desktop.app.themes.canvas = null;
desktop.app.themes.label = 'Wallpaper';
desktop.app.themes.settings = null;
desktop.app.themes.init = false;
desktop.app.themes.width = 0;
desktop.app.themes.height = 0;


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
desktop.app.themes.applyTheme = function applyTheme () {};

desktop.app.themes.themes = {};

// TODO: have click button to export current custmo theme as .js file with name ( can make pull request with  )
//       theme.name = "Marak's Awesome Theme";


// TODO: wallpaper editor form should be moved into themes editor page?
// TODO: themes editor form should be moved into Desktop Settings page?
// TODO: two forms, one for switching between themes, one for editing theme properties / export theme as json
desktop.app.themes.paused = false;
desktop.app.themes.load = function desktopLoadBuddyList (params, next) {
  desktop.load.remoteAssets([
    'themes'
  ], function (err) {
    next();
  });
};