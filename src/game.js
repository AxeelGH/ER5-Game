import globals from "./globals.js";
import { GameState, Key, LoginData, SpriteID } from "./constants.js";
import { Events } from "./Events.js";
import { View } from "./View.js";
import Asset from "./assets.js";
import SpriteFactory from "./SpriteFactory.js";
import playerView from "./PlayerView.js";
import Map from "./Map.js";
import MapView from "./MapView.js";
import ImageSet from "./ImageSet.js";
import CollisionManager from "./CollisionManager.js";
import CombatTurn from "./CombatTurn.js";
import Inventory from "./Inventory.js";
import { Sound } from "./constants.js";
import GameFactory from "./GameFactory.js";
import LevelFactory  from "./levelFactory.js";

class Game {
  constructor(canvas, gameData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    globals.ctx = this.ctx;

    this.gameState = GameState.MENU;
    globals.gameState = GameState.MENU;
    console.log("Game State: LOADING");

    this.score = 0;
    this.timer = gameData.game.time;
    this.highScore = this.score;
    this.masterVolume = gameData.audio.masterVolume;
    this.difficulty = "Hard";

    if (this.difficulty === "Easy") {
      this.enemyHPMultiplier = gameData.difficulty.easy.enemyHPMultiplier;
      this.enemyAttackMultiplier = gameData.difficulty.easy.enemyAttackMultiplier;
      this.playerHPMultiplier = gameData.difficulty.easy.playerHPMultiplier;
    } else if (this.difficulty === "Hard") {
      this.enemyHPMultiplier = gameData.difficulty.hard.enemyHPMultiplier;
      this.enemyAttackMultiplier = gameData.difficulty.hard.enemyAttackMultiplier;
      this.playerHPMultiplier = gameData.difficulty.hard.playerHPMultiplier;
    }

    this.levelFactory = new LevelFactory();

    // Managers
    this.inputManager = new Events();
    this.view = new View(this.ctx, this);

    globals.map = null;

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

    //Initialize enemy array
    globals.enemies = [];
    globals.currentEnemy = null;

    this.combatTurn = null;

    globals.currentSound = Sound.NO_SOUND;

    this.loginLoadingFrames = 0;
    this.pendingScreen = null;      
    this.loadScreenFrames = 0;
  }

  static async create(canvas, gameData) {
    console.log("Initializing...");
    const game = new Game(canvas, gameData);

    globals.gameInstance = game;

    globals.sprites = [];
    globals.tileSets = [];
    globals.assetsToLoad = [];
    globals.assetsLoaded = 0;

    globals.inventory = new Inventory();

    game.assets = new Asset();
    game.assets.loadAssets();
    game.player = SpriteFactory.createPlayer(100, 220, 120, 70);
    globals.player = game.player;
    globals.sprites.push(globals.player);
    console.log(globals.sprites[0]);

    await game.initializeLevels();

    canvas.style.width = screen.width + "px";
    canvas.style.height = screen.height + "px";
    console.log(canvas.style.width);
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
          this.gameState = GameState.MENU;
          globals.gameState = GameState.MENU;
          console.log("Game State: INTRO");
          console.log(this.canvas.width);
          console.log(this.canvas.height);

          console.log("Current difficulty setting: " + this.difficulty);

        }
        break;

      case GameState.INTRO:
        if (globals.action.confirm) {
          console.log("CONFIRM detected, changing to MENU...");
          this.gameState = GameState.LOGIN;
          globals.gameState = GameState.LOGIN;
          globals.menuIndex = 0;
          globals.action.confirm = false;

          globals.sounds[Sound.START_MUSIC].play();
          globals.sounds[Sound.START_MUSIC].volume = this.masterVolume;
        }
        break;

      case GameState.LOGIN:
        const form = document.querySelector("#formLogin");

        if (form && form.style.display !== "block") {
          form.style.display = "block";
        }

        if (globals.buttonStart && globals.buttonStart.clicked) {
          globals.buttonStart.clicked = false;

          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          if (!email || !password) {
            alert("Please enter both email and password.");
          } else {
            this.login(email, password);
          }
        }

        break;

      case GameState.LOGIN_LOADING:
        this.loginLoadingFrames += 1;

        if (this.loginLoadingFrames >= 120) {
          this.loginLoadingFrames = 0;
        }

        break;

      case GameState.MENU:
        if (globals.action.moveUp) {
          globals.action.moveUp = false;
          globals.menuIndex = globals.menuIndex > 0 ? globals.menuIndex - 1 : 3;
        }

        if (globals.action.moveDown) {
          globals.action.moveDown = false;
          globals.menuIndex = globals.menuIndex < 3 ? globals.menuIndex + 1 : 0;
        }

