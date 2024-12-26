import bp from './bp.js';

async function go() {
    await startBuddylist();
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
    await bp.start(['ui', 'client', buddylistOptions, 'menubar', 'emoji-picker']);
    console.log('apps availble:', bp.apps)
    console.log('api available:', bp.apps.client.api);
    let api = bp.apps.client.api;

    const menuBar = bp.apps.menubar.createMenu();
    console.log(menuBar);
    document.body.appendChild(menuBar);
    bp.open('buddylist');

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

go();