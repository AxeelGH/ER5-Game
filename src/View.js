import globals from "./config/globals.js";
import { GameState, SpriteID } from "./config/constants.js";
import playerView from "./sprites/PlayerView.js";
import MapView from "./map/MapView.js";
import ItemView from "./sprites/ItemView.js";

import CombatView from "./combat/CombatView.js";
import CombatTurn from "./combat/CombatTurn.js";
import MessagesView from "./combat/MessagesView.js";

export class View {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.playerView = new playerView(ctx);
    this.mapView = new MapView(ctx);
    this.itemView = new ItemView(ctx);
    this.combatView = new CombatView(ctx);
    this.game = game;

    this.introBackgroundImg = new Image();
    this.introBackgroundImg.src = "./assets/images/IntroBackground.png";
    this.mainBackgroundImg = new Image();
    this.mainBackgroundImg.src = "./assets/images/MainBackground.png";
    this.battlegroundImg = new Image();
    this.battlegroundImg.src = "./assets/images/Battleground.png";
    this.storyBackgroundImg = new Image();
    this.storyBackgroundImg.src = "./assets/images/StoryBackground.png";
    this.highScoreBackgroundImg = new Image();
    this.highScoreBackgroundImg.src = "./assets/images/HighScoreBackground.jpg";
    this.loginBackgroundImg = new Image();
    this.loginBackgroundImg.src = "./assets/images/LoginBackground.png";

    this.highScoreBackgroundImg.src = "./assets/images/HighScoreBackground.jpg";
    this.victoryBackgroundImg = new Image();
    this.victoryBackgroundImg.src = "./assets/images/VictoryBackground.png";
    this.gameOverBackgroundImg = new Image();
    this.gameOverBackgroundImg.src = "./assets/images/GameOverBackground.png";

