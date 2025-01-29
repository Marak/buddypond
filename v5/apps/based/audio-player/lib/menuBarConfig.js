let logo = document.createElement("h1");
logo.classList.add("logo");
logo.textContent = "PVRTY BVX";


export default [
  
    {
        label: logo,
        submenu: [
            { label: 'Device Settings', click: () => api.ui.toggleDeviceSettings() }, // auto-load and play if empty
            { type: 'separator' },

            { label: 'Play Deck A - [ W ] Key', click: () => api.track.playPause('deckA', null, true) }, // auto-load and play if empty

            { label: 'Play Deck B - [ S ] Key', click: () => api.track.playPause('deckB', null, true) },

            { type: 'separator' },
            { label: 'Next Song [ N ]', click: () => api.transport.nextTrack() },
            { label: 'New Sampler [ M ]', click: () => api.sampler.load() },
            { type: 'separator' },
            { label: 'AutoDJ [ O ] ', click: () => api.toggleAutoDJ() },

            { label: 'Phase Lock [ P ] ', click: () => api.togglePhaseLock() },
            { label: 'Party [ I ]', click: () => api.party() },
            { type: 'separator' },
            { label: 'Login', className: 'loggedOut', click: () => api.bp.apps.buddylist.init() },
            { label: 'Logout', className: 'loggedIn', click: () => api.bp.apps.buddylist.logout() },
        ],
    },

    // View Menu
    {
        label: 'View',
        submenu: [
            {
                label: 'Layouts', submenu: [
                    { label: 'Default', click: () => api.ui.switchLayout('default') },
                    { label: 'Perform', click: () => api.ui.switchLayout('perform') },
                    { label: 'Minimal', click: () => api.ui.switchLayout('minimal') },
                    { label: 'Create custom layout', disabled: true },
                ]
            },
            { type: 'separator' },
            { label: 'Transport', click: (ev) => api.ui.toggleTransport(ev) },
            { label: 'Library', click: (ev) => api.ui.toggleLibrary(ev) },
            { label: 'Playlist', click: (ev) => api.ui.togglePlaylist(ev) },
            { label: 'Social Hub', click: () => api.ui.toggleSocialHubDisplay() },
            { type: 'separator' },
            { id: "menubar-set-window-as-background", label: 'Set Window as Background', click: () => api.ui.setActiveWindowAsBackground(), disabled: true, title: 'Requires an open Window element' },
            // restore background window
            { id: "menubar-restore-background-window", label: 'Restore Background Window', click: () => api.ui.restoreBackgroundWindows(), disabled: true },
            { type: 'separator' },
            { label: 'Toggle Effects', click: () => console.log('Toggle Effects') },
            { label: 'Auto-hide Menubar', id: 'menu-bar-autohide', click: () => api.ui.toggleAutoHideMenuBar() },
            { label: 'Enter Fullscreen', click: () => api.ui.toggleFullscreen() },
        ],
    },

    // Library Menu (custom for DJ app)
    {
        label: 'Library',
        submenu: [
            // export library file
            { label: 'Analyze Tracks', click: () => console.log('Analyze Tracks') },
            { label: 'Search Library', click: (ev) => api.ui.toggleLibrary(ev) },
            { type: 'separator' },
            // load library file
            { label: 'Import Songs', click: () => api.transport.importLibraryComponent.toggle() },
            { type: 'separator' },
            // stripe all tracks
            { label: 'Check Consistency', click: () => api.library.showCheckConsistency() },
            { type: 'separator' },
            { label: 'Switch Library', click: () => api.ui.switchLibrary.toggle() },
            { label: 'Export Library', click: () => api.library.download() },

        ],
    },
    {
        label: 'Vibes',
        submenu: [
            { label: 'Show Vibes', click: () => api.ui.vibeSelector.toggle() },
            { label: 'Edit Vibes', click: () => api.ui.vibeEditor.toggle() },
        ],
    },

    // Sampler
    {
        label: { label: 'New Sampler', click: () => api.sampler.load() },
    },

    // Addons
    {
        label: 'Addons',
        submenu: [
            { label: 'Install Addon from URL...', disabled: true, click: () => console.log('Install Addon from URL') },
            //separator
            { type: 'separator' },
            { label: 'Manage Addons', click: () => toggleAddonModal(), disabled: true },
            { type: 'separator' },

            { label: 'Ultimate Air Horn', id: 'addon-ultimate-air-horn', click: () => api.ui.toggleAirhornWindow() },

            { type: 'separator' },

            { label: 'Audio Visualizer', id: 'addon-audio-visualizer', click: () => toggleAddon('audio-visualizer', './addons') },
            { label: 'Audio Visualizer Fractal', id: 'addon-audio-visualizer-fractal', click: () => toggleAddon('audio-visualizer-fractal', './addons') },
            { label: 'Audio Visualizer Particles', id: 'addon-audio-visualizer-particles', click: () => toggleAddon('audio-visualizer-particles', './addons') },
            // { label: 'Audio Visualizer Oscilloscope', id: 'addon-audio-visualizer-oscilloscope', click: () => toggleAddon('audio-visualizer-oscilloscope', './addons') },

        ],
    },
   
    // Help Menu
    {
        label: 'Help',
        submenu: [
            //{ label: 'Documentation', click: () => console.log('Open Documentation') },
            { label: 'Keyboard Shortcuts', disabled: true, click: () => console.log('Open Keyboard Shortcuts') },
            // { label: 'Check for Updates...', click: () => console.log('Check for Updates') },
            //    { type: 'separator' },
            { label: 'About', click: () => confirm('Pvrty Bvx is Awesome!') },
        ],
    },
];