export default function defaultDesktopShortcuts() {

    bp.apps.desktop.addShortCut({
        name: 'profile',
        icon: `desktop/assets/images/icons/icon_profile_64.png`,
        label: 'My Profile',
    }, {
        onClick: () => {
            bp.open('profile');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'buddylist',
        icon: `desktop/assets/images/icons/icon_profile_64.png`,
        label: 'BuddyList',
    }, {
        onClick: () => {
            bp.open('buddylist');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'pad',
        icon: `desktop/assets/images/icons/icon_pad_64.png`,
        label: 'Pads',
    }, {
        onClick: () => {
            bp.open('pad');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'pond',
        icon: `desktop/assets/images/icons/icon_pond_64.png`,
        label: 'Ponds',
    }, {
        onClick: () => {
            bp.open('pond');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'file-explorer',
        icon: `desktop/assets/images/icons/icon_file-explorer_64.png`,
        label: 'Buddy Files',
    }, {
        onClick: () => {
            bp.open('file-explorer');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'paint',
        icon: `desktop/assets/images/icons/icon_paint_64.png`,
        label: 'Paint',
    }, {
        onClick: () => {
            bp.open('paint');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'sound-recorder',
        icon: `desktop/assets/images/icons/icon_soundrecorder_64.png`,
        label: 'Sound Recorder',
    }, {
        onClick: () => {
            bp.open('soundrecorder');
        }
    });



    bp.apps.desktop.addShortCut({
        name: 'youtube',
        icon: `desktop/assets/images/icons/icon_interdimensionalcable_64.png`,
        label: 'Youtube',
    }, {
        onClick: () => {
            bp.open('youtube');
        }
    });

   

    bp.apps.desktop.addShortCut({
        name: 'camera',
        icon: `desktop/assets/images/icons/icon_camera_64.png`,
        label: 'Camera',
    }, {
        onClick: () => {
            bp.open('camera');
        },
    

    });


    bp.apps.desktop.addShortCut({
        name: 'piano',
        icon: `desktop/assets/images/icons/icon_piano_64.png`,
        label: 'Piano',
    }, {
        onClick: () => {
            bp.open('piano');
        }
    });


    bp.apps.desktop.addShortCut({
        name: 'fluid-simulation',
        icon: `desktop/assets/images/icons/icon_fluidsimulation_64.png`,
        label: 'Fluid Simulation',
    }, {
        onClick: () => {
            bp.open('fluid-simulation');
        }
    });

    bp.apps.desktop.addShortCut({
        name: 'sampler',
        icon: `desktop/assets/images/icons/icon_midifighter_64.png`,
        label: 'Sampler',
    }, {
        onClick: () => {
            bp.open('sampler');
        }
    });

  
    bp.apps.desktop.addShortCut({
        name: 'audio-visual',
        icon: `desktop/assets/images/icons/icon_visuals_64.png`,
        label: 'Audio Visuals',
    }, {
        onClick: () => {
            bp.open('audio-visual');
        }
    });

    function coinBeta () {
        bp.apps.desktop.addShortCut({
            name: 'orderbook',
            icon: `desktop/assets/images/icons/icon_visuals_64.png`,
            label: 'Orderbook',
        }, {
            onClick: () => {
                bp.open('orderbook');
            }
        });
    
        bp.apps.desktop.addShortCut({
            name: 'coin',
            icon: `desktop/assets/images/icons/icon_visuals_64.png`,
            label: 'Coin',
        }, {
            onClick: () => {
                bp.open('coin');
            }
        });
    
    
        bp.apps.desktop.addShortCut({
            name: 'buddybux',
            icon: `desktop/assets/images/icons/icon_visuals_64.png`,
            label: 'BuddyBux',
        }, {
            onClick: () => {
                bp.open('buddybux');
            }
        });

        bp.apps.desktop.arrangeShortcuts(3);
    }

    window.coinBeta = coinBeta;


    /*
    bp.apps.desktop.addShortCut({
        name: 'Merlin',
        icon: `desktop/assets/images/icons/icon_merlin_64.png`,
        label: 'Merlin Automated Assistant',
    }, {
        onClick: () => {
            desktop.ui.openWindow('merlin');
        }
    });
    */


    bp.apps.desktop.addFolder({
        name: 'Games',
        items: [
            {
                id: 'mantra',
                label: 'Mantra'
            },
            {
                id: 'minesweeper',
                label: 'Minesweeper'
            },
            {
                id: 'emulator',
                label: 'NES',
                icon: 'desktop/assets/images/icons/icon_nes_64.png'
            },
            {
                id: 'emulator',
                label: 'Sega',
                options: {
                    context: 'sega',
                },
                icon: 'desktop/assets/images/icons/icon_sega_64.png'
            },

            {
                id: 'solitaire',
                label: 'Solitaire'
            }
        ]
    });

    bp.apps.desktop.addFolder({
        name: 'Hacking Tools',
        Olditems: [
            'globe',
            'hacker-typer',
            'hex-editor',
            'maps'
        ],
        items: [
            {
                id: 'globe',
                label: 'Globe'
            },
            {
                id: 'hacker-typer',
                label: 'Hack Typer',
            },
            {
                id: 'hex-editor',
                label: 'Hex Editor'
            },
            {
                id: 'maps',
                label: 'Maps'
            }


        ],
    });
    bp.apps.desktop.addShortCut({
        name: 'audio-player',
        icon: `desktop/assets/images/icons/icon_midifighter_64.png`,
        label: 'Audio Player',
    }, {
        onClick: () => {
            bp.open('audio-player');
        }
    });


}