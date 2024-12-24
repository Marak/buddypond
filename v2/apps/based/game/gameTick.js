import Lifecycle from "./Lifecycle.js";

let game = {
  data: {
    config: {
      hzMS: 16.666
    },
    ents: {},
    data: {},
    tick: 0,
    removedEntities: new Set(),
    changedEntities: new Set(),
    currentPlayerId: null
  }
};

let lastTick = Date.now();

function gameTick(deltaTimeMS) {
  game.data.tick++;
  game.data.data.tick = game.data.tick;

  let hzMS = game.data.config.hzMS || 16.666; // 60 FPS

  if (game.data.currentPlayerId) { // why is this here?
    game.data.data.currentPlayer = game.data.data.ents.PLAYER.find(player => player.id === game.data.currentPlayerId);
  }

  // Clear changed entities
  game.data.removedEntities.clear();

  if (game.data.isClient) {
    // TODO: move to localGameLoop?
    game.data.systems['entity'].cleanupDestroyedEntities();
  }

  // Update the physics engine
  // TODO: 
    //game.data.physics.updateEngine(deltaTimeMS);

  // Run game lifecycle hooks
  if (game.data.lifecycle) {
    game.data.lifecycle.triggerHook('before.update', hzMS);
  }

  // run the .update() method of all registered systems
  if (game.data.systemsManager) {
    game.data.systemsManager.update(hzMS); // TODO: use deltaTime in systemsManager
  }

  // Run game lifecycle hooks
  if (game.data.lifecycle) {
    game.data.lifecycle.triggerHook('after.update', hzMS);
  }

  game.data.changedEntities.clear();

  // should return snapshot here of ents

  // TODO: THESE should / could all be hooks, after::gameTick

}

export default gameTick;