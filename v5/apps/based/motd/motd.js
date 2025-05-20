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

    async open () {
        let today = DateFormat.format.date(new Date(), 'MM/dd/yy');
        let motdWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'motd',
            title: 'Updates: ' + today,
            icon: 'desktop/assets/images/icons/icon_console_64.png',
            x: 250,
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
                date: '5/15/25',
                notes: [
                    'Spellbook app added with new spells',
                    'Video Calls app added',
                    'Upgraded Chat with new features',
                    'Personal Profile Picture added'
                ]
            },
            {
                date: '5/03/25',
                notes: [
                    'Buddy Coins system implemented',
                    'Portfolio app updated with coin tracking.',
                    `MEGA and GBP currencies added`
                ]
            },
            {
                date: '2/22/25',
                notes: [
                    'Buddy Pads launched',
                    'Buddy Files app added'
                ]
            },
            {
                date: '1/1/25',
                notes: [
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
                    this.bp.apps.ui.openApp(app);
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