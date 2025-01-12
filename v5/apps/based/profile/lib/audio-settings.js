export default function legacyAudioSettings(bp) {
    if (bp.settings.notifications_audio_enabled) {
        $('.enableAudioNotifications').prop('checked', true);
    }

    if (bp.settings.audio_enabled) {
        $('.audioEnabled').prop('checked', true);
    }

    if (bp.settings.audio_tts_enabled) {
        $('.audioTTSEnabled').prop('checked', true);
    }
    $(document).on('change', '.audioEnabled', function () {
        let audioMuted = $(this).prop('checked');
        if (audioMuted) {
            bp.set('audio_enabled', true);
            bp.log('Desktop Audio has been muted.');
        } else {
            bp.set('audio_enabled', false);
            bp.log('Desktop Audio is back on.');
        }
    });

    $(document).on('change', '.audioTTSEnabled', function () {
        let audioMuted = $(this).prop('checked');
        if (audioMuted) {
            bp.set('audio_tts_enabled', true);
            bp.say('Text to speech enabled');
        } else {
            bp.set('audio_tts_enabled', false);
        }
    });

    $(document).on('change', '.enableAudioNotifications', function () {
        let audioNotificationsEnabled = $(this).prop('checked');
        if (audioNotificationsEnabled) {
            bp.set('notifications_audio_enabled', true);
            bp.log('Audio Notifications have been enabled.');
            $('.audioEnabled').prop('checked', true);
            $('.audioEnabled').trigger('change');
        } else {
            bp.set('notifications_audio_enabled', false);
            bp.log('Audio Notifications have been disabled.');
        }
    });
}
