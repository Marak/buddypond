import bp from './bp.js';

async function go() {
    await startBuddylist();
    //await startGame();
    //await stripeCheckout();
}

async function startBuddylist() {
    await bp.start(['ui', 'client', 'buddylist', 'menubar']);
    console.log('apps availble:', bp.apps)
    console.log('api available:', bp.apps.client.api);
    let api = bp.apps.client.api;

     const menuBar = bp.apps.menubar.createMenu();
     console.log(menuBar);
     document.body.appendChild(menuBar);

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