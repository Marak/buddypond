window.bp_v_5 = async function bp_v_5() {
    await bp.load('error-tracker', {
        apiEndpoint: 'https://bp-error-tracker.cloudflare1973.workers.dev/',
        // apiEndpoint: 'http://localhost:8787/error',
    });

    setConfig();
    bindUIEvents();
    await bp.load('localstorage');
    await bp.load('buddyscript');

    await loadCoreApps();
    arrangeDesktop();

    // desktop is loaded at this stage, continue with other apps
    // load what is required for buddylist and login
    let allCommands = bp.apps.buddyscript.commands;

    await bp.load('play');
    await bp.open('client');

    // if not mobile, open buddylist

    if (!bp.isMobile()) {
        await bp.open({
            name: 'buddylist',
            autocomplete: allCommands
        });
    }

    // if mobile and also session, open buddylist
    // TODO: if (bp.isMobile() && bp.me) {
        

    // buddy list is operational at this stage
    // load apps related to chat / social
    await bp.load("card");

    // 'toastr', 'powerlevel',

    // load any other apps that are non-essential but still useful
     bp.load('console');
     bp.load('clock');
     bp.load('appstore');
     bp.load('themes');
     bp.load('wallpaper');
     bp.load('motd');
     bp.load('say');
     bp.load('droparea');
     bp.load('file-viewer');
     //bp.open('file-explorer');

    
     // bp.open('piano')
     // bp.open('hacker-typer');
     // bp.open('globe');
     // bp.open('maps');

     //bp.open('minesweeper');
     //bp.open('solitaire');
     //bp.open('mantra');

    // await bp.load('youtube');
    // await bp.load('soundrecorder');
    // await bp.open('camera');
    // bp.apps.buddylist.openChatWindow({ context: 'Buddy', type: 'pond', x: 500 });


};


function setConfig() {
    bp.setConfig({
        host: _host,
        wsHost: _wsHost,
        api: _api,
        cdn: _cdn
    });
}


function bindUIEvents() {
    // Legacy BP logout / login
    bp.on('auth::logout', 'old-bp-logout', function () {
        $('.loggedIn').flexHide();

        $('.loggedOut').flexShow();
        //$('.loggedOut').addClass('show');
        bp.apps.client.api.logout(function (err, data) {
            console.log('logout', err, data);
        });
    });

    bp.on('auth::qtoken', 'old-bp-login', function (qtoken) {
        buddypond.qtokenid = qtoken.qtokenid;
        bp.me = qtoken.me;
        //console.log("Showing logged in", qtoken);
        $('.loggedIn').flexShow();
        //$('.loggedIn').addClass('show');
        $('.loggedOut').flexHide();
        $('#me_title').html('Welcome ' + bp.me);
        bp.apps.desktop.load();
    });

    bp.on('buddy::message::gotfiltered', 'show-toast-info', function (message) {
        // console.log('buddy-message-gotfiltered', message);

        // make toastr that stays for 5 seconds
        toastr.options.timeOut = 5000;

        toastr.info('Your message was filtered due to being at Power Level 1.');

        // desktop.ui.openWindow('buddy_message', { context: message });
    });

    let d = $(document);


    // Delegate click event for .volumeToggle
    d.on('click', '.volumeToggle', function () {
        let audio_enabled = localStorage.getItem('audio_enabled');
        if (audio_enabled === 'true') {
            localStorage.setItem('audio_enabled', 'false');
            $('.volumeFull').hide();
            $('.volumeMuted').show();
        } else {
            localStorage.setItem('audio_enabled', 'true');
            $('.volumeFull').show();
            $('.volumeMuted').hide();
            bp.play('desktop/assets/audio/IM.wav', { tryHard: Infinity });
        }
    });

    // Delegate click event for .loginLink
    d.on('click', '.loginLink', function () {
        bp.open('buddylist');
    });

    // Delegate change event for .selectPlaylist
    d.on('change', '.selectPlaylist', function () {
        $('#soundcloudiframe').remove();
        $('#soundcloudplayer').html('');
        /*
        if (desktop.app.soundcloud) {
            desktop.app.soundcloud.embeded = false;
        }
        desktop.ui.openWindow('soundcloud', { playlistID: $(this).val() });
        */
       if (bp.apps.soundcloud) {
        bp.apps.soundcloud.soundCloudEmbeded = false; // reload
       }
        bp.open('soundcloud', { playlistID: $(this).val() });
    });

    // Delegate change event for .selectTheme
    d.on('change', '.selectTheme', function () {
        let theme = $(this).val();
        if (theme === 'Customize') {
            bp.open('profile', { context: 'themes' });
        } else {
            /*
            desktop.app.themes.applyTheme(desktop.app.themes.themes[theme]);
            */
            bp.apps.themes.applyTheme(theme);
            bp.set('active_theme', theme);
        }
    });

    d.on('mousedown', 'img.remixPaint, img.remixMeme', function () {

    
        let form = $(this).parent();
        let url = $('.image', form).attr('src');
        let output = $(this).data('output');
        let context = $(this).data('context');
    
    
        let cardContainer =  $(this).parent().parent();
        console.log('cardContainer', cardContainer);
        url = $('.bp-image', cardContainer).attr('src');
        // url = buddypond.host + url;
        console.log('remixPaint', url, output, context);

        bp.open('paint', {
            src: url,
            output: output,
            context: context
        });

      });

    // Checking and setting the initial state of audio settings
    $(function () {
        if (!desktop.settings.audio_enabled) {
            $('.volumeFull').hide();
            $('.volumeMuted').show();
        } else {
            $('.volumeFull').show();
            $('.volumeMuted').hide();
        }
    });


}

async function loadCoreApps() {

    console.log("start ui import")

    await bp.importModule({
        name: 'ui',
        parent: $('#desktop').get(0),
        window: {
            onFocus(window) {
                // console.log('custom onFocus window focused');
                // legacy window check ( we can remove this after all windows are converted to new window )
                // get all the legacy windows and check z-index to ensure
                // our window is +1 of the highest z-index
                let legacyWindows = $('.window');
                let highestZ = 0;
                let anyVisible = false;
                legacyWindows.each((i, el) => {
                    let z = parseInt($(el).css('z-index'));
                    if (z > highestZ) {
                        highestZ = z;
                    }
                    if ($(el).is(':visible')) {
                        anyVisible = true;
                    }
                });
                // set the z-index of the current window to highestZ + 1
                if (legacyWindows.length > 0 && anyVisible) {
                    console.log('legacyWindows', legacyWindows);
                    console.log('highestZ', highestZ);
                    console.log('setting window depth to', highestZ + 1);
                    window.setDepth(highestZ + 1);
                }
            },
        }
    });
    console.log("ui imported")

    await bp.importModule({
        name: 'desktop',
        parent: $('#desktop').get(0),
    });


    await bp.load('menubar');
    bp.apps.menubar.load();


    // await bp.start(['ui', 'fetch-in-webworker', 'audio-track']);
    //bp.open('audio-player')




}


function arrangeDesktop() {
    if (bp.isMobile()) {
        bp.apps.desktop.arrangeShortcuts(4, {
            rowWidth: 256,
            rowHeight: 256
        })

    } else {
        bp.apps.desktop.arrangeShortcuts(3); // Arrange the icons in a grid of 4 columns
    }


}
window.arrangeDesktop = arrangeDesktop;