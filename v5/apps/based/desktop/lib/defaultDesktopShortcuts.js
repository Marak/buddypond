export default function defaultDesktopShortcuts() {

    bp.apps.desktop.addShortCut({
        name: 'profile',
        icon: `desktop/assets/images/icons/icon_profile_64.png`,
        label: 'My Profile',
        description: 'Manage your profile and settings'
    }, {
        onClick: () => {
            bp.open('profile');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'buddylist',
        icon: `desktop/assets/images/icons/icon_profile_64.png`,
        label: 'BuddyList',
        description: 'View and manage your contacts'
    }, {
        onClick: () => {
            bp.open('buddylist');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'pad',
        icon: `desktop/assets/images/icons/icon_pad_64.png`,
        label: 'Pads',
        description: 'Create and edit notes or documents'
    }, {
        onClick: () => {
            bp.open('pad');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'pond',
        icon: `desktop/assets/images/icons/icon_pond_64.png`,
        label: 'Ponds',
        description: 'Explore shared content or communities'
    }, {
        onClick: () => {
            bp.open('pond');
        }
    });

    if (!bp.isMobile()) {

    bp.apps.desktop.addShortCut({
        name: 'file-explorer',
        icon: `desktop/assets/images/icons/icon_file-explorer_64.png`,
        label: 'Buddy Files',
        description: 'Browse and manage your files'
    }, {
        onClick: () => {
            bp.open('file-explorer');
        }
    });
}

    bp.apps.desktop.addShortCut({
        name: 'paint',
        icon: `desktop/assets/images/icons/icon_paint_64.png`,
        label: 'Paint',
        description: 'Create and edit digital artwork'
    }, {
        onClick: () => {
            bp.open('paint');
        }
    });

    if (!bp.isMobile()) {

        bp.apps.desktop.addShortCut({
            name: 'soundrecorder',
            icon: `desktop/assets/images/icons/icon_soundrecorder_64.png`,
            label: 'Sound Recorder',
            description: 'Record and save audio clips'
        }, {
            onClick: () => {
                bp.open('soundrecorder');
            }
        });
    }

    bp.apps.desktop.addShortCut({
        name: 'youtube',
        icon: `desktop/assets/images/icons/icon_interdimensionalcable_64.png`,
        label: 'Youtube',
        description: 'Watch and browse YouTube videos'
    }, {
        onClick: () => {
            bp.open('youtube');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'camera',
        icon: `desktop/assets/images/icons/icon_camera_64.png`,
        label: 'Camera',
        description: 'Capture photos or videos'
    }, {
        onClick: () => {
            bp.open('camera');
        },
    });

    if (!bp.isMobile()) {
        bp.apps.desktop.addShortCut({
            name: 'piano',
            icon: `desktop/assets/images/icons/icon_piano_64.png`,
            label: 'Piano',
            description: 'Play a virtual piano keyboard'
        }, {
            onClick: () => {
                bp.open('piano');
            }
        });
    }

    bp.apps.desktop.addShortCut({
        name: 'fluid-simulation',
        icon: `desktop/assets/images/icons/icon_fluidsimulation_64.png`,
        label: 'Fluid Simulation',
        description: 'Interact with a fluid dynamics simulation'
    }, {
        onClick: () => {
            bp.open('fluid-simulation');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'sampler',
        icon: `desktop/assets/images/icons/icon_midifighter_64.png`,
        label: 'Sampler',
        description: 'Create and mix audio samples'
    }, {
        onClick: () => {
            bp.open('sampler');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'audio-visual',
        icon: `desktop/assets/images/icons/icon_visuals_64.png`,
        label: 'Audio Visuals',
        description: 'Experience audio-responsive visuals'
    }, {
        onClick: () => {
            bp.open('audio-visual');
        }
    });

    function coinBeta() {
        /*
        bp.apps.desktop.addShortCut({
            name: 'orderbook',
            icon: `desktop/assets/images/icons/icon_orderbook_64.png`,
            label: 'Orderbook',
            description: 'View trading order book data'
        }, {
            onClick: () => {
                bp.open('orderbook');
            }
        });
        */
        bp.apps.desktop.addShortCut({
            name: 'coin',
            icon: `desktop/assets/images/icons/icon_coin_64.png`,
            label: 'Buddy Coins',
            description: 'Manage your virtual currency'
        }, {
            onClick: () => {
                bp.open('coin');
            }
        });


        bp.apps.desktop.addShortCut({
            name: 'portfolio',
            icon: `desktop/assets/images/icons/icon_portfolio_64.png`,
            label: 'Portfolio',
            description: 'Track your investments and assets'
        }, {
            onClick: () => {
                bp.open('portfolio');
            }
        });

        /*
        bp.apps.desktop.addShortCut({
            name: 'buddybux',
            icon: `desktop/assets/images/icons/icon_buddybux_64.png`,
            label: 'BuddyBux',
            description: 'Manage BuddyBux currency'
        }, {
            onClick: () => {
                bp.open('buddybux');
            }
        });
        */

        bp.apps.desktop.arrangeShortcuts(3);
    }

    window.coinBeta = coinBeta;

    /*
    bp.apps.desktop.addShortCut({
        name: 'Merlin',
        icon: `desktop/assets/images/icons/icon_merlin_64.png`,
        label: 'Merlin Automated Assistant',
        description: 'Access your AI assistant'
    }, {
        onClick: () => {
            desktop.ui.openWindow('merlin');
        }
    });
    */

    bp.apps.desktop.addFolder({
        name: 'Games',
        height: 250,
        items: [
            {
                id: 'mantra',
                label: 'Mantra',
                description: 'Play the Mantra game'
            },
            {
                id: 'minesweeper',
                label: 'Minesweeper',
                description: 'Classic Minesweeper puzzle game'
            },
            {
                id: 'emulator',
                label: 'NES',
                options: {
                    context: 'nes',
                },
                icon: 'desktop/assets/images/icons/icon_nes_64.png',
                description: 'Play Nintendo Entertainment System games'
            },
            {
                id: 'emulator',
                label: 'Sega',
                options: {
                    context: 'sega',
                },
                icon: 'desktop/assets/images/icons/icon_sega_64.png',
                description: 'Play Sega console games'
            },
            {
                id: 'emulator',
                label: 'SNES',
                options: {
                    context: 'snes',
                },
                icon: 'desktop/assets/images/icons/icon_snes_64.png',
                description: 'Play Super Nintendo games'
            },
            {
                id: 'emulator',
                label: 'Atari 2600',
                options: {
                    context: 'atari2600',
                },
                icon: 'desktop/assets/images/icons/icon_atari2600_64.png',
                description: 'Play Atari 2600 games'
            },
            {
                id: 'emulator',
                label: 'n64',
                options: {
                    context: 'n64',
                },
                icon: 'desktop/assets/images/icons/icon_n64_64.png',
                description: 'Play Nintendo 64 games'
            },
            {
                id: 'solitaire',
                label: 'Solitaire',
                description: 'Classic Solitaire card game'
            }
        ]
    });

    bp.apps.desktop.addFolder({
        name: 'Hacking Tools',
        width: 320,
        height: 220,
        items: [
            {
                id: 'globe',
                label: 'Globe',
                description: 'Visualize global network data'
            },
            {
                id: 'hacker-typer',
                label: 'Hack Typer',
                description: 'Simulate hacking with a typing game'
            },
            {
                id: 'hex-editor',
                label: 'Hex Editor',
                description: 'Edit files in hexadecimal format'
            },
            {
                id: 'maps',
                label: 'Maps',
                description: 'Access mapping and navigation tools'
            },
            {
                id: 'spellbook',
                label: 'Spellbook',
                description: 'Manage scripts or commands'
            }
        ],
    });

    bp.apps.desktop.addShortCut({
        name: 'audio-player',
        icon: `desktop/assets/images/icons/icon_audio-player_64.png`,
        label: 'Audio Player',
        description: 'Play and manage audio files'
    }, {
        onClick: () => {
            bp.open('audio-player');
        }
    });

    coinBeta();

}