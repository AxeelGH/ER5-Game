import globals from "./config/globals.js";
import { BASE_URL, GameState, Key, LOCAL_URL, SpriteID } from "./config/constants.js";
import { Events } from "./events/Events.js";
import { View } from "./View.js";
import Asset from "./assets/assets.js";
import SpriteFactory from "./sprites/SpriteFactory.js";
import playerView from "./sprites/PlayerView.js";
import Map from "./map/Map.js";
import MapView from "./map/MapView.js";
import ImageSet from "./sprites/ImageSet.js";
import CollisionManager from "./map/CollisionManager.js";
import CombatTurn from "./combat/CombatTurn.js";
import Inventory from "./combat/Inventory.js";
import { Sound } from "./config/constants.js";
import GameFactory from "./GameFactory.js";
import LevelFactory from "./map/levelFactory.js";
import Item from "./sprites/Item.js";
import Slime from "./sprites/Slime.js";
import Mage from "./sprites/Mage.js";
import Skeleton from "./sprites/Skeleton.js";
import GameStatistics from "./GameStatistics.js";
import Combat from "./combat/Combat.js";
import EventWrath from "./events/EventWrath.js"; 

class Game {
  constructor(canvas, gameData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    globals.ctx = this.ctx;
    this.gameData = gameData;

    this.gameState = GameState.LOADING;
    globals.gameState = GameState.LOADING;
    console.log("Game State: LOADING");

    this.score = 0;
    this.timer = gameData.game.time;
    this.highScore = this.score;
    this.masterVolume = gameData.audio.masterVolume;

    this.levelFactory = new LevelFactory();

    this.inputManager = new Events();
    this.view = new View(this.ctx, this);

    globals.map = null;

    this.mapView = new MapView(this.ctx);
    this.playerView = new playerView(this.ctx);

    globals.action = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
      confirm: false,
    };

    globals.enemies = [];
    globals.currentEnemy = null;

    this.combatTurn = null;

    globals.currentSound = Sound.NO_SOUND;

    this.loginLoadingFrames = 0;
    this.pendingScreen = null;
    this.pendingScreenForCinematic = null;
    this.loadScreenFrames = 0;
    this.loginMessage = "";
    this.cinematicTimer = 0;
    this.showLevelUpMessageTimer = 0;

    this.eventWrath = new EventWrath();
    globals.eventWrath = this.eventWrath;
  }

  addEnemyProgress() {
  const leveledUp = this.eventWrath.addProgress(20);
  if (leveledUp && this.eventWrath.level === 2) {
    this.showLevelUpMessage();
  }
}

addScreenProgress() {
  const leveledUp = this.eventWrath.addProgress(100);
  if (leveledUp && this.eventWrath.level === 2) {
    this.showLevelUpMessage();
  }
}

addItemProgress() {
  const leveledUp = this.eventWrath.addProgress(20);
  if (leveledUp && this.eventWrath.level === 2) {
    this.showLevelUpMessage();
  }
}

