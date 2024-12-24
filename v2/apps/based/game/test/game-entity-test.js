import tap from 'tape';

import bp from '../../../../bp.js';


if (typeof globalThis.requestAnimationFrame === 'undefined') {
    let lastTime = 0;
    globalThis.requestAnimationFrame = (callback) => {
        const now = Date.now();
        const nextTime = Math.max(lastTime + 16, now); // simulate 60 FPS
        return setTimeout(() => {
            callback(lastTime = nextTime);
        }, nextTime - now);
    };

    globalThis.cancelAnimationFrame = (id) => {
        clearTimeout(id);
    };
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


tap.test('game class', (t) => {

    // init game
    t.test('init game', async (t) => {

        await startGame();
        t.end();

    });
    /*

    t.test('createEntity() function - good data', (t) => {
        const entityId = 1;
        const entity = game.createEntity({
            id: entityId,
            type: 'TEST',
            width: 33,
            height: 44,
            radius: 55,
            position: { x: 10, y: 20 }

        });

        t.equal(game.getComponent(entityId, 'position').x, 10);
        t.equal(game.getComponent(entityId, 'position').y, 20);

        t.equal(game.getComponent(entityId, 'width'), 33);
        t.equal(game.getComponent(entityId, 'height'), 44);
        t.equal(game.getComponent(entityId, 'radius'), 55);

        t.equal(game.getComponent(entityId, 'type'), 'TEST');
        t.equal(entity.id, entityId);
        t.end();
    });

    t.test('createEntity() function - bad data should throw', (t) => {

        let failed = false;
        let errMessage = null;
        try {
            let ent = game.createEntity({
                id: 1,
                type: 'TEST',
                position: { x: NaN, y: 20 }
            });

        } catch (err) {
            failed = true;
            errMessage = err.message;

        }

        t.equal(failed, true);
        t.equal(errMessage, 'Invalid position for entity');
        t.end();
    });

    t.test('removeEntity() function', (t) => {
        const entityId = 3;
        game.createEntity({
            id: entityId,
            type: 'TEST',
            position: { x: 10, y: 20 }
        });

        game.removeEntity(entityId);

        const pendingRemoval = game.getEntity(entityId);
        t.equal(pendingRemoval.destroyed, true);

        game.gameTick();
        game.systems['entity'].cleanupDestroyedEntities();


        const removedEntity = game.getEntity(entityId);
        t.equal(removedEntity, null);
        t.end();
    });
    */
});
