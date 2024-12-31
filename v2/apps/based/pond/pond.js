export default class Pond {
    constructor(bp, options = {}) {
        this.bp = bp;
        options.window = options.window || {};
        this.options = options;
        return this;
    }


    async init() {

        // injects CSS link tag into the head of document
        await this.bp.load('/v2/apps/based/pond/pond.css');

        // fetches html from the fragment and returns it as a string
        this.html = await this.bp.load('/v2/apps/based/pond/pond.html');

        // should be automatic? why didn't bp.load() pick up on this?
        this.open();

        this.bp.on('ponds::hotPonds', 'update-hotponds-list', data => this.updateHotPonds(data));


        $('.joinPond').on('click', () => {
              // get value from #customPondName
              let pondName = $('#customPondName').val();
              this.bp.apps.buddylist.openChatWindow({ pondname: pondName });
                
        });

        $('.joinPondTable').on('click', (e) => {

            // check if target is a button

            let pondName;
            // check to see if has class joinPondButton
            if (e.target.classList.contains('joinPondButton')) {
                // get the pond value from the data-pond attribute
                pondName = e.target.getAttribute('data-pond');
                // open the pond window
                // this.bp.open('buddylist', { pondName: pond });
                this.bp.apps.buddylist.openChatWindow({ pondname: pondName });
            } 

        });

        // await imports the module and returns it
        // let module = await this.bp.load('/v2/apps/based/pond/pond.js');

        return 'loaded pond';
    }

    updateHotPonds(data) {
        let hotPonds = data.result;
        let html = '';
        const $joinPondTable = $('.joinPondTable');

        // Clear existing entries in the HTML representation (optional, based on whether you want to append or replace)
        $joinPondTable.empty();

        // order hotPonds by score
        hotPonds.sort((a, b) => b.score - a.score);

        // Iterate through the hot ponds data
        for (let i = 0; i < hotPonds.length; i++) {
            let pond = hotPonds[i];
            // pond has value and score properties

            // Create a selector for the specific pond row based on the data-pond attribute
            let $existingRow = $joinPondTable.find(`tr[data-pond="${pond.value}"]`);

            // Check if the row already exists
            if ($existingRow.length > 0) {
                // Update the existing row if needed
                $existingRow.find('td').eq(1).text(pond.score); // Update the score column
            } else {
                // If the row does not exist, append a new row to the table
                $joinPondTable.append(`<tr data-pond="${pond.value}"><td>#${pond.value}</td><td>${pond.score}</td><td><button class="joinPondButton" data-pond="${pond.value}">Join</button></td></tr>`);
            }
        }

        // Update the HTML representation in the pond list
        $('.pond-list', this.pondWindow.content).html(html);
    }


    open() {
        // alert("hi")
        //this.pondWindow.open();

        // we now need to indicate that the profile should subscribe to get updates about the most popular ponds
        // the easiest way seems to create timer on client that sends ws message "getHotPonds" every 5 seconds
        this.bp.emit('client::requestWebsocketConnection', 'ponds');

        this.updatePondsTimer = setInterval(() => {
            this.bp.apps.client.sendMessage({ id: new Date().getTime(), method: 'getHotPonds' });
        }, 5000);

        // immediately get the hot ponds
        this.bp.apps.client.sendMessage({ id: new Date().getTime(), method: 'getHotPonds' });

        if (this.pondWindow) {
            this.pondWindow.open();
            return;
        }
        let iconImagePath = 'desktop/assets/images/icons/icon_pond_64.png';

        this.pondWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'pond',
            title: 'Ponds',
            app: 'pond',
            icon: iconImagePath,
            x: 100,
            y: 100,
            width: 350,
            height: 400,
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

                this.bp.apps.client.releaseWebsocketConnection('ponds');

            }
        });

        $('.loggedIn', this.pondWindow.content).show();
        $('.loggedOut', this.pondWindow.content).hide();

    }

}