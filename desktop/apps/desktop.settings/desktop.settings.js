desktop.app.settings = {}; // since localStorage is loaded first and already populated desktop.settings scope
// desktop.settings.icon = "folder";
desktop.app.settings.label = "Settings";

desktop.app.settings.load = function loadsettings (params, next) {

  desktop.load.remoteAssets([
    'settings' // this loads the sibling desktop.settings.html file into <div id="window_settings"></div>
  ], function (err) {
    $('#window_settings').css('width', 662);
    $('#window_settings').css('height', 495);
    $('#window_settings').css('left', 80);
    $('#window_settings').css('top', 80);

    // Remark: Here we can add defaults for required local storage desktop.settings
    if (typeof desktop.settings.notifications_audio_enabled === 'undefined') {
      desktop.set('notifications_audio_enabled', true);
      // will also update -> desktop.settings.notifications_audio_enabled = true
    }

    if (typeof desktop.settings.agent_merlin_active === 'undefined') {
      desktop.settings.agent_merlin_active = true;
      desktop.set('agent_merlin_active', true);
      // will also update -> desktop.settings.agent_merlin_active = true
    }

    desktop.app.settings.renderForm($('.desktopSettingsTable'));
    desktop.ui.setDesktopIconPositions();
    
    next();
  });

};

// Remark: _ scope is used here since we assume all settings.* properties are actual settings 
//.          ( except settings.load, settings.openWindow, etc)
desktop.app.settings.renderForm = function renderDesktopSettingsForm (el) {

  for (let key in desktop.settings) {
    let val = desktop.settings[key];
    let actualKey = desktop.app.localstorage.prefix + key;
    
    if (typeof val === 'object') {
      //val = JSON.stringify(val, true, 2);
    } else {
      el.append(`
              <tr>
                <th>${key}:</th>
                <th><input name="${actualKey}" id="${actualKey}" type="text" value="${val}"/></th>
              </tr>
        `);
    }
    
    
  }
  
}

desktop.ui.getDesktopIconPositions = function getDesktopIconPositions () {
  let elements = [];
  $('a.icon').each(function(i, item){
    let el = {};
    // TODO: unique IDs might be required for syncing window position
    // el.id = $(this).attr('id');
    el.href = $(this).attr('href');
    el.left = $(item).css('left');
    el.right = $(item).css('right');
    el.top = $(item).css('top');
    elements.push(el);
  });
  desktop.set('desktop_icon_positions', elements);
};

desktop.ui.setDesktopIconPositions = function getDesktopIconPositions () {
  let elements = desktop.settings.desktop_icon_positions || [];
  elements.forEach(function(el){
    let _el = $(`a.icon[href=${el.href}]`)
    _el.css('left', el.left);
    _el.css('right', el.right);
    _el.css('top', el.top);
  });
};

desktop.app.settings.openWindow = function openWindow () {
  $('.desktopSettingsTable').html('');
  desktop.app.settings.renderForm($('.desktopSettingsTable'));

  $('.saveDesktopSettings').on('click', function(){
    // serialize form and apply each setting to localstorage
    // this will also set the desktop.settings scope
    for (let key in desktop.settings) {
      let val = desktop.settings[key];
      if (typeof val === 'string') {
        console.log('setting', key, val)
        let formVal = $('#' + desktop.app.localstorage.prefix + key).val();
        console.log('formVal', '#' + desktop.app.localstorage.prefix + key, formVal)
        desktop.set(key, formVal);
      }
    }
  });

  $('.restoreDesktopSettings').on('click', function(){
    let yes = confirm('Are you certain?\n\nThis will restore all Desktop Settings to their original values and log you out.');
    if (!yes) {
      return;
    }
    localStorage.clear();
    document.location = 'index.html';
  });
  

  return true;
};

desktop.app.settings.closeWindow = function closeWindow () {
  return true;
};