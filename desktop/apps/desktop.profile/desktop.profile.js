desktop.app.profile = {};
desktop.app.profile.label = 'Profile';

desktop.app.profile.load = function loadDesktop (params, next) {
  desktop.load.remoteAppHtml('profile', function (responseText, textStatus, jqXHR) {
    $('.lastSeen').html(new Date().toString());

    $('.updateProfileForm').on('submit', function () {
      // clear out local profile cache, this will trigger a re-render from next server update
      desktop.app.profileCache = {};
      return false;
    });

    if (!buddypond.qtokenid) {
      $('.editProfileLink').addClass('editProfileLinkDisabled');
    }

    $('.editProfileLink').on('click', function () {
      if (buddypond.qtokenid) {
        $(this).closest('.menu').hide();
        desktop.app.profile.openWindow();
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
      // TODO: replace this with better UX thank you
      prompt('( alert lol )\n\nType your custom status:');
    });

    // Remark: also being triggered by enter event on form, jquery.desktop.app.js?
    $('.updateProfileButton').on('click', function () {
      const updates = {};
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

    $('#profileTabs' ).tabs();
    next();
  });
};

desktop.app.profile.openWindow = function openWindow () {
  $('#window_profile').addClass('window_stack').show();
  $('#window_profile').css('height', 540);
  $('#window_profile').css('width', 460);
};