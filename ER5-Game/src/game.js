import globals from './globals.js';
import { GameState, Key } from './constants.js';
import { Events } from './Events.js';
import { View } from './View.js';
import Asset from './assets.js';
import SpriteFactory from './SpriteFactory.js';
import playerView from './PlayerView.js';
import Map, { mapData} from './Map.js';
import MapView from './MapView.js';
import ImageSet from './ImageSet.js';

class Game {

    constructor(canvas) {
        globals.canvas.width = 800;
        globals.canvas.height = 600;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        globals.ctx = this.ctx;

        this.gameState = GameState.LOADING;
        console.log("Game State: LOADING");

        this.timer = 400;
        this.score = 0;

        // Managers 
        this.inputManager = new Events();
        this.view = new View(this.ctx);

        const mapImageSet = new ImageSet(0, 0, 32, 32, 0, 0, 32); 
        globals.map = new Map(mapData, mapImageSet);

        this.mapView = new MapView(this.ctx);
        this.playerView = new playerView(this.ctx);

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
        globals.previousCycleMilliseconds = 0;

        function gameLoop(currentTime) {
            requestAnimationFrame(gameLoop);

            if (globals.previousCycleMilliseconds === 0) {
                globals.previousCycleMilliseconds = currentTime;
                return;
            }

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

        requestAnimationFrame(gameLoop);
    }

    update(dt) {
        switch (this.gameState) {

            case GameState.LOADING:
                if (globals.assetsLoaded >= globals.assetsToLoad.length && globals.assetsToLoad.length > 0) {
                    this.gameState = GameState.INTRO;
                    globals.gameState = GameState.INTRO;
                    console.log("Game State: INTRO");
                }
                break;

            case GameState.INTRO:
                if (globals.action.confirm) {
                    console.log("CONFIRM detected, changing to MENU...");
                    this.gameState = GameState.MENU;   
                    globals.gameState = GameState.MENU;
                    globals.menuIndex = 0;
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
                        case 0:
                            this.gameState = GameState.PLAYING;
                            globals.gameState = GameState.PLAYING;
                            this.timer = 400; 
                            console.log("Game State: PLAYING");
                            break;

                        case 1:
                            this.gameState = GameState.HISTORY;
                            globals.gameState = GameState.HISTORY;
                            break;

                        case 2:
                            this.gameState = GameState.SETTINGS;
                            globals.gameState = GameState.SETTINGS;
                            break;

                        case 3:
                            this.gameState = GameState.HIGHSCORE;
                            globals.gameState = GameState.HIGHSCORE;
                            break;
                    }
                }
                break;

            case GameState.PLAYING:
                this.timer -= dt;
                if (this.timer <= 0) {
                    this.gameState = GameState.GAME_OVER;
                    globals.gameState = GameState.GAME_OVER;
                }

                if (globals.player) {
                    globals.player.update();
                }
                
                if (globals.player) {
                    globals.player.xPos = Math.max(0, Math.min(globals.player.xPos, globals.canvas.width - 50));
                    globals.player.yPos = Math.max(0, Math.min(globals.player.yPos, globals.canvas.height - 70));
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.view.render();
    }
}

export { Game };