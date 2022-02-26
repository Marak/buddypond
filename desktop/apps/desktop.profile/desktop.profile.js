desktop.app.profile = {};
desktop.app.profile.label = "Profile";

desktop.app.profile.load = function loadDesktop (params, next) {
  desktop.load.remoteAppHtml('profile', function (responseText, textStatus, jqXHR) {
    $('.lastSeen').html(new Date().toString());

    $('.updateProfileForm').on('submit', function () {
      // clear out local profile cache, this will trigger a re-render from next server update
      desktop.app.profileCache = {};
      return false;
    });

    $('.editProfileLink').on('click', function(){
      $(this).closest('.menu').hide();
      desktop.app.profile.openWindow();
      return false;
    });

    $('.setStatus').on('click', function(){
      let replaceThisWithBetterUXThankYou = prompt('( alert lol )\n\nType your custom status:');
    });

    // Remark: also being triggered by enter event on form, jquery.desktop.app.js?
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

    $('.updateProfileMarkdown').on('click', function(){
      desktop.app.buddylist.profileState.updates.myProfile = $('.profileMarkdown').val();
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

    $("#profileTabs" ).tabs();
    next();
  });
};

desktop.app.profile.openWindow = function openWindow () {
  $('#window_profile').addClass('window_stack').show();
  $('#window_profile').css('height', 540);
  $('#window_profile').css('width', 460);
}