desktop.app.settings = {}; // since localStorage is loaded first and already populated desktop.settings scope
// desktop.settings.icon = "folder";
desktop.app.settings.label = 'Settings';

desktop.app.settings.load = function loadsettings (params, next) {

  $('#window_settings').css('width', '33vw');
  $('#window_settings').css('height', '77vh');
  $('#window_settings').css('top', '9vh');
  $('#window_settings').css('left', '3vw');

  //
  // BEGIN SET DEFAULTS FOR ALL DESKTOP SETTINGS
  //
  // TODO: move these to separate file or function block
  if (typeof desktop.settings.audio_enabled === 'undefined') {
    desktop.set('audio_enabled', true);
    // will also update -> desktop.settings.audio_enabled = true
  }

  if (typeof desktop.settings.audio_tts_enabled === 'undefined') {
    desktop.set('audio_tts_enabled', true);
    // will also update -> desktop.settings.audio_tts_enabled = true
  }

  if (typeof desktop.settings.notifications_audio_enabled === 'undefined') {
    desktop.set('notifications_audio_enabled', true);
    // will also update -> desktop.settings.notifications_audio_enabled = true
  }

  if (typeof desktop.settings.agent_merlin_active === 'undefined') {
    desktop.set('agent_merlin_active', true);
    // will also update -> desktop.settings.agent_merlin_active = true
  }

  if (typeof desktop.settings.tts_voice_index === 'undefined') {
    desktop.set('tts_voice_index', 0);
  }

  if (typeof desktop.settings.mirror_selected_camera_device_label === 'undefined') {
    desktop.set('mirror_selected_camera_device_label', false);
  }

  if (typeof desktop.settings.mirror_snaps_camera_countdown_enabled === 'undefined') {
    desktop.set('mirror_snaps_camera_countdown_enabled', true);
  }

  if (typeof desktop.settings.wallpaper_name === 'undefined') {
    desktop.set('wallpaper_name', 'matrix');
  }

  if (typeof desktop.settings.wallpaper_color === 'undefined') {
    desktop.set('wallpaper_color', '#008F11');
  }

  if (typeof desktop.settings.geo_flag_hidden === 'undefined') {
    desktop.set('geo_flag_hidden', false);
  }

  //
  // END SET DEFAULTS FOR ALL DESKTOP SETTINGS
  //
  
  // RENDER DEFAULT DESKTOP ICONS HERE ( for now )

  //  if (typeof desktop.settings.apps_installed === 'undefined') {
      let defaultApps = [ 
        { name: 'profile', label: 'Profile', version: '4.20.69' },
        { name: 'buddylist', label: 'Buddy List', version: '4.20.69' },
        { name: 'pond', label: 'Pond', version: '4.20.69' },
        { name: 'interdimensionalcable', label: 'Inter Dimensional Cable', version: '4.20.69' },
        { name: 'memepool', label: 'Meme Pool', version: '4.20.69' },
        { name: 'soundcloud', label: 'Sound Cloud', version: '4.20.69' },
        { name: 'soundrecorder', label: 'Sound Recorder', version: '4.20.69' },
        { name: 'paint', label: 'Paint', version: '4.20.69' },
        { name: 'mirror', label: 'Mirror', version: '4.20.69' },
        { name: 'visuals', label: 'Audio Visualizer', version: '4.20.69' },
        { name: 'games', label: 'Games', icon: 'folder', version: '4.20.69' },
        { placeholder: true },
        { name: 'download', label: 'Download Buddy Pond', icon: 'drive', version: '4.20.69' },
        { name: 'login', label: 'Login', icon: 'login', class: 'loginIcon', version: '4.20.69' },
        { name: 'logout', label: 'Logout', icon: 'login', class: 'loggedIn', version: '4.20.69' },
        { placeholder: true },
        { placeholder: true },
        { placeholder: true },
        { placeholder: true }
        // { name: 'appstore', label: 'App Store', version: '4.20.69' }
      ];
      defaultApps.reverse();
      desktop.set('apps_installed', defaultApps);
  //  }

      // find which apps are installed into this desktop and render their icons
      desktop.settings.apps_installed.forEach(function(app){
        if (app.placeholder) {
          $('.desktop-shortcuts-container').prepend(`
            <div class="icon shortcut">
            </div>
          `);
        } else {
          let href = `#icon_dock_${app.name}`;
          if (app.href) {
            href = app.href;
          }
          $('.desktop-shortcuts-container').prepend(`
            <div class="icon shortcut ${app.class}">
              <a href="${href}">
                <img class="emojiIcon" src="desktop/assets/images/icons/icon_${app.icon || app.name}_64.png" />
                <span class="title">
                  ${app.label || app.name}
                </span>
              </a>
            </div>
          `);
        }
  
      });

  next();

};