desktop.app.settings = {}; // since localStorage is loaded first and already populated desktop.settings scope
// desktop.settings.icon = "folder";
desktop.app.settings.label = 'Settings';

desktop.app.settings.load = function loadsettings (params, next) {

  desktop.load.remoteAssets([
    'settings' // this loads the sibling desktop.settings.html file into <div id="window_settings"></div>
  ], function (err) {

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

    next();
  });

};