import GameLoop from './GameLoop.js';
import entity from '../entity/entity.js';

export default class Game {
    constructor(bp, options = {}) {
        this.bp = bp;

        new entity(bp).init();

        let gameConfig = {
            onlineGameLoopRunning: true,
            graphics: ['css'],
            physics: {},
            systems: {},
            entities: {},
            ents: {},
            data: {},
            tick: 0,
            removedEntities: new Set(),
            changedEntities: new Set(),
            currentPlayerId: null
          };

        let parent = null;

        if (bp.apps && bp.apps.ui){
            parent = bp.apps.ui.parent;
        }
        this.config = {
            parent: parent, // should probably be a new window instead
            game: gameConfig, // Your game instance
            //hzMS: 16.666,
            hzMS: 16.666,
            fpsReportFrequency: 60,
            gameWorker: '/v2/apps/based/game/gameWorker.js', // worker file that runs all your game logic
            // once data is processed by the gameWorker, it sends it back to the main thread
            // and then these methods are called
            // inflateSnapshot and graphicsRender are currently hard-coded in GameLoop , but could be customized
            inflateSnapshot: function noop () {}, // Your snapshot inflating function
            graphicsRender: function noop () {} // Your graphics rendering function
          };

         

    }

    async init () {
        this.gameLoop = new GameLoop(this.config, this.bp);
        await this.gameLoop.init();
        return this;
    }

    start () {
        this.gameLoop.start();
    }

    stop () {
        this.gameLoop.stop();
    }
    
}