showLevelUpMessage() {
  this.showLevelUpMessageTimer = 180;
  this.eventWrath.markCinematicShown();
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
    game.player = SpriteFactory.createPlayer(100, 220, 120, 70, Math.floor(Math.random() * 100) + 1);
    globals.player = game.player;
    game.gameStats = new GameStatistics(game.player.playerId);
    globals.gameStats = game.gameStats;
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
          this.gameState = GameState.INTRO;
          globals.gameState = GameState.INTRO;
          console.log("Game State: INTRO");
          console.log(this.canvas.width);
          console.log(this.canvas.height);

          console.log("Current difficulty setting: " + globals.difficulty);
        }
        break;

      case GameState.INTRO:
        if (globals.action.confirm) {
          const savedSession = localStorage.getItem("userSession");
          if (savedSession) {
            const profile = JSON.parse(savedSession);
            console.log("logged:", profile);

            globals.userName = profile.email;
            console.log("profile session:", globals.userName);

            this.gameState = GameState.MENU;
            globals.gameState = GameState.MENU;
          } else {
            this.gameState = GameState.LOGIN;
            globals.gameState = GameState.LOGIN;
          }

          globals.menuIndex = 0;
          globals.action.confirm = false;
        }
        break;

      case GameState.LOGIN:
        const form = document.querySelector("#formLogin");

        if (form && form.style.display !== "block") {
          form.style.display = "block";
        }

        if (globals.buttonStart && globals.buttonStart.clicked) {
          globals.buttonStart.clicked = false;

          const emailInput = document.getElementById("email");
          const passwordInput = document.getElementById("password");

          const email = emailInput.value;
          const password = passwordInput.value;

          if (!email || !password) {
            this.loginMessage = "Please enter both email and password.";
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
          globals.menuIndex = globals.menuIndex > 0 ? globals.menuIndex - 1 : 6;
        }

        if (globals.action.moveDown) {
          globals.action.moveDown = false;
          globals.menuIndex = globals.menuIndex < 6 ? globals.menuIndex + 1 : 0;
        }

        if (globals.action.confirm) {
          globals.action.confirm = false;

          switch (globals.menuIndex) {
            case 0:
              if (globals.difficulty === "easy") {
                this.enemyHPMultiplier = this.gameData.difficulty.easy.enemyHPMultiplier;
                this.enemyAttackMultiplier = this.gameData.difficulty.easy.enemyAttackMultiplier;
              } else if (globals.difficulty === "hard") {
                this.enemyHPMultiplier = this.gameData.difficulty.hard.enemyHPMultiplier;
                this.enemyAttackMultiplier = this.gameData.difficulty.hard.enemyAttackMultiplier;
              }
              this.gameState = GameState.PLAYING;
              globals.gameState = GameState.PLAYING;
              console.log("Game State: PLAYING");
              for (let i = 0; i < globals.enemies.length; i++) {
                globals.enemies[i].hp *= this.enemyHPMultiplier;
                globals.enemies[i].maxHp = globals.enemies[i].hp;
                console.log("Enemy " + 1 + ": " + globals.enemies[i].hp);
              }
              this.player.hp;
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

            case 4:
              this.gameState = GameState.DIFFICULTY;
              globals.gameState = GameState.DIFFICULTY;
              break;
            case 5:
              this.gameState = GameState.STATS;
              globals.gameState = GameState.STATS;
              break;

            case 6:
              this.logout();
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

            let cloneEnemies = [];
            for (let i = 0; i < level.enemies.length; i++) {
              let enemy = level.enemies[i];
              if (enemy.id === SpriteID.SLIME) {
                cloneEnemies[i] = Slime.clone(level.enemies[i]);
              } else if (enemy.id === SpriteID.MAGE) {
                cloneEnemies[i] = Mage.clone(level.enemies[i]);
              } else {
                cloneEnemies[i] = Skeleton.clone(level.enemies[i]);
              }
            }

            globals.enemies = cloneEnemies;

            let cloneItems = [];
            for (let i = 0; i < level.items.length; i++) {
              cloneItems[i] = Item.clone(level.items[i]);
            }
            globals.items = cloneItems;

            globals.sprites = [];
            globals.sprites.push(globals.player);
            for (let i = 0; i < globals.enemies.length; i++) {
              globals.sprites.push(globals.enemies[i]);
            }
            for (let i = 0; i < globals.items.length; i++) {
              globals.sprites.push(globals.items[i]);
            }

            console.log("Level loaded: " + level.name);
          }

          this.pendingScreen = null;
          this.loadScreenFrames = 0;
          this.gameState = GameState.PLAYING;
          globals.gameState = GameState.PLAYING;
        }
        break;

      case GameState.PLAYING:
        this.timer -= dt;
        if (this.timer <= 0) {
          this.gameState = GameState.GAME_OVER;
          globals.gameState = GameState.GAME_OVER;
        }

        if (this.showLevelUpMessageTimer > 0) {
          this.showLevelUpMessageTimer--;
        }

        if (this.eventWrath.level >= 2) {
          const spawnChance = this.eventWrath.getEnemySpawnChance() * (dt * 60);
          if (Math.random() < spawnChance && globals.enemies.length < 6) {
            this.spawnRandomEnemy();
          }
        }

        if (globals.player) {
          globals.player.update();
        }

        for (let i = 0; i < globals.enemies.length; i++) {
          if (globals.enemies[i].isAlive) {
            globals.enemies[i].update();
          }
        }

        if (globals.item) {
          globals.item.update();
        }

        if (globals.player) {
          globals.player.xPos = Math.max(0, Math.min(globals.player.xPos, globals.canvas.width - 50));
          globals.player.yPos = Math.max(0, Math.min(globals.player.yPos, globals.canvas.height - 70));
        }

        CollisionManager.detectCollisions();

        let allEnemiesDead = true;

        if (globals.enemies.length === 0) {
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
          globals.gameStats.finish("Victory", this.score);
          this.postStats();
        }
        break;

      case GameState.CINEMATIC:
        this.updateCinematic();
        break;

      case GameState.INIT_COMBAT:
        const combat = Combat.create(player, enemies);
        this.gameState = GameState.COMBAT;
        globals.gameState = GameState.COMBAT;
        break;

      case GameState.COMBAT:
        this.combat.update(globals.combatState);
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

      case GameState.DIFFICULTY:
        if (globals.action.moveUp) {
          globals.action.moveUp = false;
          globals.subMenuIndex = globals.subMenuIndex > 0 ? globals.subMenuIndex - 1 : 1;
        }
        if (globals.action.moveDown) {
          globals.action.moveDown = false;
          globals.subMenuIndex = globals.subMenuIndex < 1 ? globals.subMenuIndex + 1 : 0;
        }
        if (globals.action.confirm) {
          switch (globals.subMenuIndex) {
            case 0:
              globals.difficulty = "easy";
              console.log("easy");
              break;
            case 1:
              globals.difficulty = "hard";
              console.log("hard");
              break;
          }
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
        break;  

      case GameState.GAME_OVER:
        globals.gameStats.finish("Defeat",this.score);
        this.postStats();
        if (globals.action.confirm) {
          this.gameState = GameState.MENU;
          globals.gameState = GameState.MENU;
          globals.action.confirm = false;
        }
        break;
      case GameState.STATS:
        globals.subMenuIndex = 0;
        if (globals.action.confirm) {
          this.gameState = GameState.MENU;
          globals.gameState = GameState.MENU;
          globals.subMenuIndex = 0;
          globals.action.confirm = false;
        }
        break;
        
      default:
        break;
    }
  }

  updateCinematic() {
    if (this.cinematicTimer > 0) {
      this.cinematicTimer--;
      if (this.cinematicTimer <= 0) {
        if (this.pendingScreenForCinematic !== null) {
          this.gameState = GameState.LOAD_SCREEN;
          globals.gameState = GameState.LOAD_SCREEN;
          this.loadScreen(this.pendingScreenForCinematic);
          this.pendingScreenForCinematic = null;
        } else {
          this.gameState = GameState.PLAYING;
          globals.gameState = GameState.PLAYING;
        }
      }
    }
    
    if (globals.action.confirm) {
      globals.action.confirm = false;
      this.cinematicTimer = 0;
    }
  }

  spawnRandomEnemy() {
    const availableTypes = this.eventWrath.getAvailableEnemyTypes();
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const hpMultiplier = this.eventWrath.getEnemyHpMultiplier();
    
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
      case 0:
        x = Math.random() * (this.canvas.width - 100) + 50;
        y = -50;
        break;
      case 1:
        x = Math.random() * (this.canvas.width - 100) + 50;
        y = this.canvas.height + 50;
        break;
      case 2:
        x = -50;
        y = Math.random() * (this.canvas.height - 100) + 50;
        break;
      default:
        x = this.canvas.width + 50;
        y = Math.random() * (this.canvas.height - 100) + 50;
    }
    
    let newEnemy;
    if (randomType === "slime") {
      newEnemy = SpriteFactory.createSlime(x, y);
      newEnemy.hp = 50 * hpMultiplier;
      newEnemy.maxHp = 50 * hpMultiplier;
    } else {
      newEnemy = SpriteFactory.createSkeleton(x, y);
      newEnemy.hp = 80 * hpMultiplier;
      newEnemy.maxHp = 80 * hpMultiplier;
    }
    
    newEnemy.isAlive = true;
    globals.enemies.push(newEnemy);
    globals.sprites.push(newEnemy);
    
    console.log(`[EventWrath] New ${randomType} spawned at (${Math.floor(x)}, ${Math.floor(y)})`);
  }

  async initializeLevels() {
    await this.levelFactory.loadLevels("./src/mapData.json");
    if (this.levelFactory.levels.length > 0) {
      const currentLevel = this.levelFactory.levels[0];
      globals.map = currentLevel;

      let cloneEnemies = [];

      for (let i = 0; i < currentLevel.enemies.length; i++) {
        let enemy = currentLevel.enemies[i];
        if (enemy.id === SpriteID.SLIME) {
          cloneEnemies[i] = Slime.clone(currentLevel.enemies[i]);
        } else if (enemy.id === SpriteID.MAGE) {
          cloneEnemies[i] = Mage.clone(currentLevel.enemies[i]);
        } else {
          cloneEnemies[i] = Skeleton.clone(currentLevel.enemies[i]);
        }
      }
      globals.enemies = cloneEnemies;

      let cloneItems = [];
      for (let i = 0; i < currentLevel.items.length; i++) {
        cloneItems[i] = Item.clone(currentLevel.items[i]);
        console.log("Cloned potion: ", cloneItems[i]);
      }
      globals.items = cloneItems;
      globals.currentScreen = currentLevel.id;

      globals.sprites = [];
      globals.sprites.push(globals.player);
      for (let i = 0; i < globals.enemies.length; i++) {
        globals.sprites.push(globals.enemies[i]);
      }
      for (let i = 0; i < globals.items.length; i++) {
        globals.sprites.push(globals.items[i]);
      }
      for (let i = 0; i < globals.enemies.length; i++) {
        console.log("Cloned enemies: ", globals.enemies[i]);
      }
      console.log("Initial level loaded:", currentLevel.name);
      console.log("Sprites:", globals.sprites.length);
    }
  }

  loadScreen(newScreen) {
  console.log("loading Screen: " + newScreen);

  this.addScreenProgress();

  let level = this.levelFactory.getLevelById(newScreen);

  if (level) {
    globals.map = level;
    let cloneEnemies = [];
    for (let i = 0; i < level.enemies.length; i++) {
      let enemy = level.enemies[i];
      if (enemy.id === SpriteID.SLIME) {
        cloneEnemies[i] = Slime.clone(level.enemies[i]);
      } else if (enemy.id === SpriteID.MAGE) {
        cloneEnemies[i] = Mage.clone(level.enemies[i]);
      } else {
        cloneEnemies[i] = Skeleton.clone(level.enemies[i]);
      }
      console.log("Cloned enemy: ", cloneEnemies[i]);
    }
    globals.enemies = cloneEnemies;

    let cloneItems = [];
    for (let i = 0; i < level.items.length; i++) {
      cloneItems[i] = Item.clone(level.items[i]);
      console.log("Cloned potion: ", cloneItems[i]);
    }
    globals.items = cloneItems;

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

    fetch(BASE_URL+"login", {
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
        localStorage.setItem("userSession", JSON.stringify(json));
        globals.userName = json.email;

        this.gameState = GameState.MENU;
        globals.gameState = GameState.MENU;
        globals.menuIndex = 0;
        globals.action.confirm = false;
      })
      .catch(error => {
        this.loginMessage = "Error: Invalid username or password.";
        console.error(error);

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        if (emailInput) emailInput.value = "";
        if (passwordInput) passwordInput.value = "";

        this.gameState = GameState.LOGIN;
        globals.gameState = GameState.LOGIN;
        document.getElementById("formLogin").style.display = "block";
      });
  }

  logout() {
    localStorage.removeItem("userSession");
    globals.userName = "";
    console.log("User logged out successfully.");

    this.gameState = GameState.LOGIN;
    globals.gameState = GameState.LOGIN;
    globals.menuIndex = 0;

    const form = document.getElementById("formLogin");
    if (form) form.style.display = "block";

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (emailInput) emailInput.value = "";
    if (passwordInput) passwordInput.value = "";
  }

  postStats() {
    fetch(LOCAL_URL + "stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(globals.gameStats.toPayload()),
      
    });
    console.log("stats post" + JSON.stringify(globals.gameStats.toPayload()));
  }
}

export function initGame(canvas) {
  fetch("./src/config/gameData.json")
    .then(response => response.json())
    .then(async data => {
      console.log("JSON:", data);
      const factory = new GameFactory(data);
      const game = await factory.create(canvas);
      if (game) game.execute();
    })
    .catch(error => console.error("Failed to fetch data:", error));
}

export { Game };