desktop.app.settings = {}; // since localStorage is loaded first and already populated desktop.settings scope
// desktop.settings.icon = "folder";
desktop.app.settings.label = "Settings";

desktop.app.settings.load = function loadsettings (params, next) {

  desktop.load.remoteAssets([
    'settings' // this loads the sibling desktop.settings.html file into <div id="window_settings"></div>
  ], function (err) {
    $('#window_settings').css('width', 520);
    $('#window_settings').css('height', 495);
    $('#window_settings').css('left', 80);
    $('#window_settings').css('top', 80);

    //
    // BEGIN SET DEFAULTS FOR ALL DESKTOP SETTINGS
    //
    if (typeof desktop.settings.audio_enabled === 'undefined') {
      desktop.set('audio_enabled', true);
      // will also update -> desktop.settings.audio_enabled = true
    }

    if (typeof desktop.settings.notifications_audio_enabled === 'undefined') {
      desktop.set('notifications_audio_enabled', true);
      // will also update -> desktop.settings.notifications_audio_enabled = true
    }

    if (typeof desktop.settings.agent_merlin_active === 'undefined') {
      desktop.set('agent_merlin_active', true);
      // will also update -> desktop.settings.agent_merlin_active = true
    }

    if (typeof desktop.settings.wallpaper_name === 'undefined') {
      desktop.set('wallpaper_name', 'matrix');
    }

    if (typeof desktop.settings.wallpaper_color === 'undefined') {
      desktop.set('wallpaper_color', '#008F11');
    }
    //
    // END SET DEFAULTS FOR ALL DESKTOP SETTINGS
    //

    desktop.on('desktop.settings', 'update-settings-form', function(){
      desktop.app.settings.renderForm($('.desktopSettingsTable tbody'));
    });

    desktop.ui.setDesktopIconPositions();

    desktop.app.settings.renderForm($('.desktopSettingsTable tbody'));

    function saveSettings () {
      // serialize form and apply each setting to localstorage
      // this will also set the desktop.settings scope
      let updated = {};
      for (let key in desktop.settings) {
        let val = desktop.settings[key];
        let formVal = $('#' + desktop.app.localstorage.prefix + key).val();
        try {
          updated[key] = JSON.parse(formVal);
        } catch (err) {
          updated[key] = formVal;
        }
      }
      desktop.set(updated);
    }

    // cancel the form submit
    $('.updateDesktopSettingsForm').on('submit', function(){
      saveSettings();
      return false;
    })

    $('.editDesktopSettingsLink').on('click', function(){
      $(this).closest('.menu').hide();
      desktop.ui.openWindow('settings');
      return false;
    });

    $('.restoreDesktopSettings').on('click', function(){
      let yes = confirm('Are you certain?\n\nThis will restore all Desktop Settings to their original values and log you out.');
      if (!yes) {
        return;
      }
      desktop.settings = {};
      localStorage.clear();
      document.location = 'index.html';
    });

    $('.enableWebNotifications').on('change', function(){
      let notificationsEnabled = $(this).prop("checked");
      if (notificationsEnabled) {
        Notification.requestPermission().then(function(permission) {
          desktop.set('notifications_web_enabled', true);
          desktop.app.notifications.notifyBuddy("Buddy Pond Notifications Enabled!");
          desktop.log('Browser has granted Notification permissions');
          console.log(permission)
        });
      } else {
        // TODO: keeps browser setting active, but disables Desktop Client from emitting Notification events
        desktop.set('notifications_web_enabled', false);
      }
    });

    if (desktop.settings.notifications_web_enabled) {
      $('.enableWebNotifications').prop('checked', true);
    }

    $('.enableAudioNotifications').on('change', function(){
      let audioNotificationsEnabled = $(this).prop("checked");
      if (audioNotificationsEnabled) {
        desktop.set('notifications_audio_enabled', true);
        desktop.log('Audio Notifications have been enabled.');
        $('.audioEnabled').prop('checked', true);
        $('.audioEnabled').trigger('change');
      } else {
        desktop.set('notifications_audio_enabled', false);
        desktop.log('Audio Notifications have been disabled.');
      }
    });

    if (desktop.settings.notifications_audio_enabled) {
      $('.enableAudioNotifications').prop('checked', true);
    }

    $('.audioEnabled').on('change', function(){
      let audioMuted = $(this).prop("checked");
      if (audioMuted) {
        desktop.set('audio_enabled', true);
        desktop.log('Desktop Audio has been muted.');
      } else {
        desktop.set('audio_enabled', false);
        desktop.log('Desktop Audio has is back on.');
      }
    });

    if (desktop.settings.audio_enabled) {
      $('.audioEnabled').prop('checked', true);
    }

    $('#settingsTabs').tabs({
      activate: function(event ,ui){
        console.log(ui.newTab.index());
          if (ui.newTab.index() === 0) {
            /*
            setTimeout(function(){
              $('.simpleColorDisplay').trigger('click');
            }, 1); // move to next tick, could also be zero ( unsure if browsers complain )
            */
          }
      }
    });

    next();
  });

};

// Remark: _ scope is used here since we assume all settings.* properties are actual settings 
//.          ( except settings.load, settings.openWindow, etc)
desktop.app.settings.renderForm = function renderDesktopSettingsForm (el) {
  $('.desktopSettingsTable tbody').html('');
  let keys = Object.keys(desktop.settings).sort();
  keys.forEach(function(key){
    let val = desktop.settings[key];
    let actualKey = desktop.app.localstorage.prefix + key;
    
    if (typeof val === 'object') {
      //val = JSON.stringify(val, true, 2);
    } else {
      el.append(`
          <tr>
            <td>${key}:</td>
            <td><input name="${actualKey}" id="${actualKey}" type="text" value="${val}"/></td>
          </tr>
      `);
    }
  })

  $('.desktopSettingsTable').each(function() {
    // Add zebra striping, ala Mac OS X.
    $(this).find('tbody tr:odd').addClass('zebra');
  });

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
  if (elements && elements.length) {
    elements.forEach(function(el){
      let _el = $(`a.icon[href=${el.href}]`)
      _el.css('left', el.left);
      _el.css('right', el.right);
      _el.css('top', el.top);
    });
  }
};

desktop.app.settings.openWindow = function openWindow () {
  // $('.simpleColorDisplay').trigger('click');
  return true;
};

desktop.app.settings.closeWindow = function closeWindow () {
  return true;
};