        if (globals.action.confirm) {
          globals.action.confirm = false;

          switch (globals.menuIndex) {
            case 0:
              this.gameState = GameState.PLAYING;
              globals.gameState = GameState.PLAYING;
              //this.timer = 400;
              console.log("Game State: PLAYING");
              for (let i = 0; i < globals.enemies.length; i++) {
                globals.enemies[i].hp *= this.enemyHPMultiplier;
                globals.enemies[i].maxHp = globals.enemies[i].hp;  
                console.log("Enemy " + 1 + ": " + globals.enemies[i].hp);
              }
              this.player.hp *= this.playerHPMultiplier;
              this.player.maxHp = this.player.hp;
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

      case GameState.LOAD_SCREEN:

        this.loadScreenFrames++;
        
        if (this.pendingScreen !== null && this.loadScreenFrames >= 30) {
          
          let level = this.levelFactory.getLevelById(this.pendingScreen);
          
          if (level) {
            globals.map = level;
            globals.enemies = level.enemies;
            globals.objects = level.objects;
            
            console.log("loadScreen: " + level.name);
            console.log("Enemies: " + globals.enemies.length);
            
            this.pendingScreen = null;
            this.loadScreenFrames = 0;
            
            this.gameState = GameState.PLAYING;
            globals.gameState = GameState.PLAYING;
            console.log("Game State: PLAYING");

          } else {

            console.error("Error loading screen: " + this.pendingScreen);
            this.pendingScreen = null;
            this.loadScreenFrames = 0;
            this.gameState = GameState.PLAYING;
            globals.gameState = GameState.PLAYING;
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

        for (let i = 0; i < globals.enemies.length; i++) {
          if (globals.enemies[i].isAlive) {
            globals.enemies[i].update();
          }
        }

        if (globals.object) {
          globals.object.update();
        }

        if (globals.player) {
          globals.player.xPos = Math.max(0, Math.min(globals.player.xPos, globals.canvas.width - 50));
          globals.player.yPos = Math.max(0, Math.min(globals.player.yPos, globals.canvas.height - 70));
        }

        CollisionManager.detectCollisions();

        let allEnemiesDead = true;

        if(globals.enemies.length === 0) {
          allEnemiesDead = false;
        }

        for (let i = 0; i < globals.enemies.length; i++) {
          if (globals.enemies[i].isAlive === true) {
            allEnemiesDead = false;
            break;
          }
        }

        if (allEnemiesDead) {
          this.gameState = GameState.VICTORY;
          globals.gameState = GameState.VICTORY;
        }
        break;

      case GameState.COMBAT:
        if (this.combatTurn) {
          this.combatTurn.combatMenu();
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

      case GameState.VICTORY:
        if (globals.action.confirm) {
          this.gameState = GameState.MENU;
          globals.gameState = GameState.MENU;
          globals.action.confirm = false;
        }

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

  async initializeLevels() {
    await this.levelFactory.loadLevels("./src/mapData.json");
    if (this.levelFactory.levels.length > 0) {
        globals.map = this.levelFactory.levels[0];
        globals.enemies = this.levelFactory.levels[0].enemies;
        globals.objects = this.levelFactory.levels[0].objects ? this.levelFactory.levels[0].objects : [];
        globals.currentScreen = this.levelFactory.levels[0].id;
      console.log("currentScreen: " + globals.currentScreen);
    }
  }

    loadScreen(newScreen) {
      console.log("loading Screen: " + newScreen);
      
      let level = this.levelFactory.getLevelById(newScreen);
      
      if (level) {
        globals.map = level;
        globals.enemies = level.enemies;
        globals.objects = level.objects;
        
        console.log("Screen: " + level.name);
        console.log("Enemies: " + globals.enemies.length);
        
        this.gameState = GameState.PLAYING;
        globals.gameState = GameState.PLAYING;
      } else {
        console.log("error: " + newScreen);
      }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.view.render();
  }

  login(email, password) {
    this.gameState = GameState.LOGIN_LOADING;
    globals.gameState = GameState.LOGIN_LOADING;
    this.loginLoadingFrames = 0;

    document.getElementById("formLogin").style.display = "none";

    const data = {
      email: email,
      password: password,
    };

    fetch(LoginData, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(response => {
        if (!response.ok) throw new Error("Not authorized");
        return response.json();
      })
      .then(json => {
        console.log("Login OK", json);
        this.gameState = GameState.MENU;
        globals.gameState = GameState.MENU;
        globals.menuIndex = 0;
        globals.action.confirm = false;
      })

      .catch(error => {
        alert("Error: Invalid username or password.");
        console.error(error);

        this.gameState = GameState.LOGIN;
        globals.gameState = GameState.LOGIN;
        document.getElementById("formLogin").style.display = "block";
      });
  }

}

export function initGame(canvas) {
  fetch("./src/gameData.json")
    .then(response => response.json())
    .then( async data => {
      console.log("JSON:", data);
      const factory = new GameFactory(data);
      const game = await factory.create(canvas);
      if (game) game.execute();
    })
    .catch(error => console.error("Failed to fetch data:", error));
}

export { Game };
