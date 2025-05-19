export default async function legacyUserSettings(bp) {
    $('.updateProfileButton').on('click', async function () {
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
        try {
            let passwordChanged = await buddypond.passwordChange({ buddyname: bp.me, password: updates.password });
            console.log('password changed', passwordChanged);
            // update successful
            if (passwordChanged) {
                $('.updateProfileResponse').html('Password changed');
            }
        } catch (e) {
            $('.updateProfileResponse').addClass('error');
            $('.updateProfileResponse').html('Failed to change password ' + e.message);
            return;
        }

        /*
        buddypond.updateBuddyProfile({ updates: updates }, function (err, res) {
            if (res.error) {
                alert(res.message);
                return;
            }
            $('.updateProfileResponse').html('Updated!');
        });
        */
    });


    if (bp.apps.buddylist && bp.apps.buddylist.data.profileState && bp.apps.buddylist.data.profileState.email) {
        $('.buddy_email').val(bp.apps.buddylist.data.profileState.email);
    }

    $('.updateProfileForm').on('submit', function (e) {
        e.preventDefault();
        // clear out local profile cache, this will trigger a re-render from next server update
        // desktop.app.profileCache = {};
        return false;
    });

    if (bp.apps.say) {
        let voices = bp.apps.say.voices;
        voices.forEach(function (v) {
            $('.ttsVoice').append(`<option value="${v.voiceURI}">${v.name} ${v.lang}</option>`);
        });
    
    }

    if (desktop.settings.tts_voice_index) {
        $('.ttsVoice').prop('selectedIndex', desktop.settings.tts_voice_index);
    }

    $('.ttsVoice').on('change', function () {
        //desktop.app.tts.voice = voices[$(this).prop('selectedIndex')];
        let voice = voices[$(this).prop('selectedIndex')];
        bp.apps.say.setVoice($(this).prop('selectedIndex'));
        desktop.set('tts_voice', voice);
        desktop.set('tts_voice_index', $(this).prop('selectedIndex'));
        bp.say('Hello Beautiful');
    });


    $('.hideFlag').on('click', function () {
        if ($(this).prop('checked')) {
            desktop.set('geo_flag_hidden', true);
        } else {
            desktop.set('geo_flag_hidden', false);
        }
    });



}