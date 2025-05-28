window.bp_v_5 = async function bp_v_5() {

    // Wait for the error-tracker to load, so we may capture any potential errors during the loading process
    await bp.load('error-tracker', {
        apiEndpoint: buddypond.errorsEndpoint
    });

    setConfig(); // probably can remove this
    bindUIEvents(); // legacy UI events, these should be removed / refactored to each specific app

    // Must wait for localstorage and buddyscript to load before loading the rest of the apps
    await Promise.all([
        bp.load('localstorage'),
        bp.load('buddyscript')
    ]);

    loadCoreApps();

    // desktop is loaded at this stage, continue with other apps
    // load what is required for buddylist and login
    let allCommands = bp.apps.buddyscript.commands;

    await bp.open('client');

    // if not mobile, open buddylist
    await bp.open({
        name: 'buddylist',
        autocomplete: allCommands
    });

    //await bp.load("card");
    bp.load('card');

    // load any other apps that are non-essential but still useful
    // bp.load('console');
    bp.load('clock');
    bp.load('appstore');
    //await bp.load('motd');
    bp.open('motd');
    bp.load('say');
    bp.load('droparea');
    bp.load('file-viewer');

    /*
    */

    //bp.open('file-explorer');

    // await bp.load('spellbook');
    // bp.open('spellbook');

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
    // await this.bp.load('markup');

};


function setConfig() {
    bp.setConfig({
        host: _host,
        api: _api,
        cdn: _cdn,
        portfolioEndpoint: _portfolioEndpoint,
        coinEndpoint: _coinEndpoint,
        orderbookEndpoint: _orderbookEndpoint,
    });
}

function bindUIEvents() {

    // Legacy BP logout / login
    // TODO: move these to buddylist app
    bp.on('auth::logout', 'old-bp-logout', function () {
        $('.loggedIn').flexHide();
        $('.loggedOut').flexShow();
        // TODO: close all windows that have "loggedIn" flag ( not class )
        for (let window of bp.windows) {
            if (window.loggedIn) {
                window.close();
            }
        }
    });

    bp.on('buddy::message::gotfiltered', 'show-toast-info', function (message) {
        // console.log('buddy-message-gotfiltered', message);
        // make toastr that stays for 5 seconds
        toastr.options.timeOut = 5000;
        toastr.info('Your message was filtered due to being at Power Level 1.');
        // desktop.ui.openWindow('buddy_message', { context: message });
    });

    let d = $(document);

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

    $(window).on('resize', function () {
        //bp.apps.desktop.showDesktopIcons();
        //bp.apps.desktop.arrangeShortcuts();
        arrangeDesktop();
        console.log('Window resized, rearranging desktop shortcuts');
    });

    d.on('mousedown', 'img.remixPaint, img.remixMeme', function () {


        let form = $(this).parent();
        let url = $('.image', form).attr('src');
        let output = $(this).data('output');
        let context = $(this).data('context');


        let cardContainer = $(this).parent().parent();
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

    bp.load('wallpaper');
    bp.load('themes');

    bp.importModule({
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

    bp.load('menubar');

    bp.importModule({
        name: 'desktop',
        parent: $('#desktop').get(0),
    }, {}, true, function () {
        arrangeDesktop();
    });

}

function arrangeDesktop() {
    if (bp.isMobile()) {
        bp.apps.desktop.arrangeShortcuts(4, {
            rowWidth: 256,
            rowHeight: 256
        });
        bp.apps.desktop.showDesktopIcons();
        bp.apps.ui.windowManager.arrangeVerticalStacked()

    } else {
        bp.apps.desktop.arrangeShortcuts(3); // Arrange the icons in a grid of 4 columns
        // bp.apps.ui.windowManager.restoreWindows();
    }

        setTimeout(() => {
            bp.apps.desktop.showDesktopIcons();

        }, 300);

}
window.arrangeDesktop = arrangeDesktop;