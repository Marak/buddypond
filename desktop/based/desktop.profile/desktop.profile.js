desktop.app.profile = {};
desktop.app.profile.label = 'Profile';

desktop.app.profile.load = function loadProfile (params, next) {
  desktop.load.remoteAppHtml('profile', function (responseText, textStatus, jqXHR) {
    $('.lastSeen').html(new Date().toString());

    $('.updateProfileForm').on('submit', function () {
      // clear out local profile cache, this will trigger a re-render from next server update
      desktop.app.profileCache = {};
      return false;
    });

    if (!buddypond.qtokenid) {
      // $('.editProfileLink').addClass('editProfileLinkDisabled');
    }

    let d = $(document);
    
    d.on('mousedown', '.editProfileLink', function () {
      $(this).closest('.menu').hide();
      desktop.ui.openWindow('profile');
      if (buddypond.qtokenid) {
      } else {
        
      }
      return false;
    });

    desktop.app.tts.voices.forEach(function (v) {
      $('.ttsVoice').append(`<option value="${v.voiceURI}">${v.name} ${v.lang}</option>`);
    });

    if (desktop.settings.tts_voice_index) {
      $('.ttsVoice').prop('selectedIndex', desktop.settings.tts_voice_index);
    }

    $('.ttsVoice').on('change', function () {
      desktop.app.tts.voice = desktop.app.tts.voices[$(this).prop('selectedIndex')];
      desktop.set('tts_voice', desktop.app.tts.voice);
      desktop.set('tts_voice_index', $(this).prop('selectedIndex'));
      desktop.say('Hello Beautiful');
    });

    $('.setStatus').on('click', function () {
      let replaceThisWithBetterUXThankYou = prompt('( alert lol )\n\nType your custom status:');
    });

    // Remark: also being triggered by enter event on form, jquery.desktop.app.js?
    $('.updateProfileButton').on('click', function () {
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
      buddypond.updateBuddyProfile({ updates: updates }, function (err, res) {
        if (res.error) {
          alert(res.message);
          return;
        }
        $('.updateProfileResponse').html('Updated!');
      });
    });

    $('.updateProfileMarkdown').on('click', function () {
      desktop.app.buddylist.profileState.updates.myProfile = $('.profileMarkdown').val();
    });

    $('.hideFlag').on('click', function () {
      if ($(this).prop('checked')) {
        desktop.set('geo_flag_hidden', true);
      } else {
        desktop.set('geo_flag_hidden', false);
      }
    });

    // wallpaper app might not be loaded into desktop ( such as LYTE mode )
    if (desktop.app.wallpaper) {
      desktop.app.profile.renderWallpaperTypes($('.wallpaperTypes'));
      desktop.on('desktop.settings.wallpaper_color', 'update-wallpaper-color-picker', function(color){
        $('.wallpaperOptionColor').setColor(color)
        $('.simpleColorDisplay').html(color)
      });
    }
    $('.enableWebNotifications').on('change', function () {
      let notificationsEnabled = $(this).prop('checked');
      if (notificationsEnabled) {
        Notification.requestPermission().then(function (permission) {
          desktop.set('notifications_web_enabled', true);
          desktop.app.notifications.notifyBuddy('Buddy Pond Notifications Enabled!');
          desktop.log('Browser has granted Notification permissions');
          console.log(permission);
        });
      } else {
        // TODO: keeps browser setting active, but disables Desktop Client from emitting Notification events
        desktop.set('notifications_web_enabled', false);
      }
    });

    if (desktop.settings.notifications_web_enabled) {
      $('.enableWebNotifications').prop('checked', true);
    }

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

    function renderAppList () {
      $('#window_profile .yourApps tbody').html('');
      desktop.app.profile.renderProfileApps();
      desktop.app.profile.renderProfileApp('midi')
      desktop.app.profile.renderProfileApp('appstore')
    }

    renderAppList();

    desktop.on('desktop.settings.apps_installed', 'render-profile-apps-list', function(){
      renderAppList();
    })
    // TODO: v5
    // $('#profileTabs' ).tabs();

    next();
  });
};

desktop.app.profile.renderProfileApp = function renderProfileApp (appName, app) {
  if (!app) {
    app = desktop.app.appstore.apps[appName]
  }
  // don't show Profile App itself in Profile App List
  if (appName === 'profile') {
    return;
  }
  let str = `
    <tr class="openApp" data-app="${appName}">
      <td>
        <img class="emojiIcon float-left" src="desktop/assets/images/icons/icon_${app.icon || appName}_64.png" />
      </td>
      <td>
       ${app.description || app.label || appName}
      </td>
  </tr>`;
  $('#window_profile .yourApps tbody').append(str);
}

desktop.app.profile.renderProfileApps = function renderProfileApps () {
  for (let appName in desktop.settings.apps_installed) {
    let app = desktop.app.appstore.apps[appName];
    desktop.app.profile.renderProfileApp(appName, app);
  }
}

desktop.app.profile.renderWallpaperTypes = function renderWallpaperTypes (el) {
  for (let w in desktop.app.wallpaper._wallpapers) {
    let _wallpaper = desktop.app.wallpaper._wallpapers[w];
    let checked = '';
    if (w === desktop.get('wallpaper_name')) {
      checked = 'checked';
    }
    let str = `
    <input type="radio" id="wallPaperRadio${w}" name="wallpaper_opt" class="wallpaper_opt" value="${w}" ${checked}>
    <label for="wallPaperRadio${w}">${_wallpaper.label}</label>
    <br>
    `;
    el.append(str);
  }
}

desktop.app.profile.openWindow = function openWindow (params) {

  params = params || {
    context: 'themes'
  };

  $('#window_profile').css('width', '44vw');
  $('#window_profile').css('height', '66vh');
  $('#window_profile').css('top', '6vh');
  $('#window_profile').css('left', '2vw');
  new bp.apps.ui.Tabs('#profileTabs');
  // TODO: add other tabs and context
  if (params.context === 'themes') {
    //new bp.apps.ui.Tabs('#profileTabs');
    // $('#profileTabs').tabs({ active: 1});
  }

};