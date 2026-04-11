import globals from './globals.js';
import { GameState, Key } from './constants.js';
import { Events } from './Events.js';
import { View } from './View.js';
import Asset from './assets.js';
import SpriteFactory from './SpriteFactory.js';
import playerView from './PlayerView.js';

class Game {

    constructor(canvas) {

       this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        globals.ctx = this.ctx;

        this.gameState = GameState.PLAYING;
        console.log(this.gameState);

        this.timer = 400; // 400 seconds = 6 minutes
        this.score = 0;

        // Managers 
        this.inputManager = new Events();
        this.view = new View(this.ctx);

        this.playerView = new playerView(this.ctx)

        //key actions
        globals.action = {

            moveUp: false,
            moveDown: false,
            moveLeft: false,
            moveRight: false,
            confirm: false,
        };

    }

    static create(canvas) {

        console.log("Initializing...");
        const game = new Game(canvas);

        globals.gameInstance = game;
        
        globals.sprites = [];
        globals.tileSets = [];
        globals.assetsToLoad = [];
        globals.assetsLoaded = 0;

        game.assets = new Asset();
        game.assets.loadAssets();

        game.player = SpriteFactory.createPlayer(250, 100, 120, 70);
        globals.player = game.player;
        globals.sprites.push(globals.player);

        console.log("Ready to execute.");
        return game;
    }

    execute() {
        // Reset timers
        globals.previousCycleMilliseconds = 0;

        function gameLoop(currentTime) {
            requestAnimationFrame(gameLoop);

            //safe first cycle
            if (globals.previousCycleMilliseconds === 0) {
                globals.previousCycleMilliseconds = currentTime;
                return;
            }

            //Time calculations
            const elapsedSeconds = (currentTime - globals.previousCycleMilliseconds) / 1000;
            globals.previousCycleMilliseconds = currentTime;

            globals.deltaTime += elapsedSeconds;
            globals.cycleRealTime += elapsedSeconds;

            if (globals.cycleRealTime >= globals.frameTimeObj) {
                
                if (globals.gameInstance) {

                    globals.gameInstance.update(globals.deltaTime);
                    globals.gameInstance.render();
                }

                globals.cycleRealTime -= globals.frameTimeObj;
                globals.deltaTime = 0;
            }
        }

        // Start the game loop
        requestAnimationFrame(gameLoop);
    }

    update(dt) {
    
        switch (this.gameState) {

            case GameState.INTRO:

                if (globals.action.confirm) {
                    console.log("CONFIRM detected, changing...");
                    this.gameState = GameState.MENU;   
                    globals.gameState = GameState.MENU;
                    this.timer = 400;                      
                    globals.action.confirm = false;        
                }

                break;

            case GameState.MENU:

                if (globals.action.moveUp) {
                    globals.action.moveUp = false; 
                    globals.menuIndex = (globals.menuIndex > 0) ? globals.menuIndex - 1 : 3;
                }

                if (globals.action.moveDown) {
                    globals.action.moveDown = false; 
                    globals.menuIndex = (globals.menuIndex < 3) ? globals.menuIndex + 1 : 0;
                }

                if (globals.action.confirm) {
                    globals.action.confirm = false; 
                    
                    switch (globals.menuIndex) {
                        case 0: // Play
                            this.gameState = GameState.PLAYING;
                            globals.gameState = GameState.PLAYING;
                            this.timer = 400; 
                            globals.action.confirm = false;
                            break;

                        case 1: // Story
                            this.gameState = GameState.HISTORY;
                            globals.gameState = GameState.HISTORY;
                            break;

                        case 2: // Controls
                            this.gameState = GameState.SETTINGS;
                            globals.gameState = GameState.SETTINGS;
                            break;

                        case 3: // High Score
                            this.gameState = GameState.HIGHSCORE;
                            globals.gameState = GameState.HIGHSCORE;
                            break;
                    }
                }
                break;

            case GameState.PLAYING:

                this.timer -= dt;
                if (this.timer <= 0) {
                    this.gameState = gameState.GAME_OVER;
                    globals.gameState = gameState.GAME_OVER;
                }

                if (globals.player) {
                    globals.player.update();
                }
                
                break;

            case GameState.HISTORY:

                globals.subMenuIndex = 0;

                if (globals.action.confirm) {

                    this.gameState = GameState.MENU;
                    globals.gameState = GameState.MENU;

                    globals.subMenuIndex = 0; 
                    globals.action.confirm = false;
                }
                break;

            case GameState.SETTINGS:

                globals.subMenuIndex = 0;

                if (globals.action.confirm) {

                    this.gameState = GameState.MENU;
                    globals.gameState = GameState.MENU;

                    globals.subMenuIndex = 0; 
                    globals.action.confirm = false;
                }
                break;

            case GameState.HIGHSCORE:

                globals.subMenuIndex = 0;

                if (globals.action.confirm) {

                    this.gameState = GameState.MENU;
                    globals.gameState = GameState.MENU;

                    globals.subMenuIndex = 0; 
                    globals.action.confirm = false;
                }
                break;

            case GameState.GAME_OVER:

                if (globals.action.confirm) {

                    this.gameState = GameState.MENU;
                    globals.gameState = GameState.MENU;
                    globals.action.confirm = false;
                }
                break;

            default:
                break;
        }
    }

    render() {

       //Clear all canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        //All the rendering logic is handled by the view
        this.view.render();
    }
}

export { Game };