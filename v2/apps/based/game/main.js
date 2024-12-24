const worker = new Worker('ECSWorker.js');

function createEntity(entityData) {
  worker.postMessage({ type: 'createEntity', payload: entityData });
}

function updateEntity(entityId, updates) {
  worker.postMessage({ type: 'updateEntity', payload: { id: entityId, updates } });
}

function gameLoop(deltaTime) {
  worker.postMessage({ type: 'gameTick', payload: { deltaTime } });
  requestAnimationFrame(gameLoop);
}

// Listen for state updates from the worker
worker.onmessage = function(event) {
  const { type, payload } = event.data;

  switch (type) {
    case 'gameStateUpdate':
      applyGameStateUpdate(payload);
      break;
    default:
      console.error('Received unknown type from worker:', type);
  }
};

function applyGameStateUpdate(diffState) {
  // Apply differential state updates to the game state
}

requestAnimationFrame(gameLoop);
