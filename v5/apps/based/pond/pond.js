export default class Pond {
    constructor(bp, options = {}) {
        this.bp = bp;
        options.window = options.window || {};
        this.options = options;
        return this;
    }


    async init() {
        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/pond/pond.css');
        // fetches html from the fragment and returns it as a string
        this.html = await this.bp.load('/v5/apps/based/pond/pond.html');
        return 'loaded pond';
    }

    updateHotPonds(data) {
        let hotPonds = data;
        // console.log('updateHotPonds called with data:', hotPonds);
        let html = '';
        const $joinPondTable = $('.joinPondTable');

        // Clear existing entries in the HTML representation (optional, based on whether you want to append or replace)
        $joinPondTable.empty();

        // console.log('Processed hotPonds:', hotPonds);
        // order hotPonds by score
        hotPonds.sort((a, b) => b.connection_count - a.connection_count);

        // Iterate through the hot ponds data
        for (let i = 0; i < hotPonds.length; i++) {
            let pond = hotPonds[i];
            // pond has value and score properties

            // Create a selector for the specific pond row based on the data-pond attribute
            let $existingRow = $joinPondTable.find(`tr[data-pond="${pond.value}"]`);

            // Check if the row already exists
            if ($existingRow.length > 0) {
                // Update the existing row if needed
                $existingRow.find('td').eq(1).text(pond.connection_count); // Update the score column
            } else {
                let pondName = pond.pond_id.replace('pond/', '');
                // If the row does not exist, append a new row to the table
                $joinPondTable.append(`<tr data-pond="${pond.pond_id}"><td>#${pondName}</td><td>${pond.connection_count}</td><td><button class="joinPondButton open-app" data-app="buddylist" data-type="pond" data-context="${pondName}">Join</button></td></tr>`);
            }
        }

        // Update the HTML representation in the pond list
        $('.pond-list', this.pondWindow.content).html(html);
    }


    open(options = {}) {

        if (options.context) {
            this.bp.apps.buddylist.openChatWindow({ pondname: options.context })
            return;
        }

        let iconImagePath = 'desktop/assets/images/icons/icon_pond_64.png';

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
                }
            });

            $('.loggedIn', this.pondWindow.content).show();
            $('.loggedOut', this.pondWindow.content).hide();

            // joinPondForm cancel submission ( for now )
            // should not hijack joinPond, use proper submit handler
            $('.joinPondForm').on('submit', (e) => {
                e.preventDefault();
                /*
                // get value from #customPondName
                let pondName = $('#customPondName').val();
                if (pondName) {
                    this.bp.apps.buddylist.openChatWindow({ pondname: pondName });
                } else {
                    alert('Please enter a pond name');
                }
                */
                joinPond.call(this);
                return false;
            });

            function joinPond() {
                // get value from #customPondName
                let pondName = $('#customPondName').val();
                if (pondName) {
                    this.bp.apps.buddylist.openChatWindow({ pondname: pondName, type: 'pond', context: pondName });
                }
            };

            $('.joinPond').on('click', (e) => {
                e.preventDefault();
                joinPond.call(this);
                return false;
            });

        }

        // TODO: switch to websocket connection?
        function fetchPondData() {
            // make initial fetch API request to buddypond.messagesApiEndpoint
            let url = buddypond.messagesApiEndpoint + '/hotponds';
            // console.log('Fetching hot ponds from:', url);
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.bp.qtokenid}`, // Use Authorization header
                    'x-me': this.bp.me
                }
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch hot ponds');
                }
            }).then(data => {
                // console.log('Hot ponds data:', data);
                this.updateHotPonds(data);
            }).catch(error => {
                console.error('Error fetching hot ponds:', error);
            });

        }

        fetchPondData.call(this);
        this.updatePondsTimer = setInterval(() => {
            fetchPondData.call(this);
        }, 5000);

        return this.pondWindow;

    }

}