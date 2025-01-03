export default function legacyAudioSettings() {
    if (desktop.settings.notifications_audio_enabled) {
        $('.enableAudioNotifications').prop('checked', true);
    }

    if (desktop.settings.audio_enabled) {
        $('.audioEnabled').prop('checked', true);
    }

    if (desktop.settings.audio_tts_enabled) {
        $('.audioTTSEnabled').prop('checked', true);
    }

    $('.audioEnabled').on('change', function () {
        let audioMuted = $(this).prop('checked');
        if (audioMuted) {
            desktop.set('audio_enabled', true);
            desktop.log('Desktop Audio has been muted.');
        } else {
            desktop.set('audio_enabled', false);
            desktop.log('Desktop Audio has is back on.');
        }
    });

    $('.audioTTSEnabled').on('change', function () {
        let audioMuted = $(this).prop('checked');
        if (audioMuted) {
            desktop.set('audio_tts_enabled', true);
            desktop.say('Text to speech enabled');
        } else {
            desktop.set('audio_tts_enabled', false);
        }
    });

    $('.enableAudioNotifications').on('change', function () {
        let audioNotificationsEnabled = $(this).prop('checked');
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
  


}

