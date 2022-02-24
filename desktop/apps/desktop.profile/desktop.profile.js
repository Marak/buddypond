desktop.profile = {};
desktop.profile.label = "Profile";

desktop.profile.load = function loadDesktop (params, next) {
  desktop.loadRemoteAppHtml('profile', function (responseText, textStatus, jqXHR) {
    $('.lastSeen').html(new Date().toString());

    $('.updateProfileForm').on('submit', function () {
      return false;
    });

    // Remark: also being triggered by enter event on form, jquery.desktop.js?
    $('.updateProfileButton').on('click', function(){
      let updates = {};
      updates.email = $('.buddy_email').val();
      updates.password = $('.buddy_password').val();
      updates.confirmPassword = $('.confirm_buddy_password').val();
      $('.updateProfileResponse').html('');
      if (updates.password) {
        if (!updates.confirmPassword || (updates.password !== updates.confirmPassword)) {
          $('.updateProfileResponse').addClass('error');
          $('.updateProfileResponse').html('Passwords do not match');
          return;
        }
      }
      $('.updateProfileResponse').removeClass('error');
      buddypond.updateBuddyProfile({ updates: updates }, function(err, res){
        $('.updateProfileResponse').html('Updated!');
      })
    });

    $('.enableWebNotifications').on('change', function(){
      let notificationsEnabled = $(this).prop("checked");
      if (notificationsEnabled) {
        Notification.requestPermission().then(function(permission) {
          desktop.localstorage.set('notifications_web_enabled', true);
          desktop.notifications.notifyBuddy("Buddy Pond Notifications Enabled!");
          desktop.log('Browser has granted Notification permissions');
          console.log(permission)
        });
      } else {
        // TODO: keeps browser setting active, but disables Desktop Client from emitting Notification events
        desktop.localstorage.set('notifications_web_enabled', false);
      }
    });

    if (desktop.settings.notifications_web_enabled) {
      $('.enableWebNotifications').prop('checked', true);
    }

    $('.enableAudioNotifications').on('change', function(){
      let audioNotificationsEnabled = $(this).prop("checked");
      if (audioNotificationsEnabled) {
        desktop.localstorage.set('notifications_audio_enabled', true);
        desktop.log('Audio Notifications have been enabled.');
      } else {
        desktop.localstorage.set('notifications_audio_enabled', false);
        desktop.log('Audio Notifications have been disabled.');
      }
    });

    if (desktop.settings.notifications_audio_enabled) {
      $('.enableAudioNotifications').prop('checked', true);
    }

    $("#profileTabs" ).tabs();
    next();
  });
};

desktop.profile.openWindow = function openWindow () {
  $('#window_profile').css('height', 510);
  $('#window_profile').css('width', 460);
}