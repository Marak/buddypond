// all the game logic runs in the worker


import gameTick from './gameTick.js';

let gameState = {
  entities: [], // Initialize your game state appropriately
};

// Set up message handling from the main thread
self.onmessage = function(event) {
  const { type, payload } = event.data;
  switch (type) {
    case 'gameTick':
      const deltaTime = payload.deltaTime;
      runGameLogic(deltaTime);
      break;
    // Additional message handling as needed
  }
};

function runGameLogic(deltaTime) {

  // console.log('Running game logic with deltaTime:', deltaTime);

  let snapshot = gameTick(deltaTime);

  // Collect and send updated state back to the main thread
  // This will be the latest snapshot of the game state
  const updatedEntities = collectEntityStates(); // Implement this based on your entity management


  postMessage({ type: 'updateState', payload: { entities: updatedEntities } });
}

function collectEntityStates() {
  // This function would gather all the current states of entities
  // For example, this might involve collecting position, health, status, etc.
  return gameState.entities.map(entity => ({
    id: entity.id,
    position: entity.position,
    health: entity.health,
    // More properties as needed
  }));
}

// Any additional functions needed for game logic

// Start the worker or any initial setup if necessary
