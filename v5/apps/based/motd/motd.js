export default class Motd {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        return this;
    }

    async init() {
        this.html = await this.bp.load('/v5/apps/based/motd/motd.html');
        await this.bp.load('/v5/apps/based/motd/motd.css');
        return 'loaded MOTD';
    }

    async open() {
        let today = DateFormat.format.date(new Date(), 'MM/dd/yy');
        let motdWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'motd',
            title: 'Updates: ' + today,
            icon: 'desktop/assets/images/icons/icon_console_64.png',
            x: 100,
            y: 75,
            width: 600, // Increased width for two-column layout
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            content: this.html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onclose: () => {
                // this.bp.apps.ui.windowManager.destroyWindow('motd');
            }
        });

        // Dynamically populate patch notes
        const patchNotesList = motdWindow.content.querySelector('.patch-notes-list');
        const patchNotes = [

            {
                date: '6/30/25',
                notes: [
                    'Improved Mobile Support',
                    'Many new Games Added!',
                    'Computer Vision Apps Added',
                    'Improved Task Bar and Home Panel',
                    'Improved Emoji Support',
                ]
            },
            {
                date: '6/15/25',
                notes: [
                    `Brand new Buddy Apps Store`,
                    'Deploy your Buddy Apps from Github',
                    'Buddy Pond API Keys for developers',
                    'New tabbed Pond Chat Interface',
                    'Customizable Chat Button Bar',
                ]
            },
            {
                date: '6/6/25',
                notes: [
                    'Buddy Coin Rewards every 60 seconds',
                    'BuddyScript Commands',
                    'Drag and Drop Video Uploads',
                    'Website Embeds in Chats',
                    'Increased Chat History Size',
                ],
            },
            {
                date: '5/28/25',
                notes: [
                    'Image Search',
                    `Voice Dictation`,
                    'Improved Spellbook',
                    'Improved Mobile Support',
                    'Improved Chat Performance for all devices',
                ]
            },

            {
                date: '5/15/25',
                notes: [
                    'Spellbook - Cast Spells with your Buddies',
                    `Buddy Files storage now backed by Buddy Coins`,
                    'Personal Profile Pictures',
                    'Numerous User Experience Improvements',
                ]
            },
            {
                date: '5/03/25',
                notes: [
                    'Buddy Coins system implemented',
                    'Send and receive Buddy Coins with Buddies',
                    'Portfolio App with Coin Tracking',
                    `Adds $MEGA and $GBP Buddy Coins`,
                    `Randolph Coin Faucet Bot launched`

                ]
            },
            {
                date: '4/30/25',
                notes: [
                    'Enchanced Chat Performance',
                    'Migration to websockets for real-time updates',
                    'Infinite scaling for Pond chats'
                ]
            },
            {
                date: '4/20/25',
                notes: [
                    'Theme Support',
                    'Buddy Pond User Interface updated',
                    'User Experience Improvements',
                    `Game Emulators`
                ]
            },

            {
                date: '4/5/25',
                notes: [
                    'Enhanced Chat Experience',
                    'Repies, Editing, Multimedia support',
                    'Video and Audio calls'
                ]
            },
            {
                date: '3/25/25',
                notes: [
                    'Enchanced Buddy Cards',
                    '20+ Chat Cards available',
                    'Buddy Cards integrated with Chat'
                ]
            },
            {
                date: '3/12/25',
                notes: [
                    'Integrated Code Editor',
                    'VSCode like experience',
                    'Edit Buddy Pads with syntax highlighting'
                ]
            },


            {
                date: '2/27/25',
                notes: [
                    'Buddy Pads launched',
                    'Buddy Pads can be shared with Buddies',
                    'Custom Apps for Buddies',
                ]
            },
            {
                date: '2/14/25',
                notes: [
                    'Buddy Bots launched',
                    'Deepseek AI integration',
                    'Ramblor Randomization API services',

                ]
            },

            {
                date: '2/3/25',
                notes: [
                    'Buddy Files launched',
                    'Cloud File Storage with User Folders',
                    'Drag and drop File Uploads'

                ]
            },
            {
                date: '1/22/25',
                notes: [
                    'Ported all legacy apps to new Buddy Pond',
                    'Completed migration to Buddy Pond Cloud API',
                ]
            },

            {
                date: '1/1/25',
                notes: [
                    'Buddy Pond 6.0 launched',
                    'New Buddy Pond Cloud API launched',
                    'Buddy Pond front-end rewrite completed'
                ]
            }
        ];

        patchNotes.forEach(patch => {
            const patchItem = document.createElement('li');
            patchItem.className = 'patch-item';
            patchItem.innerHTML = `
                <h3>Update ${patch.date}</h3>
                <ul>${patch.notes.map(note => `<li>${note}</li>`).join('')}</ul>
            `;
            patchNotesList.appendChild(patchItem);
        });

        // Add event listeners for navigation buttons
        motdWindow.content.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', () => {
                const app = button.dataset.app;
                if (app) {
                    // not needed, handled by open-app class on buttons
                    // this.bp.apps.ui.openApp(app);
                } else if (button.dataset.url) {
                    window.open(button.dataset.url, '_blank');
                }
            });
        });

        // this should be handled globally ( if possible )
        $('.loggedIn', motdWindow.content).hide();
        $('.loggedOut', motdWindow.content).show();

    }
}