    this.messagesView = new MessagesView(ctx);
  }

  render() {
  switch (globals.gameState) {
    case GameState.LOADING:
      this.renderLoading();
      break;

    case GameState.INTRO:
      this.renderIntro();
      break;

    case GameState.MENU:
      this.renderMenu();
      break;

    case GameState.STORY:
      this.renderStory();
      break;

    case GameState.PLAYING:
      this.renderPlaying();
      this.renderHUD();
      break;

    case GameState.COMBAT:
      this.renderCombat();
      break;

    case GameState.GAME_OVER:
      this.renderGameOver();
      break;

    case GameState.VICTORY:
      this.renderVictory();
      break;

    case GameState.SETTINGS:
      this.renderSettings();
      break;

    case GameState.HISTORY:
      this.renderHistory();
      break;

    case GameState.DIFFICULTY:
      this.renderDifficulty();
      break;

    case GameState.HIGHSCORE:
      this.renderHighScore();
      break;

    case GameState.PAUSE:
      this.renderPause();
      break;

    case GameState.LOGIN:
      this.renderLogin();
      break;

    case GameState.LOGIN_LOADING:
      this.renderLoginLoading();
      break;

    case GameState.LOAD_SCREEN:
      this.renderLoadScreen();
      break;
      
    case GameState.CINEMATIC:
      this.renderCinematic();
      break;
      case GameState.LOAD_SCREEN:
        this.renderLoadScreen();

        if (this.game.showLevelUpMessageTimer > 0) {
         this.renderLevelUpMessage();
        }
        break;
      
      case GameState.STATS:
        this.renderStats();
        break;
    }
  }


  renderLoading() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "16px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("LOADING...", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
  }

  renderIntro() {
    this.ctx.drawImage(this.introBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "4vw alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("THE STORM", this.ctx.canvas.width / 2, 80);
    this.ctx.fillText("OF THE", this.ctx.canvas.width / 2, 140);
    this.ctx.fillText("ANCIENT WARRIORS", this.ctx.canvas.width / 2, 200);

    this.ctx.font = "40px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Press SPACE to start", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 350);
  }

  renderMenu() {
    this.ctx.drawImage(this.mainBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (globals.userName) {
      this.ctx.save();
      this.ctx.fillStyle = "#ffffff70";
      this.ctx.fillRect((this.ctx.canvas.width / 2) * 0.6, (this.ctx.canvas.height / 2) * 0.67, 400, 60);

      this.ctx.fillStyle = "#000000";
      this.ctx.font = "4vw alkhemikal";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Welcome " + globals.userName + "!!!", this.ctx.canvas.width / 2, (this.ctx.canvas.height / 2) * 0.8);

      this.ctx.restore();
    }

    this.ctx.fillStyle = "white";
    this.ctx.font = "5vw alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("THE STORM OF ", this.ctx.canvas.width / 2, this.ctx.canvas.height * 0.1);
    this.ctx.fillText("THE ANCIENT WARRIORS", this.ctx.canvas.width / 2, this.ctx.canvas.height * 0.2);

    const menuItems = ["Play", "Story", "Controls", "High Score", "Difficulty", "Stats", "Logout"];
    const startY = 400;
    const itemHeight = 50;
    const selectedIndex = globals.menuIndex;

    for (let index = 0; index < menuItems.length; index++) {
      const text = menuItems[index];
      const y = startY + index * itemHeight;
      const isSelected = index === selectedIndex;

      this.ctx.fillStyle = isSelected ? "yellow" : "white";
      this.ctx.font = isSelected ? "bold 52px alkhemikal" : "36px alkhemikal";
      this.ctx.fillText(isSelected ? "> " + text + " <" : text, this.ctx.canvas.width / 2, y);
    }
  }

  renderStory() {
  this.ctx.fillStyle = "rgb(0, 0, 0)";
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  this.ctx.strokeStyle = "#d4af37";
  this.ctx.lineWidth = 4;
  this.ctx.strokeRect(50, 50, this.ctx.canvas.width - 100, this.ctx.canvas.height - 100);

  this.ctx.fillStyle = "#e9b200";
  this.ctx.font = "bold 48px alkhemikal";
  this.ctx.textAlign = "center";
  this.ctx.fillText(this.game.storyTitle, this.ctx.canvas.width / 2, 150);

  this.ctx.fillStyle = "#ffffff";
  this.ctx.font = "32px alkhemikal";
  const lines = this.game.storyText.split('\n');
  let y = 280;
  for (let i = 0; i < lines.length; i++) {
    this.ctx.fillText(lines[i], this.ctx.canvas.width / 2, y);
    y += 60;
  }

  this.ctx.fillStyle = "#aaaaaa";
  this.ctx.font = "24px alkhemikal";
  this.ctx.fillText("Press SPACE to continue...", this.ctx.canvas.width / 2, this.ctx.canvas.height - 80);
  
  }

  renderPlaying() {
  if (globals.map && this.mapView) {
    this.mapView.render();
  }

  if (globals.enemies) {
    for (let i = 0; i < globals.enemies.length; i++) {
      const enemy = globals.enemies[i];
      if (enemy.isAlive && enemy.draw) {
        enemy.draw(this.ctx);
      }
    }
  }
  if (globals.items) {
    for (let i = 0; i < globals.items.length; i++) {
      const obj = globals.items[i];
      if (obj && obj.imageSet) {
        const img = globals.tileSets[2];
        if (img && img.complete) {
          if(obj.type === "collectable")
          {
            this.ctx.drawImage(img, 0, 80, 20, 20, obj.xPos, obj.yPos, 20, 20);
          }
          if(obj.type === "potion")
          {
            this.ctx.drawImage(img, 0, 0, 20, 20, obj.xPos, obj.yPos, 20, 20);
          }
          if(obj.type === "sword")
          {
            this.ctx.drawImage(img, 0, 120, 64, 64, obj.xPos, obj.yPos, 64, 64);

          }
        }
      }
    }
  }

  for (let i = 0; i < globals.potionDrops.length; i++) {
    const potion = globals.potionDrops[i];
    const img = globals.tileSets[2];
    if (img && img.complete) {
      this.ctx.drawImage(img, 0, 0, 16, 16, potion.xPos, potion.yPos, 16, 16);
    }
  }

  if (globals.ParticleSystem) {
    globals.ParticleSystem.update();
    globals.ParticleSystem.draw(this.ctx);
  }

  if (globals.player) {
    this.playerView.render();
  }

  if (globals.object) {
    this.objectView.render();
  }
  
  if (this.game.showLevelUpMessageTimer > 0) {
    this.renderLevelUpMessage();
  }
}

  drawAllHitBoxes() {
    if (globals.player) {
      this.playerView.drawHitBox(globals.player);
    }

    if (globals.enemies) {
      for (let i = 0; i < globals.enemies.length; i++) {
        const enemy = globals.enemies[i];
        if (enemy.isAlive && enemy.hitBox) {
          const x = Math.floor(enemy.xPos) + enemy.hitBox.xOffset;
          const y = Math.floor(enemy.yPos) + enemy.hitBox.yOffset;
          this.ctx.strokeStyle = "red";
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(x, y, enemy.hitBox.xSize, enemy.hitBox.ySize);
        }
      }
    }
  }

  renderLevelUpMessage() {
  const timer = this.game.showLevelUpMessageTimer;
  const maxTime = 180;
  
  let alpha = 1;
  if (timer < 30) {
    alpha = timer / 30;
  } else if (timer > 150) {
    alpha = (maxTime - timer) / 30;
  }
  
  const level = this.game.lastUnlockedLevel || this.game.eventWrath.level;;

  this.ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * alpha})`;
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  
  this.ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  this.ctx.shadowBlur = 10;
  
  //this.ctx.fillStyle = "rgb(227, 4, 4)";
  //this.ctx.font = "bold 56px alkhemikal";
  this.ctx.textAlign = "center";
  //this.ctx.fillText("LEVEL 1 UNLOCKED", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 60);
  
  this.ctx.fillStyle = "rgb(179, 0, 0)";
  this.ctx.font = "48px alkhemikal";

    if (level === 1) {
    this.ctx.fillText("The Scholar's Wrath begins!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.font = "28px alkhemikal";
    this.ctx.fillText("Enemies will grow stronger over time...", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 60);
  } else if (level === 2) {
    this.ctx.fillText("The Scholar's Wrath intensifies!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.font = "28px alkhemikal";
    this.ctx.fillText("Enemies gain health, damage, and extra spawns!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 60);
  } else if (level === 3) {
    this.ctx.fillText("The Ancient Evil awakens!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.font = "28px alkhemikal";
    this.ctx.fillText("Mages appear and enemies multiply!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 60);
  }
  
  this.ctx.shadowColor = "transparent";
  this.ctx.shadowBlur = 0;
}

  renderGameOver() {
    this.ctx.drawImage(this.gameOverBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "rgb(179, 0, 0)";
    this.ctx.font = "48px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("GAME OVER", this.ctx.canvas.width / 2, 80);

    this.ctx.fillStyle = "white";
    this.ctx.font = "32px alkhemikal";
    this.ctx.fillText("Press SPACE to go back to main menu", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
  }

  renderPause() {
    this.ctx.fillStyle = "rgba(0,0,0,0.7)";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "30px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("PAUSE", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
  }

  renderVictory() {
    this.ctx.drawImage(this.victoryBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "#e9b200";
    this.ctx.font = "48px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("VICTORY!", this.ctx.canvas.width / 2, 80);

    this.ctx.fillStyle = "white";
    this.ctx.font = "32px alkhemikal";
    this.ctx.fillText("Your score: " + this.game.score, this.ctx.canvas.width / 2, 200);
    this.ctx.fillText("Press SPACE to go back to main menu", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
  }

  renderCombat() {
  this.ctx.drawImage(this.battlegroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  if (globals.ParticleSystem) {
    globals.ParticleSystem.update();
    globals.ParticleSystem.draw(this.ctx);
  }

  this.combatView.render();

  this.ctx.fillStyle = "#ffffff";
  this.ctx.font = "48px alkhemikal";
  this.ctx.textAlign = "center";
  this.ctx.fillText("Turn " + this.game.combat.currentRound, this.ctx.canvas.width / 2, 50);

  this.ctx.fillStyle = "#ff4444";
  this.ctx.fillText("COMBAT", 120, 50);

  if (globals.currentEnemy) {
    let enemyName = "";
    let enemyColor = "";
    switch (globals.currentEnemy.id) {
      case SpriteID.SLIME:
        enemyName = "SLIME";
        enemyColor = "#88ff88";
        break;
      case SpriteID.SKELETON:
        enemyName = "SKELETON";
        enemyColor = "#cccccc";
        break;
      case SpriteID.MAGE:
        enemyName = "MAGE";
        enemyColor = "#cc88ff";
        break;
      default:
        enemyName = "ENEMY";
        enemyColor = "#ffffff";
    }
    this.ctx.fillStyle = enemyColor;
    this.ctx.font = "48px alkhemikal";
    this.ctx.fillText(enemyName, 800, 50);
  }

  if (globals.player) {
    this.ctx.fillStyle = "rgba(0,0,0,0.85)";
    this.ctx.fillRect(3, 70, 250, 80);
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(3, 70, 250, 80);
    this.ctx.fillStyle = "#ff0000";
    this.ctx.font = "28px alkhemikal";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Your HP: ${Math.floor(globals.player.hp)}/${globals.player.maxHp}`, 8, 95);
    this.ctx.fillStyle = "#41ddf8";
    this.ctx.fillText(`Your MP: ${Math.floor(globals.player.mana)}/${globals.player.maxMana}`, 8, 140);
  }

  globals.damageNumbers.update();
  globals.damageNumbers.render(this.ctx);

  if (this.game.combat && this.game.combat.turns && this.game.combat.turns.length > 0) {
    const currentTurn = this.game.combat.turns[this.game.combat.currentTurnIndex];
    
    if (currentTurn && currentTurn.selectedPhase && currentTurn.selectedPhase.renderUI) {
      if (currentTurn.selectedPhase.state === "waiting") {
        currentTurn.selectedPhase.renderUI(this.ctx);
      }
    }
    else if (currentTurn && currentTurn.type === "player" && currentTurn.state === "selecting") {
      this.renderCombatMenu();
    }
  } else if (this.game.combatTurn && this.game.combatTurn.state === "selecting") {
    this.renderCombatMenu();
  }

  this.ctx.fillStyle = "rgba(0,0,0,0.85)";
  this.ctx.fillRect(360, 600, 661, 200);
  this.ctx.strokeStyle = "#ffffff";
  this.ctx.lineWidth = 3;
  this.ctx.strokeRect(360, 600, 661, 200);
  this.messagesView.render(globals.messageQueue);

  // Timer
  if (this.game.combat && this.game.combat.turns && this.game.combat.turns.length > 0) {
    const currentTurn = this.game.combat.turns[this.game.combat.currentTurnIndex];
    if (currentTurn && currentTurn.turnTimerActive) {
      let secondsLeft = Math.ceil(currentTurn.turnTimer / 60);
      if (secondsLeft < 0) secondsLeft = 0;
      this.ctx.fillStyle = "#ffaa44";
      this.ctx.font = "32px alkhemikal";
      this.ctx.textAlign = "left";
      this.ctx.fillText(" " + secondsLeft, this.ctx.canvas.width / 2 - 30, 100);
    }
  }
}

  renderCombatMenu() {
  let currentTurn = null;
  let phaseIndex = 0;

  if (this.game.combat && this.game.combat.turns && this.game.combat.turns.length > 0) {
    currentTurn = this.game.combat.turns[this.game.combat.currentTurnIndex];
    if (currentTurn && currentTurn.type === "player") {
      phaseIndex = currentTurn.currentPhaseIndex;
    }
  } else if (this.game.combatTurn) {
    phaseIndex = this.game.combatTurn.getPhaseIndex();
  }

  this.ctx.fillStyle = "rgba(0,0,0,0.85)";
  this.ctx.fillRect(3, 600, 354, 200);
  this.ctx.strokeStyle = "#ffffff";
  this.ctx.lineWidth = 3;
  this.ctx.strokeRect(3, 600, 354, 200);

  const options = ["ATTACK", "ABILITY", "ITEM", "MOVE", "FLEE"];
  const positions = [
    { x: 15, y: 615 },
    { x: 185, y: 615 },
    { x: 15, y: 665 },
    { x: 185, y: 665 },
    { x: 100, y: 720 },
  ];

  for (let i = 0; i < options.length; i++) {
    const { x, y } = positions[i];
    if (i === phaseIndex) {
      const gradient = this.ctx.createLinearGradient(x, y, x + 160, y + 40);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, y, 160, 40);
      this.ctx.strokeStyle = "#fd0000fc";
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(x, y, 160, 40);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 32px alkhemikal";
    } else {
      this.ctx.fillStyle = "#1a1a2e";
      this.ctx.fillRect(x, y, 160, 40);
      this.ctx.strokeStyle = "#666666";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x, y, 160, 40);
      this.ctx.fillStyle = "#cccccc";
      this.ctx.font = "28px alkhemikal";
    }
    this.ctx.textAlign = "center";
    this.ctx.fillText(options[i], x + 80, y + 30);
    this.ctx.shadowColor = "transparent";
    this.ctx.shadowBlur = 0;
  }
}

  renderSettings() {
    this.ctx.drawImage(this.storyBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "#e9b200";
    this.ctx.font = "48px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("CONTROLS", this.ctx.canvas.width / 2, 80);

    this.ctx.font = "32px alkhemikal";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText("W - Move Up", this.ctx.canvas.width / 2, 220);
    this.ctx.fillText("S - Move Down", this.ctx.canvas.width / 2, 270);
    this.ctx.fillText("A - Move Left", this.ctx.canvas.width / 2, 320);
    this.ctx.fillText("D - Move Right", this.ctx.canvas.width / 2, 370);
    this.ctx.fillText("E - Inventory", this.ctx.canvas.width / 2, 420);
    this.ctx.fillText("SPACE - Confirm/Action", this.ctx.canvas.width / 2, 470);

    this.ctx.fillStyle = "yellow";
    this.ctx.fillText("Press SPACE to go back", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
  }

  renderCinematic() {
  const alpha = Math.min(1, this.game.cinematicTimer / 30);
  this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  
  const message = this.game.eventWrath.getCinematicMessage();
  
  if (message) {
    this.ctx.fillStyle = "#ff4444";
    this.ctx.font = "bold 48px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText(message.title, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 100);
    
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "32px alkhemikal";
    const lines = message.message.split('\n');
    let yOffset = this.ctx.canvas.height / 2 - 20;
    for (let i = 0; i < lines.length; i++) {
      this.ctx.fillText(lines[i], this.ctx.canvas.width / 2, yOffset + (i * 50));
    }
    
    this.ctx.font = "24px alkhemikal";
    this.ctx.fillStyle = "#888888";
    this.ctx.fillText("Press SPACE to continue...", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 150);
  }
}

  renderHistory() {
    this.ctx.drawImage(this.storyBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "#e9b200";
    this.ctx.font = "48px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("THE ANCIENT LORE", this.ctx.canvas.width / 2, 80);

    this.ctx.font = "32px alkhemikal";
    this.ctx.fillStyle = "#ffffff";
    var story = [
      "In a time of chaos, ancient warriors",
      "rise again to face the darkness...",
      "",
      "You are the chosen hero destined",
      "to restore peace to the kingdom.",
      "",
      "Find the legendary sword and",
      "defeat the evil that threatens the land.",
    ];

    for (var i = 0; i < story.length; i++) {
      this.ctx.fillText(story[i], this.ctx.canvas.width / 2, 230 + i * 35);
    }

    this.ctx.font = "32px alkhemikal";
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText("Press SPACE to go back", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
  }

  renderDifficulty() {
    this.ctx.drawImage(this.storyBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "#e9b200";
    this.ctx.font = "48px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("DIFFICULTY", this.ctx.canvas.width / 2, 80);

    this.ctx.fillStyle = "yellow";
    this.ctx.fillText("Press SPACE to go back", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);

    const menuItems = ["Easy", "Hard"];
    const startY = 300;
    const itemHeight = 50;
    const selectedIndex = globals.subMenuIndex !== undefined ? globals.subMenuIndex : 0;

    for (let index = 0; index < menuItems.length; index++) {
      const text = menuItems[index];
      const y = startY + index * itemHeight;
      const isSelected = index === selectedIndex;

      this.ctx.fillStyle = isSelected ? "yellow" : "white";
      this.ctx.font = isSelected ? "bold 52px alkhemikal" : "36px alkhemikal";
      this.ctx.fillText(isSelected ? "> " + text + " <" : text, this.ctx.canvas.width / 2, y);
    }
  }

  renderHighScore() {
    this.ctx.drawImage(this.storyBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "#e9b200";
    this.ctx.font = "48px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("HIGH SCORES", this.ctx.canvas.width / 2, 80);

      let scores = [];
    const saved = localStorage.getItem("highScores");
    if (saved) {
      scores = JSON.parse(saved);
    }
 
    this.ctx.font = "32px alkhemikal";
    this.ctx.textAlign = "center";
 
    if (scores.length === 0) {
      
      this.ctx.fillStyle = "#aaaaaa";
      this.ctx.fillText("No scores yet. Play a game first!", this.ctx.canvas.width / 2, 280);
    } else {
      
      this.ctx.fillStyle = "#e9b200";
      this.ctx.fillText("#    PLAYER                  SCORE", this.ctx.canvas.width / 2, 180);
 
      
      this.ctx.fillStyle = "#666666";
      this.ctx.fillRect(this.ctx.canvas.width / 2 - 300, 195, 600, 2);
 
     
      for (let i = 0; i < scores.length; i++) {
        let entry = scores[i];
 
        
        if (i === 0) {
          this.ctx.fillStyle = "#ffd700";
        } else {
          this.ctx.fillStyle = "#e7e7e7";
        }
 
        let position = (i + 1) + ".";
        let name = entry.name || "Unknown";
        let score = entry.score;
        this.ctx.fillText(position + "   " + name + "   " + score + " XP", this.ctx.canvas.width / 2, 240 + i * 55);
      }
    }

    this.ctx.fillStyle = "yellow";
    this.ctx.fillText("Press SPACE to go back", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
  }

  renderHUD() {
  if (!globals.player) return;

  this.ctx.fillStyle = "rgba(0,0,0,0.7)";
  this.ctx.fillRect(2, 3, 200, 125);
  this.ctx.strokeStyle = "white";
  this.ctx.lineWidth = 2;
  this.ctx.strokeRect(2, 3, 200, 125);

  this.ctx.fillStyle = "rgba(0,0,0,0.7)";
  this.ctx.fillRect(2, 135, 200, 100);
  this.ctx.strokeStyle = "white";
  this.ctx.lineWidth = 2;
  this.ctx.strokeRect(2, 135, 200, 100);

  this.ctx.fillStyle = "rgba(0,0,0,0.7)";
  this.ctx.fillRect(750, 3, 272, 70);
  this.ctx.strokeStyle = "white";
  this.ctx.lineWidth = 2;
  this.ctx.strokeRect(750, 3, 272, 70);

  this.ctx.fillStyle = "rgba(0,0,0,0.7)";
  this.ctx.fillRect(695, 3, 50, 70);
  this.ctx.strokeStyle = "white";
  this.ctx.lineWidth = 2;
  this.ctx.strokeRect(695, 3, 50, 70);

  this.ctx.fillStyle = "#ff0000";
  this.ctx.fillRect(7, 40, 190, 20);

  this.ctx.fillStyle = "#00ff00";
  var hpPercent = globals.player.hp / globals.player.maxHp;
  this.ctx.fillRect(7, 40, 190 * hpPercent, 20);
  this.ctx.strokeStyle = "grey";
  this.ctx.lineWidth = 2;
  this.ctx.strokeRect(7, 40, 190, 20);

  this.ctx.fillStyle = "white";
  this.ctx.font = "32px alkhemikal";
  this.ctx.textAlign = "left";
  this.ctx.fillText("HP: " + Math.floor(globals.player.hp) + "/" + globals.player.maxHp, 7, 30);

  this.ctx.fillStyle = "#002aff";
  var manaPercent = globals.player.mana / globals.player.maxMana;
  this.ctx.fillRect(7, 100, 190 * manaPercent, 20);
  this.ctx.strokeStyle = "grey";
  this.ctx.lineWidth = 2;
  this.ctx.strokeRect(7, 100, 190, 20);

  this.ctx.fillStyle = "white";
  this.ctx.font = "32px alkhemikal";
  this.ctx.textAlign = "left";
  this.ctx.fillText("Mana: " + Math.floor(globals.player.mana) + "/" + globals.player.maxMana, 7, 90);

  // if (globals.gameInstance) {
  //   var timer = Math.max(0, Math.floor(globals.gameInstance.timer));
  //   this.ctx.fillStyle = "white";
  //   this.ctx.textAlign = "left";
  //   this.ctx.fillText("Time: " + timer, 7, 165);
  // }

  if (globals.enemies) {
    let aliveCount = 0;
    for (let i = 0; i < globals.enemies.length; i++) {
      if (globals.enemies[i].isAlive) aliveCount++;
    }
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText("Enemies: " + aliveCount, 7, 195);
  }

  if (globals.collectableCollected) {
    const img = globals.tileSets[2];
    if (img && img.complete) {
      this.ctx.drawImage(img, 0, 80, 20, 20, 705, 20, 30, 30);
    }
  }

  // Mostrar Score y HighScore
  this.ctx.fillStyle = "white";
  this.ctx.textAlign = "left";
  
  this.ctx.fillText("Score: " + this.game.score, 755, 30);
  this.ctx.fillText("HighScore: " + this.game.highScore, 755, 60);
}

  renderLogin() {
    const canvas = this.ctx.canvas;
    this.ctx.drawImage(this.loginBackgroundImg, 0, 0, canvas.width, canvas.height);

    if (this.game.loginMessage) {
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "32px alkhemikal";
      this.ctx.textAlign = "center";

      const messageY = canvas.height / 2 + 250;
      this.ctx.fillText(this.game.loginMessage, canvas.width / 2, messageY);
    }
  }

  renderLoginLoading() {
    const canvas = this.ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.ctx.fillStyle = "white";
    this.ctx.font = "32px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Verifying credentials", centerX, centerY - 50);

    const barWidth = 300;
    const barHeight = 20;
    const barX = centerX - barWidth / 2;
    const barY = centerY;

    let progress = 0;
    if (this.game && this.game.loginLoadingFrames) {
      progress = Math.min(1, this.game.loginLoadingFrames / 120.0);
    }

    this.ctx.fillStyle = "#333333";
    this.ctx.fillRect(barX, barY, barWidth, barHeight);

    this.ctx.fillStyle = "#d4af37";
    this.ctx.fillRect(barX, barY, barWidth * progress, barHeight);

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(barX, barY, barWidth, barHeight);

    this.ctx.fillStyle = "white";
    this.ctx.font = "20px alkhemikal";
    this.ctx.fillText(Math.floor(progress * 100) + "%", centerX, barY - 10);
  }

  renderLoadScreen() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "32px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText("LOADING...", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
  }


 renderStats() {
  const stats = globals.gameStats;

  this.ctx.drawImage(this.storyBackgroundImg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  this.ctx.fillStyle = "#e9b200";
  this.ctx.font = "48px alkhemikal";
  this.ctx.textAlign = "center";
  this.ctx.fillText("SESSION STATISTICS", this.ctx.canvas.width / 2, 80);

  this.ctx.font = "32px alkhemikal";
  this.ctx.fillStyle = "#ffffff";

  const leftCol = 400;
  const rightCol = (this.ctx.canvas.width / 4) * 2.5;
  const startY = 240;
  const gap = 70;

  this.ctx.textAlign = "center";
  this.ctx.fillText("Games Played: "   + stats.gamesPlayed,    leftCol, startY);
  this.ctx.fillText("High Score: "     + stats.highScore,      rightCol, startY);
  this.ctx.fillText("Total XP: "       + stats.totalXP,        this.ctx.canvas.width / 2, startY + gap * 3);
  
  this.ctx.fillText("Wins: "           + stats.wins,           leftCol, startY + gap);
  this.ctx.fillText("Losses: "         + stats.losses,         rightCol, startY + gap);
  
  this.ctx.fillText("Enemies Killed: " + stats.enemiesKilled,   leftCol, startY + gap * 2);
  this.ctx.fillText("Potions Used: "   + stats.consumedPotions, rightCol, startY + gap * 2);

  this.ctx.fillStyle = "yellow";
  this.ctx.fillText("Press SPACE to go back", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
}
}
