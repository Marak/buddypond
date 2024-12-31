import bp from './bp.js';
import config from './config/config.js';

bp.setConfig({
    host: 'http://192.168.200.59:5174',
    wsHost: 'ws://192.168.200.59'
});

async function go() {
    // await startPartyBox();




    await startBuddylist();


    // await bp.load('powerlevel');
    await bp.load('desktop');;

    bp.apps.desktop.addShortCut({
        name: 'pond',
        icon: 'http://192.168.200.59/desktop/assets/images/icons/icon_pond_64.png',
        label: 'Pond',
    }, {
        onClick: () => {
            bp.open('pond');
        }

    });


    // Assuming there's a container with ID 'powerLevelContainer' in your HTML
    /*
        const powerLevel = bp.apps.powerlevel.popup;

    // Example of increasing to level 4
    powerLevel.show(4, {
        duration: 7777
    });
    */

    //await startGame();
    //await stripeCheckout();
}

async function startBuddylist() {
    let buddylistOptions = {
        name: 'buddylist',
        // autocomplete: allCommands,
        // wil probably need the autocomplete fn handler
        // autocompleteOnSuggestion: fn, etc, will see
        chatWindowButtons: [{
            text: '😊',
            className: 'emojiPicker',
            onclick: (ev) => {

                // focus on the .emojiPicker input
                $('.emojiPicker').focus();

                // we need to add class activeTextArea to the active textarea
                // so we can append the emoji to the correct textarea
                // remove the activeTextArea from all other textareas
                $('.activeTextArea').removeClass('activeTextArea');

                let messageControls = $(ev.target).closest('.aim-message-controls');
                // find the closest textarea to the ev.target
                $('.aim-input', messageControls).addClass('activeTextArea');



            }
        }]

    }
    await bp.start([
        {
            name: 'ui',
            noZepto: true
        },
        'card',
        {
            name: 'client',
            config: {
                host: 'http://192.168.200.59',
                wsHost: 'wss://192.168.200.59'
            }
        },
        'buddyscript', buddylistOptions,
        'menubar',
        'toastr',
        'emoji-picker']);
    console.log('apps availble:', bp.apps)
    console.log('api available:', bp.apps.client.api);
    let api = bp.apps.client.api;

    /*
    const menuBar = bp.apps.menubar.createMenu();
    console.log(menuBar);
    document.body.appendChild(menuBar);
    */
    bp.open('buddylist');

    bp.apps.buddyscript.addCommand('help', (context) => {
        console.log('show help')
        return `Echo: ${context}`;
    });


    bp.on('buddy::message::gotfiltered', 'show-toast-info', function (message) {
        console.log('buddy-message-gotfiltered', message);
        toastr.error('Your message was partially filtered due to you being at Power Level 1.');

        // desktop.ui.openWindow('buddy_message', { context: message });
    });


    async function cardTest() {
        const cardManager = bp.apps.card.cardManager;

        const container = document.createElement('div');
        document.body.appendChild(container);
        const cardData = {
            title: "New Hit Single",
            soundURL: "path/to/song.mp3"
        };
        const card = await cardManager.loadCard('audio', cardData);
        console.log('ffff', card)
        card.render(container);

        const pointsCard = await cardManager.loadCard('points', {
            to: '_Marak',
            from: '_Marak',
            action: 'got', points: 100, balance: 1000, amount: 1000, buddyname: '_Marak'
        });
        pointsCard.render(container);



        // Example data for a snap card
        const snapData = {
            snapURL: 'path/to/image.gif',
            type: 'buddy',
            from: 'JohnDoe',
            to: 'JaneDoe'
        };

        const snapCard = await cardManager.loadCard('snap', snapData);
        snapCard.render(container);



        // Example data for a meme card
        const memeData = {
            title: "Funny Cat",
            levenshtein: "High",
            winkler: "Medium",
            filename: "cat_meme.jpg",
            type: "buddy",
            to: "JohnDoe"
        };

        const memeCard = await cardManager.loadCard('meme', memeData);
        memeCard.render(container);



    }





}

async function startGame() {
    await bp.start(['ui', 'entity', 'game']);

    // bp.apps.game.start();
    bp.on('game::loop', (tick, snapshot, stats) => {
        document.body.innerHTML = JSON.stringify({ tick, snapshot, stats });
    });

    bp.apps.game.start();
    bp.createEntity({
        type: 'ship'
    });
}

async function stripeCheckout() {
    await bp.start(['ui', 'stripe']);

    let sessionId = '1234';
    //bp.apps.stripe.startCheckout(sessionId)
}

async function startPartyBox() {
    await bp.start(['ui', 'fetch-in-webworker', 'audio-track']);

    // create the track
    let t = bp.apps['audio-track'].createAudioTrack({
        fileName: './v2/apps/based/audio-track/assets/dang-son.mp3',
        url: './v2/apps/based/audio-track/assets/dang-son.mp3'
    });
    console.log('created audio track', t);

    // render the track
    let trackElement = t.render();
    console.log('rendered audio track', trackElement);

    // append the track to the body
    document.body.appendChild(trackElement);

    // load the track
    await t.load();
    console.log("loaded audio track", t);

    // await t.play();



}

go();