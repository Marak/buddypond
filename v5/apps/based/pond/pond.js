import HotPondsWebSocketClient from './client.js';

export default class Pond {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.options = options;
        this.options.window = this.options.window || {};
        this.data = {};
        this.pondWindow = null;
    }

    async init() {
        await this.bp.load('/v5/apps/based/pond/pond.css');
        this.html = await this.bp.load('/v5/apps/based/pond/pond.html');

        // this may need to be bound to pond::open event...
        this.bp.on('auth::qtoken', 'ponds-connect-client', async (data) => {
            if (this.pondWindow && this.pondWindow.content) {
                $('.loggedIn', this.pondWindow.content).show();
                $('.loggedOut', this.pondWindow.content).hide();
            }
            this.connectPonds(this);
        });

        if (this.bp.qtokenid) {
            this.connectPonds(this);
        }

        return 'loaded pond';
    }

    async connectPonds() {

        this.client = new HotPondsWebSocketClient({ bp: this.bp });
        console.log('Connecting to HotPonds WebSocket...');
        await this.client.connect();

        if (this.eventsBound !== true) {
            this.bp.on('hotpond::activePonds', 'update-pond-room-list', (data) => {
                // console.log('Received hotpond::activePonds event with data:', data);
                this.data.hotPonds = data;

                const chatWindow = this.bp.apps.ui.windowManager.getWindow('pond_message_main');
                if (!chatWindow) {
                    console.log('Pond message main window not found, cannot update room list');
                } else {
                    this.bp.apps.buddylist.populateRoomList(data, chatWindow);
                }
                if (this.pondWindow?.content) {
                    this.updateHotPonds(data);
                }
            });

            this.bp.on('pond::connectedUsers', 'update-pond-connected-users', (data) => {
                // console.log('Received pond::connectedUsers event with data:', data);
                this.bp.apps.buddylist.updatePondConnectedUsers(data);
            });
            this.eventsBound = true;
        }


        this.client.listActivePonds();

    }


    updateHotPonds(data) {
        const $joinPondTable = $('.joinPondTable');
        $joinPondTable.empty();

        data.sort((a, b) => b.connection_count - a.connection_count);

        for (let pond of data) {
            const pondName = pond.pond_id.replace('pond/', '');
            const $existingRow = $joinPondTable.find(`tr[data-pond="${pond.pond_id}"]`);

            if ($existingRow.length > 0) {
                $existingRow.find('td').eq(1).text(pond.connection_count);
            } else {
                $joinPondTable.append(`
                    <tr data-pond="${pond.pond_id}">
                        <td>#${pondName}</td>
                        <td>${pond.connection_count}</td>
                        <td><button class="joinPondButton" data-context="${pondName}">Join</button></td>
                    </tr>
                `);
            }
        }
    }

    joinPondByName(pondName) {
        if (!pondName) return;

        // check for bad names
        let invalidName = this.bp.apps.buddylist.forbiddenNotes.containsBadWord(pondName);
        if (invalidName) {
            alert('Invalid pond name. Please choose a different name.');
            return;
        }

        const pondMainWindow = this.bp.apps.ui.windowManager.getWindow('pond_message_main');
        if (pondMainWindow) {
            this.bp.apps.buddylist.joinPond(pondName);
            pondMainWindow.focus();
        } else {
            this.bp.apps.buddylist.openChatWindow({ pondname: pondName });
        }
    }

    open(options = {}) {
        const iconImagePath = 'desktop/assets/images/icons/icon_pond_64.png';

        if (!this.pondWindow) {
            this.pondWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'pond',
                title: 'Ponds',
                app: 'pond',
                icon: iconImagePath,
                x: 100,
                y: 100,
                width: 400,
                height: 470,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                content: this.html,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                preventOverlap: this.options.window.preventOverlap,
                onClose: () => {
                    console.log('pond window closed');
                    this.pondWindow = null;
                    clearInterval(this.updatePondsTimer);
                    // close the client connection if open
                    if (this.client) {
                        this.client.disconnect();
                        this.client = null;
                    }
                }
            });

            if (this.bp.qtokenid) {
                $('.loggedIn', this.pondWindow.content).show();
                $('.loggedOut', this.pondWindow.content).hide();

            } else {
                $('.loggedIn', this.pondWindow.content).hide();
                $('.loggedOut', this.pondWindow.content).show();
            }


            // Manual pond join via input
            const $form = $('.joinCustomPondForm', this.pondWindow.content);
            const $input = $('#customPondName', this.pondWindow.content);

            $form.on('submit', (e) => {
                e.preventDefault();
                const pondName = $input.val();
                this.joinPondByName(pondName);
            });

            // Table-based join buttons
            const $joinPondTable = $('.joinPondTable', this.pondWindow.content);
            $joinPondTable.on('click', '.joinPondButton', (e) => {
                e.preventDefault();
                const pondName = $(e.currentTarget).data('context');
                this.joinPondByName(pondName);
            });

            // Legacy "Join Pond" button (if needed)
            $('.joinPond', this.pondWindow.content).on('click', (e) => {
                e.preventDefault();
                const pondName = $input.val();
                this.joinPondByName(pondName);
            });
        }
        if (this.client) { // only call if client is initialized / connected
            this.client.listActivePonds();
        }

        if (!this.client && this.bp.qtokenid) {
            this.connectPonds(this);
        }

        return this.pondWindow;
    }
}