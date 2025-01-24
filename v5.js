window.bp_v_5 = async function bp_v_5() {

    setConfig();
    bindUIEvents();
    await loadCoreApps();
    arrangeDesktop();

    // desktop is loaded at this stage, continue with other apps
    // load what is required for buddylist and login
    await bp.load('buddyscript');
    let allCommands = bp.apps.buddyscript.commands;

    await bp.load('localstorage');
    await bp.load('play');
    await bp.open('client');
    await bp.open({
        name: 'buddylist',
        autocomplete: allCommands
    });

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


    // load the legacy apps ( for now )
    // TODO: remove this
    let legacyApps = ['piano', 'lofi', 'ayyowars', 'interdimensionalcable', 'paint', 'mirror', 'games', 'soundrecorder', 'merlin'];

    /*
    for (let appName in bp.settings.apps_installed) {
        let app = bp.apps.appstore.apps[appName];
        //desktop.ui.renderDesktopShortCut(appName, app);
        //console.log('renderDesktopShortCuts', appName, app);
        bp.apps.desktop.addShortCut({
            name: appName,
            icon: `desktop/assets/images/icons/icon_${appName}_64.png`,
            label: app.label || appName,
        }, {
            onClick: () => {
                if (legacyApps.includes(appName)) {
                    desktop.ui.openWindow(appName);
                } else {
                    bp.open(appName);
                }
            }
        });

    }
        */




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

    /*
    desktop.on('window::dragstart', 'legacy-correct-window-z-index', function (event) {

        let windowId = event.windowId;
        let window = $(windowId);
        // console.log('windowwindowwindow', window)
        let newWindows = bp.apps.ui.windowManager.windows;
        // console.log('newWindows', newWindows);
        let newWindowsSorted = newWindows.sort((a, b) => {
            return a.z - b.z;
        });

        if (newWindowsSorted.length) {
            // set the z-index of windowId to the highest z-index + 1
            let highestZ = newWindowsSorted[newWindowsSorted.length - 1].z;
            // console.log('highestZ', highestZ);
            $(`${windowId}`).css('z-index', highestZ + 1);
            // console.log('focus windowId', windowId);

        }


    });
    */

    let d = $(document);

    // TODO: move these to appropriate apps
    // Delegate mousedown event for .logoutLink
    d.on('mousedown', '.logoutLink', function (ev) {
        bp.apps.buddylist.logout();
    });

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




    // Legacy windows
    // we need the same logic for drag start and drag stop on 
    $(document).on('click', function (ev) {
        //  console.log('click', ev.target);
        // if target has class window or has parent with class window
        if ($(ev.target).closest('.window').length) {


            // we need to address the z-index / focus on this window
            let windowId = $(ev.target).closest('.window').attr('id');
            //console.log("current windowId", windowId);
            //console.log('current window zIndex', $(ev.target).css('z-index'));
            // we need to figure out the correct z-index to set this window
            // its not only the legacy BP windows now its also the new windows
            let newWindows = bp.apps.ui.windowManager.windows;
            // console.log('newWindows', newWindows);
            let newWindowsSorted = newWindows.sort((a, b) => {
                return a.z - b.z;
            });

            // set the z-index of windowId to the highest z-index + 1
            let highestZ = newWindowsSorted[newWindowsSorted.length - 1].z;
            //console.log('highestZ', highestZ);
            $(`#${windowId}`).css('z-index', highestZ + 1);
            //console.log('focus windowId', windowId);
        }
        // the event must bubble up to the document
        // so we can capture the window click event

        return true;
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