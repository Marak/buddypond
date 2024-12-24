// import Worker from './workerWrapper.js';

import getWorkerClass from './workerWrapper.js';

export default class GameLoop {
    constructor(config, bp) {
      // Previous initializations...
      this.snapshots = [];  // Array to hold snapshots received from the worker
      this.game = config.game;
      this.bp = bp;

      this.started = false;
      this.lastRenderedSnapshotId = null;
      this.hzMS = config.hzMS || 16.666; // Default to approx 60 FPS if not provided
      this.accumulator = 0;
      this.lastGameTick = Date.now();
      this.lastDelta = 0;
      this.lastFPS = 0;
  
      this.fpsMeasurements = [];
      this.fpsReportFrequency = config.fpsReportFrequency || 60; // Default to reporting every 60 frames
      this.frameCount = 0;
      this.tickCount = 0;

      this.config = config;

      this.init();

    }

    async init() {
      const Worker = await getWorkerClass();

      this.worker = new Worker(this.config.gameWorker || 'gameWorker.js', { type: 'module' });
      console.log('fuuudge', this.worker)
      this.setupWorkerListeners();

    }
  
    start() {
      this.lastGameTick = Date.now();
      this.loop();
    }

    stop() {
      this.game.onlineGameLoopRunning = false;
    }

    setupWorkerListeners() {
      this.worker.onmessage = (event) => {
        const { type, payload } = event.data;
        switch (type) {
          case 'updateState':
            // Store snapshots instead of processing immediately
            // console.log('Received snapshot from worker:', payload);
            this.snapshots.push(payload);
            this.tickCount++;
            this.bp.emit('game::loop', this.tickCount, payload, {
              fps: this.lastFPS,
              frameCount: this.frameCount,
              lastDelta: this.lastDelta
            });

            break;
          default:
            console.error('Unhandled message type from worker:', type);
        }
      };
    }
  
    loop() {
      if (!this.game.onlineGameLoopRunning) return;
  
      let currentTime = Date.now();
      let deltaTime = (currentTime - this.lastGameTick) / 1000.0;
      this.lastDelta = deltaTime;
      this.calculateFPS(deltaTime);
      this.lastGameTick = currentTime;
  
      // Send deltaTime to the worker to process game logic
      // console.log('postMessage', { type: 'gameTick', payload: { deltaTime } });
      this.worker.postMessage({ type: 'gameTick', payload: { deltaTime } });

      // Process all pending snapshots
      while (this.snapshots.length > 0) {
        let snapshot = this.snapshots.shift(); // Process each snapshot
        // console.log('Processing snapshot..inflating...', snapshot);
        // this.inflateSnapshot(this.game, snapshot.entities);
      }

      this.renderGraphics();

  
      requestAnimationFrame(this.loop.bind(this));
    }
  
    processWorkerUpdates(data) {
      // This method can now be refactored or removed if not needed
    }
  
    renderGraphics() {
      let alpha = this.accumulator / (this.hzMS / 1000.0);
      this.game.graphics.forEach(graphicsInterface => {
        // console.log('GameLoop renderGraphics', alpha);
        // this.graphicsRender(graphicsInterface, this.game, alpha);
      });
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
          this.lastFPS = averageFPS;
          // this.game.emit('fps', averageFPS);
          this.fpsMeasurements = [];
        }
      }
    }
}
