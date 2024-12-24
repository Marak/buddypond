class GameLoop {
    constructor(config) {
      this.started = false;
      this.lastRenderedSnapshotId = null;
      this.hzMS = config.hzMS || 16.666; // Default to approx 60 FPS if not provided
      this.accumulator = 0;
      this.lastGameTick = Date.now();
  
      this.fpsMeasurements = [];
      this.fpsReportFrequency = config.fpsReportFrequency || 60; // Default to reporting every 60 frames
      this.frameCount = 0;
  
      // Configuration for external functions
      this.gameTick = config.gameTick;
      this.graphicsRender = config.graphicsRender;
      this.inflateSnapshot = config.inflateSnapshot;
      this.physics = config.physics;
      this.lifecycle = config.lifecycle;
      this.systemsManager = config.systemsManager;
  
      // Game context
      this.game = config.game;
    }
  
    start() {
      if (!this.started) {
        this.started = true;
        this.lastGameTick = Date.now();
        this.loop();
      }
    }
  
    stop() {
      this.game.onlineGameLoopRunning = false;
    }
  
    loop() { 

      if (!this.game.onlineGameLoopRunning) return;
  
      let currentTime = Date.now();
      let deltaTime = (currentTime - this.lastGameTick) / 1000.0; // Convert milliseconds to seconds
      this.calculateFPS(deltaTime);
      this.lastGameTick = currentTime;

      // Where should this go?
      worker.postMessage({ type: 'gameTick', payload: { deltaTime } });

      // Run the game logic with gameTick()
      // - This covers entity lifecycle and systems lifecycle
      this.runGameLogic(deltaTime);

      requestAnimationFrame(this.loop.bind(this));
    }

    // TODO: move to prototype scope, copy to ./gameTick.js
    gameTick (deltaTime) {

      // process all snapshots ( this will Entity.inflateEntity())
      this.processSnapshots();

      // Clear any removed entities ( from last frame )
      this.removedEntities.clear();

      this.systemsManager.systems.entity.cleanupDestroyedEntities();

      // Update the physics engine
      this.physics.updateEngine(deltaTimeMS);

      // Run game lifecycle hooks
      if (this.lifecycle) {
        this.lifecycle.triggerHook('before.update', hzMS);
      }

      // run the .update() method of all registered systems
      if (this.systemsManager) {
        this.systemsManager.update(hzMS); // TODO: use deltaTime in systemsManager
      }

      // Run game lifecycle hooks
      if (this.lifecycle) {
        this.lifecycle.triggerHook('after.update', hzMS);
      }

      // Clear changed entities
      this.changedEntities.clear();

      // Render the graphics with new positions etc
      this.renderGraphics();

      // Save the game snapshot
      this.saveSnapshot(this.getEntities(), this.lastProcessedInput);
    }
  
    calculateFPS(deltaTime) {
      if (deltaTime > 0) {
        let currentFPS = 1 / deltaTime;
        this.fpsMeasurements.push(currentFPS);
  
        if (this.fpsMeasurements.length > this.fpsReportFrequency) {
          this.fpsMeasurements.shift();
        }
  
        this.frameCount++;
        if (this.frameCount % this.fpsReportFrequency === 0) {
          let sumFPS = this.fpsMeasurements.reduce((a, b) => a + b, 0);
          let averageFPS = sumFPS / this.fpsMeasurements.length;
          this.game.emit('fps', averageFPS);
          this.fpsMeasurements = [];
        }
      }
    }
  
    processSnapshots() {
      if (this.game.latestSnapshot && this.game.latestSnapshot.id !== this.lastRenderedSnapshotId) {
        while (this.game.snapshotQueue.length > 0) {
          let snapshot = this.game.snapshotQueue.shift();
          snapshot.state.forEach(state => this.inflateSnapshot(this.game, state));
          this.lastRenderedSnapshotId = snapshot.id;
        }
      }
    }
  
    runGameLogic(deltaTime) {
      this.accumulator += deltaTime;
      while (this.accumulator >= this.hzMS / 1000.0) {
        this.gameTick(this.game);
        this.accumulator -= this.hzMS / 1000.0;
      }
    }
  
    renderGraphics() {
      let alpha = this.accumulator / (this.hzMS / 1000.0);
      this.game.graphics.forEach(graphicsInterface => {
        this.graphicsRender(graphicsInterface, this.game, alpha);
      });
    }
  }
  
  export default GameLoop